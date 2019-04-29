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
const CryptoJS = require("crypto-js");
const IPFS = require('ipfs');
const fetch = require('node-fetch');
// const JSEncrypt = require('jsencrypt');
const NodeRSA = require('node-rsa');
const crypto = require("crypto");
const cors = require('cors')


const config = require("./config");
const accountSid = config.accountSid;
const authToken = config.authToken;
const client = require('twilio')(accountSid, authToken);



let app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// API to create new hospital
app.get('/createHospital', async function(req, res) {
    console.log('API Call to create new hospital');
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
    console.log('API Call to create new doctor');
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


    
    cmd.get(finalCommand,getKeyData);

    // getKeyData();
    
    
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



// For patient, hospital, and regulator
// API to list doctors after removing private data
    app.get('/api/listDoctors', async function(req, res) {
        console.log('API Call to list all doctors');


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
            delete jsonResponse[i]['publicKey'];
        }

        console.log(jsonResponse);
        res.send(jsonResponse);
      }
    
        
        });

// For regulators
// API to list hospitals after removing private data
        app.get('/api/listHospitals', async function(req, res) {
            console.log('API Call to list all hospitals');    
    
    
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





// API for user patinetKey
// Store username as well as aesKey/contentKey in sharedpref....android
app.post('/api/userLogin', function(req, res) {
    console.log('API Call to user authentication');
    console.log('----' + req.body.password);
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
        // console.log(response.data);
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
    //   console.log(response);
      console.log(response.password);
      console.log('inside check');

      if(password == response.password){
          res.end(JSON.stringify([{ status: "ok" }]));
          console.log('here');
      }else{
        res.end(JSON.stringify([{ status: "incorrect" }]));
      }
      

  }

    // console.log(password);
    // console.log(username);


});




app.get('/test', async function(req, res) {
    console.log('inside get method');



    res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
    
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
        res.end(JSON.stringify([{ status: "ok" }]));
    });
    
    
    });



app.post('/api/test', function(req, res) {
    var user_id = req.body.id;
    

    console.log(user_id);
    res.send(user_id);
});





