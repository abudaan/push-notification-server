import fs from 'fs'
import webPush from 'web-push'
import database from './database'


function pushNotifications(devices, message, topic = null){

  let invalidTokens = []
  let promises = []
  let tokens = []
  let payload = JSON.stringify({
    title: 'message from your beloved great leader',
    body: message,
  })
//  let payload = message

  for(let device of devices){
    if(device.service !== 'web'){
      continue
    }
    console.log('web', device.token, payload)
    tokens.push(device.token)
    if(topic === null){
      promises.push(webPush.sendNotification(device.endpoint, {
        payload,
        userPublicKey: device.key,
        userAuth: device.secret,
      }))
    }else{
      //promises.push(webPush.sendNotification(`/topics/$}${topic}`, message))
    }
  }

  Promise.all(promises)
  .then(responses => {
    responses.forEach((response, i) => {
      //console.log(response.success, tokens[i])
      console.log('[RESPONSE]', response)
      if(response.success !== 1){
        invalidTokens.push(tokens[i])
        console.log('[GCM] error', response.results[0].error, tokens[i])
      }
    })
    database.removeTokens(...invalidTokens)
  })
}


export default {
  start(data){
    let buffer = fs.readFileSync(data.key)
    webPush.setGCMAPIKey(buffer.toString())
  },
  pushNotifications
}

