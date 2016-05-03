import fs from 'fs'
import fetch from 'isomorphic-fetch'
import {status, json} from './fetch-helpers'
import database from './database'


let gcmUrl
let gcmKey

function pushNotifications(devices, message, topic = null){

  let invalidTokens = []
  let promises = []
  let tokens = []

  for(let device of devices){
    if(device.service !== 'gcm'){
      continue
    }
    //console.log('gcm', device.token, topic)
    tokens.push(device.token)
    if(topic === null){
      promises.push(sendToGCM(device.token, message))
    }else{
      promises.push(sendToGCM(`/topics/$}${topic}`, message))
    }
  }

  Promise.all(promises)
  .then(responses => {
    responses.forEach((response, i) => {
      //console.log(response.success, tokens[i])
      //console.log(response)
      if(response.success !== 1){
        invalidTokens.push(tokens[i])
        console.log('[GCM] error', response.results[0].error, tokens[i])
      }
    })
    database.removeTokens(...invalidTokens)
  })
}


function sendToGCM(token, message){
  console.log('[GCM] sending to', token)
  return fetch(gcmUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `key=${gcmKey}`
    },
    body: JSON.stringify({
      to: token,
      data: {
        message
      }
    })
  })
  .then(status)
  .then(json)
  .then(data => {
    return Promise.resolve(data)
  })
  .catch(error => {
    console.log('[GCM] error', error, token)
    return Promise.resolve(null)
  })
}


export default {
  start: function(data){
    gcmUrl = data.url || 'https://gcm-http.googleapis.com/gcm/send'
    let buffer = fs.readFileSync(data.key)
    gcmKey = buffer.toString()
  },
  pushNotifications
}
