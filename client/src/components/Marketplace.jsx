import React, {Component } from 'react';
import Web3 from 'web3';
import Token from '../contracts/Token.json';
import Nav from './Nav';
import TradeRequest from './TradeRequest';
import CircularProgress from '@mui/material/CircularProgress';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus,faMinus } from '@fortawesome/free-solid-svg-icons';

 export default class Trade extends Component{

    constructor(props){
        super(props);
        this.state = {
            user: {},
            TradeRequest: {},
            tokensBalance: {  
              symbol: [],
              balance: []
            },
            tokensDatas: {},
            selectedSymbol: '',
            selectedBalance: 0,
            showClosedRequests: false,
            showAddRequest : false,
            loaded: false
          };
          
    }
    async componentDidMount() {
        this.loadLocalStorage();
        await this.loadTradeRequestFromApi();
        this.setState({ loaded: true });
      }
  
    async loadWeb3(){  // chargement de la blockchain
        window.web3=new Web3('HTTP://127.0.0.1:7545');
    }
 
    loadLocalStorage() {
      var user = localStorage.getItem("userData");
      var tokensDatas = localStorage.getItem("tokensDatas");
      var tokensBalance = localStorage.getItem("tokensBalance");
    
      // Parse the JSON strings into objects
      user = JSON.parse(user);
      tokensDatas = JSON.parse(tokensDatas);
      tokensBalance = JSON.parse(tokensBalance);
    
      this.setState({ user, tokensDatas, tokensBalance });
    }
      
    async loadTradeRequestFromApi()
    {
        var url = 'https://localhost:7038/api/TradeRequest';
        const response = await fetch(url);
        const TradeRequest = await response.json();
        this.setState({ TradeRequest })
    }
    async updateTradeRequestToApi(id, newStatus) {
      var url = `https://localhost:7038/api/TradeRequest?id=${id}&newStatus=${newStatus}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });
    
      if (response.ok) {
        console.log('TradeRequest updated successfully');
      } else {
        console.error('Failed to update TradeRequest');
      }
    }

    async handleTrade(tradeRequest) {
      try {
        this.loadWeb3();
        const web3 = window.web3;
        const networkId = await web3.eth.net.getId();
        const networkData = Token.networks[networkId];
      
        if (networkData) {
          const token = new web3.eth.Contract(Token.abi, networkData.address);
          const sender = tradeRequest.user;
          const receiver = this.state.user;
          var tokenToTradeId = "";
          var tokenToReceiveId = "";

          tradeRequest.tokenToTrade === "BTC" ? (tokenToTradeId = 1) : tradeRequest.tokenToTrade === "DOGE" ? (tokenToTradeId = 2) : (tokenToTradeId = 3);
          tradeRequest.tokenToReceive === "BTC" ? (tokenToReceiveId = 1) : tradeRequest.tokenToReceive === "DOGE" ? (tokenToReceiveId = 2) : (tokenToReceiveId = 3);
    
          // Unlock the sender's account using the password
          await web3.eth.personal.unlockAccount(sender.address, sender.password, null, null);
          await web3.eth.personal.unlockAccount(receiver[3], receiver[2], null, null);
          // Convert the token amount to wei

          const amountToTrade = parseInt(tradeRequest.amountToTrade) //* (10**18);
          const amountToReceive = parseInt(tradeRequest.amountToReceive)//* (10**18);
    
          // Approve the trade amount from sender's address to the contract
          await token.methods.approve(sender.address, amountToTrade, tokenToTradeId).send({ from: sender.address });
          // Transfer tokens from sender's address to receiver's address
          var success1 = await token.methods.transferFrom(sender.address, receiver[3], amountToTrade, tokenToTradeId).send({ from: sender.address });
          console.log(success1)
          if (success1) {
            // Transfer tokens from receiver's address back to sender's address
            await token.methods.approve(receiver[3], amountToReceive, tokenToReceiveId).send({ from: receiver[3] });
          var success2 = await token.methods.transferFrom(receiver[3], sender.address,amountToReceive, tokenToReceiveId).send({ from: receiver[3] });
          }

          if(success1 && success2 )
           {
            // TO DO put request to change the status to complete
            
            await this.updateTradeRequestToApi(tradeRequest.id,"closed");
           }
        }
      } catch (error) {
        console.log(error);
      }
    }
    
    render() {
        if (!this.state.loaded) { // if state is not loaded, show a loading circle
            return (
              <div className="flex flex-col items-center justify-center bg-[#03001C] text-cyan-300 min-h-screen font-mono">
                <h1>Loading...</h1>
                <br />
                <CircularProgress/>
              </div>
            );
          }
      // Filter the trade requests based on the selectedSortOption
      const filteredTradeRequests = this.state.selectedSortOption === "pending"
      ? this.state.TradeRequest.filter((tradeRequest) => tradeRequest.status === "pending") // Show only pending requests
      : this.state.selectedSortOption === "closed"
      ? this.state.TradeRequest.filter((tradeRequest) => tradeRequest.status === "closed") // Show only closed requests
      : this.state.TradeRequest; // Show all requests

      return (
        <div className="flex flex-wrap justify-center bg-[#03001C] text-cyan-300 min-h-screen font-mono">
          <h1 className="w-full text-center text-3xl py-4">Marketplace</h1>
          <button className='w-full' onClick={() => this.setState({ showAddRequest: !this.state.showAddRequest })}>
            {this.state.showAddRequest ? 'Hide Trade Request' : 'Add Trade Request'}
            <FontAwesomeIcon
              className='border-2 p-2 rounded-xl border-cyan-300'
              icon={this.state.showAddRequest ? faMinus : faPlus}
              style={{ color: "#00fbff" }}
            />
          </button>
          {this.state.showAddRequest && (
            <TradeRequest
              user={this.state.user}
              TradeRequest={filteredTradeRequests} // Use the filtered trade requests
              tokensDatas={this.state.tokensDatas}
              tokensBalance={this.state.tokensBalance}
            />
          )}

          
          <div className="py-4">
            <div className="flex items-center mb-4">
            <button
                onClick={() => this.setState({ selectedSortOption: "all" })}
                className={`hover:text-[#A459D1]  text-cyan-300 py-2 px-4 border-2 border-cyan-300 rounded-xl ${
                  this.state.selectedSortOption === "all" ? "bg-cyan-300 font-black text-[#A459D1]" : ""
                }`}
              >
                All Requests
              </button>
              <button
                onClick={() => this.setState({ selectedSortOption: "pending" })}
                className={`hover:text-[#A459D1]  text-cyan-300 py-2 px-4 border-2 border-cyan-300 rounded-xl mr-2 ${
                  this.state.selectedSortOption === "pending" ? "bg-cyan-300 font-black text-[#A459D1]" : ""
                }`}
              >
                Pending Requests
              </button>
              <button
                onClick={() => this.setState({ selectedSortOption: "closed" })}
                className={`hover:text-[#A459D1]  text-cyan-300 py-2 px-4 border-2 border-cyan-300 rounded-xl mr-2 ${
                  this.state.selectedSortOption === "closed" ? "bg-cyan-300 font-black text-[#A459D1]" : ""
                }`}
              >
                Closed Requests
              </button>
            </div>
            <h2 className="text-2xl mb-2">Trading requests:</h2>
            <div className="flex flex-col">
              {filteredTradeRequests.map((tradeRequest, index) => (
                <div key={index} className="bg-[#1F1B38] rounded-md border-[#A459D1] border-2 p-4 mb-4">
                  <p className="mb-2">
                    <span className="font-semibold">Username:</span> {tradeRequest.user.username}
                  </p>
                  <p className="mb-2">
                    <span className="font-semibold">Trading:</span> {tradeRequest.amountToTrade} {tradeRequest.tokenToTrade} for {tradeRequest.amountToReceive} {tradeRequest.tokenToReceive}
                  </p>
                  <p>At: {new Date(tradeRequest.date).toLocaleString()}</p>
                  <p>
                    Status: {tradeRequest.status}
                  </p>
                  {this.state.user[0] !== tradeRequest.user.username && tradeRequest.status === "pending" ? (
                    <button
                      onClick={() => this.handleTrade(tradeRequest)}
                      className="hover:text-[#A459D1] text-cyan-300 py-2 px-4 border-2 border-cyan-300 rounded-xl"
                    >
                      Trade
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              ))}
            </div>
          </div>
          <div>
            <Nav handleLogout={this.props.handleLogout} ></Nav>
          </div>
        </div>
      );
    }
}