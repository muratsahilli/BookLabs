import { Col, Row, Container, Card } from 'react-bootstrap';
import Navigation from './Navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [userCount, setUsers] = useState("");
  const [bookCount, setBooks] = useState("");
  const [authorCount, setAuthors] = useState("");
  useEffect(() => {
    (async () => await Load())();
  }, []);
  async function Load() {
    await axios.all([
      axios.get("http://localhost:5049/api/Users/counter"),
      axios.get("http://localhost:5049/api/Books/counter"),
      axios.get("http://localhost:5049/api/Authors/counter")
    ])
      .then(axios.spread((user, book, author) => {

        setUsers(user.data);
        setBooks(book.data);
        setAuthors(author.data);
      }));
  }
  return (
    <div style={{ minHeight: '100vh', paddingBottom: '60px' }}>
      <Navigation />
      <Container>
        <br></br>
        <div className="dashboard">
          <h1 className="title">Dashboard</h1>
          <Row>
            <Col lg={4}>
              <Card className="mb-2" style={{ backgroundColor: 'rgb(119, 160, 169)' }}>
                <Card.Body>
                  <Card.Title>Current User Count</Card.Title>
                  <Card.Text className="count">{userCount}</Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              <Card className="mb-2" style={{ backgroundColor: 'rgb(111, 125, 140)' }}>
                <Card.Body>
                  <Card.Title>Current Book Count</Card.Title>
                  <Card.Text className="count">{bookCount}</Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              <Card className="mb-2" style={{ backgroundColor: 'rgb(108, 89, 110)' }}>
                <Card.Body>
                  <Card.Title>Current Author Count</Card.Title>
                  <Card.Text className="count">{authorCount}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
}

export default Dashboard;