import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-regular-svg-icons'
import { faHeart as solidHeart  } from '@fortawesome/free-solid-svg-icons'


export default function Like({client, user, likes, liked, id}) {

	function updateLikes() {
		client.post(
			"/api/update_suggestion_likes",
			{
				suggestion_id: id,
			},
			{withCredentials: true},
		).then(function(response) {
			console.log(response);
			
			
		}
		)
	}
    return (
		<>
		{
			liked ? (
				<>
					<div className='suggestion-likes'>
						<h5>{likes}</h5> 

						<button onClick={updateLikes}><FontAwesomeIcon icon={solidHeart} style={{color: "red"}} size="2xl"/></button>
					</div>
					
				</>
				
			) : (
				<>
					<div className='suggestion-likes'>
						<h5>{likes}</h5>

						{
							user.loggedIn ? (
								<button onClick={updateLikes}><FontAwesomeIcon icon={faHeart} style={{color: "black"}} size="2xl"/></button>
							) : (
								<FontAwesomeIcon icon={faHeart} style={{color: "black"}} size="2xl"/>
							)
						}
						
					</div>
				</>
				
			)
		}
		
		</>
        
    )
}
