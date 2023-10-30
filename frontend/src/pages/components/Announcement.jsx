import React from 'react'

export default function Announcement({announcement}) {
    return (
        <div className='announcement shadow'>
            <h4>{announcement.title}</h4>
            <p>{announcement.body}</p>
        </div>
    )
}
