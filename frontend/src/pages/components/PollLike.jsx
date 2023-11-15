import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';

import { toast } from 'react-toastify';

export default function PollLike({ 
    client, 
    user, 
    id, 
    optionsLikeData, 
    setOptionsLikeData, 
    index,
    pollsOptionsLikeData,
    setPollsOptionsLikeData,
    checkUser }) {
    
    const [csrfToken, setCsrfToken] = useState('');
    const [stateLiked, setLiked] = useState();
    const [stateLikes, setLikes] = useState();
    const [clicked, setClicked] = useState(false);

    useEffect(() => {
        
        setLiked(optionsLikeData[id].liked)
        setLikes(optionsLikeData[id].likes)

        // Fetch the CSRF token on component mount
        client.get('/api/get_csrf_token')
        .then(response => {
            setCsrfToken(response.data.csrfToken);
        })
        .catch(error => {
            console.error('Error fetching CSRF token:', error);
        });
        
	}, [optionsLikeData]);



    const updateLikes = () => {
        
        client.post(
            `/api/update_poll_likes`,
            { id : id },
            { headers: { 'X-CSRFToken': csrfToken } }
            
        ).then(response => {
            let newPollsOptionsLikeData = pollsOptionsLikeData;
            
            newPollsOptionsLikeData[index] = response.data;
           
            setPollsOptionsLikeData(newPollsOptionsLikeData)

            setOptionsLikeData(response.data);
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

    function mustLogIn() {
        toast.warning("Must be logged in to do that!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }

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
                        onClick={mustLogIn}
                        style={{ color: "#B13F3E" }}
                        size='xl'/>
                )
            }
            
        </div>
    );
}
