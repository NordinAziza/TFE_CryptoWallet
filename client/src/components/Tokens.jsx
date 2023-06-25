import React from 'react';
import Token from '../components/Token';
import Nav from './Nav';

export default class Tokens extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tokensDatas: [],
      loaded: false
    };
  }

  componentDidMount() {
    this.loadLocalStorage();
  }

  loadLocalStorage() {
    const tokensDatas = localStorage.getItem('tokensDatas');
    // Parse the JSON strings into objects
    const parsedTokensDatas = JSON.parse(tokensDatas);
    // Updating the state after retrieving data from local storage
    this.setState(
      {
        tokensDatas: parsedTokensDatas,
        loaded: true // Set loaded to true to indicate that the data has been loaded
      },
      () => {
    
      }
    );
  }
  render() {
    if (this.state.loaded === true) {
      return (
        <div className="flex flex-wrap items-start justify-center bg-[#03001C] text-cyan-300 min-h-screen font-mono">
          <div className="w-full text-center text-xl font-bold mt-4">
            <h1>Tokens</h1>
          </div>
          <ul className="flex flex-wrap justify-center" style={{ margin: 0, padding: 0 }}>
            {this.state.tokensDatas.map((token, index) => (
              <li key={index} className="w-full  ">
                <Token token={token} />
              </li>
            ))}
          </ul>
          <div className="absolute top-0 right-0">
            <Nav />
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
  
  
  
}  