import { useNavigate } from "react-router-dom"
import { Container,Row,Col,Button } from "react-bootstrap";

const Unauthorized = () => {
    const navigate = useNavigate();

    const goBack = () => navigate(-1);

    return (
      <Container>
      <Row>
        <Col className="text-center">
          <h1>401 - Unauthorized</h1>
          <p>You are not authorized to access this page.</p>
          <Button onClick={goBack}>Go Back</Button>
        </Col>
      </Row>
    </Container>
    )
}

export default Unauthorized