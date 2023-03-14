import "./App.css";
import { useState } from "react";
import Marketplace from './components/Marketplace'
import Register from './components/Register'
import Login from './components/Login'
import { Routes, Route } from 'react-router-dom'
import Wallet from "./components/Wallet";

function App() {
  var login = useState(false);
  return (
          <Routes>
            <Route path="/" element={!login ? <Wallet></Wallet> : <Login></Login> }></Route>
            <Route path="/register" element={<Register></Register>}></Route>
          </Routes>
  );
}

export default App;
