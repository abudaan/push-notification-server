import fetch from 'isomorphic-fetch'

export function status(response) {
  if(response.status >= 200 && response.status < 300){
    return Promise.resolve(response)
  }
  return Promise.reject(new Error(response.statusText))

}

export function json(response){
  return response.json()
}

export function arrayBuffer(response){
  return response.arrayBuffer()
}


export function fetchJSON(url, settings){
  return new Promise((resolve, reject) => {
    // fetch(url, {
    //   mode: 'no-cors'
    // })
    fetch(url, settings)
    .then(status)
    .then(json)
    .then(data => {
      resolve(data)
    })
    .catch(e => {
      reject(e)
    })
  })
}

export function fetchArraybuffer(url){
  return new Promise((resolve, reject) => {
    // fetch(url, {
    //   mode: 'no-cors'
    // })
    fetch(url)
    .then(status)
    .then(arrayBuffer)
    .then(data => {
      resolve(data)
    })
    .catch(e => {
      reject(e)
    })
  })
}
