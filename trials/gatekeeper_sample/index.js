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

// API to create new hospital

app.get('/createHospital', async function(req, res) {
    console.log('API Call to create new patient');
    console.log(req.query.hospitalName);
    console.log(req.query.password);

    var jsonResponse;
    var count;
    var aesKey;
    var hashedPassword;
    

    axios.get('http://localhost:3000/api/Hospital').then(function (response){
        console.log(response.data);
        jsonResponse = response.data;

        // console.log(SHA256(req.query.password).toString());
        // hashedPassword = SHA256(req.query.password).toString();

    }).then(function (response){
        findPatientCount();
    }).catch(function (error) {
    console.log(error);
  });


  function findPatientCount(){


    count =  4001 + jsonResponse.length;

    

    // openssl('openssl enc -aes-128-cbc -k secret -P -md sha1', function (err, buffer) {
    //     console.log(err.toString(), buffer.toString());
    //     aesKey = buffer.toString().substr(26,32);
    //     console.log(aesKey);

        Request.post({
            "headers": { "content-type": "application/json" },
            "url": "http://localhost:3000/api/Hospital",
            "body": JSON.stringify({
                "hospitalName" : req.query.hospitalName,
                "hospitalId" : count.toString(),
                "password" : SHA256(req.query.password).toString()
                
            })
        }, (error, response, body) => {
            if(error) {
                return console.dir(error);
            }
            console.dir(JSON.parse(body));
        });

        // });

  }
  
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
});









// API Call to create new patient
app.get('/createPatient', async function(req, res) {
    console.log('API Call to create new patient');
    console.log(req.query.firstName);
    console.log(req.query.lastName);
    console.log(req.query.password);

    var jsonResponse;
    var count;
    var aesKey;
    var hashedPassword;
    

    axios.get('http://localhost:3000/api/Patient').then(function (response){
        console.log(response.data);
        jsonResponse = response.data;

        // console.log(SHA256(req.query.password).toString());
        // hashedPassword = SHA256(req.query.password).toString();

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
                "password" : SHA256(req.query.password).toString()
                
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
    console.log(req.query.password);
    console.log(req.query.hospitalId);

    var jsonResponse;
    var count;
    var data;
    var fullId = 'org.example.basic.Hospital#' + req.query.hospitalId;
    

    axios.get('http://localhost:3000/api/Doctor').then(function (response){
        console.log(response.data);
        jsonResponse = response.data;

    }).then(function (response){
        findDoctorCount();
    }).catch(function (error) {
    console.log(error);
  });


  function findDoctorCount(){


    count =  3020 + jsonResponse.length;


    // openssl genrsa -out rsa_1024_priv.pem 1024
    // openssl rsa -pubout -in rsa_1024_priv.pem -out rsa_1024_pub.pem

    privateKeyFile = 'rsa_1024_priv_' + count + '.pem';
    publicKeyFile = 'rsa_1024_pub_' + count + '.pem';
    privateKeyGen = 'openssl genrsa -out rsa_1024_priv_' + count + '.pem 1024';
    publicKeygen = 'openssl rsa -pubout -in rsa_1024_priv_' + count + '.pem -out rsa_1024_pub_' + count +'.pem';
    finalCommand = privateKeyGen + '&&' + publicKeygen;


    
    cmd.run(finalCommand)

    getKeyData();
    
    
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
                "hospital" : fullId,
                "password" : SHA256(req.query.password).toString(),
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




// Deprecated
// API for password creation from web portal 
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




// API to list doctors after removing private data
    app.get('/api/listDoctors', async function(req, res) {
        console.log('inside get method');



        res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        


        axios.get('http://localhost:3000/api/Doctor').then(function (response){
            console.log(response.data);
            jsonResponse = response.data;
    
        }).then(function (response){
            filterDoctorData();
        }).catch(function (error) {
        console.log(error);
      });


      function filterDoctorData(){
        for(var i = 0; i < jsonResponse.length; i++) {
            delete jsonResponse[i]['password'];
            delete jsonResponse[i]['privateKey'];
        }

        console.log(jsonResponse);
        res.send(jsonResponse);
      }
    
        
        });


// API to list hospitals after removing private data
        app.get('/api/listHospitals', async function(req, res) {
            console.log('inside get method');
    
    
    
            res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            
    
    
            axios.get('http://localhost:3000/api/Hospital').then(function (response){
                console.log(response.data);
                jsonResponse = response.data;
        
            }).then(function (response){
                filterHospitalData();
            }).catch(function (error) {
            console.log(error);
          });
    
    
          function filterHospitalData(){
            for(var i = 0; i < jsonResponse.length; i++) {
                delete jsonResponse[i]['password'];
            }
    
            console.log(jsonResponse);
            res.send(jsonResponse);
          }
        
            
            });





// API for patient login
app.post('/api/userLogin', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var type = req.body.type;
    

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");


    var url;
    if(type == 'patient'){
        url = 'http://localhost:3000/api/Patient/' + username.toString();
    }else if(type == 'doctor'){
        url = 'http://localhost:3000/api/Doctor/' + username.toString();
    }else if(type == 'hospital'){
        url = 'http://localhost:3000/api/Hospital/' + username.toString();
    }else if (type == 'insurance'){
        url = 'http://localhost:3000/api/InsuranceCompany/' + username.toString();

    }else if (type == 'regulator'){
        url = 'http://localhost:3000/api/Regulator/' + username.toString();

    }


    axios.get(url).then(function (response){
        console.log(response.data);
        jsonResponse = response.data;
        

    }).then(function (response){
        var response2 = jsonResponse;
        checkPassword(response2)
    }).catch(function (error) {
    console.log(error);
    // send invalid id message here
        res.end(JSON.stringify({ status: "error" }));
  });


  function checkPassword(response){
      console.log(response);
      console.log(response.password);
      console.log('inside check');

      if(password == response.password){
          res.end(JSON.stringify([{ status: "ok" }]));
          console.log('here');
      }else{
        res.end(JSON.stringify([{ status: "incorrect" }]));
      }
      

  }

    console.log(password);
    console.log(username);


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



app.post('/api/test', function(req, res) {
    var user_id = req.body.id;
    

    console.log(user_id);
    res.send(user_id);
});





// API to create medical record
app.post('/api/createRecord', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var type = req.body.type;
    

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");


    var url;
    if(type == 'patient'){
        url = 'http://localhost:3000/api/Patient/' + username.toString();
    }else if(type == 'doctor'){
        url = 'http://localhost:3000/api/Doctor/' + username.toString();
    }else if(type == 'hospital'){
        url = 'http://localhost:3000/api/Hospital/' + username.toString();
    }else if (type == 'insurance'){
        url = 'http://localhost:3000/api/InsuranceCompany/' + username.toString();

    }else if (type == 'regulator'){
        url = 'http://localhost:3000/api/Regulator/' + username.toString();

    }


    axios.get(url).then(function (response){
        console.log(response.data);
        jsonResponse = response.data;
        

    }).then(function (response){
        var response2 = jsonResponse;
        checkPassword(response2)
    }).catch(function (error) {
    console.log(error);
    // send invalid id message here
        res.end(JSON.stringify({ status: "error" }));
  });


  function checkPassword(response){
      console.log(response);
      console.log(response.password);
      console.log('inside check');

      if(password == response.password){
          res.end(JSON.stringify([{ status: "ok" }]));
          console.log('here');
      }else{
        res.end(JSON.stringify([{ status: "incorrect" }]));
      }
      

  }

    console.log(password);
    console.log(username);


});







  let server = app.listen(5001, function() {
      console.log('Server is listening on port 5001')
  });
