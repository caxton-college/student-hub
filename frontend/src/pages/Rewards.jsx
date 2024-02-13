import React from 'react';

import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import UserReward from './components/UserReward';
import Header from "./components/Header";

export default function Rewards({ client, user, rewards, theme, setTheme, type, getAllRewards, getUserRewards, checkUser }) {
    
    let title = "";
    let rewardAction = "";
    let marginClass = "";

    function capitalise(string) {
        try {
            return string.charAt(0).toUpperCase() + string.slice(1);
        } catch (err) {
            return string
        }
        
    }


    switch (type) {
        case "shop":
            title = "Shop"
            rewardAction = "buy";
            marginClass = "nudge-down";
            break;


        case "view":
            // 5 - techer, 1-4 (student body roles)
            
            if (user.role === 5) {
                title = `${capitalise(user.rewards_name)}' Rewards`
                rewardAction = "redeem";
                
            } else {
                title = `Your Rewards`
                rewardAction = "sell";
            }

    }
    
    return (
        <>
            <Header 
                page={title}
                theme={theme}
                setTheme={setTheme}    
            />

            {
                user.role != 5 && type === "shop" ? (
                    <div id='points-banner-rewards' className='shadow'>
                        <h3>{user.points}</h3>
                        <FontAwesomeIcon 
                        icon={faCoins} 
                        style={{ color: "#eeb825" }}> 
                        </FontAwesomeIcon>
                    </div>
                ) : (
                    <></>
                )
            }
                <div id='rewards' className={marginClass}>
                {
                   
                    rewards.length != 0 ? (
                        rewards.map((reward, i) => (
                                <>
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
                                
                                </>
                                
                                
                            
                        ))
                        

                    ) : (
                        <h3 className='content'>No rewards...</h3>
                    )
                    
                }
                </div>

            
        </>
       
    );
}
