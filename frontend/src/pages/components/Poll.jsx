import React, { useState, useEffect } from 'react';
import PollOption from './PollOption';
import DeletePoll from './DeletePoll';

export default function Poll({ 
    client, 
    user, 
    checkUser,
    polls,
    setPolls,
    getPolls,
    pollIndexInPolls,
    }) {
    

    
    
    return (
        <div className='poll shadow' style={{height: `${polls[pollIndexInPolls].options.length * 15 + 5}vh`}}>

            <h3>Poll Question</h3>

            <DeletePoll
                client={client}
                user={user}
                id={polls[pollIndexInPolls].poll.id}
                getPolls={getPolls}>
            </DeletePoll>
            
            {polls[pollIndexInPolls].options.map((option, index) => (
                <PollOption
                    client={client}
                    user={user}
                    checkUser={checkUser}  
                    polls={polls}
                    setPolls={setPolls}
                    pollIndexInPolls={pollIndexInPolls}
                    optionIndexInPolls={index}
                    key={option.id}
                />
            ))}
        </div>
    );
}
