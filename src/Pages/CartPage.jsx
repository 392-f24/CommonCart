import { useNavigate } from 'react-router-dom';
import './CartPage.css';
import { SignOut } from './SignIn';
import CartItem from '../Components/CartItem';

const CartPage = () => {
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
          <button className="create-cart-button">+ Create Cart</button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
