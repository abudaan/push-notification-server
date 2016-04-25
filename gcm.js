import fetch from 'isomorphic-fetch'
import database from './database'

let gcmUrl = 'https://gcm-http.googleapis.com/gcm/send'
let gcmKey = 'AIzaSyD6GYalxuGLWy-oMvw3HixS_9ecs_RNFNI'

function pushNotifications(devices, message){

  let promises = []
  let tokens = []
  let numReceivers = 0
  let numErrors = 0

  console.log('gcm', devices)
  for(device of devices){
    console.log('gcm', device.os)
    if(device.os !== 'android'){
      continue
    }
    tokens.push(device.token)
    numReceivers++
    promises.push(sendToGCM(device.token, message))
  }


return

  Promise.all(promises).then(
    (responses) => {
      //console.log('responses', responses)
      responses.forEach((response, i) => {
        if(response.ok){
          console.log(response.statusText)
        }else{
          // remove the invalid tokens
          console.log(`error with token ${tokens[i]}: ${response.statusText}`)
          numReceivers--
          numErrors++
          client.query(`DELETE FROM tokens WHERE token='${tokens[i]}';`, function(err, result){
            console.log(err)
            console.log(result)
          })
        }
      })
      return({numReceivers, numErrors})
    }
  )
}


function sendToGCM(token, message){
  return fetch(gcmUrl,{
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `key=${gcmKey}`
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