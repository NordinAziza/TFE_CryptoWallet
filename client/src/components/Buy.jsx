import React, { Component } from 'react';
import Web3 from 'web3';
import Token from '../contracts/Token.json';
import Nav from './Nav';

export default class Buy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: JSON.parse(localStorage.getItem("userData")),
      tokens: JSON.parse(localStorage.getItem("tokens")),
      selectedSymbol: 0,
      selectedAmount: 0,
      purchaseCompleted: false, 
    };
  }

  async loadWeb3() {
    // Loading blockchain
    window.web3 = new Web3('HTTP://127.0.0.1:7545');
  }

  handleSymbolChange = (e) => {
    const selectedSymbol = parseFloat(e.target.value);
    this.setState({ selectedSymbol });
  };

  handleAmountChange = (e) => {
    const selectedAmount = parseFloat(e.target.value);
    this.setState({ selectedAmount });
  };

  buyCrypto = async () => {
    const { selectedSymbol, selectedAmount } = this.state;

    if (selectedSymbol < 0 || selectedAmount <= 0) {
      console.log('Invalid input. Purchase skipped.');
      return;
    }

    const purchaseData = {
      user: this.state.user,
      symbol: selectedSymbol,
      amount: selectedAmount,
    };

    console.log(purchaseData);

    // Perform purchase logic
    this.loadWeb3();
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const networkData = Token.networks[networkId];
    if (networkData) {
      const token = new web3.eth.Contract(Token.abi, networkData.address);
      try {
        await token.methods.transfer(purchaseData.user[3], purchaseData.amount, purchaseData.symbol).send({ from: '0x6dF708336A0547Da2cB27737901F148A934E433C' });
        this.setState({ purchaseCompleted: true });
      } catch (error) {
        console.log('Purchase failed:', error);
        this.setState({ purchaseCompleted: false });
      }
    }
  };

  render() {
    const { selectedSymbol, selectedAmount, purchaseCompleted } = this.state;

    return (
      <form className="flex flex-col pt-5 items-center justify-center bg-[#03001C] text-cyan-300 min-h-screen font-mono">
        <h2 className="text-2xl mb-4">Buy Crypto:</h2>
        <div className="flex items-center mb-4">
          <span className="mr-2">Select crypto:</span>
          <select
            className="bg-[#03001C] border-cyan-300 border-2 rounded-lg mr-2 py-1 px-2"
            value={selectedSymbol}
            onChange={this.handleSymbolChange}
          >
            <option value="" default>Select crypto</option>
            {this.state.tokens.map((token, index) => (
              <option key={index} value={index + 1}>{token[0]}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <span className="mr-2">Amount:</span>
          <input
            type="number"
            className="bg-[#03001C] border-cyan-300 border-2 rounded-lg py-1 px-2"
            value={selectedAmount}
            onChange={this.handleAmountChange}
            min={0}
          />
        </div>
        <button
          type="button"
          className="hover:text-[#A459D1] text-cyan-300 mt-4 py-2 px-4 border-2 border-cyan-300 rounded-xl"
          onClick={this.buyCrypto}
        >
          Buy
        </button>
        {purchaseCompleted && <p className="text-green-500 mt-4">Purchase successful!</p>}
        {purchaseCompleted === false && <p className="text-red-500 mt-4">Purchase not completed.</p>}
        <Nav />
      </form>
    );
  }
}
