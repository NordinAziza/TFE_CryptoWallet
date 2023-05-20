import "./App.css";
import { useState } from "react";
import Register from './components/Register';
import Wallet from "./components/Wallet";
import Login from './components/Login';
import Graph from "./components/Graph";
import Tokens from "./components/Tokens";
import Marketplace from './components/Marketplace'
import GraphWrapper from './components/GraphWrapper';
import { Routes, Route } from 'react-router-dom'

function App() {
  var [login, setLogin] = useState(false);
  var [userAdr, setUserAdr] = useState("");
  var [userPdw, setUserPdw] = useState("");

  function changeState(userAdress, password) {
    setLogin(!login);
    setUserAdr(userAdress);
    setUserPdw(password);
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          login ? <Wallet userAdr={userAdr} /> : <Login login={login} changeState={changeState} />
        }
      />
      <Route path="/register" element={<Register />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/graph/:coin" element={<GraphWrapper />} />
      <Route path="/tokens" element={<Tokens />} />
    </Routes>
  );
}

export default App;
