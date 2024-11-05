import React from 'react';
import './CartItem.css';
import { useNavigate } from 'react-router-dom';

const CartItem = ({ title, description, memberCount }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // console.log("not_implemented")
    // Navigate to a new page (this will be updated in the future)
    // Example: navigate(`/cart/${title}`); // Uncomment and adjust when ready
    navigate(`/cart/${title}`);
  };

  return (
    <div className="cart-item" onClick={handleClick}>
      <h3>{title}</h3>
      <p className="cart-description">{description}</p>
      <p className="cart-members">Members: {memberCount}</p>
    </div>
  );
};

export default CartItem;
