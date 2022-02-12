import { type } from '@testing-library/user-event/dist/type';
import { rest } from 'lodash';
import React from 'react';

const Input= ({ name, label, error ,...rest}) => {
    return( 
        <div className='form-group'>
            <label htmlFor={name}>{label}</label>
            <input 
                // autoFocus
                {...rest}
                name={name}
                id={name} 
                className='form-control'
            />
            {error && <div className="alert alert-danger">{error}</div>}
        </div>
    );
}
export default Input;