import React from 'react'
import { useState, useReducer } from 'react';


import CreateAnnouncement from './components/CreateAnnouncement';

import Announcement from './components/Announcement';
import Header from './components/Header';
export default function Announcements({user, client, announcements}) {

	
	
	const [showAnnouncementPrompt, setShowAnnouncementPrompt] = useState(false);



	

	
	
	
	
	
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
						setShowAnnouncementPrompt={setShowAnnouncementPrompt}>
						</CreateAnnouncement>
					</>
                ) : null
            }
            
            
		</div>
	)
}
