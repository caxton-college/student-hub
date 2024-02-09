import React from 'react'

import { Link } from "react-router-dom";

export default function StudentCard({ info, setRewardsId }) {
    let id = info["user_id"]
    let name = info["name"];
    let surname = info["surname"];
    let year = info["year"];

    function handleCardClick() {
        setRewardsId(id);
        
    }

    return (
        <Link to="/rewards" className='student-card shadow' onClick={handleCardClick}>
            <h4>{name} {surname}</h4>
        </Link>
        
    )
}
