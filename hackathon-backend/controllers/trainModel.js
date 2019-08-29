const fs = require('fs');

var trainModel = function (req, res, next) {
    try {
        if (fs.existsSync('./tmp/csv/Tweets.csv')) {
            var spawn = require("child_process").spawn;
            var process = spawn('python', ["./train.py"]);
            return res.send({
                trained: true,
                reason: "Trainig Done SuccessFully, Now You can predict tweet sentiments"
            });
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
            return res.json({
                isAvailable: true
            });
        }else{
            return res.json({
                isAvailable: false
            });
        }
    } catch (error) {a
        return res.json({
            isAvailable: false
        });
    }
};


module.exports = { trainModel, trainingAvailable };