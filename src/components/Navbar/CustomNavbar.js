import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Button, Container, Form, FormControl } from 'react-bootstrap';
import { ArrowRight } from 'react-bootstrap-icons';
import { GetWithAuth } from '../../services/HttpService';
import '../Navbar/CustomNavbar.css'

function CustomNavbar() {
  let navigate = useNavigate();



  const handleLogout = () => {

    localStorage.removeItem('tokenKey');
    localStorage.removeItem('refreshKey');
    localStorage.removeItem('userName');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('role')
    // localStorage.setItem("currentUser", null)

    navigate('/auth');

    console.log("logout " + localStorage.getItem("currentUser"))

  };



  return (
    <Navbar expand="lg" className='navbar-color'>
      <Container>
        <Navbar.Brand as={Link} to="/" className="me-auto">
          Lokantacım
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {(localStorage.getItem("currentUser") == null) || (localStorage.getItem("currentUser") == "undefined") ||
              (localStorage.getItem("currentUser") == "null") ? (
              <Nav.Link as={Link} to="/auth">
                Login/Register
              </Nav.Link>

            ) : (
              <>
                <Button variant="link" className="me-2" onClick={handleLogout}>
                  <ArrowRight size={20} color="gray" />
                </Button>
                <Nav.Link as={Link} to={"/users/" + localStorage.getItem("currentUser")}>
                  Profile
                </Nav.Link>

              </>

            )}
          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}



export default CustomNavbar;