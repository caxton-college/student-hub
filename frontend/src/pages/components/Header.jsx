import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
    const [isDarkMode, setDarkMode] = useState(false);
    const [theme, setTheme] = useState('light'); 
    const pageName = "Student Hub";

    const toggleDarkMode = () => {
        setDarkMode(!isDarkMode);
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    return (
        <div className="header">
        <div className="header-navbar-content">
            <h3>{pageName}</h3>
            
            <div className="toggle-dark-mode" onClick={toggleDarkMode}>
                <FontAwesomeIcon icon={isDarkMode ? faMoon : faSun} size="xl" />
            </div>
        </div>
        </div>
    );
};

export default Header;
