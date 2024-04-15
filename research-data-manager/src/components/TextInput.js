
import React from 'react';
import { Form } from 'semantic-ui-react';

const TextInput = ({ label, placeholder, value, onChange, id, type = 'text' }) => {
    return (
        <Form.Field>
            <label>{label}</label>
            <input 
                type={type} 
                placeholder={placeholder} 
                value={value} 
                onChange={onChange} 
                id={id} 
            />
        </Form.Field>
    );
};

export default TextInput;