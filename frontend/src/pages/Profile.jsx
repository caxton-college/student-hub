import React from 'react'
import { useState } from 'react'
import Login from './components/Login'
import Logout from './components/Logout'

export default function Profile({user, setUser, client}) {

    return (
        <>
            {
                user.loggedIn  ? (
                    <>
                        <h1>{`Welcome ${user.name} ${user.surname}`}</h1>
                        <Logout setUser={setUser} client={client}/>
                    </>
                    
                    
                ) : (
                    <Login user={user} setUser={setUser} client={client}/>
                )
            }
            
        </>
        
    )
}
