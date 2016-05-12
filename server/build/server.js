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
  console.log('[GET] /');
  res.send('Hello World!');
});

app.get('/db', function (req, res) {
  console.log('[GET] /db');
  _database2.default.getTokens().then(function (tokens) {
    var html = 'Stored tokens:<br><ul>';
    tokens.forEach(function (token) {
      html += '<li>' + token.id + ' : ' + token.service + ' : ' + token.token + '</li>';
    });
    html += '</ul>';
    res.send(html);
  }, function (error) {
    return res.send(error);
  });
});

app.post('/token', function (req, res) {
  console.log('[TOKEN]', req.body);
  _database2.default.storeToken(req.body).then(function (result) {
    return res.send(result);
  }, function (error) {
    return res.send(error);
  });
});

function postMessage(message, res) {
  console.log('---');
  console.log('[NOTIFICATION]', message);

  _database2.default.getTokens().then(function (tokens) {
    _gcm2.default.pushNotifications(tokens, message);
    _apn2.default.pushNotifications(tokens, message);
    res.send({ message: 'notification pushed to ' + tokens.length + ' devices' });
  }, function (error) {
    return res.send(error);
  });
}

// test with: curl -X POST -H "Content-Type: application/json" -d '{"message" : "testing testing 1,2,3"}' http://localhost:5000/message
app.post('/message', function (req, res) {
  postMessage(req.body.message, res);
});

// test with: http://localhost:5000/message?message=testing testing 1,2,3
app.get('/message', function (req, res) {
  postMessage(req.query.message, res);
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
  key: 'conf/apn.push.pem',
  cert: 'conf/apn.push.pem'
});

_gcm2.default.start({
  key: 'conf/gcm.key', // should be a plain text file containing nothing but the key
  url: 'https://gcm-http.googleapis.com/gcm/send' // not mandatory
});

var port = process.env.PORT || 5000;
app.listen(port);
console.log('server listening at port ' + port);