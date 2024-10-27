import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { OptionDropdown, OrangeButton } from "../Components/Buttons"
import './GoShoppingPage.css'
import { useDbData } from '../utilities/firebase';

var destinationOptions = [];
var cartOptions = [];
const GoShoppingPage = () => {
    const [data, error] = useDbData('/Cart');
    if (error) {
       console.log("Error loading data!");
    }

    if (data && typeof data === 'object'){
        const allCarts = Object.values(data);
        allCarts.map((c)=>{
            cartOptions.push(c.title);  
            c.shoppingStores.map((store)=>destinationOptions.push(store));
        });
        destinationOptions = [...new Set(destinationOptions)];
        cartOptions = [...new Set(cartOptions)];
    }

    const [destination, setDestination] = useState(["Select Destination"]);
    const [cart, setCart] = useState(["Select Cart"]);

    const navigate = useNavigate();
    const DirectCheckList = () => {
        navigate('/', { state: { destination, cart } } ); // TODO: navigate to the checklist page, pass data needed
        setDestination(["Select Destination"]);
        setCart(["Select Cart"])
      };
      return(
        <div className="center-container">
            <Card className="custom-card" style={{ width: '18rem' }}>
                <Card.Header className="custom-header text-center">Trip Details</Card.Header>
                <Card.Body>
                    <div className="mb-3">
                        <strong>Destination:</strong>
                        <OptionDropdown 
                            title={"Select Destination"}
                            newTitle={destination} 
                            onSelect={setDestination} 
                            options={destinationOptions} 
                            multiOption={false}
                        />
                    </div>
                    <div className="mb-3">
                        <strong>Cart:</strong>
                        <OptionDropdown 
                            title={"Select Cart"} 
                            newTitle={cart}
                            onSelect={setCart} 
                            options={cartOptions} 
                            multiOption={true}
                        />
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