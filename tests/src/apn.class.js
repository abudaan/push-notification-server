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


class APN{

  constructor(options){
    this.options = options
    this.connection
    this.notification
    this.iosDevices
    this.currentDevice
    this.resolveCallback
    this.invalidTokens = []
    this.start()
  }

  start(){
    // open APN connection
    this.connection = new apn.Connection(this.options)

    this.connection.on('error', (e) => {
      console.log('error', e)
      this.pushNext()
    })

    this.connection.on('transmitted', (notification, device) => {
      console.log('transmitted', device.token)
      //console.log(notification)
      //console.log(device)
    })

    this.connection.on('completed', (data) => {
      console.log('completed', data)
      this.pushNext()
    })

    this.connection.on('transmissionError', (errorCode, notification, device) => {
      //console.log('transmissionError')
      //console.log(notification)
      //console.log(device)
      console.log('ERROR', errorCode, device.toString())
      if(errorCode === 8 || errorCode === 5){
        this.invalidTokens.push(device.toString())
        // database.removeTokens([device.toString()])
      }
    })
  }

  pushNotifications(devices, message){

    return new Promise((resolve) => {

      this.iosDevices = []

      for(let device of devices){
        if(device.os === 'ios'){
          let token = device.token
          if(checkHex(token) === false){
            console.log(`token is not hex: ${token}`)
            //database.removeTokens([token])
            this.invalidTokens.push(token)
            continue
          }
          if(token.length !== 64){
            console.log(`token is not valid: ${token}`)
            //database.removeTokens([token])
            this.invalidTokens.push(token)
            continue
          }
          console.log('apn', token)
          this.iosDevices.push(new apn.Device(token))
          //this.iosDevices.push(token)
        }else{
          continue
        }
      }

      if(this.iosDevices.length === 0){
        console.log('resolve')
        //return Promise.resolve([])
        resolve([])
        return
      }

      this.notification = new apn.Notification()
      this.notification.expiry = Math.floor(Date.now() / 1000) + 3600
      this.notification.payload = {message}
      this.notification.badge = 1
      this.notification.sound = 'dong.aiff'
      this.notification.alert = message

      this.currentDevice = -1

      this.resolveCallback = resolve
      this.pushNext()
    })
  }


  pushNext(){
    this.currentDevice++
    //console.log(this.currentDevice, this.iosDevices.length, this.iosDevices[this.currentDevice])
    if(this.currentDevice >= this.iosDevices.length){
      this.resolveCallback(this.invalidTokens)
    }else{
      this.connection.pushNotification(this.notification, this.iosDevices[this.currentDevice])
    }
  }


  stop(){
    // is this really necessary?
    this.connection = null
  }

}

function checkHex(string){
  let re = /[0-9A-Fa-f]{6}/g
  return re.test(string)
  //let hex = parseInt(string, 16)
  //return (hex.toString(16) === string.toLowerCase())
}


// export default {
//   stop,
//   start,
//   pushNotifications
// }


export default APN
