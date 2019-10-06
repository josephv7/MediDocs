import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, NavLink } from 'react-router-dom';
// import SignUpForm from './pages/SignUpForm';
import SignInForm from './pages/SignInForm';
import DashboardDoctor from './pages/Dashboarddoctor';
import DashboardPatient from './pages/Dashboardpatient';
import DashboardRegulator from './pages/Dashboardregulator';
import DashboardHospital from './pages/Dashboardhospital';

import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={SignInForm} />
          {/* <Route path="/sign-up" component={SignUpForm}/>    */}
          <Route path="/doctor" component={DashboardDoctor} />
          <Route path="/patient" component={DashboardPatient} />
          <Route path="/regulator" component={DashboardRegulator} />
          <Route path="/hospital" component={DashboardHospital} />
        </div>
      </Router>
    );
  }
}
export default App;
