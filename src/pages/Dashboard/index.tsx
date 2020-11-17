import React from 'react';
import { ProSidebar, MenuItem, Menu, SubMenu } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import './styles.css';

const Dashboard: React.FC = () => {

    return (
        <>
            <ProSidebar >
                <Menu iconShape="square">
                    <MenuItem >Dashboard</MenuItem>
                    <SubMenu title="Components">
                        <MenuItem>Component 1</MenuItem>
                        <MenuItem>Component 2</MenuItem>
                    </SubMenu>
                </Menu>
            </ProSidebar>
            <div id="content">
                

            </div>
        </>
    );
}

export default Dashboard;