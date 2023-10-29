import React, { useState } from 'react'

import Like from './Like'
import Pin from './Pin'

export default function Suggestion({client, suggestion, user}) {
    

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
                    <Like 
                    client={client} 
                    user={user} 
                    likes={suggestion.likes} 
                    liked={suggestion.liked} 
                    id={suggestion.id}
                    />
                    	
				</div>
			</div>
		</>
    )
}
