const fs = require('fs');

var chart1 = function (req, res, next) {
    var spawn = require("child_process").spawn;
    var process = spawn('python', ["./plot1.py"]);
    process.stdout.on('data', function (data) {
        res.send({data:data.toString()});
    });
}


var chart2 = function (req, res, next) {
    var spawn = require("child_process").spawn;
    var process = spawn('python', ["./plot2.py"]);
    process.stdout.on('data', function (data) {
        res.send(data);
    });
}

module.exports = { chart1, chart2 };