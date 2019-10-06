import React, { Component } from 'react';
import Viewlist from '../components/ViewList';
import ListDoctors from '../components/ListDoctors';
import ListHospitals from '../components/ListHospitals';
import DoctorChoice from '../components/DoctorChoice';
import ViewList from '../components/ViewList';
import Detail from '../components/Detail';
import CreateRecordDoc from '../components/CreateRecordDoc';
import CreateDoctor from './CreateDoctor';
import CreateHospital from './CreateHospital';
import { BrowserRouter as Router, Route, Link, NavLink } from 'react-router-dom';
import CreatePatient from '../components/CreatePatient';
import RegulatorChoice from '../components/RegulatorChoice';
import HospitalChoice from '../components/HospitalChoice';
import HospitalListDoctors from '../components/HospitalListDoctors';

export default class Content extends Component {
    render() {
        return (
            <div className="content-wrapper">
                <section className="content-header">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="box">
                                <div className="box-header with-border">
                                    {/* <h3 className="box-title">Hey, Doctor!!</h3> */}
                                </div>
                                <div className="box-body">
                                    <div className="row">
                                        <div className="col-md-8">
                                            <p className="text-center">
                                                {/* <strong>Doctor Data !!</strong> */}
                                                <Route exact path="/doctor" component={DoctorChoice} />
                                                <Route exact path="/doctor/view" component={ViewList} />

                                                <Route path="/doctor/:patientid/:doctorid/:recordid" component={Detail} />
                                                <Route path="/doctor/create" component={CreateRecordDoc} />

                                                <Route exact path="/regulator/view" component={ListDoctors} />
                                                <Route exact path="/regulator/view" component={ListHospitals} />
                                                <Route exact path="/regulator" component={RegulatorChoice} />
                                                <Route exact path="/regulator/create/doctor" component={CreateDoctor} />
                                                <Route exact path="/regulator/create/hospital" component={CreateHospital} />
                                                <Route exact path="/hospital" component={HospitalChoice} />
                                                <Route exact path="/hospital/create" component={HospitalChoice} />

                                                <Route exact path="/hospital/create/patient" component={CreatePatient} />
                                                <Route exact path="/hospital/create/doctor" component={CreateDoctor} />
                                                <Route exact path="/hospital/view/doctor" component={HospitalListDoctors} />
                                            </p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}