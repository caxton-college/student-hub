import React, { useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faCirclePlus, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

import { toast } from 'react-toastify';

export default function CreateAnnouncement({ 
    client, 
    user, 
    showAnnouncementPrompt, 
    setShowAnnouncementPrompt,
    getAnnouncements
}) {
    
    const [csrfToken, setCsrfToken] = useState('');
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

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

    const handleAnnouncementCreation = (e) => {
        // Post request using the fetched CSRF token
        e.preventDefault();
        client.post(
            '/api/create_announcement',
            { 
                body: body, 
                title: title},
            { headers: { 'X-CSRFToken': csrfToken } }
        ).then(response => {
            setShowAnnouncementPrompt(false);
            getAnnouncements(true); 
            setTitle("");
            setBody("");
            toast.success('Poll Created!', {
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
            console.error('Error creating announcement:', error);
        });
    };

    function handlePromtToggle() {
        setShowAnnouncementPrompt(!showAnnouncementPrompt);

    }

    return (
        <>
            <div className={showAnnouncementPrompt ? 'close create-toggle' : 'open create-toggle'}>
                <FontAwesomeIcon
                    icon={showAnnouncementPrompt ? faCircleXmark : faCirclePlus}
                    size='2xl'
                    onClick={handlePromtToggle}
                />
                
            </div>
            {showAnnouncementPrompt ? (
                <div className='shadow create-prompt'>
                    <form id='create-announcement-form' onSubmit={handleAnnouncementCreation}>
                    <textarea 
                        name="title" 
                        value={title} 
                        onInput={(e) => setTitle(e.target.value)} 
                        rows="1" 
                        className="input-text" 
                        id="title" 
                        required 
                        autoComplete="off"
                        placeholder='Announcement title'></textarea>
                        <label htmlFor="title"><span>Title</span></label>
                        <textarea 
                        name="body" 
                        value={body} 
                        onInput={(e) => setBody(e.target.value)} 
                        rows="6" 
                        className="input-text" 
                        id="body" required 
                        autoComplete="off"
                        placeholder='Announcement body'></textarea>
                        <label htmlFor="body"><span>Body</span></label>
                        <input type="submit" value="Share"/>
                    </form>
                </div>
            ) : null}
        </>
    );
}
