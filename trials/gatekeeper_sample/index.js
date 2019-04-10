const express = require('express');
const bodyParser = require('body-parser');
const url = require('url');
const querystring = require('querystring');
const Request = require("request");
const axios = require('axios');

let app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// API Call to create new patient
app.get('/createPatient', async function(req, res) {
    console.log('API Call to create new patient');
    console.log(req.query.firstName);
    console.log(req.query.lastName);

    var jsonResponse;
    var count;

    axios.get('http://315419af.ngrok.io/api/Patient').then(function (response){
        console.log(response.data);
        jsonResponse = response.data;
        
    }).then(function (response){
        findPatientCount();
    }).catch(function (error) {
    console.log(error);
  });


  function findPatientCount(){


    count =  2005 + jsonResponse.length;




    Request.post({
        "headers": { "content-type": "application/json" },
        "url": "http://315419af.ngrok.io/api/Patient",
        "body": JSON.stringify({
            "firstName" : req.query.firstName,
            "lastName" : req.query.lastName,
            "patientId" : count.toString(),
            "password" : "adad",
            "contentKey" : "fsffs"
        })
    }, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
        console.dir(JSON.parse(body));
    });


  }


    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
    
    
    
    
    });




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
