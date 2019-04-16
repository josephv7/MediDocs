const express = require('express');
const bodyParser = require('body-parser');
const url = require('url');
const querystring = require('querystring');
const Request = require("request");
const axios = require('axios');
const openssl = require('openssl-nodejs')
const fs = require('fs');
const cmd=require('node-cmd');
const SHA256 = require("crypto-js/sha256");

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
    var aesKey;
    

    axios.get('http://localhost:3000/api/Patient').then(function (response){
        console.log(response.data);
        jsonResponse = response.data;

    }).then(function (response){
        findPatientCount();
    }).catch(function (error) {
    console.log(error);
  });


  function findPatientCount(){


    count =  2001 + jsonResponse.length;

    

    openssl('openssl enc -aes-128-cbc -k secret -P -md sha1', function (err, buffer) {
        console.log(err.toString(), buffer.toString());
        aesKey = buffer.toString().substr(26,32);
        console.log(aesKey);

        Request.post({
            "headers": { "content-type": "application/json" },
            "url": "http://localhost:3000/api/Patient",
            "body": JSON.stringify({
                "firstName" : req.query.firstName,
                "lastName" : req.query.lastName,
                "patientId" : count.toString(),
                "contentKey" : aesKey,
                "password" : "adad"
                
            })
        }, (error, response, body) => {
            if(error) {
                return console.dir(error);
            }
            console.dir(JSON.parse(body));
        });

        });

  }
  


    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
});





// API Call to create new doctor
app.get('/createDoctor', async function(req, res) {
    console.log('API Call to create new patient');
    console.log(req.query.firstName);
    console.log(req.query.lastName);

    var jsonResponse;
    var count;
    var data;
    

    axios.get('http://localhost:3000/api/Doctor').then(function (response){
        console.log(response.data);
        jsonResponse = response.data;

    }).then(function (response){
        findDoctorCount();
    }).catch(function (error) {
    console.log(error);
  });


  function findDoctorCount(){


    count =  3002 + jsonResponse.length;


 
    // openssl genrsa -out rsa_1024_priv.pem 1024
    // openssl rsa -pubout -in rsa_1024_priv.pem -out rsa_1024_pub.pem

    privateKeyFile = 'rsa_1024_priv_' + count + '.pem';
    publicKeyFile = 'rsa_1024_pub_' + count + '.pem';
    privateKeyGen = 'openssl genrsa -out rsa_1024_priv_' + count + '.pem 1024';
    publicKeygen = 'openssl rsa -pubout -in rsa_1024_priv_' + count + '.pem -out rsa_1024_pub_' + count +'.pem';
    finalCommand = privateKeyGen + '&&' + publicKeygen;


    
    cmd.run(finalCommand)

    getKeyData();
    
    
    




        // Request.post({
        //     "headers": { "content-type": "application/json" },
        //     "url": "http://localhost:3000/api/Doctor",
        //     "body": JSON.stringify({
        //         "firstName" : req.query.firstName,
        //         "lastName" : req.query.lastName,
        //         "doctorId" : count.toString(),
        //         "password" : "adad",
        //         "publicKey" : "",
        //         "privateKey" : ""
                
        //     })
        // }, (error, response, body) => {
        //     if(error) {
        //         return console.dir(error);
        //     }
        //     console.dir(JSON.parse(body));
        // });


  }


  function getKeyData(){


    


    fs.readFile(privateKeyFile, 'utf8', function(err, contents) {
        console.log(contents);
        privateKey = contents;
        fs.readFile(publicKeyFile, 'utf8', function(err, contents) {
            console.log(contents);
            publicKey = contents;


            Request.post({
            "headers": { "content-type": "application/json" },
            "url": "http://localhost:3000/api/Doctor",
            "body": JSON.stringify({
                "firstName" : req.query.firstName,
                "lastName" : req.query.lastName,
                "doctorId" : count.toString(),
                "password" : "adad",
                "publicKey" : publicKey,
                "privateKey" : privateKey
                
            })
        }, (error, response, body) => {
            if(error) {
                return console.dir(error);
            }
            console.dir(JSON.parse(body));
        });

        });
    });

    

  }

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
});






app.get('/passwordCreation', async function(req, res) {
    console.log('inside get method');
    console.log(req.query.password);


    console.log(SHA256(req.query.password).toString());
    var hashedPassword = '{response:' + SHA256(req.query.password).toString() + '}';
    
    res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    

    res.send(JSON.stringify({response:SHA256(req.query.password).toString()}));
    
    });













app.post('/api/userLogin', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");


    var url = 'http://localhost:3000/api/Doctor/' + username.toString();

    axios.get(url).then(function (response){
        console.log(response.data);
        jsonResponse = response.data;
        

    }).then(function (response){
        var response2 = jsonResponse;
        checkPassword(response2)
    }).catch(function (error) {
    console.log(error);
  });


  function checkPassword(response){
      console.log(response);
      console.log(response.password);
      console.log('inside check');

      if(password == response.password){
          res.send('success');
      }else{
          res.send('error');
      }
      

  }


  

    console.log(password);
    console.log(username);
    // res.send(username);


    

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
    
    res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
    });



app.post('/api/users', function(req, res) {
    var user_id = req.body.id;
    

    console.log(user_id);
    res.send(user_id);
});





  let server = app.listen(5001, function() {
      console.log('Server is listening on port 5001')
  });
