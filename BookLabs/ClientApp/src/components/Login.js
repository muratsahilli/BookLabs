import { useRef, useState, useEffect } from "react";
import useAuth from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { Col, Button, Row, Container, Card, Form } from 'react-bootstrap';

const Login = () => {
    const { setAuth } = useAuth();

    const navigate = useNavigate();

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = "/Users/login";
            const response = await axios.post(url, {
                UserName: user,
                Password: pwd
            });
            console.log(JSON.stringify(response?.data));
            const accessToken = response.data.token;
            const roles = response?.data?.roles[0].roleName;
            setAuth({ user, pwd, roles, accessToken });
            
            console.log(setAuth);
            setUser('');
            setPwd('');
            localStorage.setItem("navName",response.data.fullName);
            localStorage.setItem("auth", JSON.stringify({ user, pwd, roles, accessToken }));
            if (roles === "admin") {
                navigate("/Dashboard")
            } else {
                navigate("/UserDashboard");
            }



        } catch (error) {
            if (!error?.response) {
                setErrMsg('No Server Response');
            } else if (error.response?.status === 400) {
                setErrMsg('Wrong Username or Password');
            } else if (error.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }
    return (
        <div>
            <Container>
                <Row className="vh-100 d-flex justify-content-center align-items-center">
                    <Col md={8} lg={6} xs={12}>
                        <Card className="px-4">
                            <Card.Body>
                                <div className="mb-3 mt-md-4">
                                    <h2 className="fw-bold mb-2 text-center text-uppercase ">
                                        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                                        Login
                                    </h2>
                                    <div className="mb-3">
                                        <Form onSubmit={handleSubmit}>
                                            <Form.Group className="mb-3" >
                                                <Form.Label className="text-center" htmlFor="username">
                                                    Username
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    id="username"
                                                    ref={userRef}
                                                    autoComplete="off"
                                                    onChange={(e) => setUser(e.target.value)}
                                                    value={user}
                                                    required />
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label htmlFor="password">Password</Form.Label >
                                                <Form.Control
                                                    type="password"
                                                    id="password"
                                                    onChange={(e) => setPwd(e.target.value)}
                                                    value={pwd}
                                                    required />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                            </Form.Group>
                                            <div className="d-grid">
                                                <Button variant="primary" type="submit" >
                                                    Login
                                                </Button>
                                            </div>
                                        </Form>
                                        <div className="mt-3">
                                            <p className="mb-0  text-center">
                                                Do you need an account??{' '}
                                                <Link to="../Register" className="text-primary fw-bold">
                                                    Register
                                                </Link>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
export default Login