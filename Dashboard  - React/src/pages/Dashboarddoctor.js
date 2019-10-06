import React, { Component } from 'react'
import Header from '../components/Header';
import SideBar from '../components/Sidebar';
import Content from '../components/Content';
import "../Dash.css";

class Dashboard extends Component {
  render() {
    return (
      <div>
        <Header />
        <SideBar />
        <Content />
      </div>
    );
  }
}

export default Dashboard;