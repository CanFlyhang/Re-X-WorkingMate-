//////////////////////////////////////////////////////////////////////////////////	 
//本程序只供学习使用，未经作者许可，不得用于其它任何用途
//中景园电子
//店铺地址：http://shop73023976.taobao.com
//
//  文 件 名   : main.c
//  版 本 号   : v2.0
//  作    者   : HuangKai
//  生成日期   : 2022-6-17
//  最近修改   : 
//  功能描述   :演示例程(STM32F103系列)
//              说明: 
//              ----------------------------------------------------------------
//              GND   电源地
//              VCC   3.3v电源
//              LCD_RES   PB3
//              CS    	  PB4
//              DC(RS)    PB5
//              WR        PB6
//              RD	      PB7
//              BLK	      PB8 
//              DB0-DB7   PA0-PA7
//              CST_SCL   PB0 
//              CST_SDA   PB1
//              CST_RES   PC0
//              CST_INT   PB2
//              ----------------------------------------------------------------
// 修改历史   :
// 日    期   : 
// 作    者   : HuangKai
// 修改内容   : 创建文件
//版权所有，盗版必究。
//Copyright(C) 中景园电子2018-10-31
//All rights reserved
//******************************************************************************/
#include "delay.h"
#include "sys.h"
#include "led.h"
#include "lcd_init.h"
#include "lcd.h"
#include "pic.h"
#include "CST816S.h"
#include "usart.h"
int main(void)
{
	u8 i,j;
	float t=0;
	delay_init();
  uart_init(115200);
	LED_Init();//LED初始化
	LCD_Init();//LCD初始化
	LCD_Fill(0,0,LCD_W,LCD_H,WHITE);
	CST816S_Init();
	while(1)
	{
	  LCD_ShowChinese(30,40,"中景园电子",RED,WHITE,32,0);
		LCD_ShowString(32,80,"LCD_Diameter:",RED,WHITE,16,0);
		LCD_ShowIntNum(134,80,LCD_W,3,RED,WHITE,16);
		LCD_ShowString(32,100,"Increaseing Nun:",RED,WHITE,16,0);
		LCD_ShowFloatNum1(160,100,t,4,RED,WHITE,16);
		t+=0.11;
		for(j=0;j<3;j++)
		{
			for(i=0;i<6;i++)
			{
				LCD_ShowPicture(40*i,120+j*40,40,40,gImage_1);
			}
		}
		CST816S_Init();
    CST816S_test();
	}
}

