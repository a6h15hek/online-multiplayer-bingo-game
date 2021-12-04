import React from 'react';
import Logo from '../../Assets/Images/circled-logo.png';
import { Navbar,Container,Nav,Button } from 'react-bootstrap'
import './GameNavbar.css'

const GameNavbar = ({roomCreatedby, currentUser, exitFunction}) => {
    const [copyStatus, setCopyStatus] = React.useState("Click link to Copy");
    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href="/home" className="navbar-brand"><img src={Logo} width="65px" height="65px" alt="logo"/> </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav>
                        <Nav.Link active className="user" >
                             Room Created By : <b>{roomCreatedby}</b><br/>
                             Current User : <b>{currentUser}</b>
                        </Nav.Link>
                        <Nav.Link active onClick={()=>{navigator.clipboard.writeText(window.location.href); setCopyStatus("URL copied to Clipboard")}} className="link">
                            JoinUrl : <b>{window.location.href}</b><br/> <span>({copyStatus})</span>
                        </Nav.Link>
                        <Nav.Link >
                            <Button variant="danger" onClick={exitFunction} className="exit">Exit</Button> <br/><br/>
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default GameNavbar
