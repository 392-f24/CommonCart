import { Button } from 'react-bootstrap';
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
