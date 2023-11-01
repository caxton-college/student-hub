import React from 'react'

import { useNavigate } from "react-router-dom";

export default function Logout({ client, setUser }) {
    
    function handleLogout(e) {
		e.preventDefault();
		client.post(
		  	"/api/logout",
		  	{withCredentials: true}
		).then(function(response) {
			setUser({"loggedIn": false});
			
		});
	}
    return (
        <button id="logout-button" className="shadow" onClick={handleLogout}><h2>Logout</h2></button>
    )
}