import apn from 'apn'

let apnOptions = {
  key: "conf/cert.pem",
  cert: "conf/cert.pem",
//  batchFeedback: true,
//  interval: 300,
}
let connection = new apn.Connection(apnOptions)
connection.errorCallback = function(error){
  console.log(error)
}
var feedback = new apn.Feedback(apnOptions)
feedback.on('feedback', function(devices) {
  devices.forEach(function(item) {
    console.log(item)
  })
})

//console.log(apnConnection)

let device = new apn.Device("2735aca631c33162d49c80195e74fa90a3baafca55b257dfcea3dae3874d889b")
let notification = new apn.Notification()
notification.expiry = Math.floor(Date.now() / 1000) + 3600
notification.alert = "Wake up!"

connection.pushNotification(notification, device)
