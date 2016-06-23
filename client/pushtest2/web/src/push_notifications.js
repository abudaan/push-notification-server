import {fetchJSON} from './fetch_helpers'

let registration
let subscription
const url = 'http://localhost:5000'

export function register(){
  return new Promise((resolve, reject) => {
    if('serviceWorker' in navigator === false) {
      reject()
    }

    navigator.serviceWorker.register('service_worker.js')
    .then(() => {
      return navigator.serviceWorker.ready
    })
    .then(serviceWorkerRegistration => {
      registration = serviceWorkerRegistration
      resolve()
      //console.log('Service Worker is ready:', registration)
    })
    .catch(reject)
  })
}


export function subscribe() {
  return new Promise((resolve, reject) => {
    registration.pushManager.subscribe({userVisibleOnly: true})
    .then(
      data => {
        subscription = data
        //console.log(subscription)

        let service = 'web'
        let endpoint = subscription.endpoint

        let token = subscription.endpoint
        token = token.substring(token.lastIndexOf('/') + 1)

        // public key
        let key = subscription.getKey('p256dh')
        key = btoa(String.fromCharCode.apply(null, new Uint8Array(key)))

        let secret = subscription.getKey('auth')
        secret = btoa(String.fromCharCode.apply(null, new Uint8Array(secret)))

        console.log('key', key)
        console.log('secret', secret)

        fetchJSON(url + '/token', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({token, service, key, secret, endpoint})
        })
        .then(resolve)
        .catch(reject)
      },
      reject
    )
  })
}


export function unsubscribe() {
  return new Promise((resolve, reject) => {
    subscription.unsubscribe()
    .then(resolve)
    .catch(error => reject(error))
  })
}
