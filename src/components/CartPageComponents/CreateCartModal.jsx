import React, { useState } from 'react';
import './CreateCartModal.css';
import SearchResultItem from './SearchResultItem';
import AddedItem from './AddedItem';
import { useDbUpdate, useDbData, useAuthState } from '../../utilities/firebase';
import { getFunctions, httpsCallable } from 'firebase/functions';

const CreateCartModal = ({ show, onClose }) => {
  const [cartName, setCartName] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [matchingUsers, setMatchingUsers] = useState([]);
  const [addedUsers, setAddedUsers] = useState([]);
  const [description, setDescription] = useState('');
  const [clickStartedOutside, setClickStartedOutside] = useState(false);

  const [updateData] = useDbUpdate('/Cart');
  const [usersData] = useDbData('/users');
  const [currentUser] = useAuthState();

  const handleCreateClick = async () => {
    if (!cartName) return;

    const newCart = {
      title: cartName,
      description,
      users: [{ id: currentUser.uid, displayName: currentUser.displayName }],
      items: {},
      imageUrls: '',
    };

    const cartId = Date.now().toString();
    

    if (addedUsers.length > 0) {
      const functions = getFunctions();
      const sendInvitations = httpsCallable(functions, 'sendCartInvitations');
      try {
        await sendInvitations({
          cartId,
          users: addedUsers,
          title: cartName,
        });
      } catch (error) {
        console.error('Error sending invitations:', error);
      }
    }
    await updateData({ [cartId]: newCart });
    onClose();
    setCartName('');
    setUserSearch('');
    setAddedUsers([]);
    setDescription('');
  };

  if (!show) return null;

  const handleMouseDown = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      setClickStartedOutside(true);
    } else {
      setClickStartedOutside(false);
    }
  };

  const handleMouseUp = (e) => {
    if (clickStartedOutside && e.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  const handleUserSearch = () => {
    if (userSearch.trim() === '') {
      setMatchingUsers([]);
      return;
    }

    const currentUserId = currentUser ? currentUser.uid : null;
    const filteredUsers = Object.entries(usersData || {})
      .filter(([id, user]) => user.displayName.toLowerCase().includes(userSearch.toLowerCase()) && id !== currentUserId)
      .slice(0, 10);

    setMatchingUsers(filteredUsers.map(([id, user]) => ({ id, displayName: user.displayName, email: user.email })));
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
    <div
      className="modal-overlay"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Create Cart</h2>

        <input
          type="text"
          placeholder="Cart Name"
          className="cart-name-input"
          value={cartName}
          onChange={(e) => setCartName(e.target.value)}
          maxLength={20}
        />

        <textarea
          placeholder="Description"
          className="cart-description-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={60}
        />
        <p className="char-warning" style={{ color: description.length === 60 ? 'red' : '#555' }}>
          {description.length === 60 ? 'Maximum length reached' : `${60 - description.length} characters remaining`}
        </p>

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

        <div className="added-users-container">
          {addedUsers.map((user) => (
            <AddedItem key={user.id} name={user.displayName} onDelete={() => handleDeleteAddedUser(user.id)} />
          ))}
        </div>

        <div className="button-container">
          <button className="create-button" onClick={handleCreateClick}>
            Create Cart and Send Invitation
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCartModal;
