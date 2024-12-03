import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { toast } from 'react-toastify'

export default function Activate({ user, client }) {
    
    const navigate = useNavigate();
    useEffect(() => {
        client.get('/api/user', {
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }

        }).then(response => {
            if (response.data.user.role !== 3 && response.data.user.role !== 4) {
                toast.warning("Only student council members can activate suggestions", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                navigate('/');
            }
        })
        .catch(error => {
            toast.error("You must be logged in to do this, log in and try again", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            navigate('/');
        })
    }, []);

    function parseError(error, type) {
        if (error.response.data.message) {
            return error.response.data.message
        } else if (error.response.data.detail) {
            return "You must be logged in to do this"
        }
        else {
            return `An error occurred while ${type} the suggestion.`

        }
        
    }

    function activateSuggestion() {

        const id = toast.loading("Activating suggestion");

        client.get('/api/activate_suggestion', { 
            params: { id: suggestionId() },
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
        }})
        .then(response => {
            toast.update(id, {
                render: 'Suggestion activated',
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
            
        })
        .catch(error => {
            toast.update(id, {
                render: parseError(error, 'activating'),
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
    }

    function rejectSuggestion() {
        const id = toast.loading("Rejecting suggestion");

        client.get('/api/reject_suggestion', { 
            params: { id: suggestionId() },
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
        }})
        .then(response => {
            toast.update(id, {
                render: 'Suggestion rejected',
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
            
        })
        .catch(error => {
            toast.update(id, {
                render: parseError(error, 'rejecting'),
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
    }

    function suggestionId(){
        const queryString = window.location.search;
        const parameters = new URLSearchParams(queryString);
        const suggestion_id = parameters.get('id');
        return suggestion_id   
    }

    return <div className='content'>
        <h2>Review Suggestion</h2>
        <div id="options">
            <button className='submit shadow' onClick={() => activateSuggestion()}><h3>Accept</h3></button>
            <button className='submit shadow' onClick={() => rejectSuggestion()}><h3>Reject</h3></button>
        </div>
    </div>
    
}
