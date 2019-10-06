import React, { Component } from 'react';
import axios from 'axios';
import { ngrokurl } from './URL.js';
import Card from 'card-vibes';
import ReactTable from "react-table";
import "react-table/react-table.css";
var url = ngrokurl;

// json - create state - component did mount lifecyclehook- api call inside - get data .then - data to var - json 
export default class Viewlist extends Component {
    constructor() {
        super();
        this.state = {
            data: []
            // Empty initialisation
        }
    }
    componentDidMount() {
        console.log("Component did mount");
        console.log(localStorage.getItem('doctorId'));
        url = ngrokurl + '/api/listdoctorrecords?doctorId=' + localStorage.getItem('doctorId');
        axios.get(url)
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
                    <h3 className="box-title">Record List</h3>
                </Card>
                <ReactTable
                    data={data}
                    columns={[
                        {
                            Header: "Record ID",
                            accessor: "recordId"
                        },
                        {
                            Header: "Patient Details",
                            accessor: "owner"
                        }
                        ,
                        {
                            Header: 'Actions',
                            Cell: row => (
                                < button onClick={() => {
                                    console.log(row.original.recordId);
                                    var patientid = ((row.original.owner).split("#"));
                                    this.props.history.push('/doctor/' + patientid[1] + '/' + localStorage.getItem('doctorId') + '/' + row.original.recordId);
                                }}>View</button>
                            )

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