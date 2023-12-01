import React from 'react'

import DeleteAnnouncement from './DeleteAnnouncement'

export default function Announcement({ client, user, announcement, getAnnouncements}) {
    return (
        <div className='announcement shadow'>
            <DeleteAnnouncement
            client={client}
            id={announcement.id}
            user={user}
            getAnnouncements={getAnnouncements}></DeleteAnnouncement>
            <h4>{announcement.title}</h4>
            <p>{announcement.body}</p>
        </div>
    )
}
