import React from 'react'
import { useState } from 'react';

export default function Login({user, setUser, client}) {

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	function handleLogIn(e) {
        e.preventDefault();
        client.post(
            "/api/login",
            {
                email: email,
                password: password
            }
        ).then(function(response) {
            client.get(
				"/api/user"
			).then(function(response) {
				setUser({
					"loggedIn": true,
					"name": response.data.user.name,
					"surname": response.data.user.surname,
					"email": response.data.user.email,
					"role": response.data.user.role,
					"points": response.data.user.points,
				});
			})

        }).catch(function(error) {
            
        });
    }

    return (
        <>
			<form onSubmit={handleLogIn} id='login-form'>
				<h2>Login</h2> 
				<input 
				className='border'
				type="text" 
				id="email"
				placeholder="email"
				autoComplete="off"
				value={email}
				onChange={(e) => {setEmail(e.target.value)}}/>


				<input 
				className='border'
				type="password" 
				id="password"
				placeholder="password"
				autoComplete="none"
				value={password}
				onChange={(e) => {setPassword(e.target.value)}}/>


				<button className='border'><h4>Submit</h4></button>
				
			</form>
		
		
		</>
    )
}
