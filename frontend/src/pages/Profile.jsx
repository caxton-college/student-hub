import React, { useState, useReducer, useEffect } from 'react';
import Login from './components/Login';
import Logout from './components/Logout';
import Header from './components/Header';
import { faHeart, faCoins, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Profile({ user, checkUser, setUser, client, theme, setTheme }) {
    
    let colour = theme === "light" ? "#3e3e6f" : "#d8d8ee";

    return (
        <>
        <div id='profile-page'>
            <Header 
            page={"Profile"}
            theme={theme}
            setTheme={setTheme}/>

            <div id='profile-content'>
            {
                user.loggedIn ? (
                    <>
                        <h2 style={{textTransform: 'uppercase'}}>WELCOME {user.name}!</h2>
                        <div id='points' className='shadow'>
                            <h3>{user.points}</h3>
                            <FontAwesomeIcon 
                            icon={faCoins} 
                            style={{ color: "#eeb825" }}> 
                            </FontAwesomeIcon>
                        </div>
                        <div id="interactions">
                                <h4>Your Interactions</h4>
                                <div id='interactions-box' className='shadow'>
                                
                                <div className='likes'>
                                    
                                    <h3>{user.userSuggestions}</h3>
                                    <FontAwesomeIcon
                                        icon={faLightbulb}
                                        style={{ color: colour }}
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
                        </div>
                        

                        <Logout setUser={setUser} client={client} />
                    </>
                ) : (
                    <Login user={user} checkUser={checkUser} client={client} />
                )
            }
            </div>
            
        </div>
        <div id='watermark'>
            <h6>Made by Carlos Lorenzo</h6>
        </div>
        </>
        
        
    );
}
