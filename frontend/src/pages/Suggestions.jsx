import React from 'react'
import { useState } from 'react';

import Suggestion from './components/Suggestion';

export default function Suggestions({user, client}) {

	const [suggestions, setSuggestions] = useState([]);
	

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
		<>
			<h1>Suggestions</h1>
			{
				suggestions.map(suggestion => (
					<Suggestion client={client} suggestion={suggestion} user={user} key={suggestion.id}/>
				))
			}
		</>
	)
}
