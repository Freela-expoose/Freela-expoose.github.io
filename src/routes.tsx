import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

const Routes: React.FC = () => {

    return (
        <BrowserRouter>
            <Route component={Login} path="/" exact />
            <Route component={Dashboard} path="/dashboard" />
        </BrowserRouter>
    );
}

export default Routes;