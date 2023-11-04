import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';

export default function SuggestionLike({ client, user, likes, liked, id, checkUser }) {
    
    const [stateLiked, setLiked] = useState(liked);
    const [stateLikes, setLikes] = useState(likes);
    const [clicked, setClicked] = useState(false);



    const updateLikes = () => {
        
        client.post(
            `/api/update_suggestion_likes`,
            { id : id },
            
        ).then(response => {
            setLiked(response.data.liked);
            setLikes(response.data.likes);
            setClicked(true);
            checkUser();
            

            // Remove the beat animation after 500ms
            setTimeout(() => {
                setClicked(false);
            }, 500);
        }).catch(error => {
            // Handle errors if the request fails
            console.error('Error updating likes:', error);
        });
    };

    const icon = stateLiked ? solidHeart : faHeart;
    const colour = stateLiked ? "#B13F3E" : "#cbcbe2";

    return (
        <div className='likes'>

            <h5>{stateLikes}</h5>
            {
                user.loggedIn ? (
                    <FontAwesomeIcon
                    onClick={updateLikes}
                    icon={icon}
                    className={clicked ? 'beat' : 'like'}
                    style={{ color: colour }}
                    size='xl'/>
                ) : (
                    <FontAwesomeIcon
                        icon={solidHeart}
                        className={"like"}
                        style={{ color: "#B13F3E" }}
                        size='xl'/>
                )
            }
            
        </div>
    );
}
