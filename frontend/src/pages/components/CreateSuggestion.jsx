import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

export default function CreateSuggestion({ client, user }) {
    const [csrfToken, setCsrfToken] = useState('');
    const [body, setBody] = useState('');
    const [showPrompt, setShowPrompt] = useState(false);

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
            window.location.reload();
        }).catch(error => {
            console.error('Error creating suggestion:', error);
        });
    };

    return (
        <>
            <div id='create-suggestion-toggle' className={showPrompt ? 'close' : 'open'}>
                <FontAwesomeIcon
                    icon={showPrompt ? faCircleXmark : faCirclePlus}
                    size='2xl'
                    onClick={() => setShowPrompt(!showPrompt)}
                />
                
            </div>
            {showPrompt ? (
                <div id='create-suggestion-prompt' className='shadow'>
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