// API to create medical record
app.post('/api/createRecord', function(req, res) {
    console.log('API Call to create new record');    
    var username = req.body.username;
    var content = req.body.content;
    var doctorname = req.body.doctorId;

    console.log(req.body.username);
    console.log(req.body.content);

    var fileHash;

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");



    axios.get('http://localhost:3000/api/MedicalRecord').then(function (response){
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


    calculatedId =  1001 + jsonResponse.length;
    var patientUrl = 'http://localhost:3000/api/Patient/' + req.body.username;

    ownerName = 'org.example.basic.Patient#' + username;

    axios.get(patientUrl).then(function (response){
        console.log(response.data);
        jsonResponse = response.data;
        patientKey = jsonResponse['contentKey'];
        console.log(patientKey);

        // console.log(SHA256(req.query.password).toString());
        // hashedPassword = SHA256(req.query.password).toString();

    }).then(function (response){
        putData();
    }).catch(function (error) {
    console.log(error);
  });


  function putData(){

    // var encryptedData = CryptoJS.AES.encrypt(req.body.content,patientKey).toString();
    // console.log(encryptedData);

//////////////////

    


const node = new IPFS()
node.on('ready', async () => {
    console.log('iniside sample code')


    var date = new Date();
    var timeStampString = date.getDate() + '_' + date.getHours() + '_' + date.getMinutes() + '_' + date.getSeconds() + '.txt';
    console.log('trial')
    console.log(timeStampString);
  
    const filesAdded = await node.add({
        path: timeStampString,
      content: Buffer.from(CryptoJS.AES.encrypt(req.body.content,patientKey).toString())
    })
  
    console.log('Added file:', filesAdded[0].path, filesAdded[0].hash)

    fileHash = filesAdded[0].hash;
    console.log('After getting filehash')
    console.log(fileHash)
    // res.send(fileHash);
    try {
        await node.stop()
        console.log('Node stopped!')
        Request.post({
            "headers": { "content-type": "application/json" },
            "url": "http://localhost:3000/api/MedicalRecord",
            "body": JSON.stringify({
                "recordId": calculatedId,
                "owner" : ownerName,
                "value" : [fileHash],
                "doctorId" : [doctorname],
                "verified" : 'false'
            })
        }, (error, response, body) => {
            if(error) {
                return console.dir(error);
            }


            client.messages.create({
          body: 'Record Created for patient' + username,
          from: 'whatsapp:+14155238886',
          to: 'whatsapp:+918289940688'
        })
        .then(message => console.log(message.sid))
        .done();


            console.dir(JSON.parse(body));
        });
      } catch (error) {
        console.error('Node failed to stop cleanly!', error)
      }

  
  })
  
  }
/////////////////

  }




});






app.get('/recordVerification', async function(req, res) {
    console.log('API Call to verify a patient record');    console.log(req.query.recordid);
    console.log(req.query.username);

    var username = req.query.username;
    var recordid = req.query.recordid;

    var recordUrl = 'http://localhost:3000/api/MedicalRecord/' + recordid;
    var ownerString = 'resource:org.example.basic.Patient#' + username;
    var recordString = 'org.example.basic.MedicalRecord#' + recordid;


    axios.get(recordUrl).then(function (response){
        console.log(response.data);
        jsonResponse = response.data;
        ownerName = jsonResponse['owner'];
        console.log(ownerName);

        // console.log(SHA256(req.query.password).toString());
        // hashedPassword = SHA256(req.query.password).toString();

    }).then(function (response){
        if(ownerName == ownerString){
            doVerification()
        }
    }).catch(function (error) {
    console.log(error);
  });


  function doVerification(){
    Request.post({
        "headers": { "content-type": "application/json" },
        "url": "http://localhost:3000/api/RecordVerification",
        "body": JSON.stringify({
            "asset": recordString,
            "newVerified" : 'true'
        })
    }, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
        console.dir(JSON.parse(body));
        res.end(JSON.stringify([{ status: "ok" }]));
    });
  }
    

    
    res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");


    
    });




// API to list all doctors in a hospital
    app.get('/api/hospitalDoctorList', async function(req, res) {
        console.log('API Call to list all doctors in a hospital');        console.log(req.query.hospitalid);
        var hospitalid = req.query.hospitalid;

        var hospitalDoctorString = 'http://localhost:3000/api/queries/HospitalDoctorList?id=resource%3Aorg.example.basic.Hospital%23' + hospitalid;
        
    
        
        res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        



            axios.get(hospitalDoctorString).then(function (response){
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
                delete jsonResponse[i]['privateKey'];
            }
    
            console.log(jsonResponse);
            res.send(jsonResponse);
          }




        });






// API call to list all patient records
        app.get('/api/listPatientRecords', async function(req, res) {
            console.log('API Call to list all patient records');
            console.log(req.query.patientId);
            var patientId = req.query.patientId;
            var listType = req.query.listType;
            // verified, unverified or all can be the type


            var patientRecordString;

            if(listType == 'verified'){
                patientRecordString = 'http://localhost:3000/api/queries/VerifiedPatientRecords?id=resource%3Aorg.example.basic.Patient%23' + patientId;
            }else if(listType == 'unverified'){
                patientRecordString = 'http://localhost:3000/api/queries/UnVerifiedPatientRecords?id=resource%3Aorg.example.basic.Patient%23' + patientId;
            }else if(listType == 'all'){
                patientRecordString = 'http://localhost:3000/api/queries/ListByPatient?id=resource%3Aorg.example.basic.Patient%23' + patientId;

            }
    
        
            
            res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            
    
    
    
                axios.get(patientRecordString).then(function (response){
                    console.log(response.data);
                    jsonResponse = response.data;
            
                }).then(function (response){
                    res.send(jsonResponse);
                }).catch(function (error) {
                console.log(error);
              });
        
            });







