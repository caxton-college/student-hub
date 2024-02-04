import React from 'react'

import { faHeart, faCoins, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { toast } from 'react-toastify';

export default function UserReward({ client, user, name, cost, id, action, getAllRewards, getUserRewards, checkUser}) {
    // Type: buy (student only), sell (student only) or redeem (teacher only)
    
    function handleAction() {
        switch(action) {
            case "buy":
                client.post("/api/purchase_reward", {
                    reward_id: id
                }).then((response) => {

                    checkUser();
                    getUserRewards();

                    toast.success(response.data.message, {
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
                    toast.error(error.response.data.message, {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                });

                break;
    
            case "sell":
                client.post("/api/sell_reward", {
                    reward_id: id
                }).then((response) => {
                    
                    checkUser();
                    getUserRewards();

                    toast.success(response.data.message, {
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
                    toast.error(error.response.data.message, {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                });
                break;
    
            case "redeem":
    
                break;
            
            default:
                console.error("Missing action prop");
                break;
        }
    
    }
    
    return (
        <div className='user-reward shadow'>
            <h4>{name}</h4>
            <div className='reward-actions'>
                <div className='reward-points shadow'>
                    <FontAwesomeIcon 
                        icon={faCoins} 
                        style={{ color: "#eeb825" }}> 
                    </FontAwesomeIcon>
                    <p><b>{cost}</b></p>
                </div>
                <button className='reward-action shadow' onClick={handleAction}><h2>{action}</h2></button>
            </div>
            
        </div>
    )
}
