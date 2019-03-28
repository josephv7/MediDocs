const express = require('express');

let app = express();
const genomeLink = require('genomelink-node');
const callback = (report) => { console.log(report.summary.text); }
genomeLink.Report.fetch({ name: 'eye-color', population: 'european', token: 'GENOMELINKTEST001' }).then((report) => { callback(report); });


let server = app.listen(4000, function() {
    console.log('Server is listening on port 4000')
});