#include <stdio.h>
#include "esp_log.h"
#include "esp_camera.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

// 引入 C++ 封装接口
#include "face_detect_wrapper.h" 

static const char *TAG = "APP_MAIN";

// --- 阈值设定 ---
#define DIST_MIN 25.0f
#define DIST_MAX 55.0f
// 稍微放宽稳定性阈值，适应儿童好动的特点
#define STABLE_THRESH 8.0f 

// --- 去抖动配置 ---
#define DEBOUNCE_FRAMES  3    // 需要连续 3 帧状态一致才切换
#define FPS_DELAY_MS     200  // 200ms = 5 FPS (降低系统负载，防发热)

// OV5640 引脚定义 (保持你的原设定)
#define CAM_PIN_PWDN -1
#define CAM_PIN_RESET -1
#define CAM_PIN_XCLK 10
#define CAM_PIN_SIOD 21
#define CAM_PIN_SIOC 14
#define CAM_PIN_D7 48
#define CAM_PIN_D6 47
#define CAM_PIN_D5 21
#define CAM_PIN_D4 14
#define CAM_PIN_D3 13
#define CAM_PIN_D2 12
#define CAM_PIN_D1 11
#define CAM_PIN_D0 10
#define CAM_PIN_VSYNC 38
#define CAM_PIN_HREF 47
#define CAM_PIN_PCLK 21

// --- 状态定义 ---
typedef enum {
    STATE_AWAY,        // 无人
    STATE_FOCUS,       // 专注中 (距离合适且稳定)
    STATE_BAD_DIST,    // 距离错误 (太近或太远)
    STATE_MOVING       // 身体晃动
} app_state_t;

// 全局状态变量
static app_state_t current_stable_state = STATE_AWAY; // 当前真正生效的状态
static app_state_t last_raw_state = STATE_AWAY;       // 上一帧的原始状态
static int debounce_counter = 0;                      // 计数器

static esp_err_t init_camera(void) {
    camera_config_t config = {
        .ledc_channel = LEDC_CHANNEL_0,
        .ledc_timer = LEDC_TIMER_0,
        .pin_d0 = CAM_PIN_D0, .pin_d1 = CAM_PIN_D1, .pin_d2 = CAM_PIN_D2,
        .pin_d3 = CAM_PIN_D3, .pin_d4 = CAM_PIN_D4, .pin_d5 = CAM_PIN_D5,
        .pin_d6 = CAM_PIN_D6, .pin_d7 = CAM_PIN_D7,
        .pin_xclk = CAM_PIN_XCLK, .pin_pclk = CAM_PIN_PCLK,
        .pin_vsync = CAM_PIN_VSYNC, .pin_href = CAM_PIN_HREF,
        .pin_sccb_sda = CAM_PIN_SIOD, .pin_sccb_scl = CAM_PIN_SIOC,
        .pin_pwdn = CAM_PIN_PWDN, .pin_reset = CAM_PIN_RESET,
        .xclk_freq_hz = 20000000,
        .pixel_format = PIXFORMAT_RGB565, 
        .frame_size = FRAMESIZE_QVGA,     
        .jpeg_quality = 12,
        .fb_count = 1, // 降低 FPS 后，fb_count=1 省内存也通常够用了
        .fb_location = CAMERA_FB_IN_PSRAM,
        .grab_mode = CAMERA_GRAB_LATEST
    };
    return esp_camera_init(&config);
}

// 状态处理辅助函数：在这里集中控制灯光或蜂鸣器
void handle_state_change(app_state_t new_state) {
    switch (new_state) {
        case STATE_AWAY:
            ESP_LOGW(TAG, ">>> Event: USER LEFT (Pause Timer)");
            // TODO: 暂停番茄钟，熄灯
            break;
        case STATE_FOCUS:
            ESP_LOGI(TAG, ">>> Event: FOCUS MODE (Green Light)");
            // TODO: 绿色呼吸灯，番茄钟继续
            break;
        case STATE_BAD_DIST:
            ESP_LOGW(TAG, ">>> Event: BAD DISTANCE (Orange Light)");
            // TODO: 橙色灯提醒，如果持续太久暂停番茄钟
            break;
        case STATE_MOVING:
            ESP_LOGI(TAG, ">>> Event: MOVING (Blue Light)");
            // TODO: 浅蓝色灯，提醒坐稳
            break;
    }
}

void app_main(void) {
    // 1. 初始化相机
    if (init_camera() != ESP_OK) {
        ESP_LOGE(TAG, "Camera Init Failed");
        return;
    }
    
    // 2. 初始化 AI
    focus_ai_init();
    ESP_LOGI(TAG, "AI Model Loaded & Debounce Logic Ready");

    while (1) {
        // 3. 获取图像
        camera_fb_t *fb = esp_camera_fb_get();
        if (!fb) {
            ESP_LOGE(TAG, "Frame Capture Failed");
            vTaskDelay(pdMS_TO_TICKS(100));
            continue;
        }

        // 4. 运行检测逻辑
        focus_result_t res = focus_ai_run((uint16_t *)fb->buf, fb->height, fb->width);
        
        // 释放 fb 内存非常重要，要尽早释放
        esp_camera_fb_return(fb);

        // 5. 判定原始状态 (Raw State)
        app_state_t raw_state;
        
        if (!res.detected) {
            raw_state = STATE_AWAY;
        } else {
            bool dist_ok = (res.distance_cm >= DIST_MIN && res.distance_cm <= DIST_MAX);
            bool stable_ok = (res.stability < STABLE_THRESH);

            if (dist_ok && stable_ok) {
                raw_state = STATE_FOCUS;
            } else if (!dist_ok) {
                raw_state = STATE_BAD_DIST;
                // 打印一下距离，方便调试
                ESP_LOGD(TAG, "Bad Dist: %.1f cm", res.distance_cm);
            } else {
                raw_state = STATE_MOVING;
                // 打印一下稳定性数值
                ESP_LOGD(TAG, "Unstable: %.2f", res.stability);
            }
        }

        // 6. 去抖动逻辑 (State Machine Debounce)
        if (raw_state == last_raw_state) {
            debounce_counter++;
        } else {
            debounce_counter = 0;
            last_raw_state = raw_state;
        }

        // 只有连续 N 帧状态一致，且与当前展示状态不同，才切换
        if (debounce_counter >= DEBOUNCE_FRAMES && raw_state != current_stable_state) {
            current_stable_state = raw_state;
            
            // 调用处理函数，执行灯光/逻辑操作
            handle_state_change(current_stable_state);
        }

        // 7. 降低帧率至 5 FPS
        // 既省电，又给 CPU 留出时间处理 WiFi 或灯光
        vTaskDelay(pdMS_TO_TICKS(FPS_DELAY_MS)); 
    }
}