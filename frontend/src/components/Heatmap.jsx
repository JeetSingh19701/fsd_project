// frontend/src/components/Heatmap.jsx
import React from 'react';
import './Heatmap.css'; // styles below

const getColor = (pChange) => {
  if (pChange > 0) {
    const alpha = Math.min(pChange / 5, 1);
    return `rgba(0,200,83,${alpha})`; // green
  }
  if (pChange < 0) {
    const alpha = Math.min(Math.abs(pChange) / 5, 1);
    return `rgba(229,57,53,${alpha})`; // red
  }
  return '#888';
};

export default function Heatmap({ stocks, onSelect }) {
  return (
    <div className="heatmap-grid">
      {stocks.map(stock => (
        <div
          key={stock.symbol}
          className="heat-tile"
          style={{ backgroundColor: getColor(stock.changePercent) }}
          onClick={() => onSelect(stock)}
        >
          <div className="tile-symbol">{stock.symbol}</div>
          <div className="tile-price">₹{stock.price}</div>
          <div className="tile-change">{stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%</div>
        </div>
      ))}
    </div>
  );
}
