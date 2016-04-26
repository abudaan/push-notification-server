import pg from 'pg'

function getTokens(){

  return new Promise(function(resolve, reject){
    pg.connect(process.env.DATABASE_URL, function(error, client, done){
      if(error !== null){
        done()
        reject(error)
      }else{
        client.query('SELECT * FROM tokens', function(error, result){
          done()
          if(error){
            reject(error)
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
  let os = data.os
  let token = data.token
  Object.keys(data).forEach(function(key){
    console.log(key, ':', data[key])
  })

  return new Promise(function(resolve, reject){
    pg.connect(process.env.DATABASE_URL, function(error, client, done){
      if(error !== null){
        done()
        resolve('Error ' + error)
      }
      // check if this token has already been stored, if not -> store it
      client.query(`SELECT id FROM tokens WHERE token='${token}';`, function(error, result){
        if(error){
          console.error(error)
          reject(error)
        }else if(result.rowCount === 0){
          client.query(`INSERT INTO tokens (token, os) VALUES ('${token}', '${os}')`, function(error, result){
            if(error){
              console.log(error)
              reject({error})
            }else{
              resolve({results: result})
            }
          })
        }else{
          let message = `token already stored in database: ${token}`
          console.log(message)
          resolve({message})
        }
      })
      done()
    })
  })
}


function removeTokens(tokens){
  pg.connect(process.env.DATABASE_URL, function(error, client, done){
    if(error !== null){
      done()
      resolve('Error ' + error)
    }
    tokens.forEach(function(token){
      client.query(`DELETE FROM tokens WHERE token='${token}';`, function(error, result){
        if(error){
          console.log(error)
        }else{
          console.log(result)
        }
      })
    })
  })
}


export default {
  getTokens,
  storeToken,
  removeTokens,
}
