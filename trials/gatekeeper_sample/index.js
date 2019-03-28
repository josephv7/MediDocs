const express = require('express');
const bodyParser = require('body-parser');
const url = require('url');
const querystring = require('querystring');
const Request = require("request");

let app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/test', async function(req, res) {
console.log('inside get method');
console.log(req.query.temperature);
console.log(req.query.location);


Request.post({
    "headers": { "content-type": "application/json" },
    "url": "http://localhost:3000/api/TemperatureDrop",
    "body": JSON.stringify({
        "asset": "org.example.mynetwork.MedicinePackage#0009",
        "newTemperature": String(req.query.temperature),
        "newLocation": String(req.query.location)
    })
}, (error, response, body) => {
    if(error) {
        return console.dir(error);
    }
    console.dir(JSON.parse(body));
});


});

  let server = app.listen(5001, function() {
      console.log('Server is listening on port 5001')
  });
