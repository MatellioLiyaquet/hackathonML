const express = require('express');
const multer = require('multer');

const app = express();
const tweetAnalysis = require('./controllers/tweetAnalysis')
const trainModel = require('./controllers/trainModel')
const uploadFile = require('./controllers/uploadFile')
const charts = require('./controllers/charts')

app.use(require('cors')());
app.use(require('body-parser').json());

app.get('/api/getSentiment', tweetAnalysis.getAnalysis);
app.get('/api/getAnalysisByText', tweetAnalysis.getAnalysisByText);
app.post('/api/getAllAnalysis', tweetAnalysis.getAllAnalysis);

app.get('/api/trainData', trainModel.trainModel)

app.get('/api/chart1', charts.chart1);

app.get('/api/chart2', charts.chart2);

app.get('/api/chart3', charts.chart3);

app.get('/api/chart4', charts.chart4);

app.get('/api/chart5', charts.chart5);

var multipartUpload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) { callback(null, './tmp/csv/'); },
    filename: function (req, file, callback) { callback(null, 'Tweets.csv'); }
  })
}).single('file');

app.post('/api/upload-csv', multipartUpload, uploadFile.upload)

app.get('/api/isTrainingDataAvailable', trainModel.trainingAvailable)


app.listen(3001, () => console.log('Server running'));
