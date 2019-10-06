import React, { Component } from 'react';
import axios from 'axios';
import sha256 from 'crypto-js/sha256';
import { BrowserRouter as Router, Route, Link, NavLink } from 'react-router-dom';
import { ngrokurl } from './URL.js';
var url = ngrokurl;
url = url + '/api/createRecord';

var headers = {
  'Content-Type': 'application/json',
}
class CreateRecordDoc extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      content: '',
      doctorId: ''
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
    console.log(this.state.username);
    console.log(this.state.content);
    console.log(this.state.doctorId);


    axios.post(url, {
      username: this.state.username,
      content: this.state.content,
      doctorId: this.state.doctorId
    }, { headers: headers })
      .then(response => {
        console.log("loginres");
        response = JSON.parse(JSON.stringify(response));
        var loginres = response.data[0].status;
        console.log(loginres);
        if (loginres == 'ok')
        {
          alert("Created Record!");
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
            <NavLink exact to="/" activeClassName="FormTitle__Link--Active" className="FormTitle__Link">Create Record</NavLink>
            {/* or <NavLink to="/sign-up" activeClassName="FormTitle__Link--Active" className="FormTitle__Link">Sign Up</NavLink> */}
          </div>
          <div className="FormCenter">
            <form onSubmit={this.handleSubmit} className="FormFields" onSubmit={this.handleSubmit}>
              <div className="FormField">
                <label className="FormField__Label" htmlFor="">User Name</label>
                <input type="text" id="" className="FormField__Inputs" placeholder="Enter your Patient ID" name="username" value={this.state.username} onChange={this.handleChange} />
              </div>
              <div className="FormField">
                <label className="FormField__Label" htmlFor="">Last Name</label>
                <input type="text" id="" className="FormField__Inputs" placeholder="Enter your Content" name="content" value={this.state.content} onChange={this.handleChange} />
              </div>
              <div className="FormField">
                <label className="FormField__Label" htmlFor="">Doctor ID</label>
                <input type="text" id="" className="FormField__Inputs" placeholder="Enter your Doctor Id" name="doctorId" value={this.state.doctorId} onChange={this.handleChange} />
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
export default CreateRecordDoc;