import Web3 from 'web3';
import React, { useState } from 'react';
import UserLogin from '../contracts/UserLogin.json'
import { Link, } from 'react-router-dom';
import { useNavigate } from 'react-router';
const { Component } = require("react");

 export default class Register extends Component{

    async loadWeb3(){  // chargement de la blockchain
        window.web3=new Web3('HTTP://127.0.0.1:7545');
    }
    async createBlockchainUser(user){       //cree un nouvelle utilisateur dans la blockchain
      this.loadWeb3();
      const web3 = window.web3
      const newAccount = await web3.eth.personal.newAccount(user.password);
      const accounts = await web3.eth.getAccounts();
      const networkId= await web3.eth.net.getId();
      const networkData = UserLogin.networks[networkId];
      if(networkData){          
                                // check network
        const userlogin = new web3.eth.Contract(UserLogin.abi,networkData.address) ;
        console.log(userlogin)    
        userlogin.methods.addUser(user.name, user.email, user.password, newAccount).send
          ({from:accounts[0] ,gas:9000000, value: web3.utils.toWei('1', 'ether')}) // ajoute 1 eth quand le compte est cree
      } 
  
      console.log(accounts)
      console.log(newAccount)
      return(newAccount)
  }
  

    handleSubmit = event => {                   //bouton submit
        event.preventDefault();
        const user = {
            name: event.target.userName.value,
            email: event.target.email.value,
            password: event.target.password.value,
          };
        console.log(user)
        try 
        {
          this.createUser(user);
        } catch (error) {
          
        }
      };
                                                //creation d'un utilisateur
      createUser(user){
        if(this.validateUser(user)){
           let account =  this.createBlockchainUser(user)
        }
      }

      validateUser(user){                    //verification des données passer
        if (user.name.trim() === '' || user.email.trim() === '' || user.password.trim() === '') {
            alert('Veuillez remplir tous les champs.');
            return false;
          } else if (!/\S+@\S+\.\S+/.test(user.email)) {
            alert('Veuillez saisir une adresse email valide');
            return false;
          } else {
            return true;
          }
      }

    render(){
        return(
          <div className='flex items-center justify-center bg-[#03001C] text-cyan-300 min-h-screen font-mono'>
          <div>
            <h1 className='text-center text-3xl h-12 w-full'>Register</h1>
            <form onSubmit={this.handleSubmit} className='flex flex-col w-1/3'>
              <label htmlFor="userName">UserName:</label>
              <input type="text" name="userName" id="userName" className='w-64 rounded-md py-2 px-3 text-[#301E67] '/>
              <br />
              <label htmlFor="email">e-mail:</label>
              <input type="email" name="email" id="email" className='w-64 rounded-md py-2 px-3 text-[#301E67] ' />
              <br />
              <label htmlFor="password">Password:</label>
              <input type="password" name="password" id="password" className='w-64 rounded-md py-2 px-3 text-[#301E67] '/>

              <button type="submit" className='w-64 mt-5 py-1 bg- border-2 rounded-xl border-cyan-300 hover:text-[#A459D1] hover:border-[#A459D1]'>
                Register
              </button>

              <Link to="/">
                            <button className='w-64 mt-5 py-1 bg- border-2 rounded-xl border-cyan-300 hover:text-[#A459D1] hover:border-[#A459D1]'>
                               Home Page
                            </button>
              </Link>
            </form>

          </div>
        </div>
        
        )
    }
 }
