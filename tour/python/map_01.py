# from bottle import route, run
from bottle import route, run, error, static_file, template, request, response, view
import pymysql
import pandas as pd
import folium
import base64
import json
import requests

@route('/')
@route('/<i_sg_cd>')
def index(i_sg_cd='41820+'):
    print('** map page start =================>')

    s_key = i_sg_cd.split('+')
    print('------', s_key)

    conn = pymysql.connect(host='database-1.csutjqozrvur.us-west-1.rds.amazonaws.com', user='admin', password='admin1234', db='st_db', charset='utf8')

    cs_no_list = []
    cs_name_list = []
    ct_cd_list = []
    ct_name_list = []
    sg_cd_list = []
    cs_lan_list = []
    cs_lng_list = []
    ct_charge_list = []
    ct_oper_list = []
    ct_phone_list = []
    cs_img_list = []

    data_exit = False;

    try:
        # srch_word INSERT -----------------------------
        if s_key[1] !="" :

            with conn.cursor() as curs:
                sql = "select srch_no, srch_rank+1 srch_rank from search_tb where srch_word = '"+ s_key[1] +"' "
                print('------> ', sql)
                curs.execute(sql)
                rs = curs.fetchall()

                if len(rs) != 0 :
                    print('rs[0]=====>',rs[0][0],' rs[1]=====>',rs[0][1])

                    sql = "UPDATE search_tb SET srch_rank="+ str(rs[0][1]) +" WHERE srch_no="+ str(rs[0][0])
                    print(sql)
                    curs.execute(sql)
                    conn.commit()

                else :
                    sql = "insert into search_tb (srch_word,ct_cd,srch_rank) values ('"+ s_key[1] +"', null, 1) "
                    print(sql)

                    curs.execute(sql)
                    conn.commit()

        # SELECT citytour_tb+course_tb ----------------
        with conn.cursor() as curs:
            sql = "select cs_no, cs_name, b.ct_cd , ct_name, b.sg_cd, cs_lan, cs_lng, ct_charge, ct_oper, ct_phone , cs_img from citytour_tb a, course_tb b where a.ct_cd = b.ct_cd "

            if s_key[0] != '' :
                sql += " and a.sg_cd = " + s_key[0]

            if s_key[1] != "" :
                sql += " and ct_name like '%"+ s_key[1] +"%' "

            sql += " order by b.ct_cd asc, cs_no asc "
            #print(sql)

            curs.execute(sql)
            rs = curs.fetchall()

            for row in rs:
                data_exit = True
                cs_no_list.append(row[0])
                cs_name_list.append(row[1])
                ct_cd_list.append(row[2])
                ct_name_list.append(row[3])
                sg_cd_list.append(row[4])
                cs_lan_list.append(row[5])
                cs_lng_list.append(row[6])

                ct_charge_list.append(row[7])
                ct_oper_list.append(row[8])
                ct_phone_list.append(row[9])
                cs_img_list.append(row[10])
    finally:
        conn.close()

    # =============================================
    # 지도 위치 표기
    # =============================================

    if data_exit :
        lan_0 = cs_lan_list[0]
        lng_0 = cs_lng_list[0]
    else :
        lan_0 = '37.2749706'
        lng_0 = '127.0086714'

    map = folium.Map(location=[lan_0,lng_0],zoom_start=12)

    if data_exit :
        scriptStr = '<script> function aaa(){alert(top.document.targetList.location); top.document.targetList.location.href="http://daum.net"; } </script> '
        for i in range(len(cs_no_list)):
            if cs_lan_list[i] != 0:
                # 이미지 처리. img 폴더에 이미지 넣기
                # pic = base64.b64encode(open('./img/img03.jpg','rb').read()).decode()
                # image_tag = '<img src="data:image/jpeg;base64,{}" width="150" height="150">'.format(pic)
                #image_tag = '<a href="http://54.215.67.224:3000/api/users" target="target2">' + ct_name_list[i] + '</a>'
                # clickStr = 'javascript:onload('+ sg_cd_list[i] +');'

                # image_tag = '<a href="javascript:void(0);" onclik="urlLocation("") target="targetList">' + ct_name_list[i] + '</a><br>'
                #image_tag = '<a href="http://54.215.67.224:3000/accom"'+ sg_cd_list[i] +' target="_parent.">' + ct_name_list[i] + '</a><br>'
                #pic = base64.b64encode(open('./img/course_tb/img03.png','rb').read()).decode()
                #image_tag = '<img src="data:image/png;base64,{}" width="60" height="60">'.format(pic)

                image_str = '/data/node/restful/public/img/course_tb/'+cs_img_list[i]
                pic = base64.b64encode(open(image_str,'rb').read()).decode()
                image_tag = '<img src="data:image/jpeg;base64,{}" width="60" height="60">'.format(pic)

                image_tag += '<br>'
                #image_tag += scriptStr+ '<a href="#" onclick="javascript:aaa();" >' + ct_name_list[i] + '</a><br>'
                image_tag += ct_name_list[i] +'<br>'
                image_tag += ct_charge_list[i] +'<br>'
                image_tag += ct_oper_list[i] +'<br>'
                image_tag += ct_phone_list[i] +'<br>'


                iframe = folium.IFrame(image_tag, width=200, height=200 )
                popupStr = folium.Popup(iframe, max_width=200)

                marker = folium.Marker([cs_lan_list[i],cs_lng_list[i]],
                                    popup=popupStr,
                                    tooltip=cs_name_list[i],
                                    icon = folium.Icon(color='blue'))

                #--- tooltip에 링크 설정 -> 보여줄뿐 click이 안됨
                #popupStr = '<a href="#" onclick="javascript:aaa();" >' + ct_name_list[i] + '</a>'
                #marker = folium.Marker([cs_lan_list[i],cs_lng_list[i]],
                #                    tooltip=popupStr,
                #                    icon = folium.Icon(color='blue'))

                marker.add_to(map)
    else :
        marker = folium.Marker([lan_0,lng_0],
                            tooltip='검색결과가 없어, 경기도청에서 시작합니다',
                            icon = folium.Icon(color='blue'))
        marker.add_to(map)

    map.save(r'city_map_02.html')
    return static_file('city_map_02.html', root='/data/node/restful/python/')



run(host='0.0.0.0', port=8080, threaded=True)
