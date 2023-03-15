import "./App.css";
import { useState } from "react";
import Register from './components/Register'
import Login from './components/Login'
import { Routes, Route } from 'react-router-dom'
import Wallet from "./components/Wallet";

function App() {
  var [login, setLogin] = useState(false);
  var [userAdr, setUserAdr] = useState("");
  var [userPdw, setUserPdw] = useState("");

  function changeState(userAdress,password) {
    login=setLogin(!login);
    userAdr=setUserAdr(userAdress);
    userPdw=setUserPdw(password);
  }

  return (
          <Routes>
            <Route path="/" element={login ? <Wallet userAdr={userAdr} userPdw={userPdw} ></Wallet> : <Login login={login} changeState={changeState} ></Login> }></Route>
            <Route path="/register" element={<Register></Register>}></Route>
          </Routes>
  );
}

export default App;
