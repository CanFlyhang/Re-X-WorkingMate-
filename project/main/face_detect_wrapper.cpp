#include "face_detect_wrapper.h"
#include "human_face_detect_msr01.hpp" 
#include "dl_tool.hpp" 
#include <vector>
#include <math.h>

// --- 参数配置 ---
#define FACE_WIDTH_REAL 14.0f     
#define FOCAL_CONST 340.0f        

// 配合 5 FPS，取 5 帧代表过去 1 秒的数据，响应更跟手
#define HISTORY_SIZE 5           

// 全局变量保持状态
static HumanFaceDetectMSR01 *detector = nullptr;

struct Point { int x, y; };
static Point history[HISTORY_SIZE];
static int history_idx = 0;
static int history_count = 0;

void focus_ai_init(void) {
    // 初始化 MSR01 模型
    // score_thresh 0.3, iou_thresh 0.3, top_k 10
    detector = new HumanFaceDetectMSR01(0.3f, 0.3f, 10, 0.3f);
}

static float calc_stability(int cur_x, int cur_y) {
    history[history_idx] = {cur_x, cur_y};
    history_idx = (history_idx + 1) % HISTORY_SIZE;
    if (history_count < HISTORY_SIZE) history_count++;

    // 数据太少时不计算
    if (history_count < 3) return 0.0f; 

    float sum_x = 0, sum_y = 0;
    for (int i = 0; i < history_count; i++) {
        sum_x += history[i].x;
        sum_y += history[i].y;
    }
    float avg_x = sum_x / history_count;
    float avg_y = sum_y / history_count;

    float variance = 0;
    for (int i = 0; i < history_count; i++) {
        variance += pow(history[i].x - avg_x, 2) + pow(history[i].y - avg_y, 2);
    }
    return sqrt(variance / history_count);
}

focus_result_t focus_ai_run(uint16_t *frame_buffer, int height, int width) {
    focus_result_t result = {false, 0.0f, 0.0f};

    if (!detector) return result;

    // AI 推理
    auto &res = detector->infer(frame_buffer, {height, width, 3});

    if (res.size() > 0) {
        auto face = res.front(); 
        result.detected = true;

        float pixel_w = (float)face.box[2];
        if (pixel_w > 0) {
            result.distance_cm = (FOCAL_CONST * FACE_WIDTH_REAL) / pixel_w;
        }

        int cx = face.box[0] + face.box[2] / 2;
        int cy = face.box[1] + face.box[3] / 2;
        result.stability = calc_stability(cx, cy);
    } else {
        // 如果没人，重置历史计数，防止下次刚坐下就用到旧坐标
        history_count = 0;
    }

    return result;
}