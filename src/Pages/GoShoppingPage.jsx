import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { OptionDropdown, OrangeButton } from "../Components/Buttons"
import './GoShoppingPage.css'
import { useDbData } from '../utilities/firebase';

const GoShoppingPage = () => {
    const [keyCart, setKeyCart] = useState({});
  const [data, error] = useDbData('/Cart');
  const [cartOptions, setCartOptions] = useState([]);
  const [destinationOptions, setDestinationOptions] = useState([]);

  useEffect(() => {
    if (error) {
      console.log("Error loading data!");
      return;
    }

        if (data && typeof data === 'object') {
            const allCarts = Object.values(data);
            const allKeys = Object.keys(data);

            // Create new objects for `keyCart`, `cartOptions`, and `destinationOptions`
            const newKeyCart = {};
            const newCartOptions = [];
            const newDestinationOptions = [];

            allCarts.forEach((c, index) => {
                newKeyCart[c.title] = allKeys[index];
                newCartOptions.push(c.title);

                c.shoppingStores.forEach((store) => {
                newDestinationOptions.push(store);
                });
            });

            // Remove duplicates using Set
            setKeyCart(newKeyCart);
            setCartOptions([...new Set(newCartOptions)]);
            setDestinationOptions([...new Set(newDestinationOptions)]);
        }
    }, [data, error]); // Only re-run effect if `data` or `error` changes

    const [destination, setDestination] = useState(["Select Destination"]);
    const [cart, setCart] = useState(["Select Cart"]);

    const navigate = useNavigate();
    const DirectCheckList = () => {
        const cartsOnly = cart.slice(1);
        const destOnly = destination.slice(1);
        const cartKeysOnly = cartsOnly.map((c) => keyCart[c]);
        // console.log(cartKeysOnly);
        navigate('/go-shopping/checklist', { state: { destOnly, cartKeysOnly } } );
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