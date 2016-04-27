import fetch from 'isomorphic-fetch'
import {status, json} from './fetch-helpers'


let url = 'http://localhost:5000'

let payload = {
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
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(payload)
})
.then(status)
.then(json)
.then((data) => {
  console.log(data)
})
