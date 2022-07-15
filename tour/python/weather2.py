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

import requests
from time import sleep
url = 'http://api.openweathermap.org/data/2.5/weather'

weather_info_list = []
for i in range(len(prov_list)):
    city_id = prov_list[i]['city_id']
    city_name = prov_list[i]['name']
    
    params = dict(
        id=city_id,
        APPID='2f958e372804e1463b261a42b2e83e88',
    )
    sleep(1)
    resp = requests.get(url=url, params=params)
    data = resp.json()
    if(data['cod'] == 429): # blocking error code
        break

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

    

import pandas as pd
df = pd.DataFrame(weather_info_list, columns=['city_id', 'city_name', \
                                              'temp_min', 'temp', 'temp_max',\
                                              'pressure', 'humidity'
                                              ])
print(df)