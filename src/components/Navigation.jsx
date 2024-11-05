// Navigation.jsx

import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { faMoneyCheckDollar } from '@fortawesome/free-solid-svg-icons';
import { faStore } from '@fortawesome/free-solid-svg-icons';




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
  
  const SummariesLink = ({ isSelected, onClick }) => {
    return (
      <NavLink to="/summaries" className="nav-item" onClick={onClick}>
        <div className="navLinkContent">
          <FontAwesomeIcon
              icon={faMoneyCheckDollar}
              color={isSelected ? 'white' : 'black'}
              size='lg'
            />
          <p className={`navText ${isSelected ? 'selectedText' : ''}`}>Summaries</p>
        </div>
      </NavLink>
    );
  };

  const ShoppingLink = ({ isSelected, onClick }) => {
    return (
      <NavLink to="/go-shopping" className="nav-item" onClick={onClick}>
        <div className="navLinkContent">
          <FontAwesomeIcon
              icon={faStore}
              color={isSelected ? 'white' : 'black'}
              size='lg'
            />
          <p className={`navText ${isSelected ? 'selectedText' : ''}`}>Go Shopping</p>
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
            />          
          </Nav.Link>

          <Nav.Link className="shoppingNav">
            <ShoppingLink 
              isSelected={selectedLink === 'go-shopping'} 
              onClick={() => setSelectedLink('go-shopping')} 
            />
          </Nav.Link>

          <Nav.Link className="summariesNav">
            <SummariesLink
              isSelected={selectedLink === 'summaries'} 
              onClick={() => setSelectedLink('summaries')} 
            />
          </Nav.Link>

        </Nav>
      {/* </Container> */}
    </Navbar>
  );
};

export default Navigationbar;
