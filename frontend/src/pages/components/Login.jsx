import React from 'react'

import axios from 'axios'

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';

import { faLock, faEnvelope, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';


export default function Login({ client, checkUser}) {

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

	function handleLogIn(e) {
        e.preventDefault();
        
       
        client.post(
            "/api/login",
            {
                username: email,
                password: password
            }
        ).then(function(response) {
            axios.defaults.headers.common['Authorization'] = `Token ${response.data.token}`;
            localStorage.setItem('token', response.data.token);

            checkUser();

            toast.success('Login Successful!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

        }).catch(function(error) {            
            toast.error("Invalid credentials", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
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
