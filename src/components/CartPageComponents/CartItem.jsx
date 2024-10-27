import React from 'react';
import './CartItem.css';
import { useNavigate } from 'react-router-dom';

const CartItem = ({ title, paymentType, paymentDue }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log("not_implemented");
    
    navigate(`/cart/${encodeURIComponent(title)}`);
  };

  return (
    <div className="cart-item" onClick={handleClick}>
      <h3>{title}</h3>
      <div className="payment-info">
        <span className="clock-icon">🕗</span>
        <span className="payment-type">{paymentType}</span>
      </div>
      <p className="payment-due">{paymentDue}</p>
    </div>
  );
};

export default CartItem;
