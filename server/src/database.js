import pg from 'pg'

function getTokens(){

  return new Promise(function(resolve, reject){
    pg.connect(process.env.DATABASE_URL, function(error, client, done){
      if(error !== null){
        done()
        error = error.toString()
        console.error('[DATABASE]', error)
        reject({error})
      }else{
        client.query('SELECT * FROM tokens', function(error, result){
          done()
          if(error){
            error = error.toString()
            console.error('[DATABASE]', error)
            reject({error})
          }else{
            //console.log(result.command, result.rows)
            resolve(result.rows)
          }
        })
      }
    })
  })
}


function storeToken(data){
  let token = data.token
  let service = data.service
  // Object.keys(data).forEach(function(key){
  //   console.log(key, ':', data[key])
  // })

  return new Promise(function(resolve, reject){
    pg.connect(process.env.DATABASE_URL, function(error, client, done){
      if(error !== null){
        done()
        error = error.toString()
        console.error('[DATABASE]', error)
        reject({error})
      }
      // check if this token has already been stored, if not -> store it
      client.query(`SELECT id FROM tokens WHERE token='${token}';`, function(error, result){
        if(error){
          error = error.toString()
          console.error('[DATABASE]', error)
          reject({error})
        }else if(result.rowCount === 0){
          client.query(`INSERT INTO tokens (token, service) VALUES ('${token}', '${service}')`, function(error, result){
            if(error){
              error = error.toString()
              console.error('[DATABASE]', error)
              reject({error})
            }else{
              let message = `new token stored ${service} | ${token}`
              console.log('[DATABASE]', message)
              resolve({message})
            }
          })
        }else{
          let message = `token already stored in database: ${token}`
          console.log('[DATABASE]', message)
          resolve({message})
        }
      })
      done()
    })
  })
}


function removeTokens(...tokens){

  let removedTokens = []

  return new Promise(function(resolve, reject){
    pg.connect(process.env.DATABASE_URL, function(error, client, done){
      if(error){
        done()
        error = error.toString()
        console.error('[DATABASE]', error)
        reject({error})
      }
      tokens.forEach(function(token){
        client.query(`DELETE FROM tokens WHERE token='${token}';`, function(error, result){
          if(error){
            console.error('[DATABASE]', error.toString())
          }else{
            console.log('[DATABASE] removed token', token)
            removedTokens.push(token)
          }
        })
      })
      resolve({removedTokens})
    })
  })
}


export default {
  getTokens,
  storeToken,
  removeTokens,
}
