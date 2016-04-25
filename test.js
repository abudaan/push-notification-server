import fetch from 'isomorphic-fetch'

let url = 'http://localhost:5000/commit'

let payload =
{
  sender: {
    login: 'abudaan'
  },
  repository: {
    full_name: 'heartbeat',
    pushed_at: new Date().getTime()
  }
}

fetch(url, {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(payload)
})
.then(
  checkStatus,
  (error) => {
    console.log('e', error)
    return
  }
)
.then((response) => {
  return response.json()
})
.then((data) => {
  console.log(data)
})


function checkStatus(response) {
  //console.log(response.status)
  if(response.status >= 200 && response.status < 300) {
    return response
  }else{
    let error = new Error(response.statusText)
    error.response = response
    throw error
  }
}
