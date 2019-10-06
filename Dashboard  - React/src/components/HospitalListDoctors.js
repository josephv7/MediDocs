import React, { Component } from 'react';
import axios from 'axios';
import { ngrokurl } from './URL.js';
import Card from 'card-vibes';
import ReactTable from "react-table";
import "react-table/react-table.css";
var url = ngrokurl;
// json - create state - component did mount lifecyclehook- api call inside - get data .then - data to var - json 
export default class HospitalListDoctors extends Component {
    constructor() {
        super();
        this.state = {
            data: []
            // Empty initialisation
        }
    }
    componentDidMount() {
        console.log("Component did mount");
        // console.log(localStorage.getItem('doctorId'));
        url = ngrokurl + '/api/hospitalDoctorList';
        axios.get(url, {
            params: {
                hospitalid: localStorage.getItem('hospitalId')
            }
        })
            .then(res => {
                console.log(res);
                this.setState({
                    data: res.data
                });
                // console.log(this.state.data);

            }).catch(function (error) {
                // handle error
                console.log(error);
            });
        // this.getData();
    }
    render() {
        const { data } = this.state;
        console.log(this.state.data);

        return (
            <div>
                <Card style={{ width: '100%', padding: '20px' }}>
                    <h3 className="box-title">Doctor List</h3>
                </Card>

                <ReactTable
                    data={data}

                    columns={[
                        {
                            Header: "Doctor ID",
                            accessor: "doctorId"
                        },
                        {
                            Header: "First Name",
                            accessor: "firstName"
                        },
                        {
                            Header: "Last Name",
                            accessor: "lastName"
                        },
                        {
                            Header: "Hospital ID",
                            accessor: "hospital"
                        }
                    ]
                    }
                    className="-striped -highlight"
                />
                <br />
            </div >
        );
    }
}