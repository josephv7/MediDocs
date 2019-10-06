import React, { Component } from 'react';
import axios from 'axios';
import sha256 from 'crypto-js/sha256';
import { BrowserRouter as Router, Route, Link, NavLink } from 'react-router-dom';
import { ngrokurl } from './URL.js';
var url = ngrokurl;
url = url + '/createHospital';
var headers = {
  'Content-Type': 'application/json',
}
class CreateHospital extends Component {
  constructor() {
    super();
    this.state = {
      hospitalName: '',
      password: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(e) {
    let target = e.target;
    let value = target.type === 'checkbox' ? target.checked : target.value;
    let name = target.name;
    this.setState({
      [name]: value
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    console.log('The form was submitted with the following data:');
    console.log(this.state);
    console.log(this.state.hospitalName);
    console.log(this.state.password);
    axios.get(url, {
      headers: headers, params: {
        hospitalName: this.state.hospitalName,
        password: this.state.password
      }
    })
      .then(response => {
        console.log("loginres");
        console.log(response);
        response = JSON.parse(JSON.stringify(response));
        var loginres = response.data.status;
        console.log(loginres);
        if (loginres == "ok") {
          alert("Hospital Record Created");
        }
      })
      .catch(error => {
        console.log(error);
      })
  }
  render() {
    return (
      <div className="App" >
        <div className="App__Forms">
          <div className="FormTitle">
            <NavLink exact to="/" activeClassName="FormTitle__Link--Active" className="FormTitle__Link">Create Hospital</NavLink>
            {/* or <NavLink to="/sign-up" activeClassName="FormTitle__Link--Active" className="FormTitle__Link">Sign Up</NavLink> */}
          </div>
          <div className="FormCenter">
            <form onSubmit={this.handleSubmit} className="FormFields">
              <div className="FormField">
                <label className="FormField__Label" htmlFor="">Hospital Name</label>
                <input type="text" id="hospitalname" className="FormField__Inputs" placeholder="Enter your Hospital Name" name="hospitalName" value={this.state.hospitalName} onChange={this.handleChange} />
              </div>
              <div className="FormField">
                <label className="FormField__Label" htmlFor="">Password</label>
                <input type="password" id="" className="FormField__Inputs" placeholder="Enter your Hospital Password" name="password" value={this.state.password} onChange={this.handleChange} />
              </div>
              <div className="FormField">
                <button className="FormField__Button mr-20">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
export default CreateHospital;