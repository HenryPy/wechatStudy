import pymysql
import datetime
import xlwt
import serial
import serial.tools.list_ports
from time import sleep
import threading


# 读取报警写入mysql
def readfile(alarm_id):
    alarm_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # 连接MySQL
    conn = pymysql.connect(host='', port=3306, user='',
                           password='', database='',
                           charset='utf8', )
    # 创建游标
    csr = conn.cursor()
    # 创建sql语句
    sql = "insert into alarmxinxi(time,warnid) values (%s,%s);"

    try:
        # csr.execute(sql, [row_content[0], row_content[1]])
        # csr.executemany(sql, [(12368, '未取嗎真空報警'),(12366, '放料未吸料報警')],)
        csr.execute(sql, (alarm_time, alarm_id))

        conn.commit()
        print('写入数据库成功')
    except Exception as e:
        conn.rollback()
        print('写入失败,原因:', e)
    finally:
        # 关闭游标
        csr.close()
        # 关闭连接
        conn.close()


# 读取mysql写入本地
def writefile():
    style = xlwt.XFStyle()  # 初始化样式
    # 创建字体
    font = xlwt.Font()
    font.name = 'Time New Roman'
    font.bold = True
    font.height = 15 * 10
    style.font = font
    # 连接MySQL
    conn = pymysql.connect(host='', port=3306, user='root',
                           password='****', database='****',
                           charset='utf8', )
    # 创建游标
    csr = conn.cursor()
    # 创建sql语句
    sql = 'select x.id,x.time,x.warnid,d.warntext from alarmxinxi as x left join duizhaobiao as d on x.warnid = d.warnum;'
    # 用游标
    csr.execute(sql)
    result = csr.fetchall()
    fields = csr.description
    # 写入excel
    file1 = xlwt.Workbook()
    sheet1 = file1.add_sheet(sheetname='sheet1', cell_overwrite_ok=False)
    # 逐行逐列写入
    for field in range(0, len(fields)):
        sheet1.write(0, field, fields[field][0])
    for row in range(1, len(result) + 1):
        for col in range(0, len(fields)):
            try:
                sheet1.write(row, col, u'%s' % result[row - 1][col])
            except Exception as e:
                print('写入失败,原因:', e)
    try:
        file1.save('C:\demoAlarm.xls')
    except Exception as e:
        print('生成文档失败,原因为:', e)
    finally:
        # 关闭游标
        csr.close()
        # 关闭连接
        conn.close()


# 发送信息给PLC
def uart_open():
    if ser.isOpen():
        while True:
            sleep(3)
            # 这里可以改为任何触发PLC的信息
            send_data = '014406Y00044E'.encode('UTF-8')
            ser.write(send_data)
            # print('发送成功')


# 循环接收PLC信息
def read_data():
    alm_list = ['0', '0', '0', '0']
    while True:
        alarm_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        # return the number of input buffer
        n = ser.inWaiting()
        if n:
            sleep(0.1)
            # 读取当前的数据,n等于要读取的长度
            a = ser.readline()
            re_data = a.decode('utf-8')
            print(f'{alarm_time}\t{re_data}Y04状态:{re_data[6]}\tY05状态:{re_data[7]}\t'
                  f'Y06状态:{re_data[8]}\tY07状态:{re_data[9]}\t'
                  f'Y08状态:{re_data[10]}\tY09状态:{re_data[11]}')
            if (re_data[6] != alm_list[0]) & (re_data[6] == '1'):
                readfile(23125)
                # print('12368')
                alm_list[0] = '1'
                # print(alm_list)
                continue
            elif (re_data[6] != alm_list[0]) & (re_data[6] == '0'):
                readfile(231250)
                # print('12369')
                alm_list[0] = '0'
                # print(alm_list)
                continue
            elif re_data[6] == alm_list[0]:
                print('相同不执行')


if __name__ == "__main__":
    ser = serial.Serial(port="COM3", baudrate=9600, bytesize=7, parity='E', stopbits=1, timeout=0.1)
    threading.Thread(target=read_data, daemon=True).start()
    sleep(0.1)
    uart_open()
