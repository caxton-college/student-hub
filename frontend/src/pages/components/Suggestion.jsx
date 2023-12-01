import React from 'react'

import SuggestionLike from './SuggestionLike'
import Pin from './Pin'
import DeleteSuggestion from './DeleteSuggestion'

export default function Suggestion({client, suggestion, user, checkUser, suggestionsLikeData, setSuggestionsLikeData, getSuggestions, order}) {
    
    return (
        <>
			<div className='suggestion shadow'>

				<div className='suggestion-body'>
					<p>{suggestion.body}</p>
				</div>

                
                <DeleteSuggestion 
                    client={client}
                    user={user} 
                    id={suggestion.id}
                    checkUser={checkUser}
                    getSuggestions={getSuggestions}
                    order={order}
                />
                

				<div className='suggestion-options'>
            
                <Pin 
                    client={client}
                    user={user}
                    pinned={suggestion.pinned}
                    id={suggestion.id}
                    checkUser={checkUser}
                    suggestionsLikeData={suggestionsLikeData}
                    setSuggestionsLikeData={setSuggestionsLikeData}
                />
                


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
