import React, { useContext } from 'react';
import { Navbar, Nav, Button, Container, Form } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthProvider";

function Navigation() {
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const logOut = async () => {
    // if used in more components, this should be in context 
    // axios to /logout endpoint 
    setAuth({});
    localStorage.removeItem("auth");
    navigate('/Login');
  }
  const name = localStorage.getItem("navName")
  return (
    <Navbar style={{ backgroundColor: 'rgb(119, 160, 169)',minHeight: '100px' }} expand="xl" variant="dark">
      <Container >
      <Navbar.Brand href="#" style={{ fontWeight: 'bold', fontSize: '2em' }}>
          WELCOME {name}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link  style={{ fontSize: '20px', fontWeight: 'bold', backgroundColor: 'rgb(75, 46, 57)' }} href="/Dashboard" replace={true}>Home</Nav.Link>
            <Nav.Link style={{ fontSize: '20px', fontWeight: 'bold', backgroundColor: 'rgb(111, 125, 140)'}} href="/Books">Books</Nav.Link>
            <Nav.Link style={{ fontSize: '20px', fontWeight: 'bold', backgroundColor: 'rgb(108, 89, 110)' }} href="/Authors">Authors</Nav.Link>
            <Nav.Link style={{ fontSize: "20px", fontWeight: "bold", backgroundColor: 'rgba(50, 2, 31, 0.9)'}} href="/Users" >Users</Nav.Link>

          </Nav>
          <Form className="d-flex">

            <Button variant="secondary" onClick={(logOut)}>Logout</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;