// API to return list of records shared with a doctor

            app.get('/api/listDoctorRecords', async function(req, res) {
                console.log('API call to list all records which are shared with a specific doctor');
                console.log(req.query.doctorId);
                var doctorId = req.query.doctorId;
                
               
                var doctorRecordString = 'http://localhost:3000/api/queries/ListRecordDoctor?id=' + doctorId;
    
                
                
                res.header("Access-Control-Allow-Origin", "*");
                    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
                    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                
        
        
        
                    axios.get(doctorRecordString).then(function (response){
                        console.log(response.data);
                        jsonResponse = response.data;
                
                    }).then(function (response){
                        filterRecordData()
                    }).catch(function (error) {
                    console.log(error);
                  });


                  function filterRecordData(){
                    for(var i = 0; i < jsonResponse.length; i++) {
                        delete jsonResponse[i]['doctorId'];
                    }
            
                    console.log(jsonResponse);
                    res.send(jsonResponse);
                  }
            
                });




// API to share record with new doctor, passing new list from android app
app.get('/api/shareDoctor', async function(req, res) {
    console.log('API call to share record with doctor');
    console.log(req.query.recordid);
    console.log(req.query.doctorid);

    var recordid = req.query.recordid;
    var doctorid = req.query.doctorid;

    var recordString = 'org.example.basic.MedicalRecord#' + recordid;

    res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
    
    
    Request.post({
        "headers": { "content-type": "application/json" },
        "url": "http://localhost:3000/api/UpdateDoctor",
        "body": JSON.stringify({
            "asset": recordString,
            "newDoctorId": doctorid.split('.')
        })
    }, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
        console.dir(JSON.parse(body));
        res.end(JSON.stringify([{ status: "ok" }]));
        
    });
    
    
    });




// API for patient to read his record 
// Make sure to check username in sharedpref is same as record owner befor making this api call from the android side
    app.get('/api/patientReadRecord', async function(req, res) {
        console.log('Patient read record api call');
        console.log(req.query.recordHash);

        var dataString;

        res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
        var recordHash = req.query.recordHash;
    
        var recordUrl = 'http://ipfs.io/ipfs/' + recordHash;
        
        fetch(recordUrl)
    .then(res => res.text())
    // .then(body => console.log(body))
    .then(body => res.end(JSON.stringify([{ status: body }])));
    // .then(res.end(JSON.stringify([{ status: body }])));

});








// API to get patient aes key
        app.get('/api/patientKey', async function(req, res) {
            console.log('API call to fetch patient aes key');
            console.log(req.query.patientid);
            // console.log(req.query.doctorid);
        
            var patientid = req.query.patientid;
        
            // var recordUrl = 'org.example.basic.MedicalRecord#' + recordid;
            var patientUrl = 'http://localhost:3000/api/Patient/' + patientid;
        
            
            axios.get(patientUrl).then(function (response){
                console.log(response.data);
                jsonResponse = response.data;
        
            }).then(function (response){
                res.send(JSON.stringify([{contentKey :jsonResponse['contentKey'], patientName : jsonResponse['firstName'] + ' ' + jsonResponse['lastName']}]));
                // res.send(jsonResponse['contentKey']);
            }).catch(function (error) {
            console.log(error);
          });
            
        
            
            res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            
            });
    








