import React from 'react'

import { faHeart, faCoins, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function UserReward({ client, user, name, cost, id, action}) {
    // Type: buy (student only), sell (student only) or redeem (teacher only)

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
                <button className='reward-action shadow'><h2>{action}</h2></button>
            </div>
            
        </div>
    )
}
