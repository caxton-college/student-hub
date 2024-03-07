import React from 'react'
import PollLike from './PollLike'

export default function PollOption({
    client, 
    user, 
    checkUser,
    polls,
    setPolls,
    pollIndexInPolls,
    optionIndexInPolls,
}) {
    
    return (
        <div className='poll-option'>
            <p className='option-body'>{polls[pollIndexInPolls].options[optionIndexInPolls].body}</p>
            <PollLike
                client={client}
                user={user}
                checkUser={checkUser}
                polls={polls}
                setPolls={setPolls}
                pollIndexInPolls={pollIndexInPolls}
                optionIndexInPolls={optionIndexInPolls}
                
            >
            </PollLike>

        </div>
    )
}
