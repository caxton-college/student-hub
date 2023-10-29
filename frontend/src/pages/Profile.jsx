import React from 'react'
import { useState, useReducer } from 'react'
import Login from './components/Login'
import Logout from './components/Logout'
import axios  from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins } from '@fortawesome/free-solid-svg-icons'
import Suggestion from './components/Suggestion';
import CreateSuggestion from './components/CreateSuggestion';
export default function Profile({user, setUser, client}) {
    const [suggestions, setSuggestions] = useState([]);
	const [, forceRender] = useReducer(x => x + 1, 0);

	function getSuggestions() {
		if (suggestions.length === 0) {
			client.get(
				"api/user_suggestions"
			).then(function(response) {
				setSuggestions(response.data);
				
			})
		}
	}
	
	
	getSuggestions();
    return (
        <div id='profile-page'>
            {
                user.loggedIn  ? (
                    <>
                        <div id='profile-header'>
                            <h4>{`${user.name} ${user.surname}`}</h4>
                            <div id='points'>{user.points}<FontAwesomeIcon icon={faCoins} /></div>
                        </div>
                        
                        <div></div>
                        
                        <Logout setUser={setUser} client={client}/>
                    </>
                    
                    
                ) : (
                    <Login user={user} setUser={setUser} client={client}/>
                )
            }
            
            

        </div>
        
    )
}
