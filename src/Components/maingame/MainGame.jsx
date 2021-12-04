import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router';
import {useHistory} from 'react-router-dom';
import { getRoom, getUpdate, joinGame, onAnswerSelect, questionChoosed, updatescore } from '../../Services/game';
import { useAuth } from '../../authcontext';
import GameNavbar from './GameNavbar';
import { Container,Row, Col,ListGroup,Modal,Button } from 'react-bootstrap'
import './maingame.css';
import Countdown from 'react-countdown';

const MainGame = () => {
    const { currentUser } = useAuth();
    const history = useHistory()
    const {roomId} = useParams();
    const [isMember, setIsMember] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [answersList, setAnswersList] = useState([]);
    const [createdBy, setCreatedBy] = useState("");
    const [board, setBoard] = useState([{
        row : [{
            value:"",
            state:false
        }]
    }]);
    const [usersList, setUsersList] = useState([{
        id : "",
        name : "",
        score : 0
    }]);
    const [questionState, setQuestionState] = useState(new Array(25).fill(false)); 

    const [turnToChooseQuestion, setTurnToChooseQuestion] = useState("");
    const [turnToChooseIndex, setTurnToChooseIndex] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState("");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeToAnswer, setTimeToAnswer] = useState(false);
    const [status, setStatus] = useState("");
    const [gameWonVisible, setGameWonVisible] = useState(false);
    const [resultPosition, setResultPosition] = useState(0);
    const [noOfQuestionCompleted, setNoOfQuestionCompleted] = useState(0);

    const bingo = ['B','I','N','G','O','B']
    useEffect(() => {
        getRoom(roomId, ()=>{
            //loading
        },response => {
            if(response.success){
                setQuestions(response.data.questionset);
                setCreatedBy(response.data.createdby)
                if(!response.data.hasOwnProperty(currentUser.uid)){
                    setIsMember(false);
                    setAnswersList(response.data.answerset);
                }else{
                    setIsMember(true);
                    setBoard(response.data[currentUser.uid])
                }
            }
        });
    }, [roomId, currentUser])

    useEffect(() => {
        getUpdate(roomId,()=>{
            //loading function
        },response => {
            if(response.success){
                setUsersList(response.data.users);
                setQuestionState(response.data.questionstate);
                setTurnToChooseQuestion(response.data.turntochoosequestion);
                setTurnToChooseIndex(response.data.turnuserindex);
                setCurrentQuestion(response.data.currentquestion);
                setCurrentQuestionIndex(response.data.currentquestionindex);
                if(response.data.timetoanswer !== false){
                    var tempTimeToAnswer = (response.data.timetoanswer).toDate();
                    if(tempTimeToAnswer <= Date.now()){
                        setTimeToAnswer(false)
                    }else{
                        setTimeToAnswer(response.data.timetoanswer);
                    }
                }else{
                    setTimeToAnswer(false)
                }
                //check time past future . future set time if not false
                setResultPosition(response.data.position);
                setNoOfQuestionCompleted(response.data.noOfQuestionCompleted);
            }else{
                setStatus(response.message)
            }
        });
    }, [roomId, currentUser])


    const getFutureTimeStamp = (minutesToAdd) => {
        var currentDate = new Date();
        return new Date(currentDate.getTime() + minutesToAdd*60000);
    }
    
    const handleExit = () =>{
        history.push("/")
    }

    const handleJoinClick = () =>{
        joinGame(roomId, currentUser.displayName, currentUser.uid, answersList,()=>{
            //loading function
        },response => {
            if(response.success){
                setIsMember(true);
                setBoard(response.board)
            }else{
                setStatus(response)
            }
        });
    }
    const JoinModel = () =>{
        return (
            <>
              <Modal show={!isMember} onHide={handleExit}>
                <Modal.Header closeButton>
                  <Modal.Title>Join Game!!</Modal.Title>
                </Modal.Header>
                <Modal.Body>Room Created By : <b>{currentUser.displayName}</b></Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleExit}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={handleJoinClick}>
                    JOIN
                  </Button>
                </Modal.Footer>
              </Modal>
            </>
        );
    }

    const GameWonModel = () =>{
        const sortedScores =  usersList.sort( function ( a, b ) { 
                return (a.score >= b.score)?-1:1;
                                } );
            // console.log(sortedScores)
        return (
            <>
              <Modal show={gameWonVisible} aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                  <Modal.Title >Game Result </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {sortedScores.map((response, key)=> {
                        return <div key = {key}><h6>{response.name} -- Score : {response.score}
                        {key===0 && '🥇'}
                        {key===1 && '🥈'}
                        {key===2 && '🥉'}
                        </h6></div>
                    })}
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="primary" onClick={handleExit}>
                    Exit
                  </Button>
                </Modal.Footer>
              </Modal>
            </>
        );
    }
    const handleQuestionChoosed = (currentquestion, questionindex) =>{
        if(!timeToAnswer){
            if(turnToChooseQuestion === currentUser.uid){
                var newquestionstate = questionState;
                newquestionstate[questionindex] = true; 
                var nextUserIndex = 0;
                if(turnToChooseIndex === usersList.length-1){
                    nextUserIndex = 0;
                }else{
                    nextUserIndex = turnToChooseIndex+1;
                }
                const nextUserId = usersList[nextUserIndex].id;
                questionChoosed(roomId,currentquestion,questionindex,newquestionstate,nextUserIndex, nextUserId, getFutureTimeStamp(0.3),()=>{
                    //loading screen functions
                },response=>{
                    if(!response.success){
                        //check your  network connection error
                    }
                })
            }else{
                //alert box with message this is not your turn to choose question.
                setStatus("not your turn to choose question");
            }
        }else{
            setStatus("Wait for other to answer. wait for timer to end!!");
        }
    }
    const getCurrentAnswerIndex = () => {
        const answer = questions[currentQuestionIndex].answer;
        for(var row = 0; row < board.length; row++){
            for(var col = 0; col < board[row].row.length;col++){
                if(board[row].row[col].value === answer){
                    return {row : row, col :col}
                }
            }
        }
    }

    const getCurrentUserIndex = () => {
        for(var userindex = 0 ; userindex < usersList.length; userindex++){
            if(usersList[userindex].id === currentUser.uid){
                return userindex;
            }
        }
    }

    const timeTOAnserOver = () => {
        setTimeToAnswer(false);
        const correctAnswerIndex = getCurrentAnswerIndex();
        if(!board[correctAnswerIndex.row].row[correctAnswerIndex.col].state){
            //wrong answer
            setStatus("your answer is Wrong!!. you will not get point. Correct answer will be marked");
            //mark correct answer
            updateStateOfCell(correctAnswerIndex.row, correctAnswerIndex.col, true);

            //check bingo
            const bingovalue = noOfBingoForCell(correctAnswerIndex.row, correctAnswerIndex.col);
            if(bingovalue > 0){
                var newuserlist = [...usersList];
                var currentUserIndex = getCurrentUserIndex();
                newuserlist[currentUserIndex].bingo += bingovalue;
                newuserlist[currentUserIndex].score +=(2*bingovalue);
                updatescore(roomId, newuserlist, resultPosition, ()=> {
                    //laoding on screen
                }, response => {
                    if(response.success){

                    }else{
                        //error alert message
                    }
                });
            }
            onAnswerSelect(roomId, currentUser.uid, board, ()=>{
            //loading screen function
            },response=>{
                if(response.success){
                    setCurrentQuestion("");
                }else{
                    //error nework connectivity
                }
            });
        }
    }
    const updateStateOfCell = (row, col, state) => {
        let newBoard = [...board];
        newBoard[row].row[col].state = state;
        setBoard(newBoard);
    }

    const handleAnswerCellClick = (answer, row, col) => {
        if(!board[row].row[col].state){
            if(currentQuestion !== ""){
                //check if answer correct
                // var newBoard = board;
                var bingo_row, bingo_col;
                var newscore = 0;
                if(answer === questions[currentQuestionIndex].answer){
                    //correct answer
                    setStatus("Congrats!! your answer is correct. you got 1 point");
                    
                    updateStateOfCell(row,col, true);
                    // newBoard[row].row[col].state = true;

                    //setting row col vaue for bingo check
                    bingo_row = row;
                    bingo_col = col; 
                    
                    //score to be added
                    newscore = 1;
                    
                }else{
                    //wrong answer
                    setStatus("you have not submitted Correct response, you will not get any point. Correct answer will be marked");
                    //mark correct answer
                    const correctAnswerIndex = getCurrentAnswerIndex();
                    updateStateOfCell(correctAnswerIndex.row, correctAnswerIndex.col, true);

                    bingo_row = correctAnswerIndex.row;
                    bingo_col = correctAnswerIndex.col;
                    newscore = 0;
                }
                //check for bingo
                const bingovalue = noOfBingoForCell(bingo_row, bingo_col);
                if(bingovalue > 0 || newscore > 0){
                    //create new userlist
                    const currentUserIndex = getCurrentUserIndex();
                    var newuserlist = [...usersList];
                    if(newscore > 0) newuserlist[currentUserIndex].score += newscore;
                    if(bingovalue > 0){
                        newuserlist[currentUserIndex].bingo += bingovalue;
                        newuserlist[currentUserIndex].score += (2*bingovalue);
                    } 

                    //check if win
                    // if(newuserlist[getCurrentUserIndex()].bingo >= 5){
                    //     //you won
                    //     newuserlist[getCurrentUserIndex()].score += (3*bingovalue);
                    //     // newuserlist[getCurrentUserIndex()].score += (5 - resultPosition);
                    //     // setResultPosition(resultPosition+1);
                    // }
                    updatescore(roomId, newuserlist, resultPosition, ()=> {
                        //laoding on screen
                    }, response => {
                        if(response.success){

                        }else{
                            //error alert message

                        }
                    });
                }
                onAnswerSelect(roomId, currentUser.uid, board, ()=>{
                    //loading screen function
                },response=>{
                    if(response.success){
                        if(noOfQuestionCompleted > 24){
                            //game ended result screen
                            setGameWonVisible(true);
                        }
                    }else{
                        //error nework connectivity
                    }
                });
            }else{
                setStatus("question not selected.");
            }
        }else{
            //warning message :  answer cell is already selected
            setStatus("block is already selected")
        }
    }

    const noOfBingoForCell = (row, col) => {
        const checkRow = (row) =>{
            for(var i = 0; i < 5; i++){
                //console.log("row = "+row+" col = "+i+ "  State : " + board[row].row[i].state);
                if(!board[row].row[i].state) return false; 
            }
            return true;
        }
        const checkColumn = (col) => {
            for(var i = 0; i < 5; i++){
                //console.log("row = "+i+" col = "+col+ "  State : " + board[i].row[col].state );
                if(!board[i].row[col].state) return false; 
            }
            return true;
        }
        const checkRightDigonal = () => {
            for(var i = 0; i < 5; i++){
                //console.log("row = "+i+" col = "+i+ " State : " + board[i].row[i].state);
                if(!board[i].row[i].state) return false; 
            }
            return true;
        }
        const checkLeftDiagonal = () => {
            for(var i = 0; i < 5; i++){
                //console.log("row = "+i+" col = "+(4-i)+ "  State : " + board[i].row[4-i].state);
                if(!board[i].row[4-i].state) return false; 
            }
            return true;
        }
        var noOfBingo = 0;
        if(checkRow(row)) noOfBingo++;
        if(checkColumn(col)) noOfBingo++;
        if(row === col && checkRightDigonal()) noOfBingo++;
        if(row+col === 4 && checkLeftDiagonal()) noOfBingo++;
        return noOfBingo; 
    }
    return (
        <div>
            <JoinModel/>
            <GameWonModel/>
            <GameNavbar
                roomCreatedby={createdBy}
                currentUser={currentUser.displayName}
                exitFunction = {handleExit}
            />
            <Container fluid>
                <Row>
                    <Col xs={6} md={3}>
                        <div className={turnToChooseQuestion === currentUser.uid ? "highlight-div" : ""}> 
                            <ListGroup className={`mt-2 question-list `} scrollable={true} >
                                {questions.map((response, key)=>{
                                    return <ListGroup.Item className="listitem" key={key} action style={{cursor:'pointer'}} onClick={() => handleQuestionChoosed(response.question, key)}>
                                        {response.description !== "" ? "Topic : "+response.description : ""}
                                        {response.description !== "" ? <br/> : ""}
                                        Q{key+1}. : <span style={{textDecoration : questionState[key] ? 'line-through' : 'none'}}><b>{response.question} </b></span> 
                                    </ListGroup.Item>;
                                })}
                            </ListGroup>
                        </div>
                    </Col>
                    <Col xs={12} md={6} >
                        <div className="my-2 detail-card rounded bg-light p-2">
                            Question : <span className="current-question" >{currentQuestion}&nbsp;</span><br/>
                        </div>
                        <div className="game-board">
                            <table className="rounded">
                                {board.map((row, row_key)=>{
                                    return <tr key={row_key}>
                                        {
                                            row.row.map((cell,cell_key)=>{
                                                return <td className="answer-cell" bgcolor={board[row_key].row[cell_key].state ? "#2a9df4" : "#e0ac69" } onClick={()=>{handleAnswerCellClick(cell.value, row_key, cell_key)}}  key={cell_key}>
                                                    {cell.value}
                                                </td>;
                                            })
                                        }
                                        <td className="bingo-text">{bingo[row_key]}</td>
                                    </tr>
                                })}
                            </table>
                        </div>
                    </Col>
                    <Col xs={6} md={3} className="bg" >
                        <h5>Other Players</h5>
                        <ListGroup className=" users-list" scrollable={true} >
                            {usersList.map((response, key)=>{
                                return <ListGroup.Item key={key} action style={{cursor:'pointer'}}>
                                    {currentUser.uid === response.id ? <h6>You : {response.name}</h6> : <h6>Player name : {response.name}</h6>}
                                    <h6>Score : {response.score} &nbsp; bingo : {response.bingo}</h6>
                                    <h6>Status : {turnToChooseQuestion === response.id ? "turn to choose question" : ""}</h6>
                                </ListGroup.Item>;
                            })}
                        </ListGroup>
                        <div class="rounded bg-light p-2 my-2">
                            Timer : <span class="timer"> {timeToAnswer ? <Countdown date={timeToAnswer.toDate() + 10000} onComplete={timeTOAnserOver} /> : ""}</span><br/>
                            Assitant : <span class="assistant-msg" >{status}&nbsp;</span>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default MainGame;
