'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _fetchHelpers = require('./fetch-helpers');

var _database = require('./database');

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var gcmUrl = void 0;
var gcmKey = void 0;

function pushNotifications(devices, message) {
  var topic = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];


  var invalidTokens = [];
  var promises = [];
  var tokens = [];

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = devices[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var device = _step.value;

      if (device.service !== 'gcm') {
        continue;
      }
      //console.log('gcm', device.token, topic)
      tokens.push(device.token);
      if (topic === null) {
        promises.push(sendToGCM(device.token, message));
      } else {
        promises.push(sendToGCM('/topics/$}' + topic, message));
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
      //console.log(response)
      if (response.success !== 1) {
        invalidTokens.push(tokens[i]);
        console.log('[GCM] error', response.results[0].error, tokens[i]);
      }
    });
    _database2.default.removeTokens.apply(_database2.default, invalidTokens);
  });
}

function sendToGCM(token, message) {
  console.log('[GCM] sending to', token);
  return (0, _isomorphicFetch2.default)(gcmUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'key=' + gcmKey
    },
    body: JSON.stringify({
      to: token,
      data: {
        message: message
      }
    })
  }).then(_fetchHelpers.status).then(_fetchHelpers.json).then(function (data) {
    return Promise.resolve(data);
  }).catch(function (error) {
    console.log('[GCM] error', error, token);
    return Promise.resolve(null);
  });
}

exports.default = {
  start: function start(data) {
    gcmUrl = data.url || 'https://gcm-http.googleapis.com/gcm/send';
    var buffer = _fs2.default.readFileSync(data.key);
    gcmKey = buffer.toString();
  },
  pushNotifications: pushNotifications
};