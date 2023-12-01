import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFire, faHourglass } from '@fortawesome/free-solid-svg-icons'

export default function SuggestionFilter({ order, handleSetOrder }) {

    return (
        <div id='suggestion-sort' className='shadow'>
                
                <div 
                    className={`sort-option ${order === "popular" ? "selected-tab" : "unselected-tab"}`}
                    onClick={(e) => handleSetOrder("popular")}
                    >
                        <FontAwesomeIcon
                        icon={faFire}
                        size='xl'>    
                        </FontAwesomeIcon>
                        <p>Popular</p>
                    
                </div>

                <div 
                    className={`sort-option ${order === "new" ? "selected-tab" : "unselected-tab"}`}
                    onClick={(e) => handleSetOrder("new")}
                    >
                        <FontAwesomeIcon
                        icon={faHourglass}
                        size='xl'>    
                        </FontAwesomeIcon>
                        <p>Recent</p>
                    
                </div>
            </div>
    )
}
