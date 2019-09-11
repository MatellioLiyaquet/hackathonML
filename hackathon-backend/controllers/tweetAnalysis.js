const fs = require('fs');

var getAnalysis = function (req, res) {
    if (fs.existsSync('trainingPickle')) {
        var spawn = require("child_process").spawn;
        var process = spawn('python', ["./hackathon.py",
            req.body.tweet]);
        process.stdout.on('data', function (data) {
            data = data.toString();
            let response = JSON.parse(data);
            let result = [];
            result[0] = response[0][0] * 100;
            result[1] = response[0][1] * 100;
            let tweetSentiment;
            console.log(result[0]);
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
            console.log(tweetSentiment)

            let finalResponse = {
                result: result,
                sentiment: tweetSentiment
            }

            return res.send(finalResponse);
        });
    }
    else {
        return res.json(null);
    }
}

module.exports = { getAnalysis };