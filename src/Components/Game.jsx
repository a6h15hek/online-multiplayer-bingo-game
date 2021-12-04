import React, { useState} from "react"
import { Modal, Button, Alert } from "react-bootstrap"
import { useAuth } from "../authcontext"
import { useHistory} from "react-router-dom"
import { prepareGame } from "../Services/game"
import './Game.css'


const Game=()=> {
    const { currentUser, logout } = useAuth();
    const history = useHistory();
    const [error,setError]=useState("");

  async function handleLogout() {
    setError("")
    try {
      await logout()
       history.push("/home");
    
    } catch {
      setError("Failed to log out")
    }
  }

  const sendVerificationEmail = () =>{
    currentUser.sendEmailVerification().then(()=>{
        window.alert("Email sent")
    }).catch((err) =>{
        window.alert(err)
    })
  }

  

  const startGame = () =>{
    prepareGame(currentUser.displayName,currentUser.uid,()=>{
        //loading function
        console.log("Loading...");
    },response =>{
        if(response.success){
            history.push("/"+response.link);
        }else{
            setError(response.message);
        }
    }); 
  }

  return (
    <React.Fragment>
            <div className="wrapper">
            <form className="form">
                <h2>Hi !!! <i>{currentUser.displayName}</i> !!!</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Modal.Body>
          <div className="d-grid gap-2 ">
            <Button className="primary">Resume</Button><br/><br/>
            <Button className="secondary" onClick={startGame}>Start Game</Button><br/><br/>
            <Button className="warning" onClick={sendVerificationEmail}>Send Verification Link</Button><br/><br/>
            <Button className="danger" onClick={handleLogout}>logout</Button> <br/><br/>
          </div>
        </Modal.Body>
            </form>
        </div>
        )
       </React.Fragment>
  )
}
export default Game;
