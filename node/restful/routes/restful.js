const express = require('express')
const bodyParser = require('body-parser')
const dfd = require('dataframe-js')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : false }))
app.use(express.json())
app.use(express.urlencoded({ extended : true }))

const users = [
  { id: 1, name : "user1" },
  { id: 2, name : "user2" },
  { id: 3, name : "user3" },
]

app.get("/Hello", (req, res)=> {
  res.send("Hello World")
})

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

// Query params
app.get("/api/users/user", (req, res) => {
  const user_id = req.query.user_id
  const user = users.filter(data => data.id == user_id)
  res.json({ok: false, user: user})
})

// path Variables
app.get("/api/users/:user_id", (req, res) => {
  const user_id = req.params.user_id
  const user = users.filter(data => data.id == user_id)
  res.json({ok: true, user: user})
})

module.exports = app;
