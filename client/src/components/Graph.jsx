import React from 'react';
import { Chart } from 'react-google-charts';
const { Component } = require("react");
export default class Graph extends Component{ 

  data = [    ['Day', 'Low', 'Open', 'Close', 'High'],
  ...[
    [
      1679702400,
      1799.15,
      1810,
      1735.01,
      1740,
      1.9783000000000002
    ],
    [
      1679788800,
      1807.35,
      1807.91,
      1758.85,
      1775,
      2.8619000000000008
    ],
    [
      1679875200,
      1770.31,
      1772.09,
      1700,
      1708.86,
      7.9248
    ],
    [
      1679961600,
      1718.87,
      1791.83,
      1705.9,
      1775.65,
      3.6420999999999997
    ],
    [
      1680048000,
      1772.84,
      1823.81,
      1772.84,
      1801.87,
      7.135799999999998
    ]
  ].map((day) => [      new Date(day[0] * 1000),
    day[3],
    day[1],
    day[2],
    day[4],
  ])
];

  render () {
    return(
      <div>
        <Chart
          width={'100%'}
          height={'400px'}
          chartType="CandlestickChart"
          data={this.data}
          options={{
            legend: 'none',
            candlestick: {
              fallingColor: { strokeWidth: 0, fill: '#a52714' },
              risingColor: { strokeWidth: 0, fill: '#0f9d58' },
            },
          }}
      />
      </div>
    )
  }
}
