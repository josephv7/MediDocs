import React, { Component } from 'react';
import axios from 'axios';
import CryptoJSAES from "crypto-js/aes";
import CryptoJS from "crypto-js"
import { ngrokurl } from './URL.js';
import Card from 'card-vibes';
var url = ngrokurl;

// import JSEncrypt from 'node-jsencrypt';
export default class Detail extends Component {
    constructor() {
        super();
        this.state = {
            data: []
            // Empty initialisation
        }
    }
    componentDidMount() {
        console.log("Details Component did mount");
        console.log("Params is " + this.props.match.params.id);
        console.log(window.location.href);
        var urlsplit = window.location.href.split("/");
        console.log(urlsplit[urlsplit.length - 2]);

        url = ngrokurl + '/api/encryptionkey?patientid=' + urlsplit[urlsplit.length - 3] + '&recordid=' + urlsplit[urlsplit.length - 1] + '&doctorid=' + urlsplit[urlsplit.length - 2];
        console.log(url);
        axios.get(url)
            .then(res => {
                console.log(res);
                this.setState({
                    data: res.data
                });
                console.log(this.state.data);
                console.log(localStorage.getItem('hash'));
                // var decrypt = new JSEncrypt();
                // console.log(decrypt);
                // decrypt.setPrivateKey(localStorage.getItem('hash'));
                // var uncrypted = decrypt.decrypt(this.state.data.encryptedKey);
                // console.log("uncrypted");
                // console.log(uncrypted);


                //IPFS Fetching

                console.log(this.state.data.aesKey);
                console.log(this.state.data.fileHash);
                var ipfsurl = 'https://ipfs.io/ipfs/' + this.state.data.fileHash;
                axios.get(ipfsurl)
                    .then(res => {
                        console.log("Fetching File Content");
                        console.log(res.data);

                        //Decryption
                        var resdata = res.data;
                        var decrypted = CryptoJSAES.decrypt(resdata.toString(), this.state.data.aesKey);
                        console.log(CryptoJS);
                        //Read Record
                        console.log(decrypted.toString(CryptoJS.enc.Utf8));
                        var stored= decrypted.toString(CryptoJS.enc.Utf8);
                        
                        // localStorage.setItem('RecordDataStore', stored);

                        var div = document.getElementById('RecordData');
                        div.innerHTML += stored;

                        // localStorage.removeItem('RecordDataStore');          
                        // localStorage.setItem('RecordDataStore', "Test Record");                        
                        // var div = document.getElementById('RecordData');
                        // div.innerHTML += "localStorage.getItem('RecordDataStore')";
                        // console.log("Data added to local storage");

                    }).catch(function (error) {
                        // handle error
                        console.log(error);
                    })
            })
            // const appendData = () => { 
            // console.log("appendData function");
            // var div = document.getElementById('RecordData');
            // div.innerHTML += "localStorage.getItem('RecordDataStore')";
            // };
            // appendData();
    }

    render() {
        const { data } = this.state;
        return (
            <div>
                <strong>PatientId : {this.props.match.params.patientid} </strong>
                <strong>DoctorId : {this.props.match.params.doctorid}   </strong>
                <strong>RecordId : {this.props.match.params.recordid}  </strong>
                <Card style={{ width: '100%', padding: '20px' }}>
                                    <div id="RecordData" className="box-title"></div>
                </Card>
            </div >
        );
        
    }
}