'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _webPush = require('web-push');

var _webPush2 = _interopRequireDefault(_webPush);

var _database = require('./database');

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function pushNotifications(devices, message) {
  var topic = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];


  var invalidTokens = [];
  var promises = [];
  var tokens = [];
  var payload = JSON.stringify({
    title: 'message from your beloved great leader',
    body: message
  });
  //  let payload = message

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = devices[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var device = _step.value;

      if (device.service !== 'web') {
        continue;
      }
      console.log('web', device.token, payload);
      tokens.push(device.token);
      if (topic === null) {
        promises.push(_webPush2.default.sendNotification(device.endpoint, {
          payload: payload,
          userPublicKey: device.key,
          userAuth: device.secret
        }));
      } else {
        //promises.push(webPush.sendNotification(`/topics/$}${topic}`, message))
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  Promise.all(promises).then(function (responses) {
    responses.forEach(function (response, i) {
      //console.log(response.success, tokens[i])
      console.log('[RESPONSE]', response);
      if (response.success !== 1) {
        invalidTokens.push(tokens[i]);
        console.log('[GCM] error', response.results[0].error, tokens[i]);
      }
    });
    _database2.default.removeTokens.apply(_database2.default, invalidTokens);
  });
}

exports.default = {
  start: function start(data) {
    var buffer = _fs2.default.readFileSync(data.key);
    _webPush2.default.setGCMAPIKey(buffer.toString());
  },

  pushNotifications: pushNotifications
};