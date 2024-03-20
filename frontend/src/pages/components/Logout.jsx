import React from 'react'

import { toast } from 'react-toastify';

export default function Logout({ client, setUser }) {
    
    function handleLogout(e) {
		e.preventDefault();
		client.post(
		  	"/api/logout",
              {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            }
		).then(function(response) {

			setUser({"loggedIn": false});

			toast.info('Logged out', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                });
		});
	}
    return (
        <button id="logout-button" className="shadow" onClick={handleLogout}>
            <h2>Logout</h2>
        </button>
    )
}