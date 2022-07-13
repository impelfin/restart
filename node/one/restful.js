const express = require('express')
const bodyParser = require('body-parser')
const dfd = require('dataframe-js')

var mysql = require('mysql');
var connection = mysql.createConnection({
  host : 'database-1.csutjqozrvur.us-west-1.rds.amazonaws.com',
  user : 'admin',
  password : 'admin1234',
  database : 'st_db'
});

var app = express();

connection.connect(function(err){
  if(!err){
    console.log('database is connected... \n\n');
  }else{
    console.log('Error connecting... \n\n');
  }
});

app.get('/accom', function(req, res ) {
  var qStr = 'select a.*, b.sg_nm from accom_tb a,  sigun_tb b where a.sg_cd = b.sg_cd ';
  var stat = true;

  if(req.query.sg_cd != null) {
    qStr += " and a.sg_cd="+req.query.sg_cd;
  } else {
    stat = false
  }
  qStr += " order by a.sg_cd, ac_cd "

  console.log('sql --> ', qStr);

  connection.query(qStr, function(err,rows,fields){
    connection.end();

    if(!err) {
      //res.send(rows);
//==================================
      res.writeHead(200);
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
           <th>1</th>
           <th>1</th>
           <th>1</th>
           <th>1</th>
           <th>1</th>
           <th>1</th>
           <th>1</th>
           <th>1</th>
           <th>1</th>
           <th>1</th>
         </tr>
       `;
       for (var i=0; i<rows.length ; i++){
         template += `
         <tr>
           <td>${rows[i]['ac_cd']}</td>
           <td>${rows[i]['sg_cd']}</td>
           <td>${rows[i]['sg_nm']}</td>
           <td>${rows[i]['ac_name']}</td>
           <td>${rows[i]['ac_stat']}</td>
           <td>${rows[i]['ac_addr']}</td>
           <td>${rows[i]['ac_url']}</td>
           <td>${rows[i]['ac_img']}</td>
           <td>${rows[i]['ac_lan']}</td>
           <td>${rows[i]['ac_lng']}</td>
         </tr>
         `;

       }
      template += `
        </table>
      </body>
      </html>
      `;
      res.end(template);
//==================================

      console.log('The solution is : ', rows);
    }else {
      console.log('Error while performing Query ', err);
    }
  })
});


app.get('/tourarea', function(req, res ) {
  var qStr = 'select a.*, b.sg_nm from tourarea_tb a,  sigun_tb b where a.sg_cd = b.sg_cd';
  var stat = true;

  if(req.query.sg_cd != null) {
    qStr += " and a.sg_cd="+req.query.sg_cd;
  } else {
    stat = false
  }
  qStr += " order by a.sg_cd, ta_no "

  console.log('sql --> ', qStr);

  connection.query(qStr, function(err,rows,fields){
    connection.end();
    if(!err) {
      //res.send(rows);
//==================================
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
           <th>1</th>
           <th>1</th>
           <th>1</th>
           <th>1</th>
           <th>1</th>
           <th>1</th>
           <th>1</th>
           <th>1</th>
           <th>1</th>
           <th>1</th>
           <th>1</th>
         </tr>
       `;
       for (var i=0; i<rows.length ; i++){
         template += `
         <tr>
           <td>${rows[i]['ta_no']}</td>
           <td>${rows[i]['sg_cd']}</td>
           <td>${rows[i]['sg_nm']}</td>
           <td>${rows[i]['ta_name']}</td>
           <td>${rows[i]['ta_stat']}</td>
           <td>${rows[i]['ta_addr']}</td>
           <td>${rows[i]['ta_phone']}</td>
           <td>${rows[i]['ta_url']}</td>
           <td>${rows[i]['ta_img']}</td>
           <td>${rows[i]['ta_lan']}</td>
           <td>${rows[i]['ta_lng']}</td>
         </tr>
         `;

       }
      template += `
        </table>
      </body>
      </html>
      `;
      res.end(template);
//==================================

      console.log('The solution is : ', rows);
    }else {
      console.log('Error while performing Query ', err);
    }
  })
});


app.get('/rank', function(req, res ) {
  var qStr = 'SELECT * FROM st_db.search_tb order by srch_rank asc';
  var stat = true;

  console.log('sql --> ', qStr);

  connection.query(qStr, function(err,rows,fields){
    //connection.end();
    if(!err) {
      //res.send(rows);
//==================================
      res.writeHead(200);
      var template = `
      <!doctype html>
      <html>
      <head>
        <title>검색어 정보</title>
        <meta charset="utf-8">
      </head>
      <body>
        <table border="1"; margin:auto;>
         <tr>
           <th>순위</th>
           <th>검색어</th>
         </tr>
       `;
       for (var i=0; i<rows.length ; i++){
         template += `
         <tr>
           <td>${rows[i]['srch_rank']}</td>
           <td>${rows[i]['srch_word']}</td>
         </tr>
         `;

       }
      template += `
        </table>
      </body>
      </html>
      `;
      res.end(template);
//==================================

      console.log('The solution is : ', rows);
    }else {
      console.log('Error while performing Query ', err);
    }
  })
});


app.get("/api/users", (req, res) => {
  let df = new dfd.DataFrame(users);
  result = df.toJSON(users)
  df.show();
  res.writeHead(200)
  var template = `
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="utf-8">
    </head>
    <body>
      ${result}
    </body>
    </html>
  `;
  res.end(template)
})

module.exports = app;
