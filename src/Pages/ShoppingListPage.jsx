import React, { useEffect, useState, useRef } from 'react';
import { useDbData, useDbRemove, useDbUpdate } from '../utilities/firebase.js';
import { BackButtonMyCart } from '../Components/Buttons.jsx';
import './ShoppingListPage.css';
import { useParams } from 'react-router-dom';
import { useAuthState } from '../utilities/firebase.js';
import AddToCartModal from '../components/AddToCart';

import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';


const ShoppingListPage = () => {
  const [carts, cartsError] = useDbData('/Cart');
  const [users, usersError] = useDbData('/users');
  const [removeItem, removeResult] = useDbRemove();

  

  const [items, setItems] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [user] = useAuthState();

  const { title } = useParams();
  const [showAddCartModal, setAddCartModal] = useState(false);
  const [cartId, setCartId] = useState(null);
  const [sortOption, setSortOption] = useState('No Sorting');


  // Get initials from a name
  const getInitials = (name) => {
    return name.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
  };

  // Color mapping
  // const colorMap = {};
  const pastelGreen = '#A8E6CF';

  useEffect(() => {
    if (users) {
      const map = {};
      Object.entries(users).forEach(([userId, user]) => {
        map[userId] = user.displayName;
      });
      setUserMap(map);
    }
  }, [users]);

  useEffect(() => {
    if (carts) {
      const matchingCart = Object.entries(carts).find(
        ([, cart]) => cart.title === title
      );
      if (matchingCart) {
        const [id, cartData] = matchingCart;
        setCartId(id);
        setItems(cartData.items ? Object.entries(cartData.items).map(([key, value]) => ({ id: key, ...value })) : []);
      } else {
        setItems([]);
      }
    }
  }, [carts, title]);

  const currentUserId = user ? user.uid : null;

  const [updateData] = useDbUpdate(`/Cart/${cartId}`);

  const handleDelete = async (itemId) => {
    if (!cartId || !itemId) return;
    const item = items.find((item) => item.id === itemId);
  
    if (item && item.userAdded === currentUserId) {
      const itemStore = item.store.toLowerCase();
  
      try {
        // Step 1: Delete the item from the cart
        await removeItem(`/Cart/${cartId}/items/${itemId}`);
  
        await new Promise((resolve) => setTimeout(resolve, 200));
  
        const updatedCartSnapshot = await useDbData(`/Cart/${cartId}`);
        const updatedCartData = updatedCartSnapshot || {};
  
        const remainingItems = updatedCartData.items
          ? Object.values(updatedCartData.items)
          : [];
  
        const updatedStores = [
          ...new Set(remainingItems.map((otherItem) => otherItem.store.toLowerCase()))
        ];
  
        const finalStores = updatedStores.length > 0 ? updatedStores : ['any store'];
  
        await updateData(`/Cart/${cartId}`, { shoppingStores: finalStores });
  
        setItems(remainingItems);
      } catch (error) {
        console.error("Error deleting item or updating stores:", error);
      }
    } else {
      console.error("You don't have permission to delete this item.");
    }
  };
  
  

  
  
  

  if (cartsError) {
    return <div>Error fetching carts: {cartsError.message}</div>;
  }

  if (usersError) {
    return <div>Error fetching users: {usersError.message}</div>;
  }


    // Sorting functions
    const sortItems = (items) => {
      switch (sortOption) {
        case 'Sort by User':
          return sortByUser(items);
        case 'Sort Alphabetically':
          return items.sort((a, b) => a.itemName.localeCompare(b.itemName));
        case 'Sort by Store':
          return sortByStore(items);
        default:
          return items; // No sorting
      }
    };
  
    const sortByUser = (items) => {
      const groupedByUser = items.reduce((acc, item) => {
        const userName = userMap[item.userAdded] || 'Unknown User';
        if (!acc[userName]) acc[userName] = [];
        acc[userName].push(item);
        return acc;
      }, {});
  
      return Object.entries(groupedByUser).map(([userName, userItems]) => (
        <div key={userName} className="user-section">
          <h3>{userName}</h3>
          <ul>{userItems.map((item) => renderItem(item))}</ul>
        </div>
      ));
    };
  
    const sortByStore = (items) => {
      const groupedByStore = items.reduce((acc, item) => {
        const storeName = item.store || 'Any Store';
        if (!acc[storeName]) acc[storeName] = [];
        acc[storeName].push(item);
        return acc;
      }, {});

      return Object.entries(groupedByStore).map(([storeName, storeItems]) => (
        <div key={storeName} className="store-section">
          <h3>{storeName}</h3>
          <ul>{storeItems.map((item) => renderItem(item))}</ul>
        </div>
      ));
    };

    const getRandomPastelColor = () => {
      const r = Math.floor(Math.random() * 128 + 127);
      const g = Math.floor(Math.random() * 128 + 127);
      const b = Math.floor(Math.random() * 128 + 127);
      return `rgb(${r}, ${g}, ${b})`;
    };
    


    const colorMap = useRef({});

    const renderItem = (item) => {
      if (!item || typeof item !== 'object') return null;
    
      const addedById = item.userAdded;
      const addedByName = userMap[addedById] || 'Unknown User';
      const initials = getInitials(addedByName);
      const fulfilledByName = item.userFulfilled ? userMap[item.userFulfilled] : null;
    
      // Assign a color if not already assigned
      if (!colorMap.current[addedById]) {
        colorMap.current[addedById] = getRandomPastelColor();
      }
    
      const userColor = colorMap.current[addedById];
    
      return (
        <li key={item.id} className="shoppinglist-item">
          <div className="user-initial" style={{ backgroundColor: userColor }}>
            {initials}
          </div>
          <div className="shoppinglist-details">
            <h2 style={{ textDecoration: item.status ? 'line-through' : 'none', color: item.status ? '#A0A0A0' : '#333' }}>
              {item.itemName}
            </h2>
            {item.quantityItem && (
              <div style={{ fontSize: '0.9rem', color: '#666' }}>
                <strong>Quantity:</strong> {item.quantityItem}
              </div>
            )}
            {item.notes && (
              <div style={{ fontSize: '0.9rem', color: '#666' }}>
                <strong>Notes:</strong> {item.notes}
              </div>
            )}
            {item.status && fulfilledByName && (
              <p className="fulfilled-text" style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>
                Fulfilled by: {fulfilledByName}
              </p>
            )}
            {addedById === currentUserId && (
              <button onClick={() => handleDelete(item.id)} className="delete-button">
                Delete
              </button>
            )}
          </div>
        </li>
      );
    };
    
    
  
    const sortedItems = sortItems(items);
  


  return (
    <div className='shoppinglist-page'>
      <BackButtonMyCart />
      <h1>Shopping List: {title}</h1>

      <DropdownButton
        id="dropdown-sort-button"
        title={
          <>
            Sort By
          </>
        }
        onSelect={(eventKey) => setSortOption(eventKey)}
        className="sort-dropdown"
      >
        <Dropdown.Item eventKey="No Sorting">No Sorting</Dropdown.Item>
        <Dropdown.Item eventKey="Sort by User">Sort by User</Dropdown.Item>
        <Dropdown.Item eventKey="Sort Alphabetically">Sort Alphabetically</Dropdown.Item>
        <Dropdown.Item eventKey="Sort by Store">Sort by Store</Dropdown.Item>
      </DropdownButton>


      
      <div className="shoppinglist-content-wrapper">
        <div className="shoppinglist-card">
          {items.length === 0 ? (
            <p>No items found in this cart.</p>
          ) : (
            Array.isArray(sortedItems) ? (
              sortedItems.map((item, index) => (
                React.isValidElement(item) ? (
                  <div key={index}>{item}</div>
                ) : (
                  <div key={index}>{renderItem(item)}</div>
                )
              ))
            ) : (
              <p>No items to display</p>
            )
          )}
        </div>

        {/* Add Item Button */}
        <button
          className="add-item-button create-cart-button"
          onClick={() => setAddCartModal(true)}
        >
          Add Item to Cart
        </button>
      </div>

      {/* Modal for adding an item */}
      {showAddCartModal && (
        <AddToCartModal
          closeModal={() => setAddCartModal(false)}
          cartId={cartId}
          cartTitle={title}
        />
      )}

    </div>
  );
};

const randomPastelColor = () => {
  const r = Math.floor(Math.random() * 128 + 127);
  const g = Math.floor(Math.random() * 128 + 127);
  const b = Math.floor(Math.random() * 128 + 127);
  return `rgb(${r}, ${g}, ${b})`;
};

export default ShoppingListPage;
