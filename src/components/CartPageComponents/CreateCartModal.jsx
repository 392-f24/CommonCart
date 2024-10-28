import React, { useState } from 'react';
import './CreateCartModal.css';
import SearchResultItem from './SearchResultItem';
import AddedItem from './AddedItem';
import { useDbUpdate, useDbData } from '../../utilities/firebase';

const mockStoreDatabase = [
  'Walmart', 'Wholefood', 'Sams', "Trader Joes's", 'Jewel Osco', 'Target' 
];

const CreateCartModal = ({ show, onClose, onAddCart }) => {
  const [cartName, setCartName] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [matchingUsers, setMatchingUsers] = useState([]);
  const [addedUsers, setAddedUsers] = useState([]);
  const [storeSearch, setStoreSearch] = useState('');
  const [matchingStores, setMatchingStores] = useState([]);
  const [addedStores, setAddedStores] = useState([]);

  const [updateData] = useDbUpdate('/Cart');
  const [usersData] = useDbData('/users');

  // console.log(usersData);

  const handleCreateClick = () => {
    if (cartName) {
      const newCart = {
        title: cartName,
        paymentType: 'One-time Payment',
        paymentDue: 'Next payment due',
        shoppingStores: addedStores,
        users: addedUsers,
        items: {},
        imageUrls: ""
      };

      // Save new cart to Firebase
      updateData({ [Date.now()]: newCart });

      // Reset states and close modal
      onClose();
      setCartName('');
      setUserSearch('');
      setAddedUsers([]);
      setStoreSearch('');
      setAddedStores([]);
    }
  };

  if (!show) return null;

  const handleOverlayClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      onClose();
    }
  };

  const handleUserSearch = () => {
    if (userSearch.trim() === '') {
      setMatchingUsers([]);
      return;
    }

    // Filter users based on displayName using the `userSearch` term
    const filteredUsers = Object.entries(usersData || {})
      .filter(([, user]) =>
        user.displayName.toLowerCase().includes(userSearch.toLowerCase())
      )
      .slice(0, 10);

    setMatchingUsers(filteredUsers.map(([id, user]) => ({ id, displayName: user.displayName })));
  };

  const handleAddUser = (user) => {
    if (!addedUsers.some((addedUser) => addedUser.id === user.id)) {
      setAddedUsers([...addedUsers, user]);
    }
    setMatchingUsers([]);
  };

  const handleDeleteAddedUser = (id) => {
    setAddedUsers(addedUsers.filter((user) => user.id !== id));
  };

  const handleStoreSearch = () => {
    if (storeSearch.trim() === '') {
      setMatchingStores([]);
      return;
    }
    const filteredStores = mockStoreDatabase
      .filter((store) => store.toLowerCase().includes(storeSearch.toLowerCase()))
      .slice(0, 5);
    setMatchingStores(filteredStores);
  };

  const handleAddStore = (store) => {
    if (!addedStores.includes(store)) {
      setAddedStores([...addedStores, store]);
    }
    setMatchingStores([]);
  };

  const handleDeleteAddedStore = (store) => {
    setAddedStores(addedStores.filter((s) => s !== store));
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
            <button className="search-button" onClick={handleUserSearch}>
              🔍
            </button>
          </div>

          {/* Matching Users Dropdown */}
          {matchingUsers.length > 0 && (
            <ul className="user-dropdown">
              {matchingUsers.map((user) => (
                <li key={user.id} className="user-dropdown-item">
                  <SearchResultItem label={user.displayName} onAdd={() => handleAddUser(user)} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Display Added Users */}
        <div className="added-users-container">
          {addedUsers.map((user) => (
            <AddedItem key={user.id} name={user.displayName} onDelete={() => handleDeleteAddedUser(user.id)} />
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

          {matchingStores.length > 0 && (
            <ul className="store-dropdown">
              {matchingStores.map((store, index) => (
                <li key={index} className="store-dropdown-item">
                  <SearchResultItem label={store} onAdd={() => handleAddStore(store)} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="added-stores-container">
          {addedStores.map((store, index) => (
            <AddedItem key={index} name={store} onDelete={() => handleDeleteAddedStore(store)} />
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
