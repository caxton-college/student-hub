import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export default function DeleteSuggestion({ client, user, id, getSuggestions, order }) {

    function deleteSuggestion() {
        client.post(
            `/api/delete_suggestion`,
        {
            suggestion_id: id
        }).then(function (response) {
            getSuggestions(true);
        })
        
    }

    if (user.role === 3 | user.role === 4) {
        return (
            <div className='delete-suggestion'>
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
