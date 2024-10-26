// Navigation.jsx

import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { faReceipt } from '@fortawesome/free-solid-svg-icons';




const CartLink = ({ isSelected, onClick }) => {
    return (
      <NavLink to="/" className="nav-item" onClick={onClick}>
        <div className="navLinkContent">
          <FontAwesomeIcon
            icon={faShoppingCart}
            color={isSelected ? 'white' : 'black'}
            size='lg'
          />
          
          <p className={`navText ${isSelected ? 'selectedText' : ''}`}>Cart</p>
        </div>
      </NavLink>
    );
  };
  
  const ReceiptLink = ({ isSelected, onClick }) => {
    return (
      <NavLink to="/receipts" className="nav-item" onClick={onClick}>
        <div className="navLinkContent">
          <FontAwesomeIcon
              icon={faReceipt}
              color={isSelected ? 'white' : 'black'}
              size='lg'
            />
          <p className={`navText ${isSelected ? 'selectedText' : ''}`}>Receipt</p>
        </div>
      </NavLink>
    );
  };

  const ProfileLink = ({ isSelected, onClick }) => {
    return (
      <NavLink to="/profile" className="nav-item" onClick={onClick}>
        <div className="navLinkContent">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            width="36px"
            height="36px"
            >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>

          <p className={`navText ${isSelected ? 'selectedText' : ''}`}>Profile</p>
        </div>
      </NavLink>
    );
  };

const Navigationbar = () => {

    const [selectedLink, setSelectedLink] = useState('');
    
  return (
    <Navbar expand="lg" className="bg-body-tertiary ">
      {/* <Container > */}
        <Navbar.Brand href="/">

        </Navbar.Brand>
        <Nav className="bottom-nav">

          <Nav.Link className="cartNav">
            {/* <NavLink to="/">
              <p className="navText">Cart</p>
            </NavLink> */}
            <CartLink 
              isSelected={selectedLink === 'cart'} 
              onClick={() => setSelectedLink('cart')} 
            />          </Nav.Link>

          <Nav.Link className="receiptNav">
            {/* <NavLink to="/receipts">
              <p className="navText">Receipt</p>
            </NavLink> */}
            <ReceiptLink 
              isSelected={selectedLink === 'receipt'} 
              onClick={() => setSelectedLink('receipt')} 
            />
          </Nav.Link>

          <Nav.Link as={NavLink} to="/go-shopping">
            <p>Go Shopping</p>
          </Nav.Link>

        </Nav>
      {/* </Container> */}
    </Navbar>
  );
};

export default Navigationbar;
