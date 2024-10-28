//CartPage.jsx
import { useNavigate } from 'react-router-dom';
import './CartPage.css';
// import SignIn from './Pages/SignIn';
import { SignOut } from './SignIn';
import CartItem from '../components/CartPageComponents/CartItem';
import React, { useState } from 'react';
import CreateCartModal from '../components/CartPageComponents/CreateCartModal';
import AddToCartModal from '../components/AddToCart';

const CartPage = () => {
  const [showModal, setShowModal] = useState(false);

  //To Be moved
  const [showAddCartModal, setAddCartModal] = useState(false);

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

      {/* <div className="create-cart-container">
          <button 
              className="create-cart-button" 
              onClick={() => setAddCartModal(true)}
            >
              Add to Cart
            </button>
        </div>
      {showAddCartModal &&
        (<AddToCartModal closeModal={showAddCartModal} />
      )} */}
        <button className="create-cart-button" onClick={() => {
            setAddCartModal(true);
          }}> Add Item to Cart </button>

          {showAddCartModal && (
            <AddToCartModal
              closeModal={() => setAddCartModal(false)}
            />
          )}



    </div>
  );
};

export default CartPage;
