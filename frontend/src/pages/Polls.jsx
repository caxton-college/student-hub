import React from 'react'
import { useState } from 'react';

import CreatePoll from './components/CreatePoll';
import Poll from './components/Poll';
import Header from './components/Header';

export default function Polls({ client, user}) {
	const [polls, setPolls] = useState([]);

	function getPolls() {
		if (polls.length === 0) {
			client.get(
				"api/polls"
			).then(function(response) {
				setPolls(response.data);
			})
		}
	}

	getPolls();
	

    return (
		<div className='content'>
            <Header page={"Polls"}/>
			{
				polls.map((pollData) => {
					return (
						<Poll client={client} user={user} pollData={pollData} key={pollData.poll.id}></Poll>
					)
				})
				
			}
			
		    <CreatePoll client={client} user={user}></CreatePoll>
		</div>
    )
}
