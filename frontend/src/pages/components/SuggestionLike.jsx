import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
export default function SuggestionLike({ 
    client, 
    user, 
    id, 
    checkUser,
    suggestionsLikeData, 
    setSuggestionsLikeData 
}) {
    
    const [stateLiked, setLiked] = useState(suggestionsLikeData[id].liked);
    const [stateLikes, setLikes] = useState(suggestionsLikeData[id].likes);
    const [clicked, setClicked] = useState(false);



    const updateLikes = () => {
        
        client.post(
            `/api/update_suggestion_likes`,
            { id : id },
            
        ).then(response => {
            setLiked(response.data.liked);
            setLikes(response.data.likes);
            let newSuggestionsLikeData = suggestionsLikeData;
            newSuggestionsLikeData[id] = response.data;
            setSuggestionsLikeData(newSuggestionsLikeData);
            setClicked(true);
            checkUser();
            
            toast.info('Like updated', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                });

            // Remove the beat animation after 500ms
            setTimeout(() => {
                setClicked(false);
            }, 500);

        }).catch(error => {
            toast.error(error.response.data.message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
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
