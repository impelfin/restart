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

// post
app.post("/api/users/userBody", (req, res) => {
  const user_id = req.body.id
  const user = users.filter(data => data.id == user_id)
  res.json({ok: true, user: user})
})

// post add
app.post("/api/users/add", (req, res) => {
  const { id, name } = req.body
  const user = users.concat({ id, name })
  res.json({ok: true, user: user})
})

// put
app.put("/api/users/update", (req, res) => {
  const { id, name } = req.body
  const user = users.map(data => {
    if(data.id == id) data.name = name

    return {
      id : data.id,
      name : data.name
    }
  })
  res.json({ok: true, user: user})
})

// patch
app.patch("/api/users/update/:user_id", (req, res) => {
  const { user_id } = req.params
  const { name } = req.body

  const user = users.map(data => {
    if(data.id == user_id) data.name = name

    return {
      id : data.id,
      name : data.name
    }
  })
  res.json({ok: true, user: user})
})

// delete
app.delete("/api/users/delete", (req, res) => {
  const { user_id } = req.body
  const user = users.filter(data => data.id != user_id )
  res.json({ok: true, user: user})
})

module.exports = app;
