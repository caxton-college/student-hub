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


function App() {
	const [user, setUser] = useState({
        "loggedIn": false,
        "name": "",
        "surname": "",
        "email": "",
        "role": 0,
        "points": 0,

    });
	
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