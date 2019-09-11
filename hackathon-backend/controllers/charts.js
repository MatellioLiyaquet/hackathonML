const fs = require('fs');

var chart1 = function (req, res, next) {
    try {
        var bitmap = fs.readFileSync('tmp/plots/plot1.jpg');
        return res.send({
            data: new Buffer(bitmap).toString('base64')
        })
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

var chart3 = function (req, res, next) {
    try {
        var bitmap = fs.readFileSync('tmp/plots/plot3.jpg');
        return res.send({
            data: new Buffer(bitmap).toString('base64')
        })
    } catch (error) {
        console.log(error)
        return res.send({ data: error });
    }

}

var chart4 = function (req, res, next) {
    try {
        var bitmap = fs.readFileSync('tmp/plots/plot4.png');
        return res.send({
            data: new Buffer(bitmap).toString('base64')
        })
    } catch (error) {
        console.log(error)
        return res.send({ data: error });
    }

}

var chart5 = function (req, res, next) {
    try {
        var bitmap = fs.readFileSync('tmp/plots/plot5.png');
        return res.send({
            data: new Buffer(bitmap).toString('base64')
        })
    } catch (error) {
        console.log(error)
        return res.send({ data: error });
    }

}


module.exports = { chart1, chart2, chart3, chart4, chart5 };