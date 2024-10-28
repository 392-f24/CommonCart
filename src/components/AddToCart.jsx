// AddToCart.jsx
import React from 'react'
import { useState, useEffect } from 'react';
import './AddToCart.css'; 
import { useDbData, useDbUpdate, useAuthState } from '../utilities/firebase';


const AddToCartModal = ({ closeModal, cartId, cartTitle }) => {
    if (!closeModal) return null;

    const [user] = useAuthState();
    const [storeName, setStoreName] = useState('');
    const [item, setItem] = useState('');
    const [status] = useState(false);  // Set status to false initially
    const [userFulfilled, setUserFulfilled] = useState('');
    const [updateData, result] = useDbUpdate(`/Cart/${cartId}/items`);

    const handleOverlayClick = (e) => {
        if (e.target.className === 'modalBackground') {
            closeModal(false);
        }
    };

    const handleSave = () => {
        if (!cartId || !storeName || !item || !user) {
            console.error("Please ensure all fields are filled in and a user is logged in.");
            return;
        }

        const newItemId = `${Date.now()}`;
        const newItem = {
            itemName: item,
            status: status,
            store: storeName,
            userAdded: user.uid,
            userFulfilled: userFulfilled
        };

        // Add the item to the selected cart's items
        updateData({
            [newItemId]: newItem,
        });

        closeModal(false);
        setStoreName('');
        setItem('');
    };
      

  return (
    <div className="modalBackground" onClick={handleOverlayClick}>
        <div className="modalContainer">

            <div className="title">
                <h2>Add Item to {cartTitle}</h2>
            </div>
            
            <div className="body">
                <div className="address">

                    {/* Select from all carts */}
                        {/* <select
                            className="input fullWidth"
                            value={cartId}
                            onChange={(e) => setCartId(e.target.value)}
                        >
                            <option value="" disabled>Select a Cart</option>
                            {cartOptions.map((cart) => (
                                <option key={cart.id} value={cart.id}>
                                    {cart.title}
                                </option>
                            ))}
                        </select> */}

                        <input
                            className="input fullWidth"
                            value={storeName}
                            onChange={(e) => setStoreName(e.target.value)}
                            placeholder="Enter a store name"
                        />
                        <input
                            className="input fullWidth"
                            value={item}
                            onChange={(e) => setItem(e.target.value)}
                            placeholder="Enter an Item"
                        />
                    </div>



            </div>

            <div className="footer">
                <button  id='cancelBtn' onClick={() => closeModal(false)}>Cancel</button>
                <button id='saveBtn' onClick={handleSave}>Add Item</button>
            </div>

        </div> 
    </div>
  );
};

export default AddToCartModal;
