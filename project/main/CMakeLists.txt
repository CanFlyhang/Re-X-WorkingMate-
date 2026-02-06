# idf_component_register(SRCS "main.c"
#                     INCLUDE_DIRS ".")

# idf_component_register(
#     SRCS "main.c" "face_detect_wrapper.cpp"
#     INCLUDE_DIRS "."
#     REQUIRES esp32-camera esp-dl nvs_flash driver
# )

# 自动获取本地 esp-dl 路径
# 获取本地组件 esp-dl 的绝对路径
set(ESP_DL_DIR "${CMAKE_CURRENT_SOURCE_DIR}/../components/esp-dl")

idf_component_register(
    SRCS "main.c" "face_detect_wrapper.cpp"
    INCLUDE_DIRS "."
    PRIV_INCLUDE_DIRS 
        "${ESP_DL_DIR}/include"
        "${ESP_DL_DIR}/include/tool"    # 对应 dl_tool.hpp
        "${ESP_DL_DIR}/include/detect"  # 对应 human_face_detect_msr01.hpp
        "${ESP_DL_DIR}/include/typedef"
        "${ESP_DL_DIR}/include/image"
        "${ESP_DL_DIR}/include/math"
        "${ESP_DL_DIR}/include/nn"
        "${ESP_DL_DIR}/include/model_zoo"
    # 在 REQUIRES 后面添加 esp_timer
    REQUIRES esp32-camera esp-dl nvs_flash driver esp_timer
)