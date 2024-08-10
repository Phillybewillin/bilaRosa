import React from 'react';

import './input.scss';

const Input = props => {
    return (
        
        <input
            type={props.type}
            placeholder={props.placeholder}
            value={props.value}
            onChange={(e) => props.onChange && props.onChange(e)}
        />
    );
}


export default Input;


