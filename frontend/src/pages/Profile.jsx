import React, { useState, useReducer, useEffect } from 'react';
import Login from './components/Login';
import Logout from './components/Logout';
import Header from './components/Header';
import { faHeart, faCoins, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Profile({ user, checkUser, setUser, client, userSuggestions }) {
    
    let numSuggestions = 0;
    if (userSuggestions) {
        numSuggestions = userSuggestions.length;
    }

    return (
        
            
            <div id='profile-page'>
            <Header page={"Profile"}></Header>
            {
                user.loggedIn ? (
                    <>
                        <h2>WELCOME {user.name}!</h2>
                        <div id='points' className='shadow'>
                            <h3>{user.points}</h3>
                            <FontAwesomeIcon 
                            icon={faCoins} 
                            style={{ color: "#eeb825" }}> 
                            </FontAwesomeIcon>
                        </div>
                        <div id='interactions-box' className='shadow'>
                        
                            <div className='likes'>
                                
                                <h3>{numSuggestions}</h3>
                                <FontAwesomeIcon
                                    icon={faLightbulb}
                                    style={{ color: "#3e3e6f" }}
                                    size="xl">

                                </FontAwesomeIcon>
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
                    <Login user={user} checkUser={checkUser} client={client} />
                )
            }
        </div>
        
        
    );
}
