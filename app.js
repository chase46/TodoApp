const express = require('express')
const app = express()
require("dotenv").config()
const { ObjectId } = require('mongodb')
const MongoClient = require('mongodb').MongoClient

const uri = process.env.MONGODB_CONNECTION_STRING

let db

let sanitizeHTML = require('sanitize-html')

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static("Public"))
app.use(passwordProtected)


MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
    if(err) {
      console.log("There was an errr: " + err)
    }

    db = client.db("TodoApp")
    app.listen(process.env.PORT || 3001)
})

function passwordProtected(req, res, next) {
  res.set('WWW-authenticate', "Basic realm='Todoapp auth'")
  console.log('Auth: ' +req.headers.authorization)
  if (req.headers.authorization == "Basic a2xlaW56OnNhMjIwYWgxMjM0NQ==") {
    next()
  } else {
    res.status(401).send("authorizaton required")
  }
}

app.get('/', function(req, res) {
  db.collection("items").find().toArray(function(err, items) {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Simple To-Do App</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
    </head>
    <body>
      <div class="container">
        <h1 class="display-4 text-center py-1">To-Do App</h1>
        
        <div class="jumbotron p-3 shadow-sm">
          <form id="create-form" action='/create-item' method='POST'>
            <div class="d-flex align-items-center">
              <input id="create-field" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
              <button class="btn btn-primary">Add New Item</button>
            </div>  
          </form>
        </div>
        
        <ul id="item-list" class="list-group pb-5">
          
        </ul>
        
      </div>
      <script>
        let items = ${JSON.stringify(items)}
      </script>
      <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
      <script src="web.js"></script>
    </body>
    </html>
    `)
  })
   
}) 


app.post('/create-item', function(req, res) {
  let cleanText = sanitizeHTML(req.body.text, {allowedAttributes: {}, allowedTags: []})
  db.collection('items').insertOne({text: cleanText}, function(err, info) {
    res.json({_id: info.insertedId.toString(), text: req.body.text})
  })
})

app.post('/update-item', function(req, res) {
  let cleanText = sanitizeHTML(req.body.text, {allowedAttributes: {}, allowedTags: []})
  db.collection('items').findOneAndUpdate({_id: ObjectId(req.body.id)}, {$set: ({text: cleanText})}, function() { })

})

app.post('/delete-item', function(req, res) {
  db.collection('items').deleteOne({_id: ObjectId(req.body.id)}, function() {})
})


app.post('/give-me//micks', function(req, res) {
  res.send('welcome, you are one micks')
})