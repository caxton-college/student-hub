import React from 'react'
import { useState, useReducer } from 'react';


import CreateSuggestion from './components/CreateSuggestion';
import Announcement from './components/Announcement';

export default function Announcements({user, client}) {

	const [announcements, setAnnouncements] = useState([]);
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
			{
				announcements.map(announcement => (
                    <Announcement announcement={announcement} key={announcement.id}></Announcement>
				))
			}
            
            
		</div>
	)
}
