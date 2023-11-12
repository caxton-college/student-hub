import { Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faLightbulb, faNoteSticky, } from '@fortawesome/free-regular-svg-icons'
import { faSquarePollHorizontal } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { useState } from "react";


function Navbar() {
    const [selected, setSelected] = useState(window.location.pathname);

    return (
        <div id="navbar-container">
        <div className="navbar shadow">
            <div className="header-navbar-content">
                <Link to="/announcements" onClick={(e) => setSelected("/announcements")} className={selected === "/announcements" ? "selected-tab" : "nav-link"}>
                    <FontAwesomeIcon icon={faNoteSticky} size="2xl" />
                </Link>
                <Link to="/polls" onClick={(e) => setSelected("/polls")} className={selected === "/polls" ? "selected-tab" : "nav-link"}>
                    <FontAwesomeIcon icon={faSquarePollHorizontal} size="2xl" />
                </Link>
                <Link to="/suggestions" onClick={(e) => setSelected("/suggestions")} className={selected === "/suggestions" ? "selected-tab" : "nav-link"}>
                    <FontAwesomeIcon icon={faLightbulb} size="2xl" />
                </Link>
                <Link to="/" onClick={(e) => setSelected("/profile")} className={selected === "/profile" ? "selected-tab" : "nav-link"}>
                    <FontAwesomeIcon icon={faUser} size="2xl" />
                </Link>
            </div>
            
        </div>
        </div>
        
    )
}

export default Navbar
