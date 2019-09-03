const fs = require('fs');
const csv = require('fast-csv');

var upload = function (req, res, next) {
    const fileRows = [];
    const temp = [];
    try {
        csv.fromPath(req.file.path)
        .on("data", function (data) {
            if (temp.length === 0) {
                temp.push(data)
            }
            fileRows.push(data);
        })
        .on("end", function () {
            const validationError = validateCsvData(temp, req.file.path);
            if (validationError) {
                return res.send({ error: validationError });
            }
            var spawn = require("child_process").spawn;
            spawn('python', ["plot1.py"]);
            spawn('python', ["plot2.py"]);
            setTimeout(() => {
                return res.json({ data: fileRows })
            }, 5000);
        })
    } catch (error) {
        console.log(error)
    }
    
};

function validateCsvData(rows, path) {
    console.log(rows[0])
    if (rows[0].indexOf('tweets') === -1 || rows[0].indexOf('sentiments') === -1) {
        fs.unlinkSync(path);
        return 'Invalid CSV, File must have Tweets and Sentiments column in it'
    }
    return;
}


module.exports = { upload };