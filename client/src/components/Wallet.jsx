import Web3 from 'web3';
import React, { useState, Component } from 'react';

export default class Wallet extends Component{

    userAddress = this.props.userAdr;
    userPassword = this.props.userPdw;
    balanceEth=0;
    

    async loadWeb3(){  // chargement de la blockchain
        window.web3=new Web3('HTTP://127.0.0.1:7545');
    }
    async getDataUser()
    {
        this.loadWeb3();
        const web3 = window.web3
        this.balance = await window.web3.eth.getBalance(this.userAddress);
        console.log(this.balance)

    }


    render(){
        return(
            <div className='flex items-center justify-center bg-[#03001C] text-cyan-300 min-h-screen font-mono'>
                <h1>userAddress : {this.userAddress}</h1>
                <br />
                <h2>Balence : {this.balance} Eth</h2>
            </div>
        )
    }
}
