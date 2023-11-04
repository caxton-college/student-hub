import React, { useState, useEffect } from 'react';
import PollOption from './PollOption';

export default function Poll({ client, user, pollData }) {
    const [optionsLikeData, setOptionsLikeData] = useState({});
    const [dataReady, setDataReady] = useState(false);

    useEffect(() => {
        if (pollData && pollData.options) {
            let newData = {};
            for (let i = 0; i < pollData.options.length; i++) {
                newData[pollData.options[i].id] = {
                    likes: pollData.options[i].likes,
                    liked: pollData.options[i].liked
                };
            }
            setOptionsLikeData(newData);
            setDataReady(true); // Set dataReady to true when optionsLikeData is populated
        }
    }, [pollData]);

    if (!dataReady) {
        // Return a placeholder or loading state until data is ready
        return <div>Loading...</div>;
    }

    return (
        <div className='poll shadow'>
            <h3>{pollData.poll.question}</h3>
            {pollData.options.map((option, index) => (
                <PollOption
                    client={client}
                    user={user}
                    option={option}
                    key={option.id}
                    optionsLikeData={optionsLikeData}
                    setOptionsLikeData={setOptionsLikeData}
                />
            ))}
        </div>
    );
}
