import { Button } from 'react-bootstrap';
import "./Buttons.css"

export const OrangeButton = ({onClick, title}) => (
    <Button className="orange-button" onClick={onClick}>{title}</Button>
);

