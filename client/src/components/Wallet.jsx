import Web3 from 'web3';
import React, { useState, Component } from 'react';

export default class Wallet extends Component{

    constructor(props) {
        super(props);
        this.state = {
          balanceEth: 0,
          userAddress : this.props.userAdr,
          userPassword : this.props.userPdw,
        };
      }
        
    async componentWillMount() {
        await this.loadWeb3();
        const balanceEth = await this.getBalance();
        this.setState({ balanceEth });
      }
    
    async loadWeb3(){  // chargement de la blockchain
        window.web3=new Web3('HTTP://127.0.0.1:7545');
    }
    async getBalance() {
        const web3 = window.web3;
        const balance = await web3.eth.getBalance(this.state.userAddress);
        console.log(balance)
        return web3.utils.fromWei(balance, 'ether');
      }
 
    render(){
      
        return(
            <div className='flex items-center justify-center bg-[#03001C] text-cyan-300 min-h-screen font-mono'>
                <h1>userAddress : {this.state.userAddress}</h1>
                <br />
                <h2>Balance : {this.state.balanceEth} Eth</h2>
            </div>
        )
    }
}
