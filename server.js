import express from 'express'
import bodyParser from 'body-parser'

let app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.listen(5000)

app.post("/commit", function(req, res) {

  let data

  if(req.body.object_kind) {
    // gitlab payload JSON
    data = req.body
  }else{
    // github payload JSON
    data = JSON.parse(req.body.payload)
  }
  console.log(data)

  res.send({ status: 'SUCCESS' })
})