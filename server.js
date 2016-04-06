'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _express = require('express');

var _express2 = _interopRequireWildcard(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireWildcard(_bodyParser);

var _request = require('request');

var _request2 = _interopRequireWildcard(_request);

var app = _express2['default']();
var gcmUrl = 'https://gcm-http.googleapis.com/gcm/send';
var gcmKey = 'AIzaSyD6GYalxuGLWy-oMvw3HixS_9ecs_RNFNI';

app.use(_bodyParser2['default'].json());
app.use(_bodyParser2['default'].urlencoded({
  extended: true
}));

app.post('/commit', function (req, res) {

  var data = req.body;
  var msg = 'new commit from ' + data.sender.login + ' to repository ' + data.repository.full_name + ' at ' + data.repository.pushed_at;

  res.send({ status: 'SUCCESS' });

  var options = {
    uri: gcmUrl,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'key=AIzaSyD6GYalxuGLWy-oMvw3HixS_9ecs_RNFNI'
    },
    method: 'POST',
    json: {
      //'registration_ids': ['73986316761'],
      to: '/topics/global',
      data: {
        message: msg
      }
    }
  };

  _request2['default'](options, function (err, res, body) {
    if (err) {
      console.log('err:', err);
    }
    //console.log('res:', res)
    console.log('body:', body);
  });
});

var port = process.env.PORT || 5000;

app.listen(port);
console.log('server listening at port ' + port);
