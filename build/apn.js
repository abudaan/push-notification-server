'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _apn = require('apn');

var _apn2 = _interopRequireDefault(_apn);

var _database = require('./database');

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*

http://redth.codes/the-problem-with-apples-push-notification-ser/

Status Codes & Meanings
0 - No errors encountered
1 - Processing error
2 - Missing device token
3 - Missing topic
4 - Missing payload
5 - Invalid token size
6 - Invalid topic size
7 - Invalid payload size
8 - Invalid token
255 - None (unknown)
*/

var connection = void 0;
var notification = void 0;
var apnDevices = void 0;
var currentDevice = void 0;

function start(options) {
  // open APN connection
  connection = new _apn2.default.Connection(options);
  //console.log(connection)

  connection.on('error', function (e) {
    console.log('APN error', e);
    pushNext();
  });

  connection.on('transmitted', function (notification, device) {
    //console.log('transmitted', device.token)
    //console.log(notification)
    //console.log(device)
  });

  connection.on('completed', function (data) {
    //console.log('completed', data)
    pushNext();
  });

  connection.on('transmissionError', function (errorCode, notification, device) {
    //console.log('transmissionError')
    //console.log(notification)
    //console.log(device)
    console.log('[APN] error', errorCode, device.toString());
    if (errorCode === 8 || errorCode === 5) {
      _database2.default.removeTokens(device.toString());
    }
  });
}

function pushNotifications(devices, message) {

  apnDevices = [];

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = devices[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var device = _step.value;

      if (device.service === 'apn') {
        var token = device.token;
        if (checkHex(token) === false) {
          console.log('token is not hex: ' + token);
          _database2.default.removeTokens(token);
          continue;
        }
        if (token.length !== 64) {
          console.log('token is not valid: ' + token);
          _database2.default.removeTokens(token);
          continue;
        }
        // console.log('apn', token)
        apnDevices.push(new _apn2.default.Device(token));
      } else {
        continue;
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

  if (apnDevices.length === 0) {
    return;
  }

  notification = new _apn2.default.Notification();
  notification.expiry = Math.floor(Date.now() / 1000) + 3600;
  notification.payload = { message: message };
  notification.badge = 1;
  notification.sound = 'dong.aiff';
  notification.alert = message;

  currentDevice = -1;
  pushNext();
}

function pushNext() {
  currentDevice++;
  //console.log(currentDevice, apnDevices.length, apnDevices[currentDevice])
  if (currentDevice < apnDevices.length) {
    var device = apnDevices[currentDevice];
    console.log('[APN] sending to', device.toString());
    connection.pushNotification(notification, device);
  }
}

function stop() {
  // is this really necessary?
  connection = null;
}

function checkHex(string) {
  var re = /[0-9A-Fa-f]{6}/g;
  return re.test(string);
  //let hex = parseInt(string, 16)
  //return (hex.toString(16) === string.toLowerCase())
}

exports.default = {
  stop: stop,
  start: start,
  pushNotifications: pushNotifications
};