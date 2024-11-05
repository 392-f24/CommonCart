import { useState, useEffect } from 'react';
import './CartPage.css';
import { signOut, useDbData } from '../utilities/firebase';
import CartItem from '../components/CartPageComponents/CartItem';
import CreateCartModal from '../components/CartPageComponents/CreateCartModal';

const CartPage = () => {
  const [showModal, setShowModal] = useState(false);

  // Fetch carts data
  const [cartData, cartDataError] = useDbData('/Cart');
  const [carts, setCarts] = useState([]);

  useEffect(() => {
    if (cartData) {
      const transformedCarts = Object.entries(cartData).map(([cartId, cart]) => ({
        id: cartId,
        title: cart.title,
        paymentType: cart.paymentType === "Weekly" ? "Weekly Payment" : "One-time Payment",
        paymentDue: cart.paymentDue ? `Next payment due: ${cart.paymentDue}` : "No payment due",
      }));
      setCarts(transformedCarts);
    }
  }, [cartData]);

  const handleAddCart = (newCart) => {
    setCarts([...carts, newCart]);
  };

  return (
    <div className="cart-page">
      <h1>My Carts</h1>

      <div className="cart-content-wrapper">
        <div className="cart-list">
          {carts.map((cart) => (
            <CartItem
              key={cart.id}
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
        <div className="signoutContainer">
          <button className="create-cart-button" onClick={signOut}>
            Sign Out
          </button>
        </div>
      </div>

      <CreateCartModal show={showModal} onClose={() => setShowModal(false)} onAddCart={handleAddCart} />
    </div>
  );
};

export default CartPage;
