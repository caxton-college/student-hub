import React, { useState } from 'react'

import SuggestionLike from './SuggestionLike'
import Pin from './Pin'

export default function Suggestion({client, suggestion, user, checkUser}) {
    

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
                    id={suggestion.id}>
                    </Pin>
                    <SuggestionLike 
                    client={client} 
                    user={user} 
                    likes={suggestion.likes} 
                    liked={suggestion.liked} 
                    id={suggestion.id}
                    checkUser={checkUser}
                    />
                    	
				</div>
			</div>
		</>
    )
}
