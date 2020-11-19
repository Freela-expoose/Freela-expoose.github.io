import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

const Routes: React.FC = () => {

    return (
        <BrowserRouter>
            <Switch>
                <Route component={Login} path="/" exact />
                <Route component={Dashboard} path="/dashboard" />
            </Switch>
        </BrowserRouter>
    );
}

export default Routes;