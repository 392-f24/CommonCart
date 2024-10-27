import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { OptionDropdown, OrangeButton } from "../Components/Buttons"
import './GoShoppingPage.css'
const destinationOptions = ["Jewel", "Whole Foods", "Trader Joe's"];
const cartOptions = ["Roommates", "Spring Break Trip", "Club Meeting"];
const GoShoppingPage = () => {
    const [destination, setDestination] = useState("Select Destination");
    const [cart, setCart] = useState("Select Cart");

    const navigate = useNavigate();
    const DirectCheckList = () => {
        navigate('/'); // TODO: navigate to the checklist page, pass data needed
      };
      return(
        <div className="center-container">
            <Card className="custom-card" style={{ width: '18rem' }}>
                <Card.Header className="custom-header text-center">Trip Details</Card.Header>
                <Card.Body>
                    <div className="mb-3">
                        <strong>Destination:</strong>
                        <OptionDropdown title={destination} onSelect={setDestination} options={destinationOptions} />
                    </div>
                    <div className="mb-3">
                        <strong>Cart:</strong>
                    </div>
                    <div className="d-flex justify-content-center">
                        <OrangeButton title={"Go shopping"} onClick={DirectCheckList}/>
                    </div>
                </Card.Body>
            </Card>
        </div>
      );
    
}
export default GoShoppingPage