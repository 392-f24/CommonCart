import { Button, Dropdown, DropdownButton } from 'react-bootstrap';
import "./Buttons.css"

export const OrangeButton = ({onClick, title}) => (
    <Button className="orange-button" onClick={onClick}>{title}</Button>
);

export const OptionDropdown = ({title, onSelect, options}) => {
    console.log(options);
    return(
    <DropdownButton
        variant="secondary"
        title={title}
        className="ms-2"
        onSelect={(e) => onSelect(e)}
    >
        {options.map((option, index) => (
            <Dropdown.Item key={index} eventKey={option}>
                {option}
            </Dropdown.Item>
        ))}
    </DropdownButton>
    );
}