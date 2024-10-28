import { useState } from 'react';
import { Button, Dropdown, DropdownButton, Form } from 'react-bootstrap';
import "./Buttons.css"
import { useNavigate } from 'react-router-dom';
import BackButtonIcon from './BackButton.svg';

export const OrangeButton = ({onClick, title}) => (
    <Button className="orange-button" onClick={onClick}>{title}</Button>
);



export function BackButton() {
    const navigate = useNavigate();

    return (
        <Button
            variant="link"
            onClick={() => navigate('/go-shopping')}
            style={{ position: 'absolute', top: '20px', left: '20px', padding: '0' }}
        >
            <img src={BackButtonIcon} alt="Back" style={{ width: '48px', height: '48px' }} />
        </Button>
    );
}

export function BackButtonMyCart() {
    const navigate = useNavigate();

    return (
        <Button
            variant="link"
            onClick={() => navigate('/')}
            style={{ position: 'absolute', top: '20px', left: '20px', padding: '0' }}
        >
            <img src={BackButtonIcon} alt="Back" style={{ width: '48px', height: '48px' }} />
        </Button>
    );
}

export const OptionDropdown = ({ title, newTitle, onSelect, options, multiOption }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState({[newTitle[0]]: true});

    const handleToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleOptionChange = (option, checked) => {
        setSelectedOptions((prev) => {
            const updatedOptions = { ...prev, [option]: checked };
            
            // Create an array of selected options based on `checked` status
            const selectedArray = Object.keys(updatedOptions).filter((key) => updatedOptions[key]);
    
            // Call onSelect with the updated array of selected options
            onSelect(selectedArray);
            return updatedOptions;
        });
    };
    return (
        <DropdownButton
            variant="secondary"
            size="sm"
            title={(multiOption)? 
                (newTitle.length > 2 ? `${newTitle.length-1} groups selected` : newTitle[newTitle.length-1]):
                newTitle[newTitle.length-1]}
            className="ms-2 fixed-width-dropdown"
            onClick={(e) => {
                if (multiOption) {
                    e.preventDefault(); // Prevents the default toggle behavior
                    handleToggle();     // Manually handles the toggle
                }
            }}
            onSelect={(e) => onSelect([newTitle[0], e])}
        >
            {options.map((option, index) => (
                <Dropdown.Item 
                    as="div" 
                    key={index} 
                    eventKey={multiOption ? null : option}
                    onClick={multiOption ? (e) => e.stopPropagation() : null}
                >
                    {multiOption &&
                    <Form.Check
                        type="checkbox"
                        label={option}
                        checked={selectedOptions[option] || false}
                        onChange={(e) => {
                            handleOptionChange(option, e.target.checked);
                        }}
                    />}
                    {!multiOption && <div>{option}</div>}
                </Dropdown.Item>
            ))}
        </DropdownButton>
    );
};
