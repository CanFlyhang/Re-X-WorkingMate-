#pragma once
#include <stdint.h>
#include <stdbool.h>

#ifdef __cplusplus
extern "C" {
#endif

typedef struct {
    bool detected;      
    float distance_cm;  
    float stability;    
} focus_result_t;

void focus_ai_init(void);
focus_result_t focus_ai_run(uint16_t *frame_buffer, int height, int width);

#ifdef __cplusplus
}
#endif