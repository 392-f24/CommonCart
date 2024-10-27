import { useNavigate, useLocation} from 'react-router-dom';
import { useState, useEffect } from 'react';
import './CartPage.css'
import { SignOut } from './SignIn';
import CartItem from '../components/CartPageComponents/CartItem';
import React, { useState } from 'react';
import CreateCartModal from '../components/CartPageComponents/CreateCartModal';

const CartPage = () => {
  const [showModal, setShowModal] = useState(false);

  // Example cart data
  const carts = [
    {
      title: '2024 Roommates',
      paymentType: 'Weekly Payment',
      paymentDue: 'Next payment due: Monday, October 21',
    },
    {
      title: 'Japan Summer Trip',
      paymentType: 'One time Payment',
      paymentDue: 'No payment due',
    },
  ];
// =======
//     const navigate = useNavigate();
//     const location = useLocation();
    
//     //TODO: remove this is just to show the data getting sent from Go Shopping
//     useEffect(() => {
//       const { destination, cart } = location.state || {};
//       console.log(destination.shift());
//       console.log(cart.shift());
//     }, [location.state]);
  
//     return (
//       <div className="cart-page">
//         <p> Cart Page</p>   
//         <SignOut/>
// >>>>>>> 24aac74 (go shopping page)

  return (
    <div className="cart-page">
      <h1>My Carts</h1>
      
      {/* Wrapper for controlling padding of cart-list and button */}
      <div className="cart-content-wrapper">
        <div className="cart-list">
          {carts.map((cart, index) => (
            <CartItem
              key={index}
              title={cart.title}
              paymentType={cart.paymentType}
              paymentDue={cart.paymentDue}
            />
          ))}
        </div>
        <div className="create-cart-container">
        <button 
            className="create-cart-button" 
            onClick={() => setShowModal(true)}
          >
            + Create Cart
          </button>
        </div>
      </div>
      <CreateCartModal show={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default CartPage;
