import React, { useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

import { toast } from 'react-toastify';

export default function CreateSuggestion({ client, user, getSuggestions, order, checkUser }) {
    
    const [body, setBody] = useState('');
    const [showPrompt, setShowPrompt] = useState(false);
    

    const handleSuggestionCreation = (e) => {
        e.preventDefault();
        const id = toast.loading("Creating suggestion");
        client.post(
            '/api/create_suggestion',
            { body: body },
            {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            }).then(response => {
            setShowPrompt(false);
            // getSuggestions(true, order);
            setBody("");
            checkUser();
            toast.update(id, {
                render: 'Suggestion pending review',
                type: "success",
                position: "top-right",
                autoClose: 1500,
                isLoading: false,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });


            
        }).catch(error => {
            
            toast.update(id, {
                render: error.response.data.message,
                type: "error",
                position: "top-right",
                autoClose: 1500,
                isLoading: false,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        });
    };

    if (user.loggedIn && user.role != 5) {
        return (
            <>
                <div className={showPrompt ? 'close create-toggle' : 'open create-toggle'}>
                    <FontAwesomeIcon
                        icon={showPrompt ? faCircleXmark : faCirclePlus}
                        size='2xl'
                        onClick={() => setShowPrompt(!showPrompt)}
                    />
                    
                </div>
                {showPrompt ? (
                    <div className='shadow create-prompt'>
                        <form id='create-suggestion-form' onSubmit={handleSuggestionCreation}>
                            <textarea 
                            name="body" 
                            value={body} 
                            onInput={(e) => setBody(e.target.value)} 
                            rows="6" 
                            className="input-text" 
                            id="body" required 
                            autoComplete="off"
                            placeholder='Share your brilliant idea...'></textarea>
                            <label htmlFor="body"><span></span></label>
                            <input type="submit" value="Collaborate!"/>
                        </form>
                    </div>
                ) : null}
            </>
        );
    }
    
}
