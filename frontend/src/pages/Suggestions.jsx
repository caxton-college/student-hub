import React from 'react'
import { useState, useReducer } from 'react';

import Suggestion from './components/Suggestion';
import CreateSuggestion from './components/CreateSuggestion';
export default function Suggestions({user, client}) {

	const [suggestions, setSuggestions] = useState([]);
	const [, forceRender] = useReducer(x => x + 1, 0);

	function getSuggestions() {
		if (suggestions.length === 0) {
			client.get(
				"api/suggestions"
			).then(function(response) {
				setSuggestions(response.data);
				
			})
		}
	}
	
	
	getSuggestions();
	
	
	return (
		<div className='suggestions'>
			{
				suggestions.map(suggestion => (
					<Suggestion client={client} suggestion={suggestion} user={user} key={suggestion.id}/>
				))
			}
            {
                user.loggedIn ? (
                    <CreateSuggestion client={client} user={user}></CreateSuggestion>
                ) : null
            }
            
		</div>
	)
}
