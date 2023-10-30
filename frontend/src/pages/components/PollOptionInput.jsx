import React from 'react'
import { useState } from 'react'
export default function PollOptionInput({index, current_option, options, setOptions}) {
    const [option, setOption] = useState("");

    function handleSetOption(e) {
        setOption(e.target.value)
        let newOptions = options;
        newOptions[index] = option;
        setOptions(newOptions);
    }
    return (
        <textarea 
            name={`question_${index}`}
            value={current_option} 
            onInput={(e) => handleSetOption(e)} 
            rows="1" 
            className="input-text" 
            id={`question_${index}`} 
            required 
            autoComplete="off"
            placeholder='Poll question'>

        </textarea>
    )
}
