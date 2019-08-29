const fs = require('fs');

var getAnalysis = function (req, res) {
    if (fs.existsSync('trainingPickle')) {
        var spawn = require("child_process").spawn;
        var process = spawn('python', ["./hackathon.py",
            req.body.tweet]);
        process.stdout.on('data', function (data) {
            return res.send(data);
        });
    }
    else {
        return res.json(null);
    }
}

module.exports = { getAnalysis };