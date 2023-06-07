import React, { Component } from 'react';
import axios from 'axios';

export default class TradeRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: JSON.parse(localStorage.getItem("userData")),
      tokensBalance: JSON.parse(localStorage.getItem("tokensBalance")),
      tokensDatas: JSON.parse(localStorage.getItem("tokensDatas")),
      selectedSymbol: '',
      selectedBalance: 0,
      convertToSymbol: '',
      convertToAmount: 0,
      convertedValue: 0,
      tradeRequestAdded: false, // Added state for trade request added message
    };
  }

  componentDidMount() {
    this.performConversion();
  }

  convertTokens(tokenIn, balance, tokenOut, tokenData) {
    if (!tokenData || !Array.isArray(tokenData)) {
      console.log("Invalid token data");
      return null;
    }

    const tokenInData = tokenData.find((token) => token.symbol.toLowerCase() === `${tokenIn.toLowerCase()}usdt`);
    const tokenOutData = tokenData.find((token) => token.symbol.toLowerCase() === `${tokenOut.toLowerCase()}usdt`);

    if (tokenInData && tokenOutData) {
      const convertedValue = (parseFloat(tokenInData.lastPrice)) / parseFloat(tokenOutData.lastPrice) * balance;
      return convertedValue;
    } else {
      return null;
    }
  }

  handleConvertToSymbolChange = (e) => {
    const convertToSymbol = e.target.value;
    this.setState({ convertToSymbol }, this.performConversion);
  };

  handleConvertToAmountChange = (e) => {
    const convertToAmount = parseFloat(e.target.value);
    this.setState({ convertToAmount }, this.performConversion);
  };

  handleSymbolChange = (e) => {
    const selectedSymbol = e.target.value;
    const selectedBalance = parseInt(this.state.tokensBalance.balance[this.state.tokensBalance.symbol.indexOf(selectedSymbol)]);
    this.setState({ selectedSymbol, selectedBalance }, this.performConversion);
  };

  handleBalanceChange = (e) => {
    const selectedBalance = parseInt(e.target.value);
    const maxBalance = parseInt(this.state.tokensBalance.balance[this.state.tokensBalance.symbol.indexOf(this.state.selectedSymbol)]);
    const adjustedBalance = Math.min(selectedBalance, maxBalance);
    this.setState({ selectedBalance: adjustedBalance }, this.performConversion);
  };
  
  performConversion() {
    const { selectedSymbol, selectedBalance, convertToSymbol, tokensDatas } = this.state;
    const convertedValue = this.convertTokens(selectedSymbol, selectedBalance, convertToSymbol, tokensDatas);
    if (convertedValue !== null) {
      this.setState({ convertedValue });
    } else {
      this.setState({ convertedValue: 0 });
    }
  }

  postRequest() {
    const user = {
      username: this.state.user[0],
      email: this.state.user[1],
      password: this.state.user[2],
      address: this.state.user[3],
    };
    const date = new Date();
    const { selectedSymbol, selectedBalance, convertToSymbol, convertedValue } = this.state;

    if (!user || !selectedSymbol || !selectedBalance || !convertToSymbol || !convertedValue) {
      console.log('Incomplete data. API call skipped.');
      return;
    }

    const payload = {
      user: user,
      date: date,
      tokenToTrade: selectedSymbol,
      amountToTrade: selectedBalance,
      tokenToReceive: convertToSymbol,
      amountToReceive: convertedValue,
    };

    console.log(payload);

    axios
      .post('https://localhost:7038/api/TradeRequest', payload)
      .then((response) => {
        // Handle the response
        console.log(response.data);
        this.setState({ tradeRequestAdded: true }); // Set tradeRequestAdded to true on successful response
      })
      .catch((error) => {
        // Handle the error
        console.error(error);
      });
  }

  render() {
    const { convertedValue, tokensBalance, selectedBalance, tradeRequestAdded } = this.state;
  
    let convertedValueDisplay = convertedValue >= 0 ? convertedValue.toFixed(8) : "Below zero";
  
    return (
      <div className="py-4 w-full flex flex-col items-center">
        <h2 className="text-2xl mb-2">Posting a trade request :</h2>
        <div className="flex items-center">
          <span className="mr-2">Tokens to trade:</span>
          <select
            className="bg-[#03001C] border-cyan-300 border-2 rounded-lg mr-2 py-1 px-2"
            value={this.state.selectedSymbol}
            onChange={this.handleSymbolChange}
          >
            <option value="" disabled>Select token</option>
            {tokensBalance.symbol.map((symbol, index) => {
              const balance = parseFloat(tokensBalance.balance[index]);
              if (balance !== 0) {
                return (
                  <option key={index} value={symbol}>
                    {symbol}
                  </option>
                );
              }
              return null;
            })}
          </select>
          <span className="mr-2">Selected Balance:</span>
          {/* Replace the select element with the input element */}
          <input
            type="number"
            className="bg-[#03001C] border-cyan-300 border-2 rounded-lg py-1 px-2"
            value={selectedBalance}
            onChange={this.handleBalanceChange}
            max={this.state.tokensBalance.balance[this.state.tokensBalance.symbol.indexOf(this.state.selectedSymbol)]}
          />
        </div>
        <div className="flex items-center mt-4">
          <span className="mr-2">Convert to token:</span>
          <select
            className="bg-[#03001C] border-cyan-300 border-2 rounded-lg mr-2 py-1 px-2"
            value={this.state.convertToSymbol}
            onChange={this.handleConvertToSymbolChange}
          >
            <option value="" disabled>Select token</option>
            {tokensBalance.symbol.map((symbol, index) => (
              <option key={index} value={symbol}>
                {symbol}
              </option>
            ))}
          </select>
          <span>Value: {convertedValueDisplay} {this.state.convertToSymbol}</span>
        </div>
        <button
          className="hover:text-[#A459D1] text-cyan-300 py-2 px-4 border-2 border-cyan-300 rounded-xl"
          onClick={() => this.postRequest()}
        >
          Confirm
        </button>
        {tradeRequestAdded && <p className="text-green-500">Trade request added</p>}
      </div>
    );
  }
}
