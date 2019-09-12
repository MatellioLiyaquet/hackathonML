const fs = require('fs');

var getAnalysis = function (req, res) {
    let result = [];
    if (fs.existsSync('trainingPickle')) {
        var spawn = require("child_process").spawn;
        console.log(req.query.tweet)
        if (req.query.tweet) {
            var process = spawn('python2', ["./hackathon.py",
                req.query.tweet]);
            process.stdout.on('data', function (data) {
                data = data.toString();
                console.log(data)
                let response = JSON.parse(data);

                result[0] = response[0][0] * 100;
                result[1] = response[0][1] * 100;
                let tweetSentiment;
                if (result[0] > result[1]) {
                    if ((result[0] - result[1]) < 15) {
                        tweetSentiment = 'NUETRAL';
                    } else {
                        tweetSentiment = 'NEGATIVE';
                    }
                } else if (result[0] < result[1]) {
                    if ((result[1] - result[0]) < 15) {
                        tweetSentiment = 'NUETRAL';
                    } else {
                        tweetSentiment = 'POSITIVE';
                    }
                }
                let finalResponse = {
                    result: result,
                    sentiment: tweetSentiment
                }

                return res.send(finalResponse);
            });
        } else {
            return res.json(null);
        }

    }
    else {
        return res.json(null);
    }
}

var getAnalysisByText = function (req, res) {
    let result = [];
    if (fs.existsSync('trainingPickle')) {
        var spawn = require("child_process").spawn;
        console.log(req.query.tweet)
        if (req.query.tweet) {
            var process = spawn('python2', ["./hackathon.py",
                req.query.tweet]);
            process.stdout.on('data', function (data) {
                data = data.toString();
                let response = JSON.parse(data);
                result[0] = response[0][0] * 100;
                result[1] = response[0][1] * 100;
                let tweetSentiment;
                if (result[0] > result[1]) {
                    if ((result[0] - result[1]) < 15) {
                        tweetSentiment = 'NUETRAL';
                    } else {
                        tweetSentiment = 'NEGATIVE';
                    }
                } else if (result[0] < result[1]) {
                    if ((result[1] - result[0]) < 15) {
                        tweetSentiment = 'NUETRAL';
                    } else {
                        tweetSentiment = 'POSITIVE';
                    }
                }
                return res.send(tweetSentiment);
            });
        } else {
            return res.json(null);
        }

    }
    else {
        return res.json(null);
    }
}

module.exports = { getAnalysis, getAnalysisByText };