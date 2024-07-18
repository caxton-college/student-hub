import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { toast } from 'react-toastify'

export default function Activate({ client }) {
    const params = useParams();

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
            <button className='submit shadow' onClick={() => activateSuggestion()}><h3>Activate</h3></button>
            <button className='submit shadow' onClick={() => rejectSuggestion()}><h3>Reject</h3></button>
        </div>
    </div>
    
}
