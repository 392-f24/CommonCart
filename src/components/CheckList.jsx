import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, ListGroup, Form } from 'react-bootstrap';
import { BackButton, OrangeButton } from "../Components/Buttons";
import { useAuthState } from "../utilities/firebase";

// Mock Data
const mockData = {
    "334108af-6b69-4557-8f84-03f54a7b835a": {
      "imageUrls": "",
      "items": {
        "b5fdb8d8-bb7a-43b0-9b76-927a246b34ad": {
          "itemName": "sugar",
          "status": false,
          "store": "Trader Joe's",
          "userAdded": "681buWUaPqMqOMNfBgjNESkWxoP2",
          "userFulfilled": ""
        }
      },
      "paymentDue": "OCT 21\"change to timestamp later",
      "paymentType": "Weekly",
      "shoppingStores": [
        "Trader Joe's"
      ],
      "title": "Org Event"
    },
    "4eefcdc9-77a3-4d4c-96b9-6343bd15f9bc": {
      "imageUrls": "",
      "items": {
        "113e9051-9a6e-4fba-88b5-ec7325c04a9b": {
          "itemName": "Minute Maid",
          "status": false,
          "store": "Target",
          "userAdded": "681buWUaPqMqOMNfBgjNESkWxoP2",
          "userFulfilled": ""
        },
        "11ab49fe-5218-4323-b419-fe8f68673ae9": {
          "itemName": "bread",
          "status": false,
          "store": "Walmart",
          "userAdded": "681buWUaPqMqOMNfBgjNESkWxoP2",
          "userFulfilled": ""
        }
      },
      "paymentDue": "OCT 21\"change to timestamp later",
      "paymentType": "Weekly",
      "shoppingStores": [
        "Walmart",
        "Target"
      ],
      "title": "Japan Summer Trip"
    },
    "64a52be5-feee-4a6b-a468-103c3d5fd024": {
      "imageUrls": "",
      "items": {
        "4ea262f2-4c2e-4880-b130-cce70bb24a20": {
          "itemName": "ginger",
          "status": false,
          "store": "Walmart",
          "userAdded": "681buWUaPqMqOMNfBgjNESkWxoP2",
          "userFulfilled": ""
        },
        "7b1d9345-137d-49fa-9c14-e6d2fd9c4998": {
          "itemName": "milk",
          "status": true,
          "store": "Walmart",
          "userAdded": "681buWUaPqMqOMNfBgjNESkWxoP2",
          "userFulfilled": "BNiVRglD53X2o1IdRDmeiIWHfOD3"
        },
        "c97b011c-a5e1-494d-bec3-36264bfdd583": {
          "itemName": "apple",
          "status": false,
          "store": "Target",
          "userAdded": "681buWUaPqMqOMNfBgjNESkWxoP2",
          "userFulfilled": ""
        },
        "cde08a66-1c15-4cdb-b61c-474a40ae0b8e": {
          "itemName": "chicken",
          "status": false,
          "store": "Trader Joe's",
          "userAdded": "681buWUaPqMqOMNfBgjNESkWxoP2",
          "userFulfilled": ""
        },
        "d59167c6-9a37-445e-aee5-59050437d698": {
          "itemName": "hammer",
          "status": false,
          "store": "Walmart",
          "userAdded": "681buWUaPqMqOMNfBgjNESkWxoP2",
          "userFulfilled": ""
        },
        "e07e388b-201a-4230-a441-1539b7d3b1b6": {
          "itemName": "Cheese",
          "status": false,
          "store": "Walmart",
          "userAdded": "681buWUaPqMqOMNfBgjNESkWxoP2",
          "userFulfilled": ""
        },
        "e420b6c9-80d7-4480-81b9-f8883580636e": {
          "itemName": "banana",
          "status": false,
          "store": "Walmart",
          "userAdded": "681buWUaPqMqOMNfBgjNESkWxoP2",
          "userFulfilled": ""
        }
      },
      "paymentDue": "OCT 21\"change to timestamp later",
      "paymentType": "Weekly",
      "shoppingStores": [
        "Walmart",
        "Target",
        "Trader Joe's"
      ],
      "title": "2024 Roommates"
    }
  }


function CheckList() {
    const location = useLocation();
    const { destOnly, cartKeysOnly } = location.state || {};
    const [user] = useAuthState();

    // Filter carts by `cartKeysOnly` and `destOnly` in `shoppingStores` 
    const filteredCarts = Object.entries(mockData)
        .filter(([cartId]) => cartKeysOnly.includes(cartId))
        .filter(([, cartData]) => cartData.shoppingStores.includes(destOnly[0]));

    // Get items with status `false`
    const initialItems = filteredCarts.flatMap(([, cartData]) =>
        Object.entries(cartData.items)
            .filter(([, itemData]) => itemData.status === false && itemData.store === destOnly[0])
            .map(([id, itemData]) => ({
                id,
                text: itemData.itemName,
                status: itemData.status
            }))
    );

    const [items, setItems] = useState(initialItems);

    // Toggle item checked state
    const handleCheck = (id) => {
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, status: !item.status } : item
            )
        );
    };

    // Update data on "Finish Shopping"
    const finishShopping = () => {
        items.forEach((item) => {
            if (item.status === true) {
                Object.values(mockData).forEach((cart) => {
                    if (cart.items[item.id]) {
                        cart.items[item.id].status = true;
                        cart.items[item.id].userFulfilled = user?.uid || "";
                    }
                });
            }
        });
        console.log("Updated mock data:", mockData);
        alert("Shopping finished! Checked items have been updated.");
    };

    return (
        <div className="d-flex flex-column align-items-center justify-content-center min-vh-100" style={{ padding: '2.0rem' }}>
            <BackButton />

            <Card
                style={{
                    width: '100%',
                    height: '65vh',
                    border: 'none',
                    backgroundColor: '#F5EDE0',
                    paddingTop: '1.0rem'
                }}
                className="text-center"
            >
                <Card.Body style={{ overflowY: 'auto', padding: '0', display: 'flex', flexDirection: 'column' }}>
                    <Card.Title style={{ fontFamily: "Josefin Sans", fontSize: '1.5rem', fontWeight: 'bold' }}>{new Date().toLocaleDateString()} Shopping Trip</Card.Title>

                    <ListGroup variant="flush" className="mb-3" style={{ backgroundColor: 'transparent' }}>
                        {items.map((item) => (
                            <ListGroup.Item
                                key={item.id}
                                className="d-flex align-items-center"
                                style={{
                                    textDecoration: item.status ? 'line-through' : 'none',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    fontFamily: "Josefin Sans",
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold',
                                    color: item.status ? '#A0A0A0' : 'inherit'
                                }}
                            >
                                <div className="d-flex align-items-center" style={{ width: '100%' }}>
                                    <Form.Check
                                        type="checkbox"
                                        checked={item.status}
                                        onChange={() => handleCheck(item.id)}
                                        className="me-2"
                                        style={{ cursor: 'pointer', accentColor: 'black' }}
                                    />
                                    {item.text}
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>

                    <div className="mt-auto" style={{ padding: '1.0rem' }}>
                        <OrangeButton title={"Finish Shopping"} onClick={finishShopping} />
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}

export default CheckList;
