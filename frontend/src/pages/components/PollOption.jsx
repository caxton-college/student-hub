import React from 'react'
import Like from './Like'

export default function PollOption({client, user, option}) {
    return (
        <div className='poll-option'>
            <Like
            client={client}
            user={user}
            liked={option.liked}
            likes={option.likes}
            id={option.id}
            type={"poll"}></Like>

        </div>
    )
}
