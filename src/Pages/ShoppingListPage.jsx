import React, { useEffect, useState } from 'react';
import { useDbData } from '../utilities/firebase.js'; // Import your custom hook for fetching data
import { BackButtonMyCart } from '../Components/Buttons.jsx';
import './ShoppingListPage.css'; // Adjust the path as necessary
import { useParams } from 'react-router-dom';
import { useAuthState } from '../utilities/firebase.js'; // Import your custom useAuthState hook
import AddToCartModal from '../components/AddToCart';


const ShoppingListPage = () => {
  const [carts, cartsError] = useDbData('Cart'); // Fetch cart data
  const [users, usersError] = useDbData('users'); // Fetch users data
  const [items, setItems] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [user] = useAuthState(); // Use the custom hook to get the current user

  const { title } = useParams(); // Get the title from the URL
  const [showAddCartModal, setAddCartModal] = useState(false);
  const [cartId, setCartId] = useState(null); // State to hold cartId




  // Function to get initials from a name
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
        map[userId] = user.displayName; // Create a mapping of user ID to displayName
      });
      setUserMap(map);
    }
  }, [users]);

    // Set cartId based on title from URL
  useEffect(() => {
      if (carts) {
        const matchingCart = Object.entries(carts).find(
          ([, cart]) => cart.title === title
        );
        if (matchingCart) {
          const [id, cartData] = matchingCart;
          setCartId(id); // Set cartId based on the matching cart
          setItems(cartData.items ? Object.values(cartData.items) : []);
        } else {
          setItems([]); // No items if cart not found
        }
      }
    }, [carts, title]);

  if (cartsError) {
    return <div>Error fetching carts: {cartsError.message}</div>;
  }

  if (usersError) {
    return <div>Error fetching users: {usersError.message}</div>;
  }

  const currentUserId = user ? user.uid : null; // Get the current user's ID

  return (
    <div className='shoppinglist-page'>
      <BackButtonMyCart />
      <h1>Shopping List: {title}</h1>
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

                // Assign color if not already assigned
                if (!colorMap[addedById]) {
                  colorMap[addedById] = addedById === currentUserId ? pastelGreen : randomPastelColor();
                }

                return (
                  <li key={item.Item_id} className="shoppinglist-item">
                    <div className="user-initial" style={{ backgroundColor: colorMap[addedById] }}>
                      {initials}
                    </div>
                    <div className="shoppinglist-details">
                      <h2>{item.itemName}</h2>
                      {/* <p>Store: {item.store}</p> */}
                      {/* <p>Added by: {addedByName}</p> */}
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
                cartId={cartId} // Pass cartId to AddToCartModal
                cartTitle={title} // Pass cart title to AddToCartModal

            />
        )}
    </div>
  );
};

// Helper function to generate random pastel colors
const randomPastelColor = () => {
  const r = Math.floor(Math.random() * 128 + 127);
  const g = Math.floor(Math.random() * 128 + 127);
  const b = Math.floor(Math.random() * 128 + 127);
  return `rgb(${r}, ${g}, ${b})`;
};

export default ShoppingListPage;
