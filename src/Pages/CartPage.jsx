import { useState, useEffect } from 'react';
import './CartPage.css';
import { signOut, useDbData, useAuthState } from '../utilities/firebase';
import CartItem from '../components/CartPageComponents/CartItem';
import CreateCartModal from '../components/CartPageComponents/CreateCartModal';

const CartPage = () => {
  const [showModal, setShowModal] = useState(false);

  // Fetch carts data
  const [cartData, cartDataError] = useDbData('/Cart');
  const [carts, setCarts] = useState([]);

  const [currentUser]= useAuthState();

  useEffect(() => {
    
    if (cartData && currentUser) {
      const userId = currentUser.uid; 
      const userName = currentUser.displayName; 

      const filteredCarts = Object.entries(cartData)
        .filter(([cartId, cart]) => 
          cart.users && cart.users.some(user => user.id === userId || user.displayName === userName)
        )
        .map(([cartId, cart]) => ({
          id: cartId,
          title: cart.title,
          description: cart.description || "No description provided",
          memberCount: cart.users ? cart.users.length : 0,
        }));
      
      setCarts(filteredCarts);
    }
  }, [cartData, currentUser]);

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
              description={cart.description}
              memberCount={cart.memberCount}
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
