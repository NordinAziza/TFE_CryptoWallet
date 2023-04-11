import React from 'react';
import { Chart } from 'react-google-charts';
const { Component } = require("react");
export default class Graph extends Component{ 


  constructor(props) {
    super(props);
    this.state = {
      data : null,
    };
  }
  async componentDidMount() {
    const data = await this.getGraphData('eth');
    this.setState({ data });
  }
  

  async getGraphData(coin) {
    coin = "ethusdt";
    var url = `https://api.wazirx.com/sapi/v1/klines?symbol=${coin}&limit=1&interval=1d`;
    const response = await fetch(url);
    const coinData = await response.json();
    console.log(coinData);
  
    const data = await coinData.map(d => [new Date(d[0]), d[1], d[2], d[3], d[4]]);
  
    return [
      ['Date', 'Open', 'High', 'Low', 'Close'],
      ...data.reverse()
    ];
  }
  
 
  render () {
    return(
      <div>
        <Chart
          width={'100%'}
          height={'400px'}
          chartType="CandlestickChart"
          data={this.state.data}
          options={{
            legend: 'none',
            candlestick: {
              fallingColor: { strokeWidth: 1, fill: '#a52714' },
              risingColor: { strokeWidth: 1, fill: '#0f9d58' },
            },
          }}
        />
      </div>
    )
  }
  
}
