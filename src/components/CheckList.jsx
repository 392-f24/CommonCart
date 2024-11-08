import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, ListGroup, Form, Modal } from 'react-bootstrap';
import { BackButton, OrangeButton } from "../Components/Buttons";
import { useAuthState, useDbData, useDbUpdate } from "../utilities/firebase";
import './CheckList.css';

function CheckList() {
  const location = useLocation();
  const navigate = useNavigate();
  const { destOnly, cartKeysOnly } = location.state || {};
  const [user] = useAuthState();

  const [cartData] = useDbData('/Cart');
  const [updateData] = useDbUpdate('/Cart');
  const [userData] = useDbData(`/users/${user?.uid}`);
  const [updateUserSummaries] = useDbUpdate(`/users`);
  const [updateSummaries] = useDbUpdate('/Summary');

  const [items, setItems] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  if (cartData && items.length === 0) {
    // Filter carts by cartKeysOnly and destination
    const filteredCarts = Object.entries(cartData)
      .filter(([cartId]) => cartKeysOnly.includes(cartId))
      .filter(([, cartData]) => {
        if (cartData.shoppingStores){
          return(
            cartData.shoppingStores.includes(destOnly[0]) || cartData.shoppingStores.includes('Any Store')
          )
        }});


    // Extract items with status false from filtered carts
    const initialItems = filteredCarts.flatMap(([cartId, cartData]) =>
      Object.entries(cartData.items)
        .filter(([, itemData]) => itemData.status === false && (itemData.store === destOnly[0] || itemData.store === 'Any Store'))
        .map(([id, itemData]) => ({
          id,
          cartId,
          itemName: itemData.itemName,
          status: itemData.status,
          store: itemData.store,
          userAdded: itemData.userAdded,
          userFulfilled: itemData.userFulfilled,
          quantityItem: itemData.quantityItem || '', 
          notes: itemData.notes || ''
        }))
    );
    

    setItems(initialItems);
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
    const itemUpdates = {};
    const storeUpdates = [];
    const completedItems = items.filter(item => item.status === true);

    // Update summaries
    const newSummaryId = `${Date.now()}`;

    const summaryData = {
      completedBy: user?.uid,
      completedAt: new Date().toISOString(),
      store: destOnly[0],
      cartIds: cartKeysOnly,
      items: completedItems.map(({ itemName, userAdded, userFulfilled }) => ({
        itemName,
        userAdded,
        userFulfilled: user?.uid
      }))
    };

    updateSummaries({ [newSummaryId]: summaryData });

    // Retrieve the users who belong to each cart in cartKeysOnly
    const userIdsToUpdate = new Set();

    cartKeysOnly.forEach(cartId => {
      const cart = cartData[cartId];
      if (cart && cart.users) {
        cart.users.forEach(user => userIdsToUpdate.add(user.id));
      }
    });

    console.log('userIdsToUpdate:', userIdsToUpdate);

    // Update each user's summaries with the new summary ID
    userIdsToUpdate.forEach(userId => {
      const userSummaryPath = `/${userId}/summaries`;
      const existingSummaries = userData?.summaries || [];
      const updatedSummaries = [...existingSummaries, newSummaryId];

      updateUserSummaries({
        [userSummaryPath]: updatedSummaries
      });
    });

    // Update cart items and manage store updates
    items.forEach((item) => {
      const itemPath = `/${item.cartId}/items/${item.id}`;
      if (item.status === true) {
        itemUpdates[itemPath] = {
          itemName: item.itemName,
          status: true,
          store: item.store,
          userAdded: item.userAdded,
          userFulfilled: user?.uid || ""
        };
      } else {
        storeUpdates.push(item.store);
      }
    });

    // Remove store from shoppingStores if all items are shopped
    if (!storeUpdates.includes(destOnly[0]) && !storeUpdates.includes('Any Store')) {
      cartKeysOnly.forEach((key) => {
        const storesPath = `/${key}/shoppingStores`;
        const newStores = cartData[key].shoppingStores.filter(
          store => store !== destOnly[0] && store !== 'Any Store'
        );

        updateData({ [storesPath]: newStores.length ? newStores : [] });
      });
    }

    updateData(itemUpdates);
    setShowPopup(true);

    setTimeout(() => {
      setShowPopup(false);
      navigate('/summaries');
    }, 1300);
  };

  if (!cartData) return <p>Loading data...</p>;

  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100" style={{ padding: '2.0rem' }}>
      <BackButton />

      <h1> {destOnly} </h1>

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
          <ListGroup variant="flush" className="mb-3">
            {items.map((item) => (
              <ListGroup.Item key={item.id} className="list-group-item">
                <div className="checkbox-container">
                  <Form.Check
                    type="checkbox"
                    checked={item.status}
                    onChange={() => handleCheck(item.id)}
                    style={{ cursor: 'pointer', accentColor: 'black' }}
                  />
                </div>
                <div className="item-details">
                  <span className="item-name" style={{ textDecoration: item.status ? 'line-through' : 'none', color: item.status ? '#A0A0A0' : 'inherit' }}>
                    {item.itemName}
                  </span>
                  {item.quantityItem && (
                    <div className="item-subtext">
                      <strong>Quantity:</strong> {item.quantityItem}
                    </div>
                  )}
                  {item.notes && (
                    <div className="item-subtext">
                      <strong>Notes:</strong> {item.notes}
                    </div>
                  )}
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
