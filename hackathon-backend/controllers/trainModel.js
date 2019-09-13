const fs = require('fs');
const csv = require('fast-csv');
var trainModel = function (req, res, next) {
    try {
        if (!fs.existsSync('./picklePrediction')) {
            var spawn = require("child_process").spawn;
            spawn('python2', ["./trainForPrediction.py"]);
            spawn('python2', ["./trainForRelevancy.py"]);
            setTimeout(() => {
                return res.send({
                    trained: true,
                    reason: "Trainig Done SuccessFully, Now You can predict tweet sentiments"
                });
            }, 10000);
            
        } else {
            return res.send({
                trained: false,
                reason: "Model Already Exists"
            });
        }
    } catch (error) {
        return res.json({
            trained: false,
            reason: "No Training File Found"
        });
    }

}

var trainingAvailable = function (req, res, next) {
    try {
        console.log("test")
        if (fs.existsSync('./tmp/csv/Tweets_Prediction.csv')) {
            const stat = fs.statSync('./tmp/csv/Tweets_Prediction.csv');
            const response = {
                'Content-Type': 'audio/csv',
                'Content-Length': stat.size,
                'name': 'Tweet.csv'
            }
            const fileRows = [];
            csv.fromPath('./tmp/csv/Tweets_Prediction.csv')
                .on("data", function (data) {
                    if(fileRows.length < 5000){
                        fileRows.push(data);
                    }
                })
                .on("end", function () {

                    return res.json({
                        isAvailable: true,
                        stat: response,
                        data: fileRows
                    });
                })

        } else {
            return res.json({
                isAvailable: false,
                stat: null
            });
        }
    } catch (error) {
        console.log(error)
        return res.json({
            isAvailable: false
        });
    }
};


module.exports = { trainModel, trainingAvailable };