import React, { useContext } from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthProvider";

function UserNavigation() {
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const logOut = async () => {
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
        <Navbar.Collapse id="navbarScroll" style={{ display: 'flex', justifyContent: 'center' }}>
          <Nav className="me-auto my-2 my-lg-0" navbarScroll>
            <Nav.Link
              style={{ fontSize: '20px', fontWeight: 'bold', backgroundColor: 'rgb(75, 46, 57)' }}
              href="/UserDashboard"
              replace={true}
            >
              Home
            </Nav.Link>
            <Nav.Link
              style={{ fontSize: '20px', fontWeight: 'bold', backgroundColor: 'rgb(111, 125, 140)'}}
              href="/UserBooks"
            >
              Books
            </Nav.Link>
            <Nav.Link
              style={{ fontSize: '20px', fontWeight: 'bold', backgroundColor: 'rgb(108, 89, 110)' }}
              href="/UserAuthors"
            >
              Authors
            </Nav.Link>
          </Nav>
          <Button variant="secondary" onClick={logOut}>
            Logout
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default UserNavigation;