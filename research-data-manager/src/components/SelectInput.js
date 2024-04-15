
import React from 'react';
import { Form, Dropdown } from 'semantic-ui-react';

const SelectInput = ({ label, options, value, onChange, id }) => {
    return (
        <Form.Field>
            <label>{label}</label>
            <Dropdown 
                placeholder={label} 
                fluid 
                selection 
                options={options} 
                value={value} 
                onChange={onChange} 
                id={id} 
            />
        </Form.Field>
    );
};

export default SelectInput;