import React from 'react';
import { Menu, Dropdown, Icon } from 'semantic-ui-react';
import { useLocation, Link } from 'react-router-dom';
import '../styles/NavBar.css';


const NavBar = () => {
    const location = useLocation();
    const activePage = location.pathname.substring(1); 

    // Create a mapping from pathnames to display names
    const pageNames = {
        '': ' ',
        'location-data-manager': 'Location Data Manager',
        'microscopy-data-manager': 'Microscopy Manager',
        // other mappings here
    };

    // Get the display name for the current pathname
    const displayName = pageNames[activePage];

    return (
        <Menu fixed="top" inverted className="navbar">
            <Menu.Item header>
                MycoDataLab
            </Menu.Item>

            <Menu.Item>
                {displayName}
            </Menu.Item>

            <Menu.Menu position="right">
                <Menu.Item as={Link} to="/">
                    Home
                </Menu.Item>
                {/* Dropdown menu item */}
                <Dropdown item text="More">
                    <Dropdown.Menu>
                        <Dropdown.Item as={Link} to="/backup">
                            Backup data
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} to="/account">
                            Account settings
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} to="/logout">
                            <Icon name="sign out" />Logout
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} to="/about">
                            <Icon name="info circle" /> About
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} to="/help">
                            <Icon name="help circle" /> Help
                        </Dropdown.Item>
                        {/* more dropdown items here */}
                    </Dropdown.Menu>
                </Dropdown>
            </Menu.Menu>
        </Menu>
    );
};

export default NavBar;