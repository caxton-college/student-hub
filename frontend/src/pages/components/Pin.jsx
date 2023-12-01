import React from 'react';
import { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbtack } from '@fortawesome/free-solid-svg-icons';

import { toast } from 'react-toastify';

export default function Pin({ 
    client, 
    user, 
    id,
    checkUser,
    suggestionsLikeData, 
    setSuggestionsLikeData
}) {
    
    const [statePinned, setPinned] = useState(suggestionsLikeData[id].pinned);
   
    const updatePin = () => {
        // Post request using the fetched CSRF token
        client.post(
            '/api/update_suggestion_pin',
            { suggestion_id: id }
            
        ).then(response => {
            setPinned(response.data.pinned);
            
            let newSuggestionsLikeData = suggestionsLikeData;
            newSuggestionsLikeData[id].pinned = response.data.pinned;
            setSuggestionsLikeData(newSuggestionsLikeData);
            checkUser();
            toast.info('Pin updated', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            

        }).catch(error => {
            toast.error('Something went wrong', {
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

    const pinClass = statePinned ? 'pinned' : 'unpinned';

    const handleClick = (event) => {
        setPinned(!statePinned);
        const icon = event.target;
        icon.classList.add('bounce');
        setTimeout(() => {
            icon.classList.remove('bounce');
        }, 500);
        updatePin();
    };

    if (user.role === 3 | user.role === 4) {
        return (
            <FontAwesomeIcon
                onClick={handleClick}
                icon={faThumbtack}
                className={pinClass}
                size="xl"
            />
        );
    } else if (pinClass === "pinned") {
        return (
            <FontAwesomeIcon
                icon={faThumbtack}
                className={pinClass}
                size="xl"
            />
        );
    }
    
}
