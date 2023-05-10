import "./App.css";
import { useState } from "react";
import Register from './components/Register';
import Wallet from "./components/Wallet";
import Login from './components/Login';
import Graph from "./components/Graph";
import Tokens from "./components/Tokens";
import Marketplace from './components/Marketplace'
import { Routes, Route } from 'react-router-dom'



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
            <Route path="/" element={login ? <Wallet userAdr={userAdr} ></Wallet> : <Login login={login} changeState={changeState} ></Login> }></Route>
            <Route path="/register" element={<Register></Register>}></Route>
            <Route path="/marketplace" element={<Marketplace></Marketplace>}></Route>
            <Route path="/graph/:coin" element={<Graph ></Graph>}></Route>
            <Route path="/tokens" element={<Tokens></Tokens>} ></Route>
          </Routes>
  );
}

export default App;
