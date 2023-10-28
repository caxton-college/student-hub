import React, { useState } from 'react'

import Like from './Like'

export default function Suggestion({client, suggestion, user}) {
    

    return (
        <>
			<div>
				<div className='suggestion-body'>
					<h3>{suggestion.owner}</h3>
					<p>{suggestion.body}</p>
				</div>
				

				<div className='suggestion-options'>
					{
						<Like 
                        client={client} 
                        user={user} 
                        likes={suggestion.likes} 
                        liked={suggestion.liked} 
                        id={suggestion.id}
                        />
					}	
					
				</div>
			</div>
		</>
    )
}
