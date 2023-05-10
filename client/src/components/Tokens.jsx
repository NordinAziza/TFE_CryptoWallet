import React from 'react';
import Web3 from 'web3';
import Token from '../contracts/Token.json';
export default class Tokens extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
          coinData:{},
          tokens:[],
          tokensBalance:[],
          loaded: false
        };
      }
          async loadWeb3(){  // chargement de la blockchain
            window.web3=new Web3('HTTP://127.0.0.1:7545');
        }

          

    render(){
        return(
            <div className='flex items-center justify-center bg-[#03001C] text-cyan-300 min-h-screen font-mono'>
                <div>Tokens</div>
                <ul>
                    <li></li>
                </ul>
            </div>
        )
    }
}