import React from 'react'
import PollLike from './PollLike'

export default function PollOption({client, user, option, optionsLikeData, setOptionsLikeData}) {
    
    return (
        <div className='poll-option'>
            <p className='option-body'>{option.body}</p>
            <PollLike
            client={client}
            user={user}
            id={option.id}
            optionsLikeData={optionsLikeData}
            setOptionsLikeData={setOptionsLikeData}></PollLike>

        </div>
    )
}
