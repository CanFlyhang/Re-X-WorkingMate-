#ifndef __LCD_INIT_H
#define __LCD_INIT_H

#include "sys.h"

#define USE_HORIZONTAL 0  //设置横屏或者竖屏显示 0或1为竖屏 2或3为横屏


#define LCD_W 240
#define LCD_H 240




//-----------------LCD端口定义---------------- 

#define DATAOUT(x) GPIOA->ODR=x; //数据输出
#define DATAIN     GPIOA->IDR;   //数据输入

#define	LCD_RES_Set()	GPIOB->BSRRL=1<<3    //复位			    PB3
#define	LCD_CS_Set()  GPIOB->BSRRL=1<<4    //片选端口    	PB4
#define	LCD_DC_Set()  GPIOB->BSRRL=1<<5    //数据/命令    PB5
#define	LCD_WR_Set()	GPIOB->BSRRL=1<<6    //写数据	      PB6
#define	LCD_RD_Set()	GPIOB->BSRRL=1<<7    //读数据		    PB7
#define	LCD_BLK_Set()	GPIOB->BSRRL=1<<8    //背光控制		  PB8

#define	LCD_RES_Clr()	GPIOB->BSRRH=1<<3     //复位				PB3	    
#define	LCD_CS_Clr()  GPIOB->BSRRH=1<<4     //片选端口    PB4
#define	LCD_DC_Clr()	GPIOB->BSRRH=1<<5     //数据/命令   PB5
#define	LCD_WR_Clr()	GPIOB->BSRRH=1<<6     //写数据	    PB6
#define	LCD_RD_Clr()	GPIOB->BSRRH=1<<7     //读数据	    PB7
#define	LCD_BLK_Clr()	GPIOB->BSRRH=1<<8     //背光控制    PB8



void LCD_GPIO_Init(void);//初始化GPIO
void LCD_Writ_Bus(u8 dat);//模拟SPI时序
void LCD_WR_DATA8(u8 dat);//写入一个字节
void LCD_WR_DATA(u16 dat);//写入两个字节
void LCD_WR_REG(u8 dat);//写入一个指令
void LCD_Address_Set(u16 x1,u16 y1,u16 x2,u16 y2);//设置坐标函数
void LCD_Init(void);//LCD初始化
#endif




