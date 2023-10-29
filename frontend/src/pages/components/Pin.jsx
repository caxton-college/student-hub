import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbtack } from '@fortawesome/free-solid-svg-icons';

export default function Pin({ client, user, pinned, id }) {
    const [csrfToken, setCsrfToken] = useState('');
    const [statePinned, setPinned] = useState(pinned);

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

    const updatePin = () => {
        // Post request using the fetched CSRF token
        client.post(
            '/api/update_suggestion_pin',
            { suggestion_id: id },
            { headers: { 'X-CSRFToken': csrfToken } }
        ).then(response => {
            setPinned(response.data.pinned);
        }).catch(error => {
            // Handle errors if the request fails
            console.error('Error updating likes:', error);
        });
    };

    const pinClass = statePinned ? 'pinned' : 'unpinned';

    const handleClick = (event) => {
        setPinned(!statePinned);
        const icon = event.target;
        icon.classList.add('bounce');
        setTimeout(() => {
            icon.classList.remove('bounce');
        }, 500);
        updatePin();
    };

    if (user.role === 3 | user.role === 4) {
        return (
            <FontAwesomeIcon
                onClick={handleClick}
                icon={faThumbtack}
                className={pinClass}
                size="xl"
            />
        );
    } else if (pinClass === "pinned") {
        return (
            <FontAwesomeIcon
                icon={faThumbtack}
                className={pinClass}
                size="xl"
            />
        );
    }
    
}
