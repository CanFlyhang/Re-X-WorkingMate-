#ifndef _CTIIC_H_
#define _CTIIC_H_

#include "sys.h"
#include "delay.h"


#define CTP_SCL_Clr() GPIO_ResetBits(GPIOB,GPIO_Pin_0)//SCL
#define CTP_SCL_Set() GPIO_SetBits(GPIOB,GPIO_Pin_0)

#define CTP_SDA_Clr() GPIO_ResetBits(GPIOB,GPIO_Pin_1)//SDA
#define CTP_SDA_Set() GPIO_SetBits(GPIOB,GPIO_Pin_1)

#define CTP_INT_Clr() GPIO_ResetBits(GPIOB,GPIO_Pin_2)//INT
#define CTP_INT_Set() GPIO_SetBits(GPIOB,GPIO_Pin_2)

#define CTP_RES_Clr() GPIO_ResetBits(GPIOC,GPIO_Pin_0)//RES
#define CTP_RES_Set() GPIO_SetBits(GPIOC,GPIO_Pin_0)

#define CTP_ReadSDA   GPIO_ReadInputDataBit(GPIOB,GPIO_Pin_1)

void CTP_SDA_IN(void);
void CTP_SDA_OUT(void);
void CTP_GPIOInit(void);
void CTP_IIC_Start(void);
void CTP_IIC_Stop(void);
u8 CTP_WaitAck(void);
void CTP_IICAck(void);
void CTP_IICNack(void);
void CTP_SendByte(u8 dat);
u8 CTP_ReadByte(u8 ack);
void CTP_INT_IN(void);
#define CT_IIC_SDA    PBout(1) 			//SDA	 


#endif
