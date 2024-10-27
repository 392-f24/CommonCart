import React, { useState } from 'react';
import './CreateCartModal.css';

const CreateCartModal = ({ show, onClose }) => {
  // State for the cart name and user search inputs
  const [cartName, setCartName] = useState('');
  const [userSearch, setUserSearch] = useState('');
  // Click handler for the "Create" button
  const handleCreateClick = () => {
    onClose();
    console.log('Cart Name:', cartName);
    console.log('User Search:', userSearch);
    setCartName('');
    setUserSearch('');
  };

  // Only render the modal if 'show' is true
  if (!show) return null;

  // Click handler for overlay to close modal
  const handleOverlayClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      onClose();
    }
  };

  
  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Create Cart</h2>

        <input
          type="text"
          placeholder="cart name"
          className="cart-name-input"
          value={cartName}
          onChange={(e) => setCartName(e.target.value)}
        />
        {/* User Search Input (Search Bar Style) */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for user to add"
            className="search-input"
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
          />
          <button className="search-button">
            🔍
          </button>
        </div>

        <div className="button-container">
          <button className="create-button" onClick={handleCreateClick}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
};
export default CreateCartModal;
