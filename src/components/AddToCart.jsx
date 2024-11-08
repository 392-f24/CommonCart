// AddToCart.jsx
import React from 'react'
import { useState, useEffect } from 'react';
import './AddToCart.css'; 
import { useDbData, useDbUpdate, useAuthState } from '../utilities/firebase';


const AddToCartModal = ({ closeModal, cartId, cartTitle }) => {
    if (!closeModal) return null;

    const [user] = useAuthState();
    const [storeName, setStoreName] = useState('');
    const [quantityItem, setQuantityItem] = useState('');
    const [notes, setNotes] = useState('');


    const [item, setItem] = useState('');
    const [status] = useState(false);  
    const [userFulfilled, setUserFulfilled] = useState('');
    const [currCartData] = useDbData(`/Cart/${cartId}`);
    const [updateCartData] = useDbUpdate(`/Cart/${cartId}`)
    const [updateData, result] = useDbUpdate(`/Cart/${cartId}/items`);

    const handleOverlayClick = (e) => {
        if (e.target.className === 'modalBackground') {
            closeModal(false);
        }
    };

    const handleSave = async () => {
        if (!cartId || !item || !user) {
            console.error("Please ensure all fields are filled in and a user is logged in.");
            return;
        }
    
        const newItemId = `${Date.now()}`;
        const normalizedStoreName = storeName.trim().toLowerCase() || 'any store';
        const newItem = {
            itemName: item,
            status: false,
            store: normalizedStoreName,
            quantityItem: quantityItem,
            notes: notes,
            userAdded: user.uid,
            userFulfilled: userFulfilled
        };
    
        try {
            // Check if `shoppingStores` exists and update it if needed
            if (currCartData?.shoppingStores) {
                const existingStores = currCartData.shoppingStores.map(store => store.toLowerCase());
                
                // Add store only if it's not already in the list (case insensitive)
                if (!existingStores.includes(normalizedStoreName)) {
                    await updateCartData({
                        shoppingStores: [...currCartData.shoppingStores, normalizedStoreName]
                    });
                }
            } else {
                // If `shoppingStores` doesn't exist, initialize it
                await updateCartData({
                    shoppingStores: [normalizedStoreName]
                });
            }
        } catch (error) {
            console.error("Error updating shopping stores:", error);
        }
    
        // Add the item to the cart's items list
        await updateData({
            [newItemId]: newItem
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
                        <input
                            className="input fullWidth"
                            value={item}
                            onChange={(e) => setItem(e.target.value)}
                            placeholder="Enter an Item"
                        />
                        <input
                            className="input fullWidth"
                            value={storeName}
                            onChange={(e) => setStoreName(e.target.value)}
                            placeholder="Enter a store name: default Any Store"
                        />

                        <input
                            className="input fullWidth"
                            value={quantityItem}
                            onChange={(e) => setQuantityItem(e.target.value)}
                            placeholder="Enter the quantity for this Item"
                        />
                        <input
                            className="input fullWidth"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Notes/details for this item"
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
