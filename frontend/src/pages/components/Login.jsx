import React from 'react'
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faLock, faEnvelope, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';


export default function Login({user, setUser, client, checkUser}) {

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

	function handleLogIn(e) {
        e.preventDefault();
        client.get(
            "/api/get_csrf_token"
        ).then(function(response) {
            client.post(
                "/api/login",
                {
                    email: email,
                    password: password
                },
                {
                    headers: {
                        "X-CSRFToken": response.data.csrfToken,
                    }
                },
            ).then(function(response) {
                checkUser();
    
            }).catch(function(error) {
                
            });
        })
        
    }

    return (
        <>
			<form onSubmit={handleLogIn} id='login-form'>
                
                <div className='shadow login-field-container'>
                    <label htmlFor="email"><FontAwesomeIcon icon={faEnvelope}></FontAwesomeIcon></label>
                    <input 
                    type="text" 
                    id="email"
                    className='login-field'
                    placeholder="email"
                    autoComplete="off"
                    value={email}
                    onChange={(e) => {setEmail(e.target.value)}}/>
                </div>
                
                <div className='shadow login-field-container'>
                    <label htmlFor="password"><FontAwesomeIcon icon={faLock}></FontAwesomeIcon></label>
                    <input 
                    type={showPassword ? "text" : "password"} 
                    id="password"
                    className='login-field'
                    placeholder="password"
                    autoComplete="none"
                    value={password}
                    onChange={(e) => {setPassword(e.target.value)}}/>
                    <FontAwesomeIcon onClick={(e) => setShowPassword(!showPassword)} icon={showPassword ? faEyeSlash : faEye}></FontAwesomeIcon>

                </div>
               


				<button type="submit" className='submit shadow'><h2>Login</h2></button>
				
			</form>
		
		
		</>
    )
}
