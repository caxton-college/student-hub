import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';

export default function Like({ client, user, likes, liked, id, type, checkUser }) {
    const [csrfToken, setCsrfToken] = useState('');
    const [stateLiked, setLiked] = useState(liked);
    const [stateLikes, setLikes] = useState(likes);
    const [clicked, setClicked] = useState(false);

    useEffect(() => {
        
        // Fetch the CSRF token on component mount
        client.get('/api/get_csrf_token')
            .then(response => {
                setCsrfToken(response.data.csrfToken);
            })
            .catch(error => {
                console.error('Error fetching CSRF token:', error);
            });
    }, []);

    const updateLikes = () => {
        
        client.post(
            `/api/update_${type}_likes`,
            { id : id },
            { headers: { 'X-CSRFToken': csrfToken } }
        ).then(response => {
            setLiked(response.data.liked);
            setLikes(response.data.likes);
            setClicked(true);

            if (type ==="poll") {
                window.location.reload();
            }
            
            if (type === "suggestion"){
                checkUser();
            }
            

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
            <FontAwesomeIcon
                onClick={updateLikes}
                icon={icon}
                className={clicked ? 'beat' : 'like'}
                style={{ color: colour }}
                size='xl'
                key={id}
            />
        </div>
    );
}
