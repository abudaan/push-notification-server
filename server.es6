import express from 'express'
import bodyParser from 'body-parser'
import request from 'request';

let app = express()
let gcmUrl = 'https://gcm-http.googleapis.com/gcm/send';
let gcmKey = 'AIzaSyD6GYalxuGLWy-oMvw3HixS_9ecs_RNFNI'

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))


app.post("/commit", function(req, res) {

  let data = req.body
  let msg = `new commit from ${data.sender.login} to repository ${data.repository.full_name} at ${data.repository.pushed_at}`

  res.send({status: 'SUCCESS'})

  let options = {
    uri: gcmUrl,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'key=AIzaSyD6GYalxuGLWy-oMvw3HixS_9ecs_RNFNI'
    },
    method: 'POST',
    json: {
      //'registration_ids': ['73986316761'],
      'to' : '/topics/global',
      'data': {
        'message': msg
      }
    }
  }

  request(options, function(err, res, body){
    if(err){
      console.log('err:', err)
    }
    //console.log('res:', res)
    console.log('body:', body)
  });
})

let port = process.env.PORT || 5000;

app.listen(port)
console.log(`server listening at port ${port}`)