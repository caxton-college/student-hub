import React from 'react'
import { useState } from 'react';


export default function StudentSearchForm({ client, setFoundUsers}) {

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");


    function searchUsers(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        let year = Object.fromEntries(formData)["year"];


        client.get(
            "/api/search_user",
            {params: {
                name: name,
                surname: surname,
                year: year
            }}
        ).then(respose => {
            setFoundUsers(respose.data);
        })
    }
    

    return (
        <>
            <form onSubmit={searchUsers} id='search-form'>
                <input type="text" onChange={e => setName(e.target.value)} placeholder='name'/>
                <input type="text" onChange={e => setSurname(e.target.value)} placeholder='surname'/>
                <select name="year" id="year-select">
                    <option value="7">Year 7</option>
                    <option value="8">Year 8</option>
                    <option value="9">Year 9</option>
                    <option value="10">Year 10</option>
                    <option value="11">Year 11</option>
                    <option value="12">Year 12</option>
                    <option value="13">Year 13</option>
                </select>
                <button type="submit" className='submit shadow'><h4>Search</h4></button>
            </form>
            
        </>
        
    )
}
