import React from 'react'

import Login from './components/Login'

export default function Profile({user, setUser, client}) {
    return (
        <Login user={user} setUser={setUser} client={client}/>
    )
}
