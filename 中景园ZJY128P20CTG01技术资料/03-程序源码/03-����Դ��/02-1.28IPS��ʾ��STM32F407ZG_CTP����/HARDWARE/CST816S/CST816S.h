#ifndef _CST816S_H_
#define _CST816S_H_
 
#include "lcd_init.h"
#include "CTIIC.h"
#include "lcd.h"

#define CST_WR_CMD 0x2A  //写命令地址
#define CST_RD_CMD 0x2B  //写数据地址

#define TP_PRES_DOWN 0x81  		//触屏被按下	  
#define TP_CATH_PRES 0x40  		//有按键按下了 

#define CTP_MAX_TOUCH 2       

#define  FT_DEVIDE_MODE 0x00	   // CST816模式控制寄存器
#define  GT_ADDR_REG    0x02     //触摸状态寄存器
#define  CST816S_ID     0xA7     //CST816SID寄存器
typedef struct
{
	void (*init)(void);   //触摸IC初始化
	u8 (*scan)(u8);       //触摸扫描
	u16 x[CTP_MAX_TOUCH]; //
	u16 y[CTP_MAX_TOUCH];
	u8  sta;              //触摸状态  
}_m_tp_dev;


u8 CST816S_WR_DATA(u16 addr,u8 data);
u8 CST816S_RD_DATA(u16 addr,u8 len,u8 *value);
void  CST816S_Init(void);
u8  CST816S_Scan(u8 mode);
void CST816S_test(void);
#endif

