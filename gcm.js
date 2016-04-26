import fetch from 'isomorphic-fetch'

let gcmUrl = 'https://gcm-http.googleapis.com/gcm/send'
let gcmKey = 'AIzaSyD6GYalxuGLWy-oMvw3HixS_9ecs_RNFNI'
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
      //console.log('responses', responses)
      responses.forEach((response, i) => {
        if(response.ok){
          console.log(response.statusText)
        }else{
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
}


export default {
  pushNotifications
}
