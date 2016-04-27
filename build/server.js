'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _database = require('./database');

var _database2 = _interopRequireDefault(_database);

var _gcm = require('./gcm');

var _gcm2 = _interopRequireDefault(_gcm);

var _apn = require('./apn');

var _apn2 = _interopRequireDefault(_apn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  return next();
});
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({
  extended: true
}));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/db', function (req, res) {
  _database2.default.getTokens().then(function (tokens) {
    var html = 'Stored tokens:<br><ul>';
    tokens.forEach(function (token) {
      html += '<li>' + token.id + ' : ' + token.os + ' : ' + token.token + '</li>';
    });
    html += '</ul>';
    res.send(html);
  }, function (error) {
    return res.send(error);
  });
});

app.post('/token', function (req, res) {
  _database2.default.storeToken(req.body).then(function (result) {
    return res.send(result);
  }, function (error) {
    return res.send(error);
  });
});

app.post('/commit', function (req, res) {
  var data = req.body;
  var message = 'new commit from ' + data.sender.login + ' to repository ' + data.repository.full_name + ' at ' + new Date(data.repository.pushed_at).toString();
  console.log('---');
  console.log('[NOTIFICATION]', message);

  _database2.default.getTokens().then(function (tokens) {
    _gcm2.default.pushNotifications(tokens, message);
    _apn2.default.pushNotifications(tokens, message);
    res.send({ message: 'notification pushed to ' + tokens.length + ' devices' });
  }, function (error) {
    return res.send(error);
  });
});

app.post('/remove_tokens', function (req, res) {
  var invalidTokens = req.body.tokens;
  _database2.default.removeTokens(invalidTokens).then(function (result) {
    return res.send(result);
  }, function (error) {
    return res.send(error);
  });
});

process.on('exit', function () {
  _apn2.default.stop();
  console.log('Goodbye!');
});

_apn2.default.start({
  // both the key and the certificate are in the .pem file so we can use the same file for both key and certificate
  key: 'conf/cert.pem',
  cert: 'conf/cert.pem'
});

_gcm2.default.start({
  key: 'conf/gcm.key', // should be a plain text file containing nothing but the key
  url: 'https://gcm-http.googleapis.com/gcm/send' // not mandatory
});

var port = process.env.PORT || 5000;
app.listen(port);
console.log('server listening at port ' + port);

/*

// push notification to topic
app.post("/commit2", function(req, res) {

  let data = req.body
  let message = `new commit from ${data.sender.login} to repository ${data.repository.full_name} at ${data.repository.pushed_at}`
  let payload = {
    to: '/topics/global',
    data: {
      message
    }
  }

  fetch(gcmUrl, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `key=${gcmKey}`
    },
    body: JSON.stringify(payload)
  })
  .then(
    (response) => {
      console.log(response.ok, response.statusText)
      //response = checkStatus(response)
    },
    (error) => {
      console.log(error)
    }
  )
  .then((response) => {
    return response.json()
  })
  .then((data) => {
    console.log(data)
  })

  res.send({status: 'SUCCESS'})
})


*/