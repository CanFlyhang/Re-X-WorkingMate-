#include "CST816S.h"
#include  "CTIIC.h"

const u16 POINT_COLOR_TBL[CTP_MAX_TOUCH]={RED,GREEN}; //触摸笔颜色
const u16 TPX[]={0x03,0x09}; //触摸地址
_m_tp_dev tp_dev=
{
 CST816S_Init,
 CST816S_Scan,
 0,
 0,	
 0,
};


//写数据
u8 CST816S_WR_DATA(u16 addr,u8 data)
{
	u8 reg;
	CTP_IIC_Start();          //IIC起始信号
	CTP_SendByte(CST_WR_CMD);  //发送写指令
	CTP_WaitAck();    
	CTP_SendByte(addr);
	CTP_WaitAck();
	CTP_SendByte(data);       //写入数据
	CTP_WaitAck();
	CTP_IIC_Stop();           //IIC结束信号
	reg=SUCCESS;
	return reg;
}

//读数据
u8 CST816S_RD_DATA(u16 addr,u8 len,u8 *value)
{
	u8 reg=ERROR,i;
	CTP_IIC_Start();
	CTP_SendByte(CST_WR_CMD);  //发送写指令
	CTP_WaitAck();    
	CTP_SendByte(addr);
	CTP_WaitAck();
  CTP_IIC_Start();
	CTP_SendByte(CST_RD_CMD);
	CTP_WaitAck();
	for(i=0;i<len;i++)
	{
		if(i==(len-1))
		{
			value[i]=CTP_ReadByte(0x00);
		}
		else
		{
			value[i]=CTP_ReadByte(0x01);
		}
	}
	CTP_IIC_Stop();
	reg=SUCCESS;
	return reg;
}


void  CST816S_Init(void)
{
	u8 ID;
	CTP_GPIOInit();
	CTP_RES_Clr();
  CTP_INT_Clr();
	delay_ms(50);
	CTP_INT_Set();
	delay_ms(50);
	CTP_RES_Set();
  delay_ms(50);
  CTP_INT_IN();	
	delay_ms(20);
	CST816S_RD_DATA(CST816S_ID,1,&ID);
}

u8 CST816S_Scan(u8 mode)
{
	u8 buf[4];
	u8 i=0;
	u8 res=0;
	u8 temp;
	u8 tempsta;
 	static u8 t=0;//控制查询间隔,从而降低CPU占用率   
	t++;
	if((t%10)==0||t<10)//空闲时,每进入10次CTP_Scan函数才检测1次,从而节省CPU使用率
	{ 
		CST816S_RD_DATA(GT_ADDR_REG,1,&mode);
		if(mode&0X80&&((mode&0XF)<6))
		{
			temp=0;	
			CST816S_WR_DATA(GT_ADDR_REG,temp);
		}		
		if((mode&0XF)&&((mode&0XF)<6))
		{
			temp=0XFF<<(mode&0XF);		//将点的个数转换为1的位数,匹配tp_dev.sta定义 
			tempsta=tp_dev.sta;			//保存当前的tp_dev.sta值
			tp_dev.sta=(~temp)|TP_PRES_DOWN|TP_CATH_PRES; 
			tp_dev.x[1]=tp_dev.x[0];	//保存触点0的数据
			tp_dev.y[1]=tp_dev.y[0];
			for(i=0;i<2;i++)
			{
				if(tp_dev.sta&(1<<i))	//触摸有效?
				{
					CST816S_RD_DATA(TPX[i],4,buf);
          if(USE_HORIZONTAL==2)//横屏
					{
						tp_dev.y[i]=buf[1];
						tp_dev.x[i]=buf[3];
					}
					else if(USE_HORIZONTAL==0)
					{
						tp_dev.x[i]=240-buf[1];
						tp_dev.y[i]=buf[3];
					} 
					else if(USE_HORIZONTAL==1)
					{
						tp_dev.x[i]=buf[1];
						tp_dev.y[i]=240-buf[3];
					} 
					else 
					{
						tp_dev.y[i]=240-buf[1];
						tp_dev.x[i]=240-buf[3];
					} 					
//					printf("x[%d]:%d,y[%d]:%d\r\n",i,tp_dev.x[i],i,tp_dev.y[i]);
				}			
			} 
			res=1;
			if(tp_dev.x[0]>LCD_W||tp_dev.y[0]>LCD_H)//非法数据(坐标超出了)
			{ 
				if((mode&0XF)>1)		//有其他点有数据,则复第二个触点的数据到第一个触点.
				{
					tp_dev.x[0]=tp_dev.x[1];
					tp_dev.y[0]=tp_dev.y[1];
					t=0;				//触发一次,则会最少连续监测10次,从而提高命中率
				}else					//非法数据,则忽略此次数据(还原原来的)  
				{
					tp_dev.x[0]=tp_dev.x[1];
					tp_dev.y[0]=tp_dev.y[1];
					mode=0X80;		
					tp_dev.sta=tempsta;	//恢复tp_dev.sta
				}
			}else t=0;					//触发一次,则会最少连续监测10次,从而提高命中率
		}
	}
	else//无触摸点按下
	{ 
		if(tp_dev.sta&TP_PRES_DOWN)	//之前是被按下的
		{
			tp_dev.sta&=~(1<<7);	//标记按键松开
			tp_dev.x[0]=0;
			tp_dev.y[0]=0;
			tp_dev.sta&=0XE0;	//清除点有效标记
		}else						//之前就没有被按下
		{ 
			tp_dev.x[0]=0;
			tp_dev.y[0]=0;
			tp_dev.sta&=0XE0;	//清除点有效标记	
		}	 
	} 	
	if(t>240)t=10;//重新从10开始计数
	return res;
}



void CST816S_test(void)
{
	u8 t=0; 	    
 	u16 lastpos[2][2];		//最后一次的数据 
	LCD_Fill(0,0,LCD_W,LCD_H,WHITE);
	while(1)
	{   
		tp_dev.scan(0);
		for(t=0;t<CTP_MAX_TOUCH;t++)
		{
			if((tp_dev.sta&(1<<t)))//判断是否有点触摸？
			{    
				delay_ms(1);
				if(tp_dev.x[t]<LCD_W&&tp_dev.y[t]<LCD_H)//在LCD范围内
				{
					if(lastpos[t][0]==0XFFFF)
					{
						lastpos[t][0] = tp_dev.x[t];
						lastpos[t][1] = tp_dev.y[t];
					}
					LCD_DrawLine(lastpos[t][0],lastpos[t][1],tp_dev.x[t],tp_dev.y[t],POINT_COLOR_TBL[t]);
					lastpos[t][0]=tp_dev.x[t];
					lastpos[t][1]=tp_dev.y[t];
				}
			}else {lastpos[t][0]=0XFFFF;}
		}
		delay_ms(5);
	}	
}










