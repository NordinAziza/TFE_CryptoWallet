import React from 'react';

export default class Bar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coinBarData: [],
    };
  }

  componentDidMount() {
    this.coinBarData();
  }

  coinBarData() {
    const coinBarData = [];
    const tokenBalance = this.props.tokensBalance,
      tokenData = this.props.tokensDatas,
      total = this.props.total;
      
    if (tokenBalance && tokenData) {
      for (let i = 0; i <= 3; i++) {
        const tokenBalanceValue = parseFloat(tokenBalance.balance[i]);
        const tokenLastPrice = parseFloat(tokenData[i].lastPrice);

        if (!isNaN(tokenBalanceValue) && !isNaN(tokenLastPrice)) {
          const value = tokenBalanceValue * tokenLastPrice;
          const percent = (value * 100) / total;
          const symbol = tokenBalance.symbol[i];
          const color = this.getColor(i);
          coinBarData.push({ percent, symbol, color, value});
        }
      }
    }
    this.setState({ coinBarData });
  }

  getColor(index) {
    const colors = ['orange', 'yellow', 'purple', 'cyan']; // Add more colors as needed
    return colors[index % colors.length];
  }

  render() {
    return (
      <div className='m-2'>
        {this.state.coinBarData.length > 0 ? (
          <div>
            {this.state.coinBarData.map((coin, index) => (
              <div key={index}>
                <div
                  style={{
                    width: `${coin.percent}%`,
                    height: '20px',
                    backgroundColor: coin.color,
                    display: coin.percent === 0 ? 'none' : 'block',
                    borderRadius: '10px',
                  }}
                >
                  <span style={{ color: 'white', padding: '2px', textShadow: '1px 1px 2px black' }}>{coin.symbol}</span>
                  <span style={{ color: 'white', marginLeft: '10px', textShadow: '1px 1px 2px black' }}>{coin.percent.toFixed(2)}%</span>
                  <span style={{ color: 'white', marginLeft: '10px', textShadow: '1px 1px 2px black' }}>{coin.value.toFixed(2)}$</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>No data available</div>
        )}
      </div>
    );
  }
}