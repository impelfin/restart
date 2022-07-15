from bottle import route, run, error, static_file, template, request, response, view
import pandas as pd
import json
import requests

#== weather_info.py =====================
@route('/')
@route('/weather/<i_sg_nm>')
def index(i_sg_nm='가평'):
    print('== weather page start ========>')

    #== 받아온 값에서 마지막 '시/군' 값을 잘라내기
    if i_sg_nm != "" :
        i_sg_nm = i_sg_nm[:-1]

    #== 해당 사이트의 시군 id 목록 =============================
    prov_list = [
        {'name':'가평','city_id':'1843082'},
        {'name':'고양','city_id':'1842485'},
        {'name':'광명','city_id':'1835848'},
        {'name':'광주','city_id':'1897000'},
        {'name':'남양주','city_id':'1833788'},
        {'name':'안성','city_id':'1846912'},
        {'name':'시흥','city_id':'1846912'},
        {'name':'양주','city_id':'1833788'},
        {'name':'연천','city_id':'1832697'},
        {'name':'여주','city_id':'1843702'},
        {'name':'오산','city_id':'1839652'},
        {'name':'평택','city_id':'1838343'},
        {'name':'파주','city_id':'1840898'},
        {'name':'이천','city_id':'1843702'},
        {'name':'화성','city_id':'1843847'},
        {'name':'시흥','city_id':'1843564'},
        {'name':'수원','city_id':'1835553'},
        {'name':'성남','city_id':'1897000'},
        {'name':'부천','city_id':'1838716'},
        {'name':'안산','city_id':'1846918'},
    ]

    def converte_kelvin_to_celsius(k):
        return (k-273.15)

    url = 'http://api.openweathermap.org/data/2.5/weather'

    weather_info_list = []

    #== 입력값으로 해당 시군 코드를 찾아서, 파라메터로 넘김 =============
    for i in range(len(prov_list)):

        if prov_list[i]['name'] == i_sg_nm :
            city_id = prov_list[i]['city_id']
            city_name = prov_list[i]['name']
            break
        else :
            city_id = prov_list[0]['city_id']
            city_name = prov_list[0]['name']

    #== 날씨 정보 검색해서 DataFrame에 담기 =====================
    params = dict(
        id=city_id,
        APPID='2f958e372804e1463b261a42b2e83e88',
    )

    resp = requests.get(url=url, params=params)
    data = resp.json()

    if(data['cod'] == 429): # blocking error code
        exit

    data_main = data['main']
    info = [
        city_id,
        city_name,
        converte_kelvin_to_celsius(data_main['temp_min']), \
        converte_kelvin_to_celsius(data_main['temp']), \
        converte_kelvin_to_celsius(data_main['temp_max']), \
        data_main['pressure'], \
        data_main['humidity'],

        ]
    weather_info_list.append(info)

    df = pd.DataFrame(weather_info_list, columns=['city_id', 'city_name', \
                                                  'temp_min', 'temp', 'temp_max',\
                                                  'pressure', 'humidity'
                                                  ])
    print(df)
    #------------------------------------------------------

    #== 날씨 정보로 html 페이지 생성 ====================
    w_list = df.values.tolist()

    wearther_page = '''
<!doctype html>
<html>
<head>
<title>지역별 날씨정보</title>
<meta charset="utf-8">
</head>
<body>
<table border="1"; margin:auto;>
    <tr>
        <th>지역</th>
        <th>최저기온</th>
        <th>기온</th>
        <th>최고기온</th>
        <th>기압</th>
        <th>습도</th>
    </tr>
    '''

    if len(w_list) > 0 :
        for v in w_list :
            wearther_page += '<tr>'
            wearther_page += '<td>' + v[1] +'</td>'
            wearther_page += '<td>' + str( round(v[2],1) ) +'</td>'
            wearther_page += '<td>' + str( round(v[3],1) ) +'</td>'
            wearther_page += '<td>' + str( round(v[4],1) ) +'</td>'
            wearther_page += '<td>' + str(v[5]) +'</td>'
            wearther_page += '<td>' + str(v[6]) +'</td>'
            wearther_page += '</tr>'
    else :
        wearther_page += '<tr><td colspan="6">검색결과 없음</td></tr>'

    wearther_page += '''
</table>
</body>
</html>
    '''
    #== html 페이지 반화 ======================
    return wearther_page

run(host='0.0.0.0', port=8080, threaded=True)
