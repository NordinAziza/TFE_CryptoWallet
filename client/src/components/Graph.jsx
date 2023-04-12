import React from 'react';
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
    const data = await this.getGraphData('eth');
    this.setState({ data });
    this.setState.loaded = true;
  }

  async getGraphData(coin) {
    coin = "ethusdt";
    var now = Date.now();
    var url = `https://api.wazirx.com/sapi/v1/klines?symbol=${coin}&limit=100&interval=4h&endTime=${now}`;
    const response = await fetch(url);
    const coinData = await response.json();

    const data =  coinData.map(d => [new Date(d[0]*1000), d[1], d[2], d[3], d[4]]);

    return [
      ['Date', 'Open', 'High', 'Low', 'Close'],
      ...data.reverse()
    ];
  }

  render() {
    return (
      <div className='flex flex-wrap items-center justify-center bg-[#03001C] text-cyan-300 min-h-screen font-mono'>
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
              fallingColor: { strokeWidth: 0, fill: 'red' },
              risingColor: { strokeWidth: 0, fill: 'green' },
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
    );
  }

}
