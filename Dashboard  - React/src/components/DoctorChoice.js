import React, { Component } from 'react';
import Card from 'card-vibes';
import { Link } from 'react-router-dom';


class DoctorChoice extends Component {
      render() {
            return (
                  <div className="App" >
                        <div className="box-header with-border">
                              <Card style={{ width: '100%', padding: '20px' }}>
                                    <h3 className="box-title">Hey, Doctor! Select Your Choice!!</h3>
                              </Card>
                              <Link to="/doctor/create"><button class="FormField__Button mr-20" >Create Record</button></Link>
                              <Link to="/doctor/view"><button class="FormField__Button mr-20" >List Records</button></Link>

                        </div>
                  </div>
            );
      }
}
export default DoctorChoice;