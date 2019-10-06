import React, { Component } from 'react';
import Card from 'card-vibes';
import { Link } from 'react-router-dom';


class RegulatorChoice extends Component {
      render() {
            return (
                  <div className="App" >
                        <div className="box-header with-border">
                              <Card style={{ width: '100%', padding: '20px' }}>
                                    <h3 className="box-title">Hey, Regulator! Select Your Choice!!</h3>
                              </Card>
                              <Link to="/regulator/view"><button class="FormField__Button mr-20" >View Lists</button></Link>
                              <Link to="/regulator/create/doctor"><button class="FormField__Button mr-20" >Create Doctor</button></Link>
                              <Link to="/regulator/create/hospital"><button class="FormField__Button mr-20" >Create Hospital</button></Link>
                        </div>
                  </div>
            );
      }
}
export default RegulatorChoice;