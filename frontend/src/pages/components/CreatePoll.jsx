import React, { useState, useEffect, isValidElement } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion, faCircleXmark, faCirclePlus } from '@fortawesome/free-solid-svg-icons';

import PollOptionInput from './PollOptionInput';

export default function CreatePoll({ 
    client, 
    user, 
}) {
    
    
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(["", ""]);
    const [showPollPrompt, setShowPollPrompt] = useState(false);
    

    const handleSuggestionCreation = (e) => {
        // Post request using the fetched CSRF token
        e.preventDefault();
        client.post(
            '/api/create_poll',
            { 
                question: question, 
                poll_options: options
            },
            
        ).then(response => {
            setShowPollPrompt(false);
            window.location.reload();
        }).catch(error => {
            console.error('Error creating poll:', error);
        });
    };

    function handlePromtToggle() {
        setShowPollPrompt(!showPollPrompt);

    }

    function handleOptionAddition() {
        setOptions([...options, ""]);
    }
    
    if (user.role === 3 | user.role === 4) {
        return (
            <>
                <div className={showPollPrompt ? 'close create-toggle' : 'open create-poll-toggle'}>
                    <FontAwesomeIcon
                        icon={showPollPrompt ? faCircleXmark : faCirclePlus}
                        size='2xl'
                        onClick={handlePromtToggle}
                    />
                    
                </div>
                {showPollPrompt ? (
                    <div className='shadow create-prompt'>
                        <form id='create-poll-form' onSubmit={handleSuggestionCreation} key={"create-poll-form"}>
                                <textarea 
                                    name="question" 
                                    value={question} 
                                    onInput={(e) => setQuestion(e.target.value)} 
                                    rows="1" 
                                    className="input-text" 
                                    id="question" 
                                    required 
                                    autoComplete="off"
                                    placeholder='Poll question'
                                    key={`create-poll-question`}>
                                    
                                </textarea>
                                <label htmlFor="question" key={"quesiton-lable"}><span>Question</span></label>
                        
                            
                                {
                                    options.map((option, index) => {
                                        
                                        return (
                                            <>
                                                <PollOptionInput
                                                index={index}
                                                current_option={option}
                                                options={options}
                                                setOptions={setOptions}
                                                key={`create-option-${index}`}>
                                                </PollOptionInput>
                                                
                                            </>
                                            
                                        )
                                    })
                                }
                           
                            <FontAwesomeIcon icon={faCirclePlus} onClick={handleOptionAddition}></FontAwesomeIcon>
                            <input type="submit" key={"submit-poll"} value="Post"/>
    
                        </form>
                    </div>
                ) : null}
            </>
        );
    }
    
}
