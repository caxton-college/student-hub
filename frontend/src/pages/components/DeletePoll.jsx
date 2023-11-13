import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import { toast } from 'react-toastify';

export default function DeletePoll({ client, user, id, getPolls }) {
    console.log(id)
    function deletePoll() {
        client.post(
            `/api/delete_poll`,
        {
            poll_id: id
        }
        ).then(function (response) {
            getPolls(true);
            
            toast.success('Poll deleted.', {
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
                onClick={deletePoll}
                icon={faXmark}
                className='close'
                size='xl'
                />
            </div>
            
        )
    }
    
}
