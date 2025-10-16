
import React from 'react';
import './Heatmap.css'; 

const getColor = (pChange) => {
  if (pChange > 0) {
    const alpha = Math.min(pChange / 5, 1);
    return `rgba(0,200,83,${alpha})`; 
  }
  if (pChange < 0) {
    const alpha = Math.min(Math.abs(pChange) / 5, 1);
    return `rgba(229,57,53,${alpha})`; 
  }
  return '#888';
};

export default function Heatmap({ stocks, onSelect }) {
  if (!stocks || Object.keys(stocks).length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="heatmap-container">
      {Object.keys(stocks).map(sector => (
        <div key={sector} className="sector-block">
          <h3 className="sector-title">{sector}</h3>
          <div className="heatmap-grid">
            {stocks[sector].map(stock => (
              <div
                key={stock.symbol}
                className="heat-tile"
                style={{ backgroundColor: getColor(stock.change) /* or changePercent field */ }}
                onClick={() => onSelect(stock)}
              >
                <div className="tile-symbol">{stock.symbol}</div>
                <div className="tile-price">₹{stock.price}</div>
                <div className="tile-change">
                  {stock.change >= 0 ? '+' : ''}{stock.change}%
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

