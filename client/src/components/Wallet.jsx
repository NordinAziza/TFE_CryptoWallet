import Web3 from 'web3';
import React, {Component } from 'react';
import UserLogin from '../contracts/UserLogin.json'
export default class Wallet extends Component{
  

    constructor(props) {
        super(props);
        this.state = {
          balanceEth: 0,
          userAddress : this.props.userAdr,
          userPassword : '',
          userEmail: '',
          userName:'',
          coinData:{},
          loaded: false
        };
      }
      
      async GetEtherFromApi()
      {
        var url = 'https://api.wazirx.com/sapi/v1/ticker/24hr?symbol=ethusdt';
        const response = await fetch(url);
        const coinData = await response.json();
        console.log(coinData)
        this.setState({ coinData })
        this.setState({ loaded: true })
      }
        
    async componentWillMount() {
        await this.loadWeb3();
        const balanceEth = await this.getUserData();
        this.setState({ balanceEth });
      }
    
    async loadWeb3(){  // chargement de la blockchain
        window.web3=new Web3('HTTP://127.0.0.1:7545');
    }
    async getUserData() {
      // chargement de la blockchain et du contrat
        this.loadWeb3();
        const web3 = window.web3;
        const balance = await web3.eth.getBalance(this.state.userAddress);
        const networkId= await web3.eth.net.getId();
        const networkData = UserLogin.networks[networkId];
        if(networkData)
        { 
          const userlogin = new web3.eth.Contract(UserLogin.abi,networkData.address) ; 
          const user= await userlogin.methods.getUserByAddress(this.state.userAddress).call();
          this.state.userName = user[0];
          this.state.userEmail = user[1];
          this.state.userPassword = user[2];
          await this.GetEtherFromApi();
        }
        return web3.utils.fromWei(balance, 'ether');
      }
 
    render(){
        return(
            <div className='flex items-center justify-center bg-[#03001C] text-cyan-300 min-h-screen font-mono'>
              <div>
                <h1 className='text-center text-4xl'>Wallet:</h1>
                <h2>Username: {this.state.userName}</h2>
                <h2>Blockchain Address : {this.state.userAddress}</h2>
                <h2>Balance : {this.state.balanceEth} Eth  </h2>
                <h2>Total Balance in USD :{this.state.loaded ? this.state.balanceEth*+this.state.coinData.lastPrice : 'loading...'}$</h2>
              </div>
            </div>
        )
    }
}
