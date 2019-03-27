const express = require('express');
// const axios = require('axios');
const bodyParser = require('body-parser');
const url = require('url');
const querystring = require('querystring');
const Request = require("request");
const IPFS = require('ipfs')


let app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());





app.get('/ipfs',async function(req,res){

console.log('inside ipfs');


var fileHash;

res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");


const node = new IPFS()
node.on('ready', async () => {
    console.log('iniside sample code')

    

    // const version = await node.version()

    
    
    // console.log('Version:', version.version)

    var date = new Date();
    var timeStampString = date.getDate() + '_' + date.getHours() + '_' + date.getMinutes() + '_' + date.getSeconds() + '.txt';
    console.log('trial')
    console.log(timeStampString);
  
    const filesAdded = await node.add({
        path: timeStampString,
      content: Buffer.from('Patient Record' + Date.now().toString())
    })
  
    console.log('Added file:', filesAdded[0].path, filesAdded[0].hash)

    fileHash = filesAdded[0].hash;
    console.log('After getting filehash')
    console.log(fileHash)
    res.send(fileHash);
    try {
        await node.stop()
        console.log('Node stopped!')
      } catch (error) {
        console.error('Node failed to stop cleanly!', error)
      }

  
  })
  

})





let server = app.listen(4000, function() {
    console.log('Server is listening on port 4000')
});