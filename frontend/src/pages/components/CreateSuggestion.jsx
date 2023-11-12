import React, { useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

import { toast } from 'react-toastify';

export default function CreateSuggestion({ client, user, getSuggestions, order }) {
    
    const [body, setBody] = useState('');
    const [showPrompt, setShowPrompt] = useState(false);
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



    const handleSuggestionCreation = (e) => {
        // Post request using the fetched CSRF token
        e.preventDefault();
        client.post(
            '/api/create_suggestion',
            { body: body },
            { headers: { 'X-CSRFToken': csrfToken } }
           
        ).then(response => {
            setShowPrompt(false);
            getSuggestions(true, order);
            setBody("");

            toast.success('Suggestion Created!', {
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
            console.error('Error creating suggestion:', error);
            toast.error('Something went wrong...', {
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

    if (user.loggedIn) {
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
                            <label htmlFor="body"><span>Suggestion</span></label>
                            <input type="submit" value="Collaborate!"/>
                        </form>
                    </div>
                ) : null}
            </>
        );
    }
    
}
