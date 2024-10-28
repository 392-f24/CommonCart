import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, ListGroup, Form, Modal } from 'react-bootstrap';
import { BackButton, OrangeButton } from "../Components/Buttons";
import { useAuthState, useDbData, useDbUpdate } from "../utilities/firebase"; // Import Firebase hooks

function CheckList() {
  const location = useLocation();
  const navigate = useNavigate();
  const { destOnly, cartKeysOnly } = location.state || {};
  const [user] = useAuthState();

  const [cartData] = useDbData('/Cart');
  const [updateData] = useDbUpdate('/Cart');

  const [items, setItems] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  if (cartData && items.length === 0) {
    // Filter carts by cartKeysOnly and destination
    const filteredCarts = Object.entries(cartData)
      .filter(([cartId]) => cartKeysOnly.includes(cartId))
      .filter(([, cartData]) => cartData.shoppingStores.includes(destOnly[0]));

    // Extract items with status false from filtered carts
    const initialItems = filteredCarts.flatMap(([cartId, cartData]) =>
      Object.entries(cartData.items)
        .filter(([, itemData]) => itemData.status === false && itemData.store === destOnly[0])
        .map(([id, itemData]) => ({
          id,
          cartId,
          itemName: itemData.itemName,
          status: itemData.status,
          store: itemData.store,
          userAdded: itemData.userAdded,
          userFulfilled: itemData.userFulfilled
        }))
    );

    setItems(initialItems);
    // console.log("items", items);
  }


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
    const updates = {};
    items.forEach((item) => {
      if (item.status === true) {
        const itemPath = `/${item.cartId}/items/${item.id}`;
        updates[itemPath] = {
          itemName: item.itemName,
          status: true,
          store: item.store,
          userAdded: item.userAdded,
          userFulfilled: user?.uid || ""
        };
      }
    });

    updateData(updates);

    // Show popup and redirect
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      navigate('/');
    }, 1300);
  };

  if (!cartData) return <p>Loading data...</p>;

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
          <Card.Title style={{ fontFamily: "Josefin Sans", fontSize: '1.5rem', fontWeight: 'bold' }}>{new Date().toLocaleDateString()} Shopping Trip {destOnly}</Card.Title>

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
                  {item.itemName}
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>

          <div className="mt-auto" style={{ padding: '1.0rem' }}>
            <OrangeButton title={"Finish Shopping"} onClick={finishShopping} />
          </div>
        </Card.Body>
      </Card>

      {/* Popup Modal */}
      <Modal
        show={showPopup}
        centered
        size="sm"
        onHide={() => setShowPopup(false)}
      >
        <Modal.Body
          className="text-center"
          style={{
            backgroundColor: '#F5EDE0',
            fontFamily: 'Josefin Sans',
            padding: '1rem',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <h4 style={{ fontFamily: 'Josefin Sans', fontSize: '2.0rem', fontWeight: 'bold' }}>Shopping Finished!</h4>
          <p style={{ fontFamily: 'Josefin Sans', fontSize: '1.4rem' }}>
            Your items have been updated successfully.
          </p>
        </Modal.Body>
      </Modal>

    </div>
  );
}

export default CheckList;
