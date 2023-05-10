import Web3 from 'web3';
import React, {Component } from 'react';
import UserLogin from '../contracts/UserLogin.json';
import Token from '../contracts/Token.json';
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
          tokensBalance:[],
          totalBalance:0,
          loaded: false
        };
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
        return "ok";
      }
      
        
    async componentWillMount() {
        await this.loadWeb3();
        const balanceEth = await this.getUserData();
        this.setState({ balanceEth });
        await this.GetTokens();
        await this.getTokensBalance();
        await this.getTokensData();
        this.totalBalance=this.getTotalBalance();
        this.setState({ loaded: true })
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
          console.log(this.state.tokens)
          return true
        }
        else return false ;
      }
      sortTokens(sort) {
        if (sort === "ascending") {
          const sortedTokens = this.state.tokens.slice().sort();
          const sortedBalances = this.state.tokensBalance.slice().sort((a, b) => {
            const indexA = this.state.tokens.indexOf(sortedTokens[a]);
            const indexB = this.state.tokens.indexOf(sortedTokens[b]);
            return indexA - indexB;
          });
          this.setState({ tokens: sortedTokens, tokensBalance: sortedBalances });
        } else if (sort === "descending") {
          const sortedTokens = this.state.tokens.slice().sort().reverse();
          const sortedBalances = this.state.tokensBalance.slice().sort((a, b) => {
            const indexA = this.state.tokens.indexOf(sortedTokens[a]);
            const indexB = this.state.tokens.indexOf(sortedTokens[b]);
            return indexA - indexB;
          }).reverse();
          this.setState({ tokens: sortedTokens, tokensBalance: sortedBalances });
        }
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
            this.state.tokensBalance.push( await token.methods.balanceOf(this.state.userAddress,i).call() );
          }
          console.log(this.state.tokensBalance)
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
          const tokenBalance = parseFloat(this.state.tokensBalance[i]);
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
            <div className="w-16 h-16 border-4 border-cyan-300 rounded-full animate-spin"></div>
          </div>
        );
      }
        return(
            <div className='flex items-center justify-center bg-[#03001C] text-cyan-300 min-h-screen font-mono'>
              <div>
                <h1 className='text-center text-4xl'>Wallet:</h1>
                <h2>Username: {this.state.userName}</h2>
                <h2>Blockchain Address : {this.state.userAddress}</h2>
                <h2>
                    Balance :
                    <select className='bg-[#03001C] border-cyan-300 border-2 rounded-lg' defaultValue={'none'} onChange={(e) => this.sortTokens(e.target.value)}>
                      <option value="none">None</option>
                      <option value="ascending">Ascending</option>
                      <option value="descending">Descending</option>
                    </select>

                     {this.state.balanceEth}
                    <Link to={{ pathname: "/graph/ethusdt" }}>
                        <span className='hover:text-[#A459D1]  hover:border-[#A459D1] mr-2'>Eth</span>
                    </Link>
                    {this.state.tokensBalance[0]}
                    <Link to={ this.state.loaded?{ pathname: "/graph/"+this.state.tokens[0][1]+"usdt"} :""}>
                      <span className='hover:text-[#A459D1]  hover:border-[#A459D1] mr-2'>{this.state.loaded? this.state.tokens[0][1] : "loading..."}</span>
                    </Link>
                    {this.state.tokensBalance[1]}
                    <Link to={ this.state.loaded?{ pathname: "/graph/"+this.state.tokens[1][1]+"usdt"} :""}>
                      <span className='hover:text-[#A459D1]  hover:border-[#A459D1] mr-2'> {this.state.loaded? this.state.tokens[1][1] : "loading..."}</span>
                    </Link>
                    {this.state.tokensBalance[2]}
                    <Link to={ this.state.loaded?{ pathname: "/graph/"+this.state.tokens[2][1]+"usdt"} :""}>
                      <span className='hover:text-[#A459D1]  hover:border-[#A459D1] mr-2'>{this.state.loaded? this.state.tokens[2][1] : "loading..."}</span>
                    </Link>
                </h2>
                <h2>Total Balance in USD :
                  {
                    this.state.loaded ? this.totalBalance : 'loading...'
                  }$
                </h2>
              </div>
            </div>
        )
    }
}
