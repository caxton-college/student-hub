import React from 'react'
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import { toast } from 'react-toastify';

export default function DeleteSuggestion({ client, user, id, getSuggestions, checkUser }) {
    
    const [csrfToken, setCsrfToken] = useState('');

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

    function deleteSuggestion() {
        client.post(
            `/api/delete_suggestion`,
        {
            suggestion_id: id
        },
        { headers: { 'X-CSRFToken': csrfToken } }
        ).then(function (response) {
            getSuggestions(true);

            toast.info('Suggestion deleted.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            checkUser();

        })
        
    }

    if (user.role === 3 | user.role === 4) {
        return (
            <div className='delete'>
                <FontAwesomeIcon 
                onClick={deleteSuggestion}
                icon={faXmark}
                className='close'
                size='xl'
                />
            </div>
            
        )
    }
    
}
