import React, {useState} from 'react';
import { ProSidebar, MenuItem, Menu, SidebarHeader, SidebarContent, SidebarFooter } from 'react-pro-sidebar';
import { Switch as SwitchRouter, Route, Link, useRouteMatch } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
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
    const [darkState, setDarkState] = useState<boolean>(false);
    const paletteType = darkState ? 'dark' : 'light';

    // Verifica se existe dark-theme no localStorage, se sim carregar o estado com ele
    React.useEffect(() => {
        const darkLocal = localStorage.getItem('@dark-theme');
        if (darkLocal){
            // setDarkState(Boolean(darkLocal));
            setDarkState(darkLocal === 'true' ? true : false);
            // console.log(darkLocal);
        }
    }, []);

    // Toda vez que o darkState é alterado ele guarda essa mudança do localStorage
    React.useEffect(() => {
        localStorage.setItem('@dark-theme', String(darkState));
    }, [darkState]);

    const darkTheme = createMuiTheme({
        palette: {
            type: paletteType
        }
    });
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

    function handleThemeChange() { 
        setDarkState(!darkState);
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
                    <Menu>
                        <MenuItem icon={<Switch checked={darkState} onChange={handleThemeChange} />} >
                            Tema escuro
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
            
            <ThemeProvider theme={darkTheme}>
                <SwitchRouter>
                    <Route component={UserTable} path={path} exact />
                    <Route component={CouponTable} path={`${path}/tabela-de-cupons`} />
                </SwitchRouter>
            </ThemeProvider>
        </div>
    );
}

export default Dashboard;