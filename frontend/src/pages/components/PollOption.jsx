import React from 'react'
import PollLike from './PollLike'

export default function PollOption({
    client, 
    user, 
    option, 
    optionsLikeData, 
    setOptionsLikeData, 
    index,
    pollsOptionsLikeData,
    setPollsOptionsLikeData,
    checkUser,
    getPolls 
}) {
    
    return (
        <div className='poll-option'>
            <p className='option-body'>{option?.body}</p>
            <PollLike
                client={client}
                user={user}
                id={option.id}
                optionsLikeData={optionsLikeData}
                setOptionsLikeData={setOptionsLikeData}
                index={index}
                pollsOptionsLikeData={pollsOptionsLikeData}
                setPollsOptionsLikeData={setPollsOptionsLikeData}
                getPolls={getPolls}
                checkUser={checkUser}
            >
            </PollLike>

        </div>
    )
}
