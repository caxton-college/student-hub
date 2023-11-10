import React from 'react'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

export default function PollOptionInput({ index, current_option, options, setOptions }) {
    const [option, setOption] = useState(current_option);

    function handleSetOption(e) {
        const updatedOption = e.target.value;
        setOption(updatedOption);
        const newOptions = [...options];
        newOptions[index] = updatedOption;
        setOptions(newOptions);
    }

    function handleOptionDeletion() {
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
    }

    return (
        <React.Fragment key={`option-${index}`}>
            <div className='poll-option-input-container'>
            <div className='poll-option-input'>
                <textarea 
                    name={`question_${index}`}
                    value={option} 
                    onInput={handleSetOption} 
                    rows="1" 
                    className="input-text" 
                    id={`question_${index}`} 
                    required 
                    autoComplete="off"
                    placeholder={`Option ${index + 1}`}
                />
                <label htmlFor={`question_${index}`}><span>Option</span></label>
            </div>
            
            <FontAwesomeIcon 
                onClick={handleOptionDeletion}
                icon={faCircleXmark}
                className='close'
                size='l'
            />
            </div>

        </React.Fragment>
    );
}