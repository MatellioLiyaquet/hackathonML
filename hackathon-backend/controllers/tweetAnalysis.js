const fs = require('fs');

var getAnalysis = function (req, res) {
    let result = [];
    if (fs.existsSync('pickleRelevancy')) {
        var spawn = require("child_process").spawn;
        if (req.query.tweet) {
            var process = spawn('python2', ["./getRelevany.py",
                req.query.tweet]);
            process.stdout.on('data', function (data) {
                data = data.toString();
                let response = JSON.parse(data);
                result[0] = response[0][0] * 100;
                result[1] = response[0][1] * 100;
                let tweetSentiment;
                if (result[0] > result[1]) {
                    tweetSentiment = 'IRRELEVANT';
                } else if (result[0] < result[1]) {
                    tweetSentiment = 'RELEVANT';
                }
                let finalResponse = {};
                if (tweetSentiment === 'RELEVANT') {
                    var process2 = spawn('python2', ["./getPrediction.py",
                        req.query.tweet]);
                    process2.stdout.on('data', function (data) {
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
                        finalResponse = {
                            result: result,
                            sentiment: tweetSentiment
                        }
                        return res.send(finalResponse);
                    })
                } else {
                    finalResponse = {
                        result: result,
                        sentiment: tweetSentiment
                    }
                    return res.send(finalResponse)
                }
            });
        } else {
            return res.json(null);
        }

    }
    else {
        return res.json(null);
    }
}

var getAllAnalysis = function (req, res) {
    let result = [];
    let releventTweets = [];
    console.log(req.body.tweets)
    if (req.body.tweets) {
        try {
            req.body.tweets.forEach(tweet => {
                var spawn = require("child_process").spawn
                var process = spawn('python2', ["./getRelevany.py",
                    tweet]);
                process.stdout.on('data', function (data) {
                    data = data.toString();
                    let response = JSON.parse(data);
                    result[0] = response[0][0] * 100;
                    result[1] = response[0][1] * 100;
                    let tweetSentiment;
                    if (result[0] > result[1]) {
                        releventTweets.push(tweet);
                    }
                });
            });
            console.log(releventTweets)
            req.body.tweets.forEach(tweet => {
                var spawn = require("child_process").spawn;
                var process2 = spawn('python2', ["./getPrediction.py",
                    releventTweets]);
                process2.stdout.on('data', function (data) {
                    let response = JSON.parse(data);
                    result[0] = response[0][0] * 100;
                    result[1] = response[0][1] * 100;
                    let tweetPrediction;
                    return res.send(result);
                });

            })
        } catch (error) {
            console.log(error)
        }
    }
}

var getAnalysisByText = function (req, res) {
    let result = [];
    if (fs.existsSync('pickleRelevancy')) {
        var spawn = require("child_process").spawn;
        if (req.query.tweet) {
            var process = spawn('python2', ["./getRelevany.py",
                req.query.tweet]);
            process.stdout.on('data', function (data) {
                data = data.toString();
                let response = JSON.parse(data);
                result[0] = response[0][0] * 100;
                result[1] = response[0][1] * 100;
                let tweetSentiment;
                if (result[0] > result[1]) {
                    tweetSentiment = 'IRRELEVANT';
                } else if (result[0] < result[1]) {
                    tweetSentiment = 'RELEVANT';
                }
                if (tweetSentiment === 'RELEVANT') {
                    var process2 = spawn('python2', ["./getPrediction.py",
                        req.query.tweet]);
                    process2.stdout.on('data', function (data) {
                        let response = JSON.parse(data);
                        result[0] = response[0][0] * 100;
                        result[1] = response[0][1] * 100;
                        let tweetPrediction;
                        if (result[0] > result[1]) {
                            if ((result[0] - result[1]) < 15) {
                                tweetPrediction = 'NUETRAL';
                            } else {
                                tweetPrediction = 'NEGATIVE';
                            }
                        } else if (result[0] < result[1]) {
                            if ((result[1] - result[0]) < 15) {
                                tweetPrediction = 'NUETRAL';
                            } else {
                                tweetPrediction = 'POSITIVE';
                            }
                        }
                        return res.send(tweetPrediction);
                    })
                } else {
                    return res.send(tweetSentiment)
                }
            });
        } else {
            return res.json(null);
        }

    }
    else {
        return res.json(null);
    }
}

module.exports = { getAnalysis, getAnalysisByText, getAllAnalysis };