import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';

import { toast } from 'react-toastify';

export default function PollLike({ 
    client, 
    user, 
    checkUser,
    polls,
    setPolls,
    pollIndexInPolls,
    optionIndexInPolls
}) {
    
        
    const [clicked, setClicked] = useState(false);
    
    


    const updateLikes = () => {
        
        client.post(
            `/api/update_poll_likes`,
            { id : polls[pollIndexInPolls].options[optionIndexInPolls].id },
            {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            }
            
            
        ).then(response => {

            
            let newPollOptionData = [...polls[pollIndexInPolls].options];
            
            
            for (let i = 0; i < newPollOptionData.length; i++) {
                newPollOptionData[i] = {
                     ...newPollOptionData[i], 
                     likes: response.data[newPollOptionData[i].id].likes, 
                     liked: response.data[newPollOptionData[i].id].liked 
                };

            }
            

            let newPolls = [...polls];
            newPolls[pollIndexInPolls] = {
                ...polls[pollIndexInPolls],
                options: newPollOptionData
            }
            setPolls(newPolls);

            


            setClicked(!clicked);
            checkUser();
            


            toast.info('Like updated', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

            // Remove the beat animation after 500ms
            setTimeout(() => {
                setClicked(false);
            }, 500);
            
        }).catch(error => {   
            console.log(error);
            
            if (error.response && error.response.data) {
                toast.error(error.response.data.message, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
            
            
        });
    };

    function mustLogIn() {
        toast.warning("Must be logged in to do that!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }

    const icon = polls[pollIndexInPolls].options[optionIndexInPolls].liked ? solidHeart : faHeart;
    const colour = polls[pollIndexInPolls].options[optionIndexInPolls].liked ? "#B13F3E" : "#cbcbe2";

    return (
        <div className='likes'>

            <h5>{polls[pollIndexInPolls].options[optionIndexInPolls].likes}</h5>
            {
                user.loggedIn ? (
                    <FontAwesomeIcon
                    onClick={updateLikes}
                    icon={icon}
                    className={clicked ? 'beat' : 'like'}
                    style={{ color: colour }}
                    size='xl'/>
                ) : (
                    <FontAwesomeIcon
                        icon={solidHeart}
                        className={"like"}
                        onClick={mustLogIn}
                        style={{ color: "#B13F3E" }}
                        size='xl'/>
                )
            }
            
        </div>
    );
}
