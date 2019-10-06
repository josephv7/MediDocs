import React from 'react';
import {BrowserRouter, Route, Switch } from 'react-router-dom';
const Router = () => (

<BrowserRouter>
<Switch>
    <Route exact path="/dashboard" component={Dashboard}/>
{/* <Route> */}
    {/* <Route> */}
</Switch>
</BrowserRouter>
);
export default Router;