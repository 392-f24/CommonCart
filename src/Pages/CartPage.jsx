import { useNavigate, useLocation} from 'react-router-dom';
import { useState, useEffect } from 'react';
import './CartPage.css'
import { SignOut } from './SignIn';
import CartItem from '../components/CartPageComponents/CartItem';
import CreateCartModal from '../components/CartPageComponents/CreateCartModal';

const CartPage = () => {
  const [showModal, setShowModal] = useState(false);

  // Example cart data
  const [carts, setCarts] = useState([
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
  ]);
    const handleAddCart = (newCart) => {
      setCarts([...carts, newCart]);
    };
    const navigate = useNavigate();
    const location = useLocation();
    
    //TODO: remove this is just to show the data getting sent from Go Shopping
    useEffect(() => {
      const { destOnly, cartKeysOnly } = location.state || {};
      if(destOnly && cartKeysOnly){
        console.log(destOnly);
        console.log(cartKeysOnly);
      }
    }, [location.state]);

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
      <CreateCartModal show={showModal} onClose={() => setShowModal(false)} onAddCart={handleAddCart} />
    </div>
  );
};

export default CartPage;
