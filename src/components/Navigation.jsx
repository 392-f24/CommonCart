// Navigation.jsx

import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';


const CartLink = ({ isSelected, onClick }) => {
    return (
      <NavLink to="/" className="nav-item" onClick={onClick}>
        <div className="navLinkContent">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={isSelected ? 'white' : 'black'}
            width="30px"
            height="30px"
          >
            <path d="M7 18c-1.11 0-1.99.9-1.99 2S5.89 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.11 0-2 .9-2 2s.89 2 2 2 2-.9 2-2-.89-2-2-2zM7.81 16.22L6.25 5h14.65L21.71 13H8.22z" />
          </svg>
          <p className={`navText ${isSelected ? 'selectedText' : ''}`}>Cart</p>
        </div>
      </NavLink>
    );
  };
  
  const ReceiptLink = ({ isSelected, onClick }) => {
    return (
      <NavLink to="/receipts" className="nav-item" onClick={onClick}>
        <div className="navLinkContent">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={isSelected ? 'white' : 'black'}
            width="30px"
            height="30px"
          >
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-4-3h-6v-2h6v2zm0-4h-6V9h6v2z" />
          </svg>
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
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container >
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


        </Nav>
      </Container>
    </Navbar>
  );
};

export default Navigationbar;
