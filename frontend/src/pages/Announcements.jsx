import React from 'react'
import { useState } from 'react';

import CreateAnnouncement from './components/CreateAnnouncement';

import Announcement from './components/Announcement';
import Header from './components/Header';
export default function Announcements({user, client, announcements, getAnnouncements, theme, setTheme}) {
	
	const [showAnnouncementPrompt, setShowAnnouncementPrompt] = useState(false);

	return (
        <>
        <Header 
        page={"Announcements"}
        theme={theme}
        setTheme={setTheme}/>
        
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
                        getAnnouncements={getAnnouncements}
						setShowAnnouncementPrompt={setShowAnnouncementPrompt}>
						</CreateAnnouncement>
					</>
                ) : null
            }
            
            
		</div>
        </>
		
	)
}
