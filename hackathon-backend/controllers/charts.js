const fs = require('fs');

var chart1 = function (req, res, next) {
    var spawn = require("child_process").spawn;
    var process = spawn('python', ["./plot1.py"]);
    process.stdout.on('data', function (data) {
        var bitmap = fs.readFileSync('./tmp/plots/plot1.png');
        var base64str = new Buffer(bitmap).toString('base64');
        res.send(base64str);
    });
}
module.exports = { chart1 };