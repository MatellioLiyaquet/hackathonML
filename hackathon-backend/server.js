const express = require('express');
const Twitter = require('twit');
const multer = require('multer');
const csv = require('fast-csv');
const fs = require('fs');
const app = express();
const client = new Twitter({
  consumer_key: 'CONSUMER_KEY',
  consumer_secret: 'CONSUMER_SECRET',
  access_token: 'ACCESS_TOKEN',
  access_token_secret: 'ACCESS_TOKEN_SECRET'
});

app.use(require('cors')());
app.use(require('body-parser').json());

app.get('/api/user', (req, res) => {
  client
    .get('account/verify_credentials')
    .then(user => {
      res.send(user);
    })
    .catch(error => {
      res.send(error);
    });
});

let cache = [];
let cacheAge = 0;

app.get('/api/home', (req, res) => {
  if (Date.now() - cacheAge > 60000) {
    cacheAge = Date.now();
    const params = { tweet_mode: 'extended', count: 200 };
    if (req.query.since) {
      params.since_id = req.query.since;
    }
    client
      .get(`statuses/home_timeline`, params)
      .then(timeline => {
        cache = timeline;
        res.send(timeline);
      })
      .catch(error => res.send(error));
  } else {
    res.send(cache);
  }
});

app.post('/api/favorite/:id', (req, res) => {
  const path = req.body.state ? 'create' : 'destroy';
  client
    .post(`favorites/${path}`, { id: req.params.id })
    .then(tweet => res.send(tweet))
    .catch(error => res.send(error));
});

app.post('/api/retweet/:id', (req, res) => {
  const path = req.body.state ? 'retweet' : 'unretweet';
  client
    .post(`statuses/retweet/${req.params.id}`)
    .then(tweet => res.send(tweet))
    .catch(error => res.send(error));
});

app.post('/api/name', callName);

function callName(req, res) {
  var spawn = require("child_process").spawn;
  var process = spawn('python', ["./hackathon.py",
    req.body.tweet]);
  process.stdout.on('data', function (data) {
    res.send(data);
  });
}

var multipartUpload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) { callback(null, './tmp/csv/'); },
    filename: function (req, file, callback) { callback(null, 'Tweets.csv'); }
  })
}).single('file');

app.post('/api/upload-csv', multipartUpload, function (req, res, next) {
  const fileRows = [];
  const temp = [];

  csv.fromPath(req.file.path)
    .on("data", function (data) {
      if (temp.length === 0) {
        temp.push(data)
      }
      fileRows.push(data);
    })
    .on("end", function () {
      const validationError = validateCsvData(temp, req.file.path);
      if (validationError) {
        return res.status(403).json({ error: validationError });
      }
      return res.json({ data: fileRows })
    })

});

function validateCsvData(rows, path) {
  console.log(rows[0])
  if (rows[0].indexOf('text') === -1 || rows[0].indexOf('airline_sentiment') === -1) {
    fs.unlinkSync(path);
    return 'Invalid CSV'
  }
  return;
}



app.listen(3000, () => console.log('Server running'));
