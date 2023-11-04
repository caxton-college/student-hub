import React from 'react'
import { useState, useReducer } from 'react';

import Suggestion from './components/Suggestion';
import CreateSuggestion from './components/CreateSuggestion';
import SuggestionFilter from './components/SuggestionFilter';
import Header from "./components/Header";

export default function Suggestions({user, client, checkUser, which, suggestions, getSuggestions}) {

	
    const [order, setOrder] = useState(which);

    function handleSetOrder(newOrder){
        setOrder(newOrder);
        getSuggestions(true, newOrder);
        
    }

	
	
	
	getSuggestions();
	
	
	return (
        
		<div className='content'>
            <Header page={"Suggestions"}/>
            <SuggestionFilter order={order} handleSetOrder={handleSetOrder}></SuggestionFilter>

			{
				suggestions.map(suggestion => (
					<Suggestion client={client} suggestion={suggestion} user={user} key={suggestion.id} checkUser={checkUser}/>
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
