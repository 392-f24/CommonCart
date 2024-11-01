import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { OptionDropdown, OrangeButton } from "../Components/Buttons"
import './GoShoppingPage.css'
import { useDbData } from '../utilities/firebase';


const GoShoppingPage = () => {
  const [keyCart, setKeyCart] = useState({});
  const [data, error] = useDbData('/Cart');
  // map of cart names and the stores under that cart 
  // TODO: make sure destinations are removed from the cart when 
  // there are no items in the cart with that destination, or items 
  // are deleted
  const [cartDestinationMap, setCartDestinationMap] = useState({}); 
  const [cartOptions, setCartOptions] = useState([]);
  const [destinationOptions, setDestinationOptions] = useState([]);
  const [destination, setDestination] = useState(["Select Destination"]);
  const [cart, setCart] = useState(["Select Cart"]);


  useEffect(() => {
    if (error) {
      console.log("Error loading data!");
      return;
    }

        if (data && typeof data === 'object') {
            const allCarts = Object.values(data);
            const allKeys = Object.keys(data);

            // Create new objects for `keyCart`, `cartDestinationMap`, `cartOptions`, and `destinationOptions`
            const newKeyCart = {};
            const newCartDestinationMap = {};
            const newCartOptions = [];
            const newDestinationOptions = [];

            allCarts.forEach((c, index) => {
                newKeyCart[c.title] = allKeys[index];
                newCartDestinationMap[c.title] = c.shoppingStores;
                newCartOptions.push(c.title);

                {c.shoppingStores && c.shoppingStores.forEach((store) => {
                newDestinationOptions.push(store);
                })};
            });

            // Remove duplicates using Set
            setKeyCart(newKeyCart);
            setCartDestinationMap(newCartDestinationMap);
            setCartOptions([...new Set(newCartOptions)]);
            setDestinationOptions([...new Set(newDestinationOptions)]);
        }
    }, [data, error]); // Only re-run effect if `data` or `error` changes

    const navigate = useNavigate();
    const DirectCheckList = () => {
        const cartsOnly = cart.slice(1);
        const destOnly = destination.slice(1);
        const cartKeysOnly = cartsOnly.map((c) => keyCart[c]);
        console.log(destOnly);
        navigate('/go-shopping/checklist', { state: { destOnly, cartKeysOnly } } );
        setDestination(["Select Destination"]);
        setCart(["Select Cart"])
      };

      // handle set destination: when a destination is selected, the only carts that become visisble
      // are the carts that have items for that destination
      const handleSetDestination = (destination) => {
        setDestination(destination);
        // create a new list of carts, that include the selected destination
        const newCart = [];
        Object.keys(cartDestinationMap).forEach((cartOption) => {
            if (cartDestinationMap[cartOption].includes(destination[1])) {
                newCart.push(cartOption);
            } else if (cart.includes(cartOption)) {
                // if a cart is previously selected, but does not include the chosen destination
                // it is unselected
                // console.log(cartOption);
                setCart(["Select Cart"]);             
            }
        }
        );
        setCartOptions(newCart);
      }

      // handle set cart: when an option is selected, the only destinations that are shown
      // are the destinations that are included for that option
      useEffect(() => {
        // create a list of destinations that are included in the selected carts
        const newDest = [];
        if( cart.length !== 1 ){
            cart.forEach((c, index) => {
                if( index !== 0 && cartDestinationMap[c]){
                    newDest.push(...cartDestinationMap[c]);
                    console.log(newDest);
                }
            });
        }
        else {
            Object.values(cartDestinationMap).forEach((d) => {
                {d &&newDest.push(...d)};
            })
        }

        setDestinationOptions((prev) => { return [...new Set(newDest)] });

      }, [cart]);

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
                            onSelect={handleSetDestination} 
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