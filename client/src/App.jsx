import "./App.css";
import { useState } from "react";
import Register from './components/Register'
import Wallet from "./components/Wallet";
import Login from './components/Login'
import Marketplace from './components/Marketplace'
import { Routes, Route } from 'react-router-dom'
import Graph from "./components/Graph";


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
            <Route path="/" element={login ? <Wallet userAdr={userAdr} ></Wallet> : <Graph></Graph> /*<Login login={login} changeState={changeState} ></Login>*/ }></Route>
            <Route path="/register" element={<Register></Register>}></Route>
            <Route path="/marketplace" element={<Marketplace></Marketplace>}></Route>
          </Routes>
  );
}

export default App;
