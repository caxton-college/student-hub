import React from 'react'
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import { toast } from 'react-toastify';

export default function DeleteAnnouncement({ client, user, id, getAnnouncements }) {
    
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

    function deleteAnnouncement() {
        client.post(
            `/api/delete_announcement`,
        {
            announcement_id: id
        },
        { headers: { 'X-CSRFToken': csrfToken } }
        ).then(function (response) {
            getAnnouncements(true);
            
            toast.info('Announcement deleted.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

        })
        
    }

    if (user.role === 3 | user.role === 4) {
        return (
            <div className='delete'>
                <FontAwesomeIcon 
                onClick={deleteAnnouncement}
                icon={faXmark}
                className='close'
                size='xl'
                />
            </div>
            
        )
    }
    
}
