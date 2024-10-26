import { useNavigate } from 'react-router-dom';
import './CartPage.css'
import { SignOut } from './SignIn';

const CartPage = () => {
    const navigate = useNavigate();
  

  
    return (
      <div className="cart-page">
        <p> Cart Page</p>   
        <SignOut/>

      </div>
    );
  };
  
  export default CartPage;
  