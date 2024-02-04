import React, { useState, useEffect } from 'react';

import { faHeart, faCoins, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import UserReward from './components/UserReward';
import Header from "./components/Header";

export default function Rewards({ client, user, rewards, theme, setTheme, type, getAllRewards, getUserRewards, checkUser }) {
    
    let title = "";
    let rewardAction = "";

    switch (type) {
        case "shop":
            title = "Shop"
            rewardAction = "buy";
            break;

        case "view":
            
            

            // 5 - techer, 1-4 (student body role's)

            if (user.role === 5) {
                title = `Student Rewards`
                rewardAction = "redeem";
                
            } else {
                title = `${user.name}' Rewards`
                rewardAction = "sell";
            }

    }
    
    return (
        <>
            <Header 
                page={title}
                theme={theme}
                setTheme={setTheme}/>
            <div id='points-banner-rewards' className='shadow'>
                <h3>{user.points}</h3>
                <FontAwesomeIcon 
                icon={faCoins} 
                style={{ color: "#eeb825" }}> 
                </FontAwesomeIcon>
            </div>
            <div id='rewards'>
                {
                    rewards.map((reward, i) => (
                        <UserReward 
                        client={client}
                        user={user}
                        name={reward.name}
                        cost={reward.cost}
                        id={reward.id}
                        action={rewardAction}
                        getAllRewards={getAllRewards}
                        getUserRewards={getUserRewards}
                        checkUser={checkUser}
                        key={i}/>
                    ))
                }

            </div>
        </>
       
    );
}
