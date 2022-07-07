const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const request = require('request');
const moment = require('moment');
const dateutil = require('date-utils');
const mongoClient = require('mongodb').MongoClient

let today = new Date();
var now = today.toFormat("YYYYMMDDHH");

var keys='B%2FNiJnYmkZV1%2FK7ulvZI4MoSXvCTDfNAd0Snw%2Bk6g4%2BbMk1LoGVhd75DJahjv4K35Cr9jh9RX0j%2BM89grKBYsw%3D%3D'
var url = 'http://apis.data.go.kr/1360000/LivingWthrIdxServiceV2/getUVIdxV2';
var queryParams = '?' + encodeURIComponent('serviceKey') + '=' + keys; /* Service Key*/
queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); /* */
queryParams += '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('JSON'); /* */
//queryParams += '&' + encodeURIComponent('areaNo') + '=' + encodeURIComponent('1100000000'); /* */
queryParams += '&' + encodeURIComponent('areaNo') + '=' + encodeURIComponent(''); /* */
queryParams += '&' + encodeURIComponent('time') + '=' + encodeURIComponent(now); /* */

//define scheme
var weatherSchema = mongoose.Schema({
      code: String,
      areaNo : Number,
      date : String,
      today : Number,
      tomorrow : Number,
      dayaftertomorrow : Number,
      twodaysaftertomorrow : Number
});

var Weather = mongoose.model('weathers',weatherSchema);

// getdata
router.get('/getdata', function(req, res, next) {
  request({
      url: url + queryParams,
      method: 'GET'
  }, function (error, response, body) {
      //console.log('Status', response.statusCode);
      //console.log('Headers', JSON.stringify(response.headers));
      //console.log('Reponse received', body);

      Weather.find({}).remove().exec();

      let data = JSON.parse(body);
      res.json(data);

      for(i in data['response']['body']['items']['item']) {
        code_v  = data['response']['body']['items']['item'][i]['code'];
        areaNo_v  = data['response']['body']['items']['item'][i]['areaNo'];
        date_v  = data['response']['body']['items']['item'][i]['date'];
        today_v  = data['response']['body']['items']['item'][i]['today'];
        tomorrow_v  = data['response']['body']['items']['item'][i]['tomorrow'];
        dayaftertomorrow_v  = data['response']['body']['items']['item'][i]['dayaftertomorrow'];
        twodaysaftertomorrow_v  = data['response']['body']['items']['item'][i]['twodaysaftertomorrow'];

        var newWeather = new Weather({code : code_v, areaNo : areaNo_v, date : date_v, today : today_v, tomorrow : tomorrow_v, dayaftertomorrow : dayaftertomorrow_v, twodaysaftertomorrow : twodaysaftertomorrow_v});
        newWeather.save(function(err, result) {
          if (err) return console.error(err);
          console.log(new Date(),result);
        })
      }
  });
});

// list
router.get('/list', function(req, res, next) {
      Weather.find({},function(err,docs){
           if(err) console.log('err');
           res.writeHead(200);
           var template = `
           <!doctype html>
           <html>
           <head>
             <title>Result</title>
             <meta charset="utf-8">
           </head>
           <body>
             ${docs}
           </body>
           </html>
          `;
           res.end(template);
      });
});

// get
router.get('/get', function(req, res, next) {
      db = req.db;
      var input = req.query.input;
      if(input=='') {
        Weather.findOne({},function(err,docs){
          if(err) console.log('err');
          res.send(docs);
        });
      } else {
        Weather.find({'areaNo':input},function(err,docs){
          if(err) console.log('err');
          res.send(docs);
        });
      }
});

module.exports = router;

Weather.find({}).exec(function(err,weathers){
      console.log("Query 1");
      console.log(new Date(), weathers+"\n");
      return;
});
