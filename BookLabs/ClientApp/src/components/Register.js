import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Button, Row, Container, Card, Form } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@.#$%]).{8,24}$/;

const Register = () => {
    const navigate = useNavigate();

    const userRef = useRef();
    const emailRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [fullName, setFullName]=useState('');

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [password, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setValidName(USER_REGEX.test(user));
    }, [user])

    useEffect(() => {
        emailRef.current.focus();
    }, [])

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email])

    useEffect(() => {
        setValidPwd(PASSWORD_REGEX.test(password));
        setValidMatch(password === matchPwd);
    }, [password, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [email, password, matchPwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("girildi")
        try {
            const url = "http://localhost:5049/api/Users/register";
            const response = await axios.post(url, {
                UserName: user,
                FullName: fullName,
                Email: email,
                Password: password
            });
            console.log(response.data);
            console.log(response.data.token);
            console.log(JSON.stringify(response));
            setUser("");
            setFullName("");
            setEmail("");
            setPwd("");
            setMatchPwd("");
            navigate("/");

        } catch (error) {
            if (!error?.response) {
                setErrMsg('No Server Response');
            } else if (error.response?.status === 409) {
                setErrMsg('Username Taken');
            } else {
                setErrMsg('Registration Failed')
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
                                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>

                                <div className="mb-3 mt-md-4">
                                    <h2 className="fw-bold mb-2 text-center text-uppercase ">
                                        Register
                                    </h2>
                                    <div className="mb-3">
                                        <Form onSubmit={handleSubmit}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="text-center" >Username</Form.Label>
                                                <Form.Control type="text"
                                                    id="username"
                                                    placeholder="Enter username"
                                                    ref={userRef}
                                                    autoComplete="off"
                                                    onChange={(e) => setUser(e.target.value)}
                                                    value={user}
                                                    required
                                                    aria-invalid={validName ? "false" : "true"}
                                                    aria-describedby="uidnote"
                                                    onFocus={() => setUserFocus(true)}
                                                    onBlur={() => setUserFocus(false)}
                                                />
                                                <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
                                                    <FontAwesomeIcon icon={faInfoCircle} />
                                                    4 to 24 characters.<br />
                                                    Must begin with a letter.<br />
                                                    Letters, numbers, underscores, hyphens allowed.
                                                </p>
                                            </Form.Group>
                                            <Form.Group className="mb-3" >
                                                <Form.Label className="text-center" >Full Name</Form.Label>
                                                <Form.Control autoComplete="off" type="text" placeholder="Enter Full Name" required onChange={(e) => setFullName(e.target.value)} />
                                            </Form.Group>

                                            <Form.Group className="mb-3" >
                                                <Form.Label className="text-center" htmlFor="email" >
                                                    Email address
                                                    <FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"} />
                                                    <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hide" : "invalid"} />
                                                </Form.Label>
                                                <Form.Control type="email"
                                                    id="email"
                                                    ref={emailRef}
                                                    autoComplete="off"
                                                    onChange={(e => setEmail(e.target.value))}
                                                    value={email}
                                                    required
                                                    aria-invalid={validEmail ? "false" : "true"}
                                                    aria-describedby="emailnote"
                                                    onFocus={() => setEmailFocus(true)}
                                                    onBlur={() => setEmailFocus(false)}
                                                    placeholder="Enter email" />
                                                <p id="emailnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                                                    <FontAwesomeIcon icon={faInfoCircle} />
                                                    Please obey the email rules.<br />
                                                    Example: john.doe@mail.com
                                                </p>
                                            </Form.Group>

                                            <Form.Group
                                                className="mb-3"
                                            >
                                                <Form.Label htmlFor="password" >Password</Form.Label>
                                                <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                                                <FontAwesomeIcon icon={faTimes} className={validPwd || !password ? "hide" : "invalid"} />

                                                <Form.Control placeholder="Password" type="password"
                                                    id="password"
                                                    onChange={(e) => setPwd(e.target.value)}
                                                    value={password}
                                                    required
                                                    aria-invalid={validPwd ? "false" : "true"}
                                                    aria-describedby="pwdnote"
                                                    onFocus={() => setPwdFocus(true)}
                                                    onBlur={() => setPwdFocus(false)}
                                                />
                                                <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                                                    <FontAwesomeIcon icon={faInfoCircle} />
                                                    8 to 24 characters.<br />
                                                    Must include uppercase and lowercase letters, a number and a special character.<br />
                                                    Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span><span aria-label="dot">.</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                                                </p>
                                            </Form.Group>
                                            <Form.Group
                                                className="mb-3"
                                            >
                                                <Form.Label htmlFor="confirm_pwd" >Confirm Password</Form.Label>
                                                <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                                                <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                                                <Form.Control type="password" placeholder="Confirm Password"
                                                    id="confirm_pwd"
                                                    onChange={(e) => setMatchPwd(e.target.value)}
                                                    value={matchPwd}
                                                    required
                                                    aria-invalid={validPwd ? "false" : "true"}
                                                    aria-describedby="confirmnote"
                                                    onFocus={() => setMatchFocus(true)}
                                                    onBlur={() => setMatchFocus(false)}
                                                />
                                                <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                                                    <FontAwesomeIcon icon={faInfoCircle} />
                                                    Must match the first password input field.
                                                </p>
                                            </Form.Group>

                                            <div className="d-grid">
                                                <Button disabled={!validName || !validEmail || !validPwd || !validMatch ? true : false} variant="primary" type="submit" >
                                                    Create Account
                                                </Button>
                                            </div>
                                        </Form>
                                        <div className="mt-3">
                                            <p className="mb-0  text-center">
                                                Already have an account??{' '}
                                                <Link to="../Login" className="text-primary fw-bold">
                                                    Sign In
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
export default Register