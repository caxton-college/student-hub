import React, { useState, useEffect } from 'react';
import PollOption from './PollOption';
import DeletePoll from './DeletePoll';
export default function Poll({ 
    client, 
    user, 
    pollData, 
    checkUser,
    index,
    getPolls,
    pollsOptionsLikeData, 
    setPollsOptionsLikeData }) {
    
    const [dataReady, setDataReady] = useState(false);
    const [optionsLikeData, setOptionsLikeData] = useState();
   
    useEffect(() => {
        if (pollData && pollData.options && pollsOptionsLikeData) {
            let newData = {};
            for (let i = 0; i < pollData.options.length; i++) {
                newData[pollData.options[i].id] = {
                    likes: pollsOptionsLikeData[index][pollData.options[i].id].likes,
                    liked: pollsOptionsLikeData[index][pollData.options[i].id].liked
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
    console.log(pollData)
    return (
        <div className='poll shadow'>

            <h3>{pollData.poll.question}</h3>
            <DeletePoll
            client={client}
            user={user}
            id={pollData.poll.id}
            getPolls={getPolls}>

            </DeletePoll>
            {pollData.options.map((option, index) => (
                <PollOption
                    client={client}
                    user={user}
                    option={option}
                    key={option.id}
                    optionsLikeData={optionsLikeData}
                    setOptionsLikeData={setOptionsLikeData}
                    index={index}
                    pollsOptionsLikeData={pollsOptionsLikeData}
                    setPollsOptionsLikeData={setPollsOptionsLikeData}  
                    checkUser={checkUser}
                    
                />
            ))}
        </div>
    );
}
