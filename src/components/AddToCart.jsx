// AddToCart.jsx
import React from 'react'
import { useState, useEffect } from 'react';
import './AddToCart.css'; 


const AddToCartModal = ({ closeModal }) => {
    if (!closeModal) return null;

    const handleOverlayClick = (e) => {
        if (e.target.className === 'modal-overlay') {
          onClose();
        }
      };

  return (
    <div className="modalBackground" onClick={handleOverlayClick}>
        <div className="modalContainer">

            <div className="title">
                <h2>Add Item to Cart</h2>
            </div>
            
            <div className="body">
                <p>YOYO this is add to cart page</p>
            </div>

            <div className="footer">
                <button  id='cancelBtn' onClick={() => closeModal(false)}>Cancel</button>
                <button id='saveBtn' >Save Profile</button>
            </div>

        </div> 
    </div>
  );
};

export default AddToCartModal;
