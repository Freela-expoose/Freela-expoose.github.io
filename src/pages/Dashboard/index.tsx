import React, {useState} from 'react';
import { ProSidebar, MenuItem, Menu, SidebarHeader, SidebarContent, SidebarFooter } from 'react-pro-sidebar';
import { Switch, Route, Link, useRouteMatch } from 'react-router-dom';
import { FiUsers, FiMenu, FiTag } from 'react-icons/fi';
import { FaPowerOff } from 'react-icons/fa';


import UserTable from './pages/UserTable';
import CouponTable from './pages/CouponTable';
import 'react-pro-sidebar/dist/css/styles.css';
import './styles.css';


const Dashboard: React.FC = () => {
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const divFooter = document.getElementById('footer');
    const buttonFooter = document.getElementById('footerButton');
    // In the child component, we get the url and path properties from the useRouteMatch hook.
    // We can use the useRouteMatch hook to return the path, and url . The path is for prefix the path prop of Route s, and url is for prefixing the to prop of Links of nested routes.
    const { path, url } = useRouteMatch();
    let copy = '\u00a9';

    if(collapsed && buttonFooter && divFooter){
        divFooter.style.flexDirection="column";
        buttonFooter.style.marginTop="8px";
    }else if(buttonFooter && divFooter) {
        divFooter.style.flexDirection="row";
        buttonFooter.style.marginTop="0";
    }

    return (
        <div id="page-sidebar">
            <ProSidebar collapsed={collapsed} >
                <SidebarHeader>
                    <Menu >
                        <MenuItem icon={<FiMenu size={20} onClick={() => setCollapsed(!collapsed)}/>}>
                            Expose Admin
                        </MenuItem>
                    </Menu>
                </SidebarHeader>

                <SidebarContent>
                    <Menu iconShape="square">
                        <MenuItem icon={<FiUsers />} >
                            Tabela dos usuários
                            <Link to={url}/>
                        </MenuItem>

                        <MenuItem icon={<FiTag />} >
                            Tabela de cupons
                            <Link to={`${url}/tabela-de-cupons`}/>
                        </MenuItem>
                    </Menu>
                </SidebarContent>

                <SidebarFooter >
                    <div id="footer">
                        {copy} Expose 
                        <button id="footerButton">
                            <FaPowerOff />
                        </button>
                    </div>
                </SidebarFooter>
            </ProSidebar>
            
            <Switch>
                <Route component={UserTable} path={path} exact />
                <Route component={CouponTable} path={`${path}/tabela-de-cupons`} />
            </Switch>
        </div>
    );
}

export default Dashboard;