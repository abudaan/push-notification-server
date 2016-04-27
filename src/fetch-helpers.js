// fetch helpers

export function status(response) {
  if(response.status >= 200 && response.status < 300){
    return Promise.resolve(response)
  }
  return Promise.reject(new Error(response.statusText))

}

export function json(response){
  return response.json()
}
