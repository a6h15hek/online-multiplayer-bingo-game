import React from 'react';
import {Switch, Route } from "react-router-dom";
import {AuthProvider} from './authcontext';
import Login from './Components/Login';
import Register from './Components/Register';
import PrivateRoute from './Components/PrivateRoute';
import Game from './Components/Game';
import ForgotPassword from "./Components/ForgotPassword.jsx";
import Home from './Components/HomeScreen';
import UpdateProfile from './Components/Updateprofile';
import './App.css';
import MainGame from './Components/maingame/MainGame';
import LeaderBoard from './Components/LeaderBoard';
import 'bootstrap/dist/css/bootstrap.min.css';
const App = () => {
  return (
    <AuthProvider>
        <Switch>
          <PrivateRoute exact path="/" component={Game} />
          <PrivateRoute path="/updateprofile" component={UpdateProfile} />
          <Route path="/home" exact component={Home} />
          <Route path="/register" exact component={Register} />
          <Route path="/login" exact component={Login} />  
          <Route path="/leaderboard" exact component={LeaderBoard} />  
          <Route path="/forgotpassword" component={ForgotPassword} />  
          <PrivateRoute exact path="/:roomId" component={MainGame} />    
        </Switch>
    </AuthProvider>
  );
};

export default App;
