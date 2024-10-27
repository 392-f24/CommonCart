import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, ListGroup, Form } from 'react-bootstrap';
import { BackButton, OrangeButton } from "../Components/Buttons";

// Mock Data
const mockData = {
    "64a52be5-feee-4a6b-a468-103c3d5fd024": {
        "imageUrls": "",
        "items": {
            "e420b6c9-80d7-4480-81b9-f8883580636e": {
                "itemName": "banana",
                "status": false,
                "store": "Walmart",
                "userAdded": "681buWUaPqMqOMNfBgjNESkWxoP2",
                "userFulfilled": ""
            },
            "d59167c6-9a37-445e-aee5-59050437d698": {
                "itemName": "apple",
                "status": false,
                "store": "Walmart",
                "userAdded": "681buWUaPqMqOMNfBgjNESkWxoP2",
                "userFulfilled": ""
            },
            "c97b011c-a5e1-494d-bec3-36264bfdd583": {
                "itemName": "apple",
                "status": false,
                "store": "Target",
                "userAdded": "681buWUaPqMqOMNfBgjNESkWxoP2",
                "userFulfilled": ""
            },
            "4ea262f2-4c2e-4880-b130-cce70bb24a20": {
                "itemName": "ginger",
                "status": false,
                "store": "Walmart",
                "userAdded": "681buWUaPqMqOMNfBgjNESkWxoP2",
                "userFulfilled": ""
            },
            "e07e388b-201a-4230-a441-1539b7d3b1b6": {
                "itemName": "Minute Maid",
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
            "cde08a66-1c15-4cdb-b61c-474a40ae0b8e": {
                "itemName": "milk",
                "status": false,
                "store": "Trader Joe's",
                "userAdded": "681buWUaPqMqOMNfBgjNESkWxoP2",
                "userFulfilled": ""
            }
        },
        "paymentDue": "OCT 21",
        "paymentType": "Weekly",
        "shoppingStores": [
            "Walmart",
            "Target",
            "Trader Joe's"
        ],
        "title": "2024 Roommate"
    }
};

function CheckList() {
    const location = useLocation();
    const { destination, cart } = location.state || {};

    // Filter only items with status: false
    const initialItems = Object.entries(mockData[cart]?.items || {})
        .filter(([, itemData]) => itemData.store === destination && itemData.status === false)
        .map(([id, itemData]) => ({
            id,
            text: itemData.itemName,
            status: itemData.status
        }));

    const [items, setItems] = useState(initialItems);

    // Toggle item checked state
    const handleCheck = (id) => {
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, status: !item.status } : item
            )
        );
    };

    // Update the mock data
    const finishShopping = () => {
        items.forEach((item) => {
            if (item.status === true) {
                if (mockData[cart]?.items[item.id]) {
                    mockData[cart].items[item.id].status = true;
                }
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
