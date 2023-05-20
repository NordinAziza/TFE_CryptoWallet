import React from 'react';
import Nav from './Nav';
import { Chart } from 'react-google-charts';

export default class Graph extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data : null,
      loaded : false,
    };
  }

  async componentDidMount() {
  await this.getUrlParams();
  }

  async componentDidUpdate(prevProps) {
    const prevCoin = prevProps.coin;
    const coin = this.props.coin;

    if (prevCoin && prevCoin !== coin) {
      await this.getGraphData(coin);
    }
  }
  
  async getUrlParams() {
    const url = window.location.href;
    const match = url.match(/\/graph\/(\w+)/);
    const URLcoin = match ? match[1] : null;
    const coin = URLcoin ? URLcoin.toLowerCase() : null;
    
    if (coin) {
      const data = await this.getGraphData(coin);
      this.setState({ coin, data, loaded: true });
    }
  }
  async getGraphData(coin) {
    var now = Date.now();
    var url = `https://api.wazirx.com/sapi/v1/klines?symbol=${coin}&limit=110&interval=4h&endTime=${now}`;
    const response = await fetch(url);
    const coinData = await response.json();
  
    const data =  coinData.map(d => [new Date(d[0]*1000), d[1], d[2], d[3], d[4]]);
  
    return [
      ['Date', 'Open', 'High', 'Low', 'Close'],
      ...data
    ];
  }

  render() {
    return (
      <div className='flex flex-wrap items-center justify-around bg-[#03001C] text-cyan-300 min-h-screen font-mono'>
        <Nav></Nav>
        <div className='w-4/5 flex-row '>
          <h1 className='w-full text-center text-3xl font-semibold'>Ethereum Graph</h1>
          <Chart
            width={'100%'}
            height={'800px'}
            chartType="CandlestickChart"
            data={this.state.data}
            options={{
              legend: 'none',
              backgroundColor: '#03001C',
              series: [{ color: 'green' }],
              candlestick: {
                fallingColor: { stroke:'red' ,strokeWidth: 0, fill: 'red' },
                risingColor: {stroke:'green' ,strokeWidth: 0, fill: 'green' },
                hollowIsRising: true,
              },
              hAxis: {
                textStyle: {
                  color: 'cyan'
                }
              },
              vAxis: {
                textStyle: {
                  color: 'cyan'
                }
              }
            }}
          />
        </div>
      </div>
    );
  }

}

