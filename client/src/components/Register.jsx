import Web3 from 'web3';
import React, { useState } from 'react';

const { Component } = require("react");

 export default class Register extends Component{

    async loadWeb3(){  // chargement de la blockchain
        window.web3=new Web3('HTTP://127.0.0.1:7545');
    }


    async createBlockchainUser(){
        this.loadWeb3();
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts();
        const newAccount = await web3.eth.personal.newAccount('test');
        console.log(newAccount);
    }

    handleSubmit = event => {
        event.preventDefault();
        this.createUser();
      };

    render(){
        return(
                <div>
                    <h1>Register</h1>
                    <form onSubmit={this.handleSubmit}>
                        <label htmlFor="userName">UserName:</label> <input type="text" id="userName" name="userName" />
                        <label htmlFor="email">e-mail:</label>      <input type="email" name="email" id="email" />
                        <label htmlFor="password">Password</label>          <input type="password" name="pwd" id="pwd" />

                        <button type="submit">Register</button>
                    </form>
              </div>
        )
    }
 }