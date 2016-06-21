'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pg = require('pg');

var _pg2 = _interopRequireDefault(_pg);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getTokens() {

  return new Promise(function (resolve, reject) {
    _pg2.default.connect(process.env.DATABASE_URL, function (error, client, done) {
      if (error !== null) {
        done();
        error = error.toString();
        console.error('[DATABASE]', error);
        reject({ error: error });
      } else {
        client.query('SELECT * FROM tokens', function (error, result) {
          done();
          if (error) {
            error = error.toString();
            console.error('[DATABASE]', error);
            reject({ error: error });
          } else {
            //console.log(result.command, result.rows)
            resolve(result.rows);
          }
        });
      }
    });
  });
}

function storeToken(data) {
  var token = data.token;
  var service = data.service;
  var key = data.key;
  var secret = data.secret;
  var endpoint = data.endpoint;
  // Object.keys(data).forEach(function(key){
  //   console.log(key, ':', data[key])
  // })

  return new Promise(function (resolve, reject) {
    _pg2.default.connect(process.env.DATABASE_URL, function (error, client, done) {
      if (error !== null) {
        done();
        error = error.toString();
        console.error('[DATABASE]', error);
        reject({ error: error });
      }
      // check if this token has already been stored, if not -> store it
      client.query('SELECT id FROM tokens WHERE token=\'' + token + '\';', function (error, result) {
        if (error) {
          error = error.toString();
          console.error('[DATABASE]', error);
          reject({ error: error });
        } else if (result.rowCount === 0) {
          client.query('INSERT INTO tokens (token, service, key, secret, endpoint) VALUES (\'' + token + '\', \'' + service + '\', \'' + key + '\', \'' + secret + '\', \'' + endpoint + '\')', function (error, result) {
            if (error) {
              error = error.toString();
              console.error('[DATABASE]', error);
              reject({ error: error });
            } else {
              var message = 'new token stored ' + service + ' | ' + token;
              console.log('[DATABASE]', message);
              resolve({ message: message });
            }
          });
        } else {
          var message = 'token already stored in database: ' + token;
          console.log('[DATABASE]', message);
          resolve({ message: message });
        }
      });
      done();
    });
  });
}

function removeTokens() {
  for (var _len = arguments.length, tokens = Array(_len), _key = 0; _key < _len; _key++) {
    tokens[_key] = arguments[_key];
  }

  var removedTokens = [];

  return new Promise(function (resolve, reject) {
    _pg2.default.connect(process.env.DATABASE_URL, function (error, client, done) {
      if (error) {
        done();
        error = error.toString();
        console.error('[DATABASE]', error);
        reject({ error: error });
      }
      tokens.forEach(function (token) {
        client.query('DELETE FROM tokens WHERE token=\'' + token + '\';', function (error, result) {
          if (error) {
            console.error('[DATABASE]', error.toString());
          } else {
            console.log('[DATABASE] removed token', token);
            removedTokens.push(token);
          }
        });
      });
      resolve({ removedTokens: removedTokens });
    });
  });
}

exports.default = {
  getTokens: getTokens,
  storeToken: storeToken,
  removeTokens: removeTokens
};