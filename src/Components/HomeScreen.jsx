import React from 'react';
import {Link, useHistory} from 'react-router-dom';
import {NavLink, Nav, Navbar, Row, Col} from 'react-bootstrap';
import Image from '../Assets/Images/logo.jpeg';

export const HomeScreen = () => {
    const history = useHistory()

    const handleLogin = () => {
        history.push('/login');
    }

    const handleRegister = () => {
        history.push('/register');
    }

    return (
        <div class="homescreen">
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="#home">Bingo Minds</Navbar.Brand>
                <Nav className="ml-auto">
                <Nav.Link href="#home">Home</Nav.Link>
                <Nav.Link href="/login">Login</Nav.Link>
                <Nav.Link href="/register">Register</Nav.Link>
                </Nav>
            </Navbar>
            <Row>
                <Col>
                    <img src={Image} alt="h" width="93%"  />
                </Col>
                <Col className="my-auto">
        
                    <div style={{marginLeft:'120px'}}>
                        <h1>Welcome to Bingo Minds!</h1>    
                        <Row style={{marginLeft:'100px'}}>
                            <button className="submit-button" type="submit" onClick={handleLogin}>Login </button>
                        </Row>
                        <Row style={{marginLeft: '100px'}}> 
                            <button className="submit-button" type="submit" onClick={handleRegister}>Register</button>
                        </Row>
                    </div>
                
                    
                </Col>
            </Row>
        </div>
    )
}

export default HomeScreen;
