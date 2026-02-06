#include "CTIIC.h"
#include "CTIIC.h"

void CTP_SDA_IN(void)
{

	GPIO_InitTypeDef  GPIO_InitStructure;
	
	RCC_AHB1PeriphClockCmd(RCC_AHB1Periph_GPIOB, ENABLE);//使能PORTB时钟
	GPIO_InitStructure.GPIO_Pin = GPIO_Pin_1;
  GPIO_InitStructure.GPIO_Mode = GPIO_Mode_IN;//输入模式
  GPIO_InitStructure.GPIO_Speed = GPIO_Speed_100MHz;//100MHz
  GPIO_InitStructure.GPIO_PuPd = GPIO_PuPd_UP;//上拉
  GPIO_Init(GPIOB, &GPIO_InitStructure);//初始化
	GPIO_ResetBits(GPIOB,GPIO_Pin_1);
}

void CTP_SDA_OUT(void)
{
	GPIO_InitTypeDef GPIO_InitStructure;
	RCC_AHB1PeriphClockCmd(RCC_AHB1Periph_GPIOB, ENABLE);//使能PORTB时钟
	GPIO_InitStructure.GPIO_Pin = GPIO_Pin_1;
  GPIO_InitStructure.GPIO_Mode = GPIO_Mode_OUT;//普通输出模式
  GPIO_InitStructure.GPIO_OType = GPIO_OType_PP;//推挽输出
  GPIO_InitStructure.GPIO_Speed = GPIO_Speed_100MHz;//100MHz
  GPIO_InitStructure.GPIO_PuPd = GPIO_PuPd_UP;//上拉
	GPIO_Init(GPIOB,&GPIO_InitStructure);
	GPIO_SetBits(GPIOB,GPIO_Pin_1);	
}



void CTP_GPIOInit(void)
{
	GPIO_InitTypeDef GPIO_InitStructure;
  RCC_APB2PeriphClockCmd(RCC_AHB1Periph_GPIOB|RCC_AHB1Periph_GPIOC,ENABLE);
	GPIO_InitStructure.GPIO_Pin=GPIO_Pin_2;
  GPIO_InitStructure.GPIO_Mode = GPIO_Mode_OUT;//普通输出模式
  GPIO_InitStructure.GPIO_OType = GPIO_OType_PP;//推挽输出
  GPIO_InitStructure.GPIO_Speed = GPIO_Speed_100MHz;//100MHz
  GPIO_InitStructure.GPIO_PuPd = GPIO_PuPd_UP;//上拉
	GPIO_Init(GPIOB,&GPIO_InitStructure);
	GPIO_SetBits(GPIOB,GPIO_Pin_2);
	
	GPIO_InitStructure.GPIO_Pin=GPIO_Pin_0;
  GPIO_InitStructure.GPIO_Mode = GPIO_Mode_OUT;//普通输出模式
  GPIO_InitStructure.GPIO_OType = GPIO_OType_PP;//推挽输出
  GPIO_InitStructure.GPIO_Speed = GPIO_Speed_100MHz;//100MHz
  GPIO_InitStructure.GPIO_PuPd = GPIO_PuPd_UP;//上拉
	GPIO_Init(GPIOC,&GPIO_InitStructure);
	GPIO_SetBits(GPIOC,GPIO_Pin_0);
	
	
	GPIO_InitStructure.GPIO_Pin=GPIO_Pin_0|GPIO_Pin_1;
  GPIO_InitStructure.GPIO_Mode = GPIO_Mode_OUT;//普通输出模式
  GPIO_InitStructure.GPIO_OType = GPIO_OType_PP;//推挽输出
  GPIO_InitStructure.GPIO_Speed = GPIO_Speed_100MHz;//100MHz
  GPIO_InitStructure.GPIO_PuPd = GPIO_PuPd_UP;//上拉
	GPIO_Init(GPIOB,&GPIO_InitStructure);
	GPIO_SetBits(GPIOB,GPIO_Pin_0|GPIO_Pin_1);
}

void CTP_INT_IN(void)
{
	GPIO_InitTypeDef GPIO_InitStructure;
  RCC_APB2PeriphClockCmd(RCC_AHB1Periph_GPIOB,ENABLE);
	GPIO_InitStructure.GPIO_Pin=GPIO_Pin_2;
  GPIO_InitStructure.GPIO_Mode = GPIO_Mode_IN;
  GPIO_InitStructure.GPIO_Speed = GPIO_Speed_100MHz;//100MHz
  GPIO_InitStructure.GPIO_PuPd = GPIO_PuPd_NOPULL;
	GPIO_Init(GPIOB,&GPIO_InitStructure);
	GPIO_ResetBits(GPIOB,GPIO_Pin_2);	
}

//控制I2C速度的延时
void CT_Delay(void)
{
	delay_us(10);
} 

void CTP_IIC_Start(void)
{
	CTP_SDA_OUT();
	CTP_SDA_Set();
	CTP_SCL_Set();
	delay_us(10);
	CTP_SDA_Clr();
	delay_us(5);
	CTP_SCL_Clr();
}
void CTP_IIC_Stop(void)
{
	CTP_SDA_OUT();
	CTP_SCL_Clr();
	CTP_SDA_Clr();
	delay_us(5);
	CTP_SCL_Set();
	CTP_SDA_Set();
}


u8 CTP_WaitAck(void)
{
	u8 ms=0;
	CTP_SDA_IN();
	CTP_SDA_Set();
	CTP_SCL_Set();
	delay_us(5);
	while(CTP_ReadSDA)
	{
		ms++;
		if(ms>250)
		{
			CTP_IIC_Stop();
			return 1;
		}
	}
	CTP_SCL_Clr();
	return 0;
}

void CTP_IICAck(void)
{
	CTP_SCL_Clr();
	CTP_SDA_OUT();
	delay_us(5);
	CTP_SDA_Clr();
	delay_us(5);
	CTP_SCL_Set();
	delay_us(5);
	CTP_SCL_Clr();
	
}

void CTP_IICNack(void)
{
	CTP_SCL_Clr();
	CTP_SDA_OUT();
	delay_us(5);
	CTP_SDA_Set();
	delay_us(5);
	CTP_SCL_Set();
	delay_us(5);
	CTP_SCL_Clr();
	
}

void CTP_SendByte(u8 dat)
{
	u8 i;
	CTP_SDA_OUT(); 
	CTP_SCL_Clr();
	for(i=0;i<8;i++)
	{
	 CT_IIC_SDA=(dat&0x80)>>7;
   dat<<=1; 
	 CTP_SCL_Set();
	 delay_us(5);
		CTP_SCL_Clr();
		delay_us(5);
	}
}
			 				     

u8 CTP_ReadByte(u8 ack)
{
	u8 i,dat;
	CTP_SDA_IN();
	for(i=0;i<8;i++)
	{
		CTP_SCL_Clr();
		delay_us(5);
		CTP_SCL_Set();
		dat<<=1;
		if(CTP_ReadSDA)
			dat++;
	}
		if(!ack)
		{
			CTP_IICNack();
		}
		else
		{
			CTP_IICAck();
		}
		return dat;
}



