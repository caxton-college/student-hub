import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

const Header = ({ page, theme, setTheme }) => {
    const [isDarkMode, setDarkMode] = useState(false);
    
    const [logo, setLogo] = useState('/logo_black_side2.png');

    const toggleDarkMode = () => {
        setDarkMode(!isDarkMode);
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        setLogo(newTheme === 'light' ? '/logo_black_side2.png' : '/logo_white_side2.png');
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    return (
        <div className='shadow header'>
            <div className="header-content">
                <img src={logo} alt="Logo" height={"100px"} className='logo'/>
                <h3>{page}</h3>
                <div className="toggle-dark-mode" onClick={toggleDarkMode}>
                
                    <FontAwesomeIcon icon={isDarkMode ? faMoon : faSun} size="1x" />
                </div>
            </div>
        </div>
    );
};

export default Header;
