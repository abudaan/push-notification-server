'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _express = require('express');

var _express2 = _interopRequireWildcard(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireWildcard(_bodyParser);

var app = _express2['default']();

app.use(_bodyParser2['default'].json());
app.use(_bodyParser2['default'].urlencoded({
  extended: true
}));

app.post('/commit', function (req, res) {

  var data = undefined;

  if (req.body.object_kind) {
    // gitlab payload JSON
    data = req.body;
  } else {
    // github payload JSON
    data = JSON.parse(req.body.payload);
  }
  console.log(data);

  res.send({ status: 'SUCCESS' });
});

var port = process.env.PORT || 5000;

app.listen(port);
console.log('server listening at port ' + port);
