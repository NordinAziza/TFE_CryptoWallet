import Web3 from 'web3';
import React, { useState } from 'react';
import UserLogin from '../contracts/UserLogin.json'
import { Link, } from 'react-router-dom';
const { Component } = require("react");

export default class Login extends Component{
    state = {
        userAddress: null,
        login:false,
      };

    async loadWeb3(){  // chargement de la blockchain
        window.web3=new Web3('HTTP://127.0.0.1:7545');
    }

    async login(user){       //cree un nouvelle utilisateur dans la blockchain
        this.loadWeb3();
        const web3 = window.web3
        const networkId= await web3.eth.net.getId();
        const networkData = UserLogin.networks[networkId];
        if(networkData){          
                                  // check network
          const userlogin = new web3.eth.Contract(UserLogin.abi,networkData.address) ;   
          const userAddress=userlogin.methods.login(user.email,user.password).call()
          return(userAddress)
        } else return(false)     
    }

    handleSubmit = async event => {              //bouton submit
        event.preventDefault();
        const user = {
            email: event.target.email.value,
            password: event.target.password.value,
          };
        this.state.userAddress= await this.login(user)
       if(this.state.userAddress)
       {
         window.userWalletAddress=this.state.userAddress;
         console.log(window.userWalletAddress);
         let testBalance =await window.web3.eth.getBalance("0x8D351Cbc0673f2eFb6dC229660296dBdF3a6Caab");
         testBalance=Web3.utils.fromWei(testBalance,'ether');
         console.log( testBalance);

         //go to wallet
        this.props.changeState(this.state.userAddress,user.password);
       }
      };
      
    render () {
        return(
            
            <div className='flex items-center justify-center bg-[#03001C] text-cyan-300 min-h-screen font-mono'>
                <div>
                    <h1 className='text-center text-3xl h-12 w-full'>Login</h1>
                    <form onSubmit={this.handleSubmit}  className='flex flex-col w-1/3'>
                        <label htmlFor="email">e-mail:</label>
                        <input type="email" name="email" id="email" className='w-64 rounded-md py-2 px-3 text-[#301E67] ' />
                        <br />
                        <label htmlFor="password">Password:</label>
                        <input type="password" name="password" id="password" className='w-64 rounded-md py-2 px-3 text-[#301E67] '/>

                        <button type="submit" className='w-64 mt-5 py-1 bg- border-2 rounded-xl border-cyan-300 hover:text-[#A459D1] hover:border-[#A459D1]'>
                            Login
                        </button>
                        <label htmlFor="register" className='text-center w-64 p-2'>or</label>
                        <Link to="/register">
                            <button className='w-64 mt-5 py-1 bg- border-2 rounded-xl border-cyan-300 hover:text-[#A459D1] hover:border-[#A459D1]'>
                                register
                            </button>
                        </Link>
                    </form>
                </div>
            </div>
        
        )
    }
}