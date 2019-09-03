const fs = require('fs');
const csv = require('fast-csv');

var upload = function (req, res, next) {
    const fileRows = [];
    const temp = [];

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
            return res.json({ data: fileRows })
        })
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