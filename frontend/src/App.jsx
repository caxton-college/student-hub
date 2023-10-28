import React from 'react';
import { Route, Routes } from 'react-router-dom'
import { useState, useEffect } from 'react';
import axios from "axios";

import Navbar from './pages/components/Navbar';
import Profile from './pages/Profile';
import Suggestions from './pages/Suggestions';


axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

const client = axios.create({
	baseURL: "http://192.168.1.64:8000" 
})

//192.168.1.64

let checkedUser = false;

function App() {
	const [user, setUser] = useState({
        "loggedIn": false,
        "name": "",
        "surname": "",
        "email": "",
        "role": 0,
        "points": 0,

    });
	
    function checkUser() {
        if (!checkedUser) {
            client.get(
                "/api/get_csrf_token"
            ).then(function(response) {
                client.get(
                    "/api/user",
                    {
                        headers: {
                            "X-CSRFToken": response.data.csrfToken,
                        }
                        
                    },
                    {withCredentials: true},
                ).then(function(response) {
                    setUser({
                        "loggedIn": true,
                        "name": response.data.user.name,
                        "surname": response.data.user.surname,
                        "email": response.data.user.email,
                        "role": response.data.user.role,
                        "points": response.data.user.points,
                    });
                    checkedUser = true;
                }).catch(function(error) {
                    checkedUser = true;
    
                })

            })
            
        }
        
    }

    checkUser();

	return (
		<>
			<Navbar/>
			<Routes>
				<Route path='/' element={<Profile user={user} setUser={setUser} client={client}/>}/>
                <Route path='/suggestions' element={<Suggestions user={user} client={client}/>}/>
                
			</Routes>
            
		</>
  	)
}

export default App