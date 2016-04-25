/*

http://redth.codes/the-problem-with-apples-push-notification-ser/

Status Codes & Meanings
0 - No errors encountered
1 - Processing error
2 - Missing device token
3 - Missing topic
4 - Missing payload
5 - Invalid token size
6 - Invalid topic size
7 - Invalid payload size
8 - Invalid token
255 - None (unknown)
*/

import apn from 'apn'
import database from './database'


let options = {
  // both the key and the cerficate are in the .pem file so we can use the same file for both key and certificate
  key: "conf/cert.pem",
  cert: "conf/cert.pem",
}
let connection


function start(){
  // open APN connection
  connection = new apn.Connection(options)
  //console.log(connection)

  connection.on('error', (e) => {
    console.log('ERROR', e)
  })

  connection.on('transmitted', (notification, device) => {
    //console.log('TRANS')
    //console.log(notification)
    //console.log(device)
  })

  connection.on('completed', (data) => {
    //console.log('COMPLETED', data)
  })

  connection.on('transmissionError', (errorCode, notification, device) => {
    //console.log('TRANS ERR')
    //console.log(notification)
    //console.log(device)
    //console.log(errorCode)
    if(errorCode === 8 || errorCode === 5){
      database.removeToken(device.toString())
    }
  })
}


function pushNotifications(devices, message){

  let notification = new apn.Notification()
  notification.expiry = Math.floor(Date.now() / 1000) + 3600
  notification.payload = {message}
  notification.badge = 1
  notification.sound = "dong.aiff"
  notification.alert = message

  for(device of devices){
    //console.log(device.os)
    if(device.os !== 'ios'){
      continue
    }

    let device = new apn.Device(device.token)
    connection.pushNotification(notification, device)
    //console.log(notification, device)
  }
}


function stop(){
  connection = null
}

export default {
  stop,
  start,
  pushNotifications
}