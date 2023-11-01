import React, { useState, useReducer, useEffect } from 'react';
import Login from './components/Login';
import Logout from './components/Logout';
import { faHeart, faCoins, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Profile({ user, setUser, client }) {
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        getSuggestions();
    }, []); // Empty dependency array ensures it runs once on mount

    function getSuggestions() {
        if (suggestions.length === 0) {
            client.get("api/user_suggestions").then(function (response) {
                setSuggestions(response.data);
            });
        }
    }

    return (
        <div id='profile-page'>
            {
                user.loggedIn ? (
                    <>
                        <h2>WELCOME {user.name}!</h2>
                        <div id='points' className='shadow'>
                            <h3>{user.points}</h3>
                            <FontAwesomeIcon icon={faCoins}></FontAwesomeIcon>
                        </div>
                        <div id='interactions' className='shadow'>
                            <div className='likes'>
                                <h3>{suggestions.length}</h3>
                                <FontAwesomeIcon
                                    icon={faLightbulb}
                                    style={{ color: "#3e3e6f" }}
                                    size="xl"
                                ></FontAwesomeIcon>
                            </div>

                            <div className='likes'>
                                <h3>{user.likes}</h3>
                                <FontAwesomeIcon
                                    icon={faHeart}
                                    style={{ color: "#B13F3E" }}
                                    size="xl">
                                </FontAwesomeIcon>
                            </div>
                        </div>

                        <Logout setUser={setUser} client={client} />
                    </>
                ) : (
                    <Login user={user} setUser={setUser} client={client} />
                )
            }
        </div>
    );
}
