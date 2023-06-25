import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faChartSimple, faStore, faBitcoinSign, faAngleDown, faAngleUp, faSearch, faWallet } from '@fortawesome/free-solid-svg-icons';

export default class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showGraphsMenu: false,
      tokensDatas: [],
      search: '',
    };
  }

  componentDidMount() {
    this.loadLocalStorage();
  }

  loadLocalStorage() {
    var tokensDatas = localStorage.getItem('tokensDatas');
    tokensDatas = JSON.parse(tokensDatas);
    this.setState({ tokensDatas });
  }

  toggleGraphsMenu = () => {
    this.setState((prevState) => ({
      showGraphsMenu: !prevState.showGraphsMenu,
    }));
  };

  handleSearchInputChange = (event) => {
    event.preventDefault();
    const searchSymbol = event.target.value;
    const { tokensDatas } = this.state;
    const search = tokensDatas.find((tokenData) => tokenData.symbol.startsWith(searchSymbol));
    this.setState({ search });
  };

  render() {
    const { showGraphsMenu } = this.state;
    const { search } = this.state;
  
    return (
      <div className="flex flex-col bg-[#03001C] text-cyan-300 min-h-screen font-mono">
        <aside
          id="default-sidebar"
          className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
          aria-label="Sidebar"
        >
          <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
            <h1 className="text-center">
              <FontAwesomeIcon className="pr-1" icon={faWallet} style={{ color: '#00ddfa' }} />
              Scuffed Wallet
            </h1>
            <div className="m-4">
              <div className="flex items-center">
                <div className="relative">
                  <input
                    type="text"
                    onChange={this.handleSearchInputChange}
                    placeholder="Search"
                    className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring focus:ring-cyan-300"
                  />
                  <FontAwesomeIcon
                    icon={faSearch}
                    style={{ color: '#00ddfa' }}
                    className="absolute top-2 right-3"
                  />
                  {search && search.symbol && (
                    <div className="absolute bg-gray-900 text-cyan-300 w-full mt-2 py-1 px-3 rounded-md">
                      <Link
                        to={{ pathname: '/token/' + search.symbol, state: { token: search } }}
                        className="block"
                      >
                        {search.symbol}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <ul className="space-y-2 font-medium p-2">
              <li className="p-2">
                <Link to="/" className="flex items-center text-cyan-300 rounded-lg">
                  <FontAwesomeIcon icon={faHouse} style={{ color: '#00ddfa' }} />
                  <span className="ml-3">Home</span>
                </Link>
              </li>
              <li className="p-2">
                <Link to="/tokens" className="flex items-center text-cyan-300 rounded-lg">
                  <FontAwesomeIcon icon={faBitcoinSign} style={{ color: '#00fbff' }} />
                  <span className="ml-3">Tokens</span>
                </Link>
              </li>
              <li>
                <div
                  className="flex items-center p-2 text-cyan-300 rounded-lg cursor-pointer"
                  onClick={this.toggleGraphsMenu}
                >
                  <FontAwesomeIcon icon={faChartSimple} style={{ color: '#00fbff' }} />
                  <span className="ml-3">Graphs </span>
                  {this.state.showGraphsMenu === false ? (
                    <FontAwesomeIcon className="p-2" icon={faAngleDown} style={{ color: '#00fbff' }} />
                  ) : (
                    <FontAwesomeIcon className="p-2" icon={faAngleUp} style={{ color: '#00fbff' }} />
                  )}
                </div>
                {showGraphsMenu && (
                  <ul className="pl-4">
                    <li>
                      <Link to="/graph/btcusdt" className="flex items-center p-2 text-cyan-300 rounded-lg">
                        <span className="ml-3">Bitcoin</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/graph/ethusdt" className="flex items-center p-2 text-cyan-300 rounded-lg">
                        <span className="ml-3">Ethereum</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/graph/dogeusdt" className="flex items-center p-2 text-cyan-300 rounded-lg">
                        <span className="ml-3">Dodge</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/graph/solusdt" className="flex items-center p-2 text-cyan-300 rounded-lg">
                        <span className="ml-3">Solana</span>
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <Link to="/marketplace" className="flex items-center p-2 text-cyan-300 rounded-lg">
                  <FontAwesomeIcon icon={faStore} style={{ color: '#00fbff' }} />
                  <span className="ml-3">Marketplace</span>
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    );
  }  
}
