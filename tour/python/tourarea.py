# from bottle import route, run
from bottle import route, run, error, static_file, template, request, response, view
import pymysql
import pandas as pd
import folium
import base64

@route('/')
@route('/<i_sg_cd>')
def index(i_sg_cd=''):

    conn = pymysql.connect(host='database-1.csutjqozrvur.us-west-1.rds.amazonaws.com', user='admin', password='admin1234', db='st_db', charset='utf8')

    ta_no_list = []
    sg_cd_list = []
    ta_name_list = []
    ta_addr_list = []
    ta_phone_list = []
    ta_lan_list = []
    ta_lng_list = []
    data_exit = False;

    try:
        # SELECT
        with conn.cursor() as curs:
            sg_cd = i_sg_cd
            sql = "SELECT ta_no,sg_cd,ta_name,ta_addr,ta_phone,ta_lan, ta_lng FROM tourarea_tb "
            if sg_cd != '' :
                sql += "where sg_cd = '"+ sg_cd +"'"
            sql += ";"

            curs.execute(sql)
            rs = curs.fetchall()

            for row in rs:
                data_exit = True
                print(row)
                ta_no_list.append(row[0])
                ct_cd_list.append(row[1])
                ta_name_list.append(row[2])
                ta_addr_list.append(row[3])
                ta_phone_list.append(row[4])
                ta_lan_list.append(row[5])
                ta_lng_list.append(row[6])
    finally:
        conn.close()

    # =============================================
    # 지도 위치 표기
    # =============================================

    if data_exit :
        lan_0 = cs_lan_list[0]
        lng_0 = cs_lng_list[0]
    else :
        lan_0 = '37.261851'
        lng_0 = '127.031121'

    map = folium.Map(location=[lan_0,lng_0],zoom_start=11)

    if data_exit :
        for i in range(len(ta_no_list)):
            if cs_lan_list[i] != 0:
                # 이미지 처리. img 폴더에 이미지 넣기
                # pic = base64.b64encode(open('./img/img03.jpg','rb').read()).decode()
                # image_tag = '<img src="data:image/jpeg;base64,{}" width="150" height="150">'.format(pic)
                image_tag = '<a href="https://daum.net" target="new">' + cs_name_list[i] + '</a>'
                iframe = folium.IFrame(image_tag, width=400, height=300 )
                nameUrl = folium.Popup(iframe, max_width=650)

                marker = folium.Marker([ta_lan_list[i],ta_lng_list[i]],
                                    popup=nameUrl,
                                    tooltip=ta_name_list[i],
                                    icon = folium.Icon(color='blue'))
                marker.add_to(map)
    else :
        marker = folium.Marker([lan_0,lng_0],
                            tooltip='수원시청역',
                            icon = folium.Icon(color='blue'))
        marker.add_to(map)

    map.save(r'city_map_02.html')
    return static_file('city_map_02.html', root='/data/python/map_01/')

run(host='0.0.0.0', port=8080, threaded=True)
