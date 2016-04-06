var querystring = require('querystring');
var request = require('request');

//var url = 'http://localhost:8080/';
var url = 'https://peaceful-brushlands-94865.herokuapp.com/';

var github_commit = {
    "after":"1481a2de7b2a7d02428ad93446ab166be7793fbb",
    "before":"17c497ccc7cca9c2f735aa07e9e3813060ce9a6a",
    "commits":[
       {
          "author":{
             "email":"github@sjorsgielen.nl",
             "name":"Sjors"
          },
          "message":"This is me testing the client"
       },
       {
          "author":{
             "email":"marlon@tweedegolf.com",
             "name":"Marlon"
          },
          "message":"This is me testing the client"
       }
    ],
    "repository":{
       "name":"testing",
       "url":"https://github.com/octokitty/testing"
    }
};

var gitlab_commit = {
  "object_kind": "push",
  "before": "95790bf891e76fee5e1747ab589903a6a1f80f22",
  "after": "da1560886d4f094c3e6c9ef40349f7d38b5d27d7",
  "repository":{
    "name": "Diaspora",
    "url": "git@example.com:mike/diasporadiaspora.git"
  },
  "commits": [
    {
      "id": "b6568db1bc1dcd7f8b4d5a946b0b91f9dacd7327",
      "author": {
        "email": "marlon@tweedegolf.com",
         "name":"Marlon"
      },
      "message":"This is me testing the client"

    },
    {
      "id": "da1560886d4f094c3e6c9ef40349f7d38b5d27d7",
      "author": {
        "email": "nick@astrant.net",
        "name":"Nick"
      },
      "message":"This is me testing the client"
    }
  ]
};

var jira_hook =  {
  "issue": {
    "key":"JRA-20002",
    "fields":{
      "summary":"Implemented Musac"
    }
  },
  "user": {
    "emailAddress":"github@sjorsgielen.nl",
    "name":"Sjors"
  },
  "changelog": {
    "items": [
      {
        "toString": "resolved",
        "field": "status"
      }
    ]
  },
  "webhookEvent": "jira:issue_updated"
};

console.log('Testing github hook:', url);

var payload = JSON.stringify(github_commit);

request.post({url: url + 'commit', form: {payload: payload}}, function(err, res, body) {
    console.log('Received:', body);
});

/*
payload = JSON.stringify(gitlab_commit);

request.post({url: url + 'commit', form: gitlab_commit}, function(err, res, body) {
    console.log('Received:', body);
});

request.post({url: url + 'issue/MUS-1', form: jira_hook}, function(err, res, body) {
    console.log('Received:', body);
});
*/