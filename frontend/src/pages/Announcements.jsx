import React from 'react'
import { useState, useReducer } from 'react';


import CreateAnnouncement from './components/CreateAnnouncement';

import Announcement from './components/Announcement';
import Header from './components/Header';
export default function Announcements({user, client}) {

	const [announcements, setAnnouncements] = useState([]);
	const [showPollPrompt, setShowPollPrompt] = useState(false);
	const [showAnnouncementPrompt, setShowAnnouncementPrompt] = useState(false);

	const [, forceRender] = useReducer(x => x + 1, 0);

	

	function getAnnouncements() {
		if (announcements.length === 0) {
			client.get(
				"api/announcements"
			).then(function(response) {
				setAnnouncements(response.data);
				
			})
		}
	}
	
	
	getAnnouncements();
	
	
	return (
		<div className='content'>
            <Header page={"Announcements"}></Header>
			{
				announcements.map(announcement => (
                    <Announcement announcement={announcement} key={announcement.id}></Announcement>
				))
			}
            {
                user.role === 3 ? (
					<>
						<CreateAnnouncement 
						client={client} 
						user={user} 
						showAnnouncementPrompt={showAnnouncementPrompt}
						setShowAnnouncementPrompt={setShowAnnouncementPrompt}
						showPollPrompt={showPollPrompt}
						setShowPollPrompt={setShowPollPrompt}>

						</CreateAnnouncement>
					</>
                ) : null
            }
            
            
		</div>
	)
}
