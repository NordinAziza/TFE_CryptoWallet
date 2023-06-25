import React from 'react';
import Nav from './Nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartSimple, faBitcoinSign } from '@fortawesome/free-solid-svg-icons';
import { Link, } from 'react-router-dom';

export default class Token extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenData: this.props.token,
    };
  }
  componentWillMount()
  {
    console.log(this.state.tokenData)
    if(this.state.tokenData === undefined)
    {
      this.loadLocalStorage();
    }
    
  }
  
  getUrlParams() {
    const url = window.location.href;
    const symbol = url.match(/\/token\/(\w+)/);
    return symbol[1]
  }
  loadLocalStorage() {
    console.log("in")
    var tokensDatas = localStorage.getItem("tokensDatas");
    // Parse the JSON strings into objects
    tokensDatas = JSON.parse(tokensDatas);
    this.setState({tokenData:tokensDatas });
  }
  findToken(symbol) {
    var tokenFound = null;
    this.state.tokenData.map(token => {
      if (symbol === token.symbol) {
        tokenFound = token;
        
      }
    });
    return tokenFound;
  }
  
  
  render() {
    var { tokenData } = this.state;
    console.log(tokenData.length)
    if (tokenData.length > 1) {
      console.log("ok")
      var symbol = this.getUrlParams();
      tokenData = this.findToken(symbol)
    }
    return (
      <div className='flex flex-wrap justify-center items-center text-center  bg-[#03001C] text-cyan-300 min-h-screen font-mono'>
        <Nav></Nav>
        <div className="w-1/3 h-[500px] text-xl flex flex-wrap bg-[#1F1B38] border-[#A459D1] border-2 p-4 rounded-lg shadow-md">
          <h2 className="w-full text-3xl font-bold mb-2"> <FontAwesomeIcon icon={faBitcoinSign} style={{ color: '#00fbff' }} /> Token: {tokenData.symbol}</h2>

            <div className="w-full md:w-1/2">
              <h3 className="text-xl font-semibold">Volume</h3>
              <p>{tokenData.volume}</p>
            </div>
            <div className="w-full md:w-1/2">
              <h3 className="text-xl font-semibold">Ask Price</h3>
              <p>{tokenData.askPrice}$</p>
            </div>
            <div className="w-full md:w-1/2">
              <h3 className="text-xl font-semibold">Open Price</h3>
              <p>{tokenData.openPrice}$</p>
            </div>
            <div className="w-full md:w-1/2">
              <h3 className="text-xl font-semibold">Last Price</h3>
              <p>{tokenData.lastPrice}$</p>
            </div>
            <div className="w-full md:w-1/2">
              <h3 className="text-xl font-semibold">High Price</h3>
              <p>{tokenData.highPrice}$</p>
            </div>
            <div className="w-full md:w-1/2">
              <h3 className="text-xl font-semibold">Low Price</h3>
              <p>{tokenData.lowPrice}$</p>
            </div>
            <div className="w-full md:w-1/2 hover:text-[#A459D1] ">
              <Link to={{ pathname : "/graph/" + tokenData.symbol }}>
                <FontAwesomeIcon icon={faChartSimple} style={{ color: '#00fbff' }} />
                  <h3 className="text-xl font-semibold">Graph </h3>
              </Link>
            </div>
        </div>
      </div>
    );    
  }
}
