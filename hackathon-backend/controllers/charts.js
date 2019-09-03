const fs = require('fs');

var chart1 = function (req, res, next) {
    try {
        // var spawn = require("child_process").spawn;
        // var process = spawn('python', ["./plot1.py"]);
        // let count = 0;
        // process.stdout.on('data', function (data) {
        //     count++;
        //     if (count == 1) {
        //         return res.send({
        //             data: data.toString()
        //         }
        //         );
        //     }
        // });
        var bitmap = fs.readFileSync('tmp/plots/plot1.jpg');
        return res.send({
            data: new Buffer(bitmap).toString('base64')
        })
        return res.send(new Buffer(bitmap).toString('base64'));
    } catch (error) {
        console.log(error)
        return res.send({ data: error });
    }

    // res.send("dsdhjksdhk")
}


var chart2 = function (req, res, next) {
    try {
        var bitmap = fs.readFileSync('tmp/plots/plot2.jpg');
        return res.send({
            data: new Buffer(bitmap).toString('base64')
        })
    } catch (error) {
        console.log(error)
        return res.send({ data: error });
    }

}

module.exports = { chart1, chart2 };