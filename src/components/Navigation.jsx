// Navigation.jsx

import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const Navigationbar = () => {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container >
        <Navbar.Brand href="/">
          {/* Your brand or logo here */}
        </Navbar.Brand>
        <Nav className="bottom-nav">
          <Nav.Link className="cartNav">
            <NavLink to="/">
              <p className="navText">Cart</p>
            </NavLink>
          </Nav.Link>
          <Nav.Link className="receiptNav">
            <NavLink to="/receipts">
              <p className="navText">Receipt</p>
            </NavLink>
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Navigationbar;

