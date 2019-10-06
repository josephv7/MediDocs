import React, { Component } from 'react';
import axios from 'axios';
import Card from 'card-vibes';

import { ngrokurl } from './URL.js';
// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";
var url = ngrokurl;

// json - create state - component did mount lifecyclehook- api call inside - get data .then - data to var - json 
export default class ListHospitals extends Component {
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
        url = url + '/api/listHospitals';
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
            <div >
                <Card style={{ width: '100%', padding: '20px' }}>
                    <h3 className="box-title">Hospital List</h3>
                </Card>

                <ReactTable
                    data={data}

                    columns={[
                        {
                            Header: "Hospital ID",
                            accessor: "hospitalId"
                        },
                        {
                            Header: "Hospital Name",
                            accessor: "hospitalName"
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