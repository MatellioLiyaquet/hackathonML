const fs = require('fs');

var chart1 = function (req, res, next) {
    try {
        var spawn = require("child_process").spawn;
        var process = spawn('python', ["./plot1.py"]);
        let count = 0;
        process.stdout.on('data', function (data) {
            count++;
            if (count == 1) {
                return res.send({
                    data: data.toString()
                }
                );
            }
        });
    } catch (error) {
        console.log(error)
        return res.send({ data: error });
    }

    // res.send("dsdhjksdhk")
}


var chart2 = function (req, res, next) {
    try {
        var spawn = require("child_process").spawn;
        var process = spawn('python', ["./plot2.py"]);
        let count = 0;
        process.stdout.on('data', function (data) {
            count++;
            if (count == 1) {
                return res.send({
                    data: data.toString()
                }
                );
            }
        });
    } catch (error) {
        console.log(error)
        return res.send({ data: error });
    }
   
}

module.exports = { chart1, chart2 };