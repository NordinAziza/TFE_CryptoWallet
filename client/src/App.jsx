import "./App.css";
import { useState } from "react";
import Register from './components/Register';
import Wallet from "./components/Wallet";
import Login from './components/Login';
import Graph from "./components/Graph";
import Buy from "./components/Buy";
import Tokens from "./components/Tokens";
import Token from "./components/Token";
import Marketplace from './components/Marketplace'
import GraphWrapper from './components/GraphWrapper';
import { Routes, Route, useLocation } from 'react-router-dom'

function App() {
  const [login, setLogin] = useState(false);
  const [userAdr, setUserAdr] = useState("");
  const [userPdw, setUserPdw] = useState("");

  function changeState(userAddress, password) {
    setLogin(prevLogin => !prevLogin); // Toggle the value of login
    setUserAdr(userAddress);
    setUserPdw(password);
  }
  const location = useLocation();
  const { tokenData } = location.state || {};


  return (
    <Routes>
      <Route
        path="/"
        element={
          login ? (
            <Wallet userAdr={userAdr} changeState={changeState} />
          ) : (
            <Login login={login} changeState={changeState} />
          )
        }
      />
      <Route path="/register" element={<Register />} />
      <Route path="/marketplace" element={<Marketplace/>} />
      <Route path="/graph/:coin" element={<GraphWrapper />} />
      <Route path="/tokens" element={<Tokens />} />
      <Route
        path="/token/:symbol"
        element={<Token token={tokenData} />}
      />
      <Route path="/buy" element={<Buy/>} />
    </Routes>
    
  );
}

export default App;
