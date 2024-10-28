import React from 'react';
import './CartItem.css';
import { useNavigate } from 'react-router-dom';

const CartItem = ({ title, paymentType, paymentDue }) => {
  const navigate = useNavigate();

  const handleClick = () => {
// <<<<<<< shoppinglistpage
    console.log("not_implemented")
    // Navigate to a new page (this will be updated in the future)
    // Example: navigate(`/cart/${title}`); // Uncomment and adjust when ready
    navigate(`/cart/${title}`);
// =======
//     console.log("not_implemented");
    
//     navigate(`/cart/${encodeURIComponent(title)}`);
// >>>>>>> main
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
