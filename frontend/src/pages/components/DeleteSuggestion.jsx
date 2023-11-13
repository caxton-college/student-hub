import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import { toast } from 'react-toastify';

export default function DeleteSuggestion({ client, user, id, getSuggestions, order }) {

    function deleteSuggestion() {
        client.post(
            `/api/delete_suggestion`,
        {
            suggestion_id: id
        }
        ).then(function (response) {
            getSuggestions(true);

            toast.success('Suggestion deleted.', {
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
                onClick={deleteSuggestion}
                icon={faXmark}
                className='close'
                size='xl'
                />
            </div>
            
        )
    }
    
}