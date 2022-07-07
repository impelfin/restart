const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const CircularJSON = require('circular-json')
const request = require('request')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : false }))
app.use(express.json())
app.use(express.urlencoded({ extended : true }))

let urls = ""

app.get("/Hello", (req, res)=> {
  urls = "http://13.209.234.117:3000/Hello"
  request(urls, { json:true }, (err, result, body) => {
    if (err) { return console.log(err) }
    res.send(CircularJSON.stringify(body))
  })
})

app.get("/api/users", (req, res) => {
  axios
    .get('http://13.209.234.117:3000/api/users')
    .then(result => {
      res.send(CircularJSON.stringify(result.data))
    })
    .catch(error => {
      console.log(error)
    })
})

// Query params
app.get("/api/users/user", (req, res) => {
  if(req.query.name == null) {
    urls = "http://13.209.234.117:3000/api/users/user?user_id="+req.query.user_id;
  } else {
    urls = "http://13.209.234.117:3000/api/users/user?user_id="+req.query.user_id+"&name="+req.query.name;
  }
  request(urls, { json:true }, (err, result, body) => {
    if (err) { return console.log(err) }
    res.send(CircularJSON.stringify(body))
  })
})

// path Variables
app.get("/api/users/:user_id", (req, res) => {
  urls = "http://13.209.234.117:3000/api/users/"+req.params.user_id;
  request(urls, { json:true }, (err, result, body) => {
    if (err) { return console.log(err) }
    res.send(CircularJSON.stringify(body))
  })
})

// post
app.post("/api/users/userBody", (req, res) => {
  const options = {
    uri : 'http://13.209.234.117:3000/api/users/userBody',
    method : 'POST',
    form : { id : req.body.id }
  }
  request(urls, { json:true }, (err, result, body) => {
    if (err) { return console.log(err) }
    res.send(CircularJSON.stringify(body))
  })
})

// post add
app.post("/api/users/add", (req, res) => {
  const options = {
    uri : 'http://13.209.234.117:3000/api/users/add',
    method : 'POST',
    form : {
      id : req.body.id,
      name : req.body.name
    }
  }
  request(urls, { json:true }, (err, result, body) => {
    if (err) { return console.log(err) }
    res.send(CircularJSON.stringify(body))
  })
})

// put
app.put("/api/users/update", (req, res) => {
  const options = {
    uri : 'http://13.209.234.117:3000/api/users/update',
    method : 'PUT',
    form : {
      id : req.body.id,
      name : req.body.name
    }
  }
  request(urls, { json:true }, (err, result, body) => {
    if (err) { return console.log(err) }
    res.send(CircularJSON.stringify(body))
  })
})

// patch
app.patch("/api/users/update/:user_id", (req, res) => {
  const options = {
    uri : 'http://13.209.234.117:3000/api/users/'+req.params.id,
    method : 'PATCH',
    form : {
      id : req.params.id,
      name : req.body.name
    }
  }
  request(urls, { json:true }, (err, result, body) => {
    if (err) { return console.log(err) }
    res.send(CircularJSON.stringify(body))
  })
})

// delete
app.delete("/api/users/delete", (req, res) => {
  const options = {
    uri : 'http://13.209.234.117:3000/api/users/delete',
    method : 'DLETE',
    form : {
      id : req.body.user_id
    }
  }
  request(urls, { json:true }, (err, result, body) => {
    if (err) { return console.log(err) }
    res.send(CircularJSON.stringify(body))
  })
})

module.exports = app;
