import pg from 'pg'

function getTokens(){

  return new Promise(function(resolve){
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
      if(!client){
        done()
        resolve('Error ' + err)
      }
      client.query('SELECT * FROM tokens', function(err, result){
        done()
        if(err){
          resolve('Error ' + err)
        }else{
          //console.log(result.command, result.rows)
          resolve(result.rows)
        }
      })
    })
  })
}


function storeToken(data){
  let os = data.os
  let token = data.token
  Object.keys(data).forEach(function(key){
    console.log(key, ':', data[key])
  })

  pg.connect(process.env.DATABASE_URL, function(err, client, done){
    if(!client){
      done()
      return 'Error ' + err
    }
    // check if this token has already been stored, if not -> store it
    client.query(`SELECT id FROM tokens WHERE token='${token}';`, function(err, result){
      if(err){
        console.error(err)
      }
      else{
        if(result.rowCount === 0){
          client.query(`INSERT INTO tokens (token, os) VALUES ('${token}', '${os}')`, function(err, result){
            if(err){
              console.error(err)
              return 'Error ' + err
            }else{
              return {results: result}
            }
          })
        }else{
          console.log(`token already stored in database: ${token}`)
        }
      }
    })
    done()
  })
}


function removeToken(token){

}


export default {
  getTokens,
  storeToken,
  removeToken
}
