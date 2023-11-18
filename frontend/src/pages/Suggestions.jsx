import React from 'react'
import { useState, useReducer } from 'react';

import Suggestion from './components/Suggestion';
import CreateSuggestion from './components/CreateSuggestion';
import SuggestionFilter from './components/SuggestionFilter';
import Header from "./components/Header";

export default function Suggestions({
    user, 
    client, 
    checkUser,
    which, 
    suggestions,
    getSuggestions,
    suggestionsLikeData,
    setSuggestionsLikeData,
    theme,
    setTheme

}) {

    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const [order, setOrder] = useState(which);

    function handleSetOrder(newOrder){
        setOrder(newOrder);
        getSuggestions(true, newOrder);
        
    }
	
	
	return (
        <>
            <Header 
            page={"Suggestions"}
            theme={theme}
            setTheme={setTheme}/>
            <div className='content'>
            
                <SuggestionFilter order={order} handleSetOrder={handleSetOrder}></SuggestionFilter>

                {
                    suggestions.map(suggestion => (
                        <Suggestion 
                        client={client} 
                        suggestion={suggestion} 
                        user={user} 
                        key={suggestion.id} 
                        checkUser={checkUser}
                        suggestionsLikeData={suggestionsLikeData}
                        setSuggestionsLikeData={setSuggestionsLikeData}
                        getSuggestions={getSuggestions}
                        order={order}/>
                    ))
                }
                
                
                <CreateSuggestion 
                client={client} 
                user={user} 
                getSuggestions={getSuggestions}
                forceUpdate={forceUpdate}
                checkUser={checkUser}
                order={order}>
                </CreateSuggestion>
                
                
                
            </div>
        </>
		
	)
}
