import fetch from 'isomorphic-fetch'

let url = 'http://localhost:5000'


document.addEventListener('DOMContentLoaded', function(){
  let btnCommit = document.getElementById('commit')
  let btnStoreToken = document.getElementById('store-token')
  let btnRemoveTokens = document.getElementById('remove-tokens')

  btnCommit.addEventListener('click', sendCommit)
  btnStoreToken.addEventListener('click', storeToken)
  btnRemoveTokens.addEventListener('click', removeTokens)
})


function storeToken(){
  let payload =
  {
    token: 'justanotherbullshittoken-2',
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
  .then(
    checkStatus,
    (error) => {
      console.log('e', error)
      return
    }
  )
  .then((response) => {
    console.log(response.body.error)
    return response.json()
  })
  .then((data) => {
    console.log(data)
  })
}

function removeTokens(){
}


function sendCommit(){
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

  fetch(url + '/commit', {
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
    console.log(response.body.error)
    return response.json()
  })
  .then((data) => {
    console.log(data)
  })
}


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
