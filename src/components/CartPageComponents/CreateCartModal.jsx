import React, { useState } from 'react';
import './CreateCartModal.css';
import SearchResultItem from './SearchResultItem';
import AddedItem from './AddedItem';

const mockUserDatabase = [
  'Haichen XU', 'Jane Smith', 'Alice Johnson', 'Bob Brown', 'Charlie White',
  'David Green', 'Eva Black', 'George Yellow', 'Hannah Blue', 'Isabella Gray',
  'Jack Purple', 'Kathy Pink', 'Liam Red', 'Mia Orange', 'Noah Silver',
  'Olivia Gold', 'Paul Copper', 'Quinn Bronze', 'Rachel Emerald', 'Sam Sapphire'
];


const mockStoreDatabase = [
  'Walmart', 'Wholefood' ,'Sams', 'Trader Joes','Jewel Osco','Target' 
];
const CreateCartModal = ({ show, onClose , onAddCart }) => {
  
  // State for the cart name and user search inputs
  const [cartName, setCartName] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [matchingUsers, setMatchingUsers] = useState([]);
  const [addedUsers, setAddedUsers] = useState([]);
  // states for store search
  const [storeSearch, setStoreSearch] = useState('');
  const [matchingStores, setMatchingStores] = useState([]);
  const [addedStores, setAddedStores] = useState([]);

  // Click handler for the "Create" button
  const handleCreateClick = () => {
    if (cartName) {
      const newCart = {
        title: cartName,
        paymentType: 'One time Payment',
        paymentDue: 'Next payment due',
      };

      // Use the callback to add the new cart
      onAddCart(newCart);
      onClose();
      
      // Reset states
      setCartName('');
      setUserSearch('');
      setAddedUsers([]);
      setStoreSearch('');
      setAddedStores([]);
    }
  };
  
  // Only render the modal if 'show' is true
  if (!show) return null;

  // Click handler for overlay to close modal
  const handleOverlayClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      onClose();
    }
  };
  //////////////////////////////////////////////////
  const handleSearch = () => {
    if (userSearch.trim() === '') {
      setMatchingUsers([]);
      return;
    }
    // Simulate filtering users 
  const filteredUsers = mockUserDatabase
      .filter((user) => user.toLowerCase().includes(userSearch.toLowerCase()))
      .slice(0, 10); // Limit to 10 users
  
    setMatchingUsers(filteredUsers);
  };
  
  const handleAddItem = (name) => {
    if (!addedUsers.includes(name)) {
      setAddedUsers([...addedUsers, name]);
    }
    setMatchingUsers([]);
  };

  const handleDeleteAddedItem = (name) => {
    setAddedUsers(addedUsers.filter((user) => user !== name));
  };
  // Same filter to handle store search//////////////////////////////
  const handleStoreSearch = () => {
    if (storeSearch.trim() === '') {
      setMatchingStores([]);
      return;
    }
  
    // Simulate filtering stores
    const filteredStores = mockStoreDatabase
      .filter((store) => store.toLowerCase().includes(storeSearch.toLowerCase()))
      .slice(0, 5); // Limit to 10 stores
  
    setMatchingStores(filteredStores);
  };
  
  const handleAddStore = (store) => {
    if (!addedStores.includes(store)) {
      setAddedStores([...addedStores, store]);
    }
    setMatchingStores([]); // Close the dropdown after adding
  };
  
  const handleDeleteAddedStore = (store) => {
    setAddedStores(addedStores.filter((s) => s !== store));
  };
  
  //////////////////////////////////////////////////////////////////
  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Create Cart</h2>
  
        {/* Cart Name Input */}
        <input
          type="text"
          placeholder="cart name"
          className="cart-name-input"
          value={cartName}
          onChange={(e) => setCartName(e.target.value)}
        />
  
        {/* Search for User Input */}
        <div className="search-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search for user to add"
              className="search-input"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />
            <button className="search-button" onClick={handleSearch}>
              🔍
            </button>
          </div>
  
          {/* Matching Users Dropdown */}
          {matchingUsers.length > 0 && (
            <ul className="user-dropdown">
              {matchingUsers.map((user, index) => (
                <li key={index} className="user-dropdown-item">
                  <SearchResultItem label={user} onAdd={handleAddItem} />
                </li>
              ))}
            </ul>
          )}
        </div>
  
        {/* Display Added Users */}
        <div className="added-users-container">
          {addedUsers.map((name, index) => (
            <AddedItem key={index} name={name} onDelete={handleDeleteAddedItem} />
          ))}
        </div>
  
        {/* Search for Shopping Store Input */}
        <div className="search-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search shopping store"
              className="search-input"
              value={storeSearch}
              onChange={(e) => setStoreSearch(e.target.value)}
            />
            <button className="search-button" onClick={handleStoreSearch}>
              🔍
            </button>
          </div>
  
          {/* Matching Stores Dropdown */}
          {matchingStores.length > 0 && (
            <ul className="store-dropdown">
              {matchingStores.map((store, index) => (
                <li key={index} className="store-dropdown-item">
                  <SearchResultItem label={store} onAdd={handleAddStore} />
                </li>
              ))}
            </ul>
          )}
        </div>
  
        {/* Display Added Stores */}
        <div className="added-stores-container">
          {addedStores.map((store, index) => (
            <AddedItem key={index} name={store} onDelete={handleDeleteAddedStore} />
          ))}
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
