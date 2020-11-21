import React, {useState, useEffect} from 'react';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import api from './services/api';

const Routes: React.FC = () => {
    const history = useHistory();

    useEffect(() => {
            const currentUser = localStorage.getItem('@currentUser');
            const token = localStorage.getItem('@userToken');
            if(currentUser && token){
                api.defaults.headers.Authorization = `Bearer ${token}`;
                history.push('/dashboard');
            }
    }, []);

    return (
        <BrowserRouter>
            <Switch>
                <Route component={Login} path="/" exact />
                <Route component={Dashboard} path="/dashboard"  />
            </Switch>
        </BrowserRouter>
    );
}

export default Routes;