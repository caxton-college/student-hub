import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';

export default function PollLike({ client, user, id, optionsLikeData, setOptionsLikeData }) {
    

    const [stateLiked, setLiked] = useState();
    const [stateLikes, setLikes] = useState();
    const [clicked, setClicked] = useState(false);

    useEffect(() => {
        
        setLiked(optionsLikeData[id].liked)
        setLikes(optionsLikeData[id].likes)
        
	}, [optionsLikeData]);



    const updateLikes = () => {
        
        client.post(
            `/api/update_poll_likes`,
            { id : id },
            
        ).then(response => {
            setOptionsLikeData(response.data)
            setClicked(true);
            
            

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
