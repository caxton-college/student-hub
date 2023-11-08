import React, { useState } from 'react'

import SuggestionLike from './SuggestionLike'
import Pin from './Pin'

export default function Suggestion({client, suggestion, user, checkUser, suggestionsLikeData, setSuggestionsLikeData}) {
    
    

    return (
        <>
			<div className='suggestion shadow'>
				<div className='suggestion-body'>
					<p>{suggestion.body}</p>
				</div>
				

				<div className='suggestion-options'>
                    <Pin 
                    client={client}
                    user={user}
                    pinned={suggestion.pinned}
                    id={suggestion.id}
                    suggestionsLikeData={suggestionsLikeData}
                    setSuggestionsLikeData={setSuggestionsLikeData}>
                    </Pin>
                    <SuggestionLike 
                    client={client} 
                    user={user}
                    id={suggestion.id}
                    checkUser={checkUser}
                    suggestionsLikeData={suggestionsLikeData}
                    setSuggestionsLikeData={setSuggestionsLikeData}
                    />
                    	
				</div>
			</div>
		</>
    )
}
