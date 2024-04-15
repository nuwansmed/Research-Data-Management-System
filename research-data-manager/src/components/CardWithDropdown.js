import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Dropdown } from 'semantic-ui-react';

const CardWithDropdown = ({ header, description, dropdownOptions }) => {
    const navigate = useNavigate();

    const options = dropdownOptions.map(option => ({
        key: option.key,
        text: option.text,
        value: option.value,
        onClick: () => navigate(option.value)
    }));

    return (
        <Card>
            <Card.Content>
                <Card.Header>{header}</Card.Header>
                <Card.Description>{description}</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Dropdown
                    text='Go to...'
                    icon='dropdown'
                    floating
                    labeled
                    className='icon'
                >
                    <Dropdown.Menu>
                        {options.map(option => (
                            <Dropdown.Item key={option.key} {...option} />
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </Card.Content>
        </Card>
    );
};

export default CardWithDropdown;