// API for doctor to get patient aes key encrypted with doctor public key
            app.get('/api/encryptionKey', async function(req, res) {
                console.log('API call for patinet key encryption');
                console.log(req.query.patientid);
                console.log(req.query.recordid);
                console.log(req.query.doctorid);
                // console.log(req.query.doctorid);

                res.header("Access-Control-Allow-Origin", "*");
                    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
                    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                
            
            
                var patientid = req.query.patientid;
                var recordid = req.query.recordid;
                var doctorid = req.query.doctorid;
            
                // var recordUrl = 'org.example.basic.MedicalRecord#' + recordid;
                var patientUrl = 'http://localhost:3000/api/Patient/' + patientid;
                var recordUrl = 'http://localhost:3000/api/MedicalRecord/' + recordid;
                var doctorUrl = 'http://localhost:3000/api/Doctor/' + doctorid;


                var dataResponse;
                var keyResponse;
                var doctorResponse;
                var doctorResp;
                
                axios.get(patientUrl).then(function (response){
                    console.log(response.data);
                    keyResponse = response.data['contentKey'];
            
                }).then(function (response){
                    // res.send(JSON.stringify({contentKey :jsonResponse['contentKey']}));
                    // res.send(jsonResponse['contentKey']);
                    getFileHash()
                }).catch(function (error) {
                console.log(error);
              });


              function getFileHash(){
                axios.get(recordUrl).then(function (response){
                    console.log(response.data);
                    dataResponse = response.data['value'][0];
            
                }).then(function (response){
                    // res.send(JSON.stringify({key : keyResponse, data : dataResponse}));
                    // res.send(jsonResponse['contentKey']);
                    getDoctorKey()
                    
                }).catch(function (error) {
                console.log(error);
              });

              }
                
            
            function getDoctorKey(){

                axios.get(doctorUrl).then(function (response){
                    console.log(response.data);
                    doctorResponse = response.data['publicKey'];
                    doctorResp = response.data['privateKey'];
            
                }).then(function (response){
                    // res.send(JSON.stringify({key : keyResponse, data : dataResponse, publicKey : doctorResponse}));
                    console.log('doctor ' + doctorResponse);
                    encryptKey()
                }).catch(function (error) {
                console.log(error);
              });


            }



            function encryptKey(){

                var message = 'abcd';
                console.log('xxxxxxx' + doctorResponse.substring(0, doctorResponse.length - 1));
                var encrypted = crypto.publicEncrypt(doctorResponse.substring(0, doctorResponse.length - 1),Buffer.from(keyResponse));

                console.log(encrypted.toString("base64"));

                // const key = new NodeRSA(doctorResponse.substring(0, doctorResponse.length - 1))
                // key.importKey(keyData, 'pkcs8');


                var decrypted = crypto.privateDecrypt(doctorResp.substring(0, doctorResp.length - 1),Buffer.from(encrypted));

                console.log('-----');
                console.log(decrypted.toString("utf8"));

                // console.log('key' + key.getKeySize());

                // console.log(key.encrypt('abc').toString());

                res.end(JSON.stringify({ encryptedKey: encrypted, fileHash: dataResponse}));


            }
                
                
    });








// API to list hospital doctor count
app.get('/api/hospitaldoctorCount', async function(req, res) {
    console.log('inside get method');
    var hospitalid = req.query.hospitalid;



    res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    

        var hospitalDoctorString = 'http://localhost:3000/api/queries/HospitalDoctorList?id=resource%3Aorg.example.basic.Hospital%23' + hospitalid;
        


        axios.get(hospitalDoctorString).then(function (response){
        console.log(response.data);
        jsonResponse = response.data;
 }).then(function (response){
    res.end(JSON.stringify({ count: jsonResponse.length}));
    }).catch(function (error) {
    console.log(error);
  });


});









// API to get doctor private key after login
app.get('/api/doctorPrivateKey', async function(req, res) {
    console.log('inside get method');
    var doctorid = req.query.doctorid;

    var doctorResponse;

    var doctorUrl = 'http://localhost:3000/api/Doctor/' + doctorid;

    res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    

        axios.get(doctorUrl).then(function (response){
            console.log(response.data);
            doctorResponse = response.data['privateKey'];
    
        }).then(function (response){
            res.end(doctorResponse.substring(0, doctorResponse.length - 1));
            // res.end(JSON.stringify({data : doctorResponse.substring(0, doctorResponse.length - 1)}));
        }).catch(function (error) {
        console.log(error);
      });


});






  let server = app.listen(5001, function() {
      console.log('Server is listening on port 5001')
  });
