import React, { useEffect, useState } from 'react';
import { useDbData, useDbRemove, useDbUpdate } from '../utilities/firebase.js';
import { BackButtonMyCart } from '../Components/Buttons.jsx';
import './ShoppingListPage.css';
import { useParams } from 'react-router-dom';
import { useAuthState } from '../utilities/firebase.js';
import AddToCartModal from '../components/AddToCart';

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

  // Get initials from a name
  const getInitials = (name) => {
    return name.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
  };

  // Color mapping
  const colorMap = {};
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
        // Ensure each item has an ID mapped for direct access
        setItems(cartData.items ? Object.entries(cartData.items).map(([key, value]) => ({ id: key, ...value })) : []);
      } else {
        setItems([]);
      }
    }
  }, [carts, title]);

 
  const [updateData] = useDbUpdate(`/Cart/${cartId}`);
  const handleDelete = async (itemId) => {
    if (!cartId || !itemId) return;
  
    const item = items.find((item) => item.id === itemId);
    if (item && item.userAdded === currentUserId) {
      const itemStore = item.store.toLowerCase(); // Normalize store name
  
      try {
        // Step 1: Delete the item from the cart
        await removeItem(`/Cart/${cartId}/items/${itemId}`);
  
        // Step 2: Fetch updated cart data to check if the store still exists
        const updatedCartSnapshot = await get(ref(database, `/Cart/${cartId}`));
        const updatedCartData = updatedCartSnapshot.val() || {};
        const remainingItems = updatedCartData.items
          ? Object.values(updatedCartData.items)
          : [];
  
        // Step 3: Check if any remaining items have the same store
        const remainingItemsWithStore = remainingItems.filter(
          (otherItem) => otherItem.store.toLowerCase() === itemStore
        );
  
        // Step 4: If no items remain with that store, update `shoppingStores`
        if (remainingItemsWithStore.length === 0) {
          const updatedStores = updatedCartData.shoppingStores
            ? updatedCartData.shoppingStores.filter(
                (store) => store.toLowerCase() !== itemStore
              )
            : [];
  
          // Use the `useDbUpdate` hook to update `shoppingStores`
          await updateData(
            updatedStores.length > 0
              ? { shoppingStores: updatedStores }
              : { shoppingStores: ['any store'] }
          );
        }
  
        // Update the local state after deletion
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

  const currentUserId = user ? user.uid : null;

  return (
    <div className='shoppinglist-page'>
      <BackButtonMyCart />
      <h1>Shopping List: {title}</h1>
      <button>Sort By</button>
      <div className="shoppinglist-content-wrapper">
        <div className="shoppinglist-card">
          {items.length === 0 ? (
            <p>No items found in this cart.</p>
          ) : (
            <ul>
              {items.map((item) => {
                const addedById = item.userAdded;
                const addedByName = userMap[addedById] || 'Unknown User';
                const initials = getInitials(addedByName);
                const fulfilledByName = item.userFulfilled ? userMap[item.userFulfilled] : null;

                if (!colorMap[addedById]) {
                  colorMap[addedById] = addedById === currentUserId ? pastelGreen : randomPastelColor();
                }

                return (
                  <li key={item.id} className="shoppinglist-item">
                    <div className="user-initial" style={{ backgroundColor: colorMap[addedById] }}>
                      {initials}
                    </div>
                    <div className="shoppinglist-details">
                      <h2 style={{ 
                        textDecoration: item.status ? 'line-through' : 'none', 
                        color: item.status ? '#A0A0A0' : '#333'
                      }}>
                        {item.itemName}
                      </h2>
                      {item.status && fulfilledByName && (
                        <p className="fulfilled-text" style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>
                          Fulfilled by: {fulfilledByName}
                        </p>
                      )}
                      
                      {addedById === (user ? user.uid : '') && (
                        <button onClick={() => handleDelete(item.id)} className="delete-button">
                          Delete
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <button className="create-cart-button" onClick={() => setAddCartModal(true)}>
            Add Item to Cart
        </button>
      </div>

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
