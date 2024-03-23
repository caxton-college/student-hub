import React, { useState, useReducer, useEffect } from 'react';

import { Link } from "react-router-dom";

import { faHeart, faCoins, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Login from './components/Login';
import Logout from './components/Logout';
import Header from './components/Header';



export default function Profile({ user, checkUser, setUser, client, theme, setTheme, setSelected }) {
    
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
                        <h3 style={{textTransform: 'uppercase'}}>WELCOME {user.name}!</h3>
                        

                        {
                            user.role != 5 ? (
                                <>

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
                                                
                                                <h5>{user.userSuggestions}</h5>

                                                <FontAwesomeIcon
                                                    icon={faLightbulb}
                                                    style={{ color: colour }}
                                                    size="1x">

                                                </FontAwesomeIcon>

                                            </div>

                                            <div className='likes'>
                                                <h5>{user.likes}</h5>
                                                <FontAwesomeIcon
                                                    icon={faHeart}
                                                    style={{ color: "#B13F3E" }}
                                                    size="1x">
                                                </FontAwesomeIcon>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div id='reward-links'>
                                        <Link to="/shop" onClick={(e) => setSelected("none")}>
                                            <button className='reward-link shadow'>
                                                <h2>Shop</h2>
                                            </button>
                                        </Link>
                                        
                                        <Link to="/rewards" onClick={(e) => setSelected("none")}>
                                            <button className='reward-link shadow'>
                                                <h2>Rewards</h2>
                                            </button>
                                        </Link>

                                        

                                        
                                    </div>
                                </>
                            ) : (

                                <Link to="/search" onClick={(e) => setSelected("none")} className='search-link shadow'>
                                    <h4>Search for student</h4>
                                </Link>
                            )
                        }
                        

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
