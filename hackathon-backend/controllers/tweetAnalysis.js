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
                console.log(data)
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
                        let response = JSON.parse(data);
                        result[0] = response[0][0] * 100;
                        result[1] = response[0][1] * 100;
                        let tweetSentiment;
                        if (result[0] > result[1]) {
                            if ((result[0] - result[1]) < 5) {
                                tweetSentiment = 'NUETRAL';
                            } else {
                                tweetSentiment = 'NEGATIVE';
                            }
                        } else if (result[0] < result[1]) {
                            if ((result[1] - result[0]) < 5) {
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
    if (req.body.tweets) {
        try {
            let count = 0;
            let countN = 0;
            let countP = 0;
            let countInner = 0;
            req.body.tweets.forEach(tweet => {
                var spawn = require("child_process").spawn
                var process = spawn('python2', ["./getRelevany.py",
                    tweet]);
                process.stdout.on('data', function (data) {
                    data = data.toString();
                    let response = JSON.parse(data);
                    result[0] = response[0][0] * 100;
                    result[1] = response[0][1] * 100;
                    if (result[0] < result[1]) {
                        releventTweets.push(tweet);
                    }
                });

                process.stdout.on('close', function (data) {
                    count++;
                    let calc = [];
                    if (req.body.tweets.length === count && releventTweets.length > 0) {
                        releventTweets.forEach(_t => {
                            var spawn = require("child_process").spawn;
                            var process2 = spawn('python2', ["./getPrediction.py",
                                _t]);
                            process2.stdout.on('data', function (data) {
                                countInner++;
                                
                                data = data.toString();
                                let response = JSON.parse(data);
                                result[0] = response[0][0] * 100;
                                result[1] = response[0][1] * 100;
                                if (result[0] > result[1]) {
                                    countN++
                                } else {
                                    countP++
                                }

                                if(releventTweets.length === countInner){
                                    let arr = [];
                                    arr[0] = (countN/(countN+countP)) * 100;
                                    arr[1] = (countP/(countN+countP)) * 100;
                                    console.log(countN, countP)
                                    return res.send(arr)
                                }
                            });
                            
                        });


                    }
                });
            });

        } catch (error) {
            return res.send(error);
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