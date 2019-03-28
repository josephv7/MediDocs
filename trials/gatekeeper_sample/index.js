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


Request.post({
    "headers": { "content-type": "application/json" },
    "url": "https://65c94784.ngrok.io/api/ShareDoctor",
    "body": JSON.stringify({
        "asset": "org.example.basic.MedicalRecord#2001",
        "newDoctorId": "3005"
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
