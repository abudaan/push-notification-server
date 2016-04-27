import fetch from 'isomorphic-fetch'
import {status, json} from './fetch-helpers'

let url = 'http://localhost:5000'


document.addEventListener('DOMContentLoaded', function(){
  let btnPushNotification = document.getElementById('push-notification')
  let btnStoreToken = document.getElementById('store-token')

  btnPushNotification.addEventListener('click', pushNotification)
  btnStoreToken.addEventListener('click', storeToken)
})


function storeToken(){
  let payload = {
    token: '3735bca631c33162d49c80195e74fa90a3baafca55b257dfcea3dae3874d889f',
    os: 'android'
  }

  fetch(url + '/token', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  .then(status)
  .then(json)
  .then(data => {
    console.log(data)
  })
  .catch(error => {
    console.log(error)
  })
}


function pushNotification(){
  let payload ={
    sender: {
      login: 'abudaan'
    },
    repository: {
      full_name: 'heartbeat',
      pushed_at: new Date().getTime()
    }
  }

  fetch(url + '/commit', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  .then(status)
  .then(json)
  .then(data => {
    console.log(data)
  })
  .catch(error => {
    console.log(error)
  })
}

