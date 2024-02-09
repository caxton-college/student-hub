import React from 'react'
import { useState } from 'react';

import Header from "./components/Header";
import StudentCard from './components/StudentCard'; 
import StudentSearchForm from './components/StudentSearchForm';

export default function Search({ client, user, theme, setTheme, setRewardsId}) {

    let info = {
        user_id:1,
        name: "carlos",
        surname: "lorenzo",
        year: 12
    }

    const [foundUsers, setFoundUsers] = useState([]);

    

    return (
        <>
            <Header 
                page={"Search"}
                theme={theme}
                setTheme={setTheme}
            />
            

            <div id="search-page">

                <StudentSearchForm client={client} setFoundUsers={setFoundUsers}/>

                <div id="search-results">
                    {
                        foundUsers.length > 0 ? (
                            foundUsers.map((userInfo, i) => {
                                return (
                                    <StudentCard info={userInfo} key={i} setRewardsId={setRewardsId}/>
                                )
                                
                            })
                        ) : (
                            <h4>No users found</h4>
                        )
                        
                    }
                </div>
                



            </div>
        </>
    )
}
