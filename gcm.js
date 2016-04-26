import fetch from 'isomorphic-fetch'
import {status, json} from './fetch-helpers'

let gcmUrl = 'https://gcm-http.googleapis.com/gcm/send'
let gcmKey
let invalidTokens

function pushNotifications(devices, message){

  invalidTokens = []
  let promises = []
  let tokens = []

  for(let device of devices){
    if(device.os !== 'android'){
      continue
    }
    //console.log('gcm', device.token)
    tokens.push(device.token)
    promises.push(sendToGCM(device.token, message))
  }

  return new Promise(resolve => {
    Promise.all(promises)
    .then(responses => {
      responses.forEach((response, i) => {
        //console.log(response.success, tokens[i])
        if(response.success === 0){
          invalidTokens.push(tokens[i])
        }
      })
      resolve(invalidTokens)
    })
  })
}


function sendToGCM(token, message){
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
    console.log('sendToGCM', error, token)
    return Promise.resolve(null)
  })
}


export default {
  start: function(key){
    gcmKey = key
  },
  pushNotifications
}
