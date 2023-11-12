import React from 'react'
import { useState } from 'react';

import CreatePoll from './components/CreatePoll';
import Poll from './components/Poll';
import Header from './components/Header';

export default function Polls({ client, user, polls, checkUser, getPolls, pollsOptionsLikeData, setPollsOptionsLikeData}) {
	
	

    return (
        <>
        <Header page={"Polls"}/>
		<div className='content'>
            
			{
				polls.map((pollData, index) => {
					return (
						<Poll 
                            client={client} 
                            user={user} 
                            pollData={pollData} 
                            key={pollData.poll.id} 
                            checkUser={checkUser}
                            index={index}
                            getPolls={getPolls}
                            pollsOptionsLikeData={pollsOptionsLikeData}
                            setPollsOptionsLikeData={setPollsOptionsLikeData}>
                        </Poll>
					)
				})
				
			}
			
		    <CreatePoll client={client} user={user} getPolls={getPolls}></CreatePoll>
		</div>        
        </>
        
    )
}
