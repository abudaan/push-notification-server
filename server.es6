import express from 'express'
import bodyParser from 'body-parser'

let app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))


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

let port = process.env.PORT || 5000;

app.listen(port)
console.log(`server listening at port ${port}`)