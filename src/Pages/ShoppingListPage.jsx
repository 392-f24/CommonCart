import React, { useEffect, useState } from 'react';
import { useDbData } from '../utilities/firebase.js'; // Import your custom hook for fetching data
import { OrangeButton } from '../Components/Buttons.jsx';
import './ShoppingListPage.css'; // Adjust the path as necessary


const ShoppingListPage = () => {
  const [carts, cartsError] = useDbData('Cart'); // Fetch cart data
  const [users, usersError] = useDbData('users'); // Fetch users data
  const [items, setItems] = useState([]);
  const [userMap, setUserMap] = useState({});

  console.log(users);

  useEffect(() => {
    if (users) {
      const map = {};
      // Ensure you are iterating over the correct structure
      Object.entries(users).forEach(([userId, user]) => {
        map[userId] = user.displayName; // Create a mapping of user ID to displayName
      });
      setUserMap(map);
    }
  }, [users]);
  

  useEffect(() => {
    if (carts) {
      const allItems = [];
      Object.values(carts).forEach(cart => {
        if (cart.items) {
          allItems.push(...Object.values(cart.items)); // Collect all items from each cart
        }
      });
      setItems(allItems);
    }
  }, [carts]);

  if (cartsError) {
    return <div>Error fetching carts: {cartsError.message}</div>;
  }

  if (usersError) {
    return <div>Error fetching users: {usersError.message}</div>;
  }

  return (
    <div className = 'white'>
        <OrangeButton/>
      <h1>Items in Carts</h1>
      {items.length === 0 ? (
        <p>No items found in carts.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.Item_id}>
              <h2>{item.itemName}</h2>
              <p>Store: {item.store}</p>
              <p>Status: {item.status}</p>
              <p>Added by: {userMap[item.userAdded] || 'Unknown User'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ShoppingListPage;
