const express = require('express')
const bodyParser = require('body-parser')
const dfd = require('dataframe-js')

var mysql = require('sync-mysql');
var connection = new mysql({
  host : 'database-1.csutjqozrvur.us-west-1.rds.amazonaws.com',
  user : 'admin',
  password : 'admin1234',
  database : 'st_db'
});

var app = express();

console.log('restful ===========================> ');

//-- 숙박업소 정보. 지역코드로 검색 ----------------
app.get('/accom', function(req, res ) {
  var qStr = 'select a.*, b.sg_nm from accom_tb a, sigun_tb b where a.sg_cd = b.sg_cd ';

  if(req.query.sg_cd != null) {
    qStr += " and a.sg_cd="+req.query.sg_cd;
  }
  qStr += " order by a.sg_cd, ac_cd "

  console.log('sql --> ', qStr);
  let result = connection.query(qStr);
  // console.log(result);

  var template = `
  <!doctype html>
  <html>
  <head>
    <title>숙박업소 정보</title>
    <meta charset="utf-8">
  </head>
  <body>
    <table border="1"; margin:auto;>
     <tr>
       <th>업소명</th>
       <th>운영상태</th>
       <th>주소</th>
       <th>사진</th>
       <th>관련링크</th>
     </tr>
   `;

  if ( result.length >0  ) {
    res.writeHead(200);

     for (var i=0; i<result.length ; i++){
       template += `
       <tr>
         <td>${result[i]['ac_name']}</td>
         <td>${result[i]['ac_stat']}</td>
         <td>${result[i]['ac_addr']}</td>
         <td><img src="./img/accom_tb/${result[i]['ac_img']}"></td>
         <td>${result[i]['ac_url']}</td>
       </tr>
       `;
     }

  }else {
    console.log('no data ==============','\n')
    template += `
    <tr>
      <td colspan="5">검색결과 없음</td>
    </tr>
    `;
  }

  template += `
    </table>
  </body>
  </html>
  `;
  res.end(template);
});


//-- 체험관광지 정보. 지역코드로 검색 ----------------
app.get('/tourarea', function(req, res ) {
  var qStr = 'select a.*, b.sg_nm from tourarea_tb a, sigun_tb b where a.sg_cd = b.sg_cd ';

  if(req.query.sg_cd != null) {
  qStr += " and a.sg_cd="+req.query.sg_cd;
  }
  qStr += " order by a.sg_cd, ta_no "

  console.log('sql --> ', qStr);
  let result = connection.query(qStr);

  res.writeHead(200);
  var template = `
      <!doctype html>
      <html>
      <head>
      <title>체험관광지 정보</title>
      <meta charset="utf-8">
      </head>
      <body>
      <table border="1"; margin:auto;>
          <tr>
          <th>관광지명</th>
          <th>운영상태</th>
          <th>주소</th>
          <th>연락처</th>
          <th>사진</th>
          <th>관련링크</th>
          </tr>
      `;


    if ( result.length >0  ) {
      for (var i=0; i<result.length ; i++){
      template += `
        <tr>
            <td>${result[i]['ta_name']}</td>
            <td>${result[i]['ta_stat']}</td>
            <td>${result[i]['ta_addr']}</td>
            <td>${result[i]['ta_phone']}</td>
            <td><img src="./img/accom_tb/${result[i]['ta_img']}"></td>
            <td>${result[i]['ta_url']}</td>
        </tr>
      `;
      }
    } else {
      console.log('no data ==============','\n')
      template += `
        <tr>
        <td colspan="6">검색결과 없음</td>
        </tr>
        `;
    }

    template += `
        </table>
        </body>
        </html>
        `;
    res.end(template);
});


//-- 검색어 rank 정보.  ----------------
app.get('/rank', function(req, res ) {
  var qStr = 'SELECT * FROM st_db.search_tb order by srch_rank desc limit 5 ';

  //console.log('sql --> ', qStr);
  let result = connection.query(qStr);

  res.writeHead(200);
  var template = `
      <!doctype html>
      <html>
      <head>
        <title>검색어 정보</title>
        <meta charset="utf-8">
      </head>
      <body>
        <table border="0"; margin:auto;>
        <tr>
          <th>순위</th>
          <th>검색어</th>
        </tr>
       `;

  if ( result.length >0  ) {
    for (var i=0; i<result.length ; i++){
      template += `
      <tr>
        <td><img src="./img/best0${i+1}.png"></td>
        <td>${result[i]['srch_word']}</td>
      </tr>
      `;

    }
  } else {
    console.log('no data ==============','\n')
    template += `
      <tr>
      <td colspan="2">검색결과 없음</td>
      </tr>
      `;
  }

  template += `
       </table>
     </body>
     </html>
     `;
   res.end(template);
});


//-- 시군 selectbox  ----------------
app.get('/sigun', function(req, res ) {
  var qStr = 'SELECT * FROM sigun_tb order by sg_nm asc ';

  console.log('sql --> ', qStr);
  let result = connection.query(qStr);

  res.writeHead(200);
  var template = `<select class ="local" name="local" id="local">`;

  if ( result.length >0  ) {
    for (var i=0; i<result.length ; i++){
      template += ` <option value=${result[i]['sg_cd']}>${result[i]['sg_nm']}</option> `;
    }
  }
  template += ` </select>`;
  res.end(template);

});


module.exports = app;
