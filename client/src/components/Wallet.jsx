import Web3 from 'web3';
import React, {Component } from 'react';
import UserLogin from '../contracts/UserLogin.json';
import Token from '../contracts/Token.json';
import Nav from './Nav';
import CircularProgress from '@mui/material/CircularProgress';
import Bar from './Bar';
import { Link, } from 'react-router-dom';
export default class Wallet extends Component{
  

    constructor(props) {
        super(props);
        this.state = {
          balanceEth: 0, //etherenum balance from the blockchain
          userAddress : this.props.userAdr,
          userPassword : '',
          userEmail: '',
          userName:'',
          coinData:{},
          tokens:[],
          tokensDatas:[],
          tokensBalance:{symbol:[],balance:[]},
          totalBalance:0,
          loaded: false
        };
      }
     
    async componentWillMount() {
        await this.loadWeb3();
        const balanceEth = await this.getUserData();
        this.setState({ balanceEth });
        await this.GetTokens();
        await this.getTokensBalance();
        await this.getTokensData();
        this.setState({ loaded: true, totalBalance:this.getTotalBalance() })
      }
    
    async loadWeb3(){  //loading blockchain
        window.web3=new Web3('HTTP://127.0.0.1:7545');
    }
    //loading users data from blockchain
    async getUserData() {
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
      //loading token datas from blockchain
      async GetTokens()
      {
        this.loadWeb3();
        const web3 = window.web3;
        const networkId= await web3.eth.net.getId();
        const networkData =Token.networks[networkId];
        if(networkData)
        {
          const token= new web3.eth.Contract(Token.abi,networkData.address);
          const tokensMax = 3;
          for(let i = 1 ; i <= tokensMax; i++)
          {
            this.state.tokens.push( await token.methods.getTokenData(i).call() );
          }
          return true
        }
        else return false ;
      }
      // retreving the etherenum data from api      
      async GetEtherFromApi()
      {
        var url = 'https://api.wazirx.com/sapi/v1/ticker/24hr?symbol=ethusdt';
        const response = await fetch(url);
        const coinData = await response.json();
        this.setState({ coinData })
      }
      async  getTokenData(symbol) {
        const url = `https://api.wazirx.com/sapi/v1/ticker/24hr?symbol=${symbol.toLowerCase()}usdt`;
        const response = await fetch(url);
        const tokenData = await response.json();
        return tokenData;
      }
      
      async  getTokensData() {
        for (let i = 0; i < 3; i++) {
          const symbol = this.state.tokens[i][1];
          await new Promise((resolve) => setTimeout(resolve, 1000));
          const tokenData = await this.getTokenData(symbol);
          this.state.tokensDatas.push(tokenData);
        }
        this.state.tokensDatas.push(this.state.coinData);
        return "ok";
      }
      
      sortTokens(sortOrder)
       {
     
        const tokens = this.state.tokensBalance.symbol.slice();
        const balances = this.state.tokensBalance.balance.slice();
        
        // combine tokens and balances into an array of objects
        const combined = tokens.map((token, index) => ({ token, balance: balances[index] }));
      
        // sort the array of objects based on the balance and sortOrder
        combined.sort((a, b) => {
          if (sortOrder === 'ascending')
          {
            return a.balance - b.balance;
          } else if (sortOrder === 'descending')
          {
            return b.balance - a.balance;
          }
        });
      
        // unzip the sorted array of objects back into separate arrays
        const sortedTokens = combined.map(obj => obj.token);
        const sortedBalances = combined.map(obj => obj.balance);

        this.setState({ tokensBalance: { symbol: sortedTokens, balance: sortedBalances } });

      }
      
      

     async getTokensBalance()
      {
        this.loadWeb3();
        const web3 = window.web3;
        const networkId= await web3.eth.net.getId();
        const networkData =Token.networks[networkId];
        if(networkData)
        {
          const token= new web3.eth.Contract(Token.abi,networkData.address);
          const tokensMax = 3;
          for(let i = 1 ; i <= tokensMax; i++)
          {
            this.state.tokensBalance.balance.push( await token.methods.balanceOf(this.state.userAddress,i).call() );
            this.state.tokensBalance.symbol.push(this.state.tokens[i-1][1]) ;
          }
          this.state.tokensBalance.symbol.push("ETH")
          this.state.tokensBalance.balance.push(this.state.balanceEth)

          return true
        }
        else return false ;
      }
      getTotalBalance() {
        let total = 0;
      
        const ethBalance = parseFloat(this.state.balanceEth);
        const coinLastPrice = parseFloat(this.state.coinData.lastPrice);
      
        if (!isNaN(ethBalance) && !isNaN(coinLastPrice)) {
          total = ethBalance * coinLastPrice;
        }
      
        for (let i = 0; i < 3; i++) {
          const tokenBalance = parseFloat(this.state.tokensBalance.balance[i]);
          const tokenLastPrice = parseFloat(this.state.tokensDatas[i].lastPrice);
      
          if (!isNaN(tokenBalance) && !isNaN(tokenLastPrice)) {
            total += tokenBalance * tokenLastPrice;
          }
        }
  
        return total;
      }
      
    
    render(){
      if (!this.state.loaded) { // if state is not loaded, show a loading circle
        return (
          <div className="flex flex-col items-center justify-center bg-[#03001C] text-cyan-300 min-h-screen font-mono">
            <h1>Loading...</h1>
            <br />
            <CircularProgress />
          </div>
        );
      }
        return(
      
          <div className='flex items-center justify-center bg-[#03001C] text-cyan-300 min-h-screen font-mono'>
            <div>
              <Nav ></Nav>
            </div>
            <div>
              <h1 className='text-center text-4xl'>Wallet:</h1>
              <h2>Username: {this.state.userName}</h2>
              <h2>Blockchain Address : {this.state.userAddress}</h2>
              <h2>
                Balance :
                <br />
                <select className='bg-[#03001C] border-cyan-300 border-2 rounded-lg m-2' defaultValue={'none'} onChange={(e) => this.sortTokens(e.target.value)}>
                  <option value="none">Sort</option>
                  <option value="ascending">Ascending</option>
                  <option value="descending">Descending</option>
                </select>
    
                {this.state.tokensBalance.balance.map((balance, index) => (
                  <span key={index}>
                    {balance}
                    <Link to={this.state.loaded ? { pathname: "/graph/"+this.state.tokensBalance.symbol[index]+"usdt" } : ""}>
                      <span className='hover:text-[#A459D1]  hover:border-[#A459D1] mr-2'>{this.state.loaded ? this.state.tokensBalance.symbol[index] : "loading..."}</span>
                    </Link>
                  </span>
                ))}

              <Bar tokensBalance={this.state.tokensBalance} tokensDatas={this.state.tokensDatas} total={this.state.totalBalance} ></Bar>

              </h2>
              <h2>Total Balance in USD :
                {this.state.loaded ? this.state.totalBalance.toFixed(2) : 'loading...'}$
              </h2>
            </div>
          </div>

        )
    }
}
