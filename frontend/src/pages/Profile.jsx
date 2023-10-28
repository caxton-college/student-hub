import React from 'react'
import { useState } from 'react'
import Login from './components/Login'
import Logout from './components/Logout'
import axios  from 'axios'


export default function Profile({user, setUser, client}) {
    const [suggestion, setSuggestion] = useState("test");

    function handleSuggestionCreation(e) {
        e.preventDefault();
        client.get(
            "api/get_csrf_token"
        ).then(function(response) {
            client.post(
                "api/create_suggestion",
                {body: suggestion},
                {
                    headers: {
                        "X-CSRFToken": response.data.csrfToken,
                    }
                },
            ).then(function(response) {
               
            })
        })
		
    }
    return (
        <>
            {
                user.loggedIn  ? (
                    <>
                        <h1>{`Welcome ${user.name} ${user.surname}`}</h1>
                        <Logout setUser={setUser} client={client}/>
                    </>
                    
                    
                ) : (
                    <Login user={user} setUser={setUser} client={client}/>
                )
            }
            
            <form onSubmit={handleSuggestionCreation}>
                <input type="text" 
                value={suggestion} 
                id="body" name="body" 
                placeholder="Enter suggestion"
                onChange={(e) => {setSuggestion(e.target.value)}}/>

                <button type='Submit'>Submit</button>
            </form>

        </>
        
    )
}
