import "./App.css";
import { useState, useEffect } from "react";
import Register from './components/Register';
import Wallet from "./components/Wallet";
import Login from './components/Login';
import Graph from "./components/Graph";
import Buy from "./components/Buy";
import Tokens from "./components/Tokens";
import Token from "./components/Token";
import Marketplace from './components/Marketplace'
import GraphWrapper from './components/GraphWrapper';
import { Routes, Route, useLocation,Navigate } from 'react-router-dom'

function App() {
  const [login, setLogin] = useState(false);
  const [userAdr, setUserAdr] = useState("");

  useEffect(() => {
    // Check if the login information exists in local storage
    const storedLogin = localStorage.getItem('login');
    const storedUserAdr = localStorage.getItem('userAdr');
    
    if (storedLogin && storedUserAdr) {
      setLogin(storedLogin === 'true');
      setUserAdr(storedUserAdr);
    }
  }, []);

  function changeState(userAddress, password) {
    setLogin(prevLogin => !prevLogin); // Toggle the value of login
    setUserAdr(userAddress);

    // Store the login information in local storage
    localStorage.setItem('login', !login);
    localStorage.setItem('userAdr', userAddress);
  }
  function handleLogout() {
    setLogin(false);
    setUserAdr("");
    localStorage.clear();
  }
  const location = useLocation();
  const { tokenData } = location.state || {};

  return (
    <Routes>
      <Route
        path="/"
        element={
          login ? (
            <Wallet userAdr={userAdr} changeState={changeState} handleLogout={handleLogout} />
          ) : (
            <Login login={login} changeState={changeState} />
          )
        }
      />
      <Route
        path="/marketplace"
        element={
          login ? <Marketplace handleLogout={handleLogout} /> : <Navigate to="/" replace />
        }
      />
      <Route
        path="/graph/:coin"
        element={
          login ? <GraphWrapper handleLogout={handleLogout} /> : <Navigate to="/" replace />
        }
      />
      <Route
        path="/tokens"
        element={
          login ? <Tokens handleLogout={handleLogout} /> : <Navigate to="/" replace />
        }
      />
      <Route
        path="/token/:symbol"
        element={
          login ? (
            <Token token={tokenData} handleLogout={handleLogout} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/buy"
        element={
          login ? <Buy handleLogout={handleLogout} /> : <Navigate to="/" replace />
        }
      />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;

