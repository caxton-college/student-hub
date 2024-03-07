import React from 'react'

import { Link } from "react-router-dom";

export default function StudentCard({ info, setRewardsId }) {
    let id = info["user_id"]
    let name = info["name"];
    let surname = info["surname"];
    let year = info["year"];

    function handleCardClick() {
        setRewardsId(id, name);
    }

    function capitalise(string) {
        try {
            return string.charAt(0).toUpperCase() + string.slice(1);
        } catch (err) {
            return string
        }
        
    }

    return (
        <Link to="/rewards" className='student-card shadow' onClick={handleCardClick}>
            <h4>{capitalise(name)} {capitalise(surname)}</h4>
        </Link>   
    )
}
