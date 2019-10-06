import React, { Component } from 'react';
import Card from 'card-vibes';
import { Link } from 'react-router-dom';


class HospitalChoice extends Component {
      render() {
            return (
                  <div className="App" >
                        <div className="box-header with-border">
                              <Card style={{ width: '100%', padding: '20px' }}>
                                    <h3 className="box-title">Hey, Hospital ! Select Your Choice!!</h3>
                                    <br />
                              </Card>
                               <Link to="/hospital/create/patient"><button class="FormField__Button mr-20" >Create Patient</button></Link>
                               <Link to="/hospital/create/doctor"><button class="FormField__Button mr-20" >Create Doctor</button></Link>
                               <Link to="/hospital/view/doctor"><button class="FormField__Button mr-20" >List Doctor</button></Link>

                        </div>
                  </div>
            );
      }
}
export default HospitalChoice;