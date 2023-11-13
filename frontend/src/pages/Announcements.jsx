import React from 'react'
import { useState, useReducer } from 'react';


import CreateAnnouncement from './components/CreateAnnouncement';

import Announcement from './components/Announcement';
import Header from './components/Header';
export default function Announcements({user, client, announcements, getAnnouncements}) {

	
	
	const [showAnnouncementPrompt, setShowAnnouncementPrompt] = useState(false);



	

	
	
	
	
	
	return (
        <>
        <Header page={"Announcements"}></Header>
        <div className='content'>
            
			{
				announcements.map(announcement => (
                    <Announcement 
					announcement={announcement}
					client={client}
					user={user}
					getAnnouncements={getAnnouncements} 
					key={announcement.id}></Announcement>
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
        </>
		
	)
}
