import React, { useState } from 'react';
import './CreateCartModal.css';
import SearchResultItem from './SearchResultItem';
import AddedItem from './AddedItem';
import { useDbUpdate, useDbData ,useAuthState } from '../../utilities/firebase';
import { getFunctions, httpsCallable } from 'firebase/functions';

const CreateCartModal = ({ show, onClose}) => {
  const [cartName, setCartName] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [matchingUsers, setMatchingUsers] = useState([]);
  const [addedUsers, setAddedUsers] = useState([]);
  
  const [description, setDescription] = useState('');


  const [updateData] = useDbUpdate('/Cart');
  const [usersData] = useDbData('/users');
  //current user
  const [currentUser] = useAuthState();

  const handleCreateClick = async () => {
    if (!cartName) return;
  
    const newCart = {
      title: cartName,
      description,
      users: [
        { id: currentUser.uid, displayName: currentUser.displayName }
      ],
      items: {},
      imageUrls: ""
    };
  
    const cartId = Date.now().toString();
  
    // Save new cart to Firebase Realtime Database
    await updateData({ [cartId]: newCart });
  
    // Call Firebase Function to send invitations
    const functions = getFunctions();
    const sendInvitations = httpsCallable(functions, "sendCartInvitations");
    console.log(addedUsers);
    try {
      await sendInvitations({
        cartId,
        users: addedUsers,
        title: cartName,
      });
      console.log("Invitations sent successfully.");
    } catch (error) {
      console.error("Error sending invitations:", error);
    }
  
    // Reset states and close modal
    onClose();
    setCartName("");
    setUserSearch("");
    setAddedUsers([]);
    setDescription("");
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

    setMatchingUsers(filteredUsers.map(([id, user]) => ({ id, displayName: user.displayName ,email: user.email})));
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

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Create Cart</h2>
  
        <input
          type="text"
          placeholder="Cart Name"
          className="cart-name-input"
          value={cartName}
          onChange={(e) => setCartName(e.target.value)}
        />

        {/* Description Input */}
        <textarea
          placeholder="Description"
          className="cart-description-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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

        {/* Added Users Section */}
        <div className="added-users-container">
          {addedUsers.map((user) => (
            <AddedItem key={user.id} name={user.displayName} onDelete={() => handleDeleteAddedUser(user.id)} />
          ))}
        </div>

        {/* Create Button */}
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
