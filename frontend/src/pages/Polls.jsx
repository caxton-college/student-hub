import React from 'react'
import { useState } from 'react';

import CreatePoll from './components/CreatePoll';
import Poll from './components/Poll';
import Header from './components/Header';

export default function Polls({ 
    client, 
    user, 
    checkUser,
    polls, 
    setPolls, 
    getPolls, 
    theme, 
    setTheme}) {
	
	
    
    return (
        <>
        <Header 
        page={"Polls"}
        theme={theme}
        setTheme={setTheme}/>
		<div className='content'>
            
			{
				polls.map((pollData, index) => {
					return (
						<Poll 
                            client={client} 
                            user={user} 
                            checkUser={checkUser}
                            polls={polls}
                            setPolls={setPolls}
                            getPolls={getPolls}
                            pollIndexInPolls={index}
                            key={pollData.poll.id} >
                        </Poll>
					)
				})
				
			}
			
		    <CreatePoll client={client} user={user} getPolls={getPolls}></CreatePoll>
		</div>        
        </>
        
    )
}
