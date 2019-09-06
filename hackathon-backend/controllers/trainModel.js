const fs = require('fs');
const csv = require('fast-csv');
var trainModel = function (req, res, next) {
    try {
        if (fs.existsSync('./tmp/csv/Tweets.csv')) {
            var spawn = require("child_process").spawn;
            spawn('python', ["./train.py"]);
            setTimeout(() => {
                return res.send({
                    trained: true,
                    reason: "Trainig Done SuccessFully, Now You can predict tweet sentiments"
                });
            }, 5000);
            
        } else {
            return res.send({
                trained: false,
                reason: "No Training File Found"
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
        if (fs.existsSync('./tmp/csv/Tweets.csv')) {
            const stat = fs.statSync('./tmp/csv/Tweets.csv');
            const response = {
                'Content-Type': 'audio/csv',
                'Content-Length': stat.size,
                'name': 'Tweet.csv'
            }
            const fileRows = [];
            csv.fromPath('./tmp/csv/Tweets.csv')
                .on("data", function (data) {
                    if(fileRows.length < 3000){
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