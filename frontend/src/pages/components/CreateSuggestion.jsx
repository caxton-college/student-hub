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
                    size='xl'
                    onClick={() => setShowPrompt(!showPrompt)}
                />
            </div>
            {showPrompt ? (
                <div id='create-suggestion-prompt'>
                    <form onSubmit={handleSuggestionCreation}>
                        <input type="text" id='body' value={body} onChange={(e) => setBody(e.target.value)} />
                        <button type='submit'>Submit</button>
                    </form>
                </div>
            ) : null}
        </>
    );
}
