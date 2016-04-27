import express from 'express'
import bodyParser from 'body-parser'

import database from './database'
import gcm from './gcm'
import apn from './apn'

let app = express()

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  return next()
})
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))


app.get('/', function(req, res){
  res.send('Hello World!')
})


app.get('/db', function(req, res){
  database.getTokens().then(
    tokens => {
      let html = 'Stored tokens:<br><ul>'
      tokens.forEach(function(token){
        html += `<li>${token.id} : ${token.os} : ${token.token}</li>`
      })
      html += '</ul>'
      res.send(html)
    },
    error => res.send(error)
  )
})


app.post('/token', function(req, res){
  database.storeToken(req.body)
  .then(
    result => res.send(result),
    error => res.send(error)
  )
})


app.post('/commit', function(req, res) {
  let data = req.body
  let message = `new commit from ${data.sender.login} to repository ${data.repository.full_name} at ${new Date(data.repository.pushed_at).toString()}`
  console.log('---')
  console.log('[NOTIFICATION]', message)

  database.getTokens().then(
    tokens => {
      gcm.pushNotifications(tokens, message)
      apn.pushNotifications(tokens, message)
      res.send({message: `notification pushed to ${tokens.length} devices`})
    },
    error => res.send(error)
  )
})


app.post('/remove_tokens', function(req, res){
  let invalidTokens = req.body.tokens
  database.removeTokens(invalidTokens)
  .then(
    result => res.send(result),
    error => res.send(error)
  )
})


process.on('exit', function (){
  apn.stop()
  console.log('Goodbye!')
})

apn.start({
  // both the key and the certificate are in the .pem file so we can use the same file for both key and certificate
  key: 'conf/cert.pem',
  cert: 'conf/cert.pem',
})

gcm.start('AIzaSyD6GYalxuGLWy-oMvw3HixS_9ecs_RNFNI')

let port = process.env.PORT || 5000
app.listen(port)
console.log(`server listening at port ${port}`)


/*

// push notification to topic
app.post("/commit2", function(req, res) {

  let data = req.body
  let message = `new commit from ${data.sender.login} to repository ${data.repository.full_name} at ${data.repository.pushed_at}`
  let payload = {
    to: '/topics/global',
    data: {
      message
    }
  }

  fetch(gcmUrl, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `key=${gcmKey}`
    },
    body: JSON.stringify(payload)
  })
  .then(
    (response) => {
      console.log(response.ok, response.statusText)
      //response = checkStatus(response)
    },
    (error) => {
      console.log(error)
    }
  )
  .then((response) => {
    return response.json()
  })
  .then((data) => {
    console.log(data)
  })

  res.send({status: 'SUCCESS'})
})


*/
