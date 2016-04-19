'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _pg = require('pg');

var _pg2 = _interopRequireDefault(_pg);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var gcmUrl = 'https://gcm-http.googleapis.com/gcm/send';
var gcmKey = 'AIzaSyD6GYalxuGLWy-oMvw3HixS_9ecs_RNFNI';

app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({
  extended: true
}));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/db', function (req, res) {
  _pg2.default.connect(process.env.DATABASE_URL, function (err, client, done) {
    client.query('SELECT * FROM tokens', function (err, result) {
      done();
      if (err) {
        console.error(err);
        res.send("Error " + err);
      } else {
        res.send({ results: result.rows });
      }
    });
  });
});

app.post('/token', function (req, res) {
  var token = req.body.token;
  Object.keys(req.body).forEach(function (key) {
    console.log(key, ':', req.body[key]);
  });

  _pg2.default.connect(process.env.DATABASE_URL, function (err, client, done) {
    // check if this token has already been stored, if not -> store it
    client.query('SELECT id FROM tokens WHERE token=\'' + token + '\';', function (err, result) {
      if (err) {
        console.error(err);
      } else {
        if (result.rowCount === 0) {
          client.query('INSERT INTO tokens (token) VALUES (\'' + token + '\')', function (err, result) {
            if (err) {
              console.error(err);
              res.send("Error " + err);
            } else {
              res.send({ results: result });
            }
          });
        } else {
          console.log('token already stored in database: ' + token);
        }
      }
    });
    done();
  });
});

// push message to device
app.post('/commit', function (req, res) {

  var data = req.body;
  var message = 'new commit from ' + data.sender.login + ' to repository ' + data.repository.full_name + ' at ' + new Date(data.repository.pushed_at).toString();
  console.log(message);

  var promises = [];
  var tokens = [];
  var numReceivers = 0;
  var numErrors = 0;

  _pg2.default.connect(process.env.DATABASE_URL, function (err, client, done) {
    client.query('SELECT * FROM tokens', function (err, result) {

      if (err) {
        console.error(err);
        res.send('Error ' + err);
      } else {
        result.rows.forEach(function (row) {
          numReceivers++;
          var token = row.token;
          tokens.push(token);

          promises.push((0, _isomorphicFetch2.default)(gcmUrl, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'key=' + gcmKey
            },
            body: JSON.stringify({
              to: token,
              data: {
                message: message
              }
            })
          }));
        });

        Promise.all(promises).then(function (responses) {
          //console.log('responses', responses)
          responses.forEach(function (response, i) {
            if (response.ok) {
              console.log(response.statusText);
            } else {
              // remove the invalid tokens
              console.log('error with token ' + tokens[i] + ': ' + response.statusText);
              numReceivers--;
              numErrors++;
              client.query('DELETE FROM tokens WHERE token=\'' + tokens[i] + '\';', function (err, result) {
                console.log(err);
                console.log(result);
              });
            }
          });
          res.send({ numReceivers: numReceivers, numErrors: numErrors });
        });
      }
    });

    done();
  });
});

// push notification to topic
app.post("/commit2", function (req, res) {

  var data = req.body;
  var message = 'new commit from ' + data.sender.login + ' to repository ' + data.repository.full_name + ' at ' + data.repository.pushed_at;
  var payload = {
    to: '/topics/global',
    data: {
      message: message
    }
  };

  (0, _isomorphicFetch2.default)(gcmUrl, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'key=' + gcmKey
    },
    body: JSON.stringify(payload)
  }).then(function (response) {
    console.log(response.ok, response.statusText);
    //response = checkStatus(response)
  }, function (error) {
    console.log(error);
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    console.log(data);
  });

  res.send({ status: 'SUCCESS' });
});

var port = process.env.PORT || 5000;

app.listen(port);
console.log('server listening at port ' + port);

/*
function checkStatus(response) {
  //console.log(response)
  if(response.status >= 200 && response.status < 300) {
    return response
  }else{
    let error = new Error(response.statusText)
    error.response = response
    throw error
  }
}
*/

