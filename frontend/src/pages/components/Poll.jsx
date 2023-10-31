import React from 'react'
import PollOption from './PollOption'
export default function Poll({ client, user, pollData }) {

    return (
        <div className='poll shadow'>
            <h3>{pollData.poll.question}</h3>

            {
                pollData.options.map((option) => {
                    return (
                        <PollOption
                        client={client}
                        user={user}
                        option={option}>

                        </PollOption>
                    )
                    
                })

            }
        </div>
        
    )
}
