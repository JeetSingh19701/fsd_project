import React, { useState } from 'react';
import './StockDrawer.css';

export default function StockDrawer({ stock, onClose, onBuy, onSell }) {
  const [qty, setQty] = useState(1);

  if (!stock) return null;

  return (
    <div className="drawer">
      <button onClick={onClose}>Close</button>
      <h2>{stock.symbol}</h2>
      <p>Price: ₹{stock.price}</p>
      <p>Change: {stock.changePercent}%</p>
      <p>Sector: {stock.sector || '—'}</p>

      <div className="trade-actions">
        <input type="number" min="1" value={qty} onChange={e => setQty(Number(e.target.value))} />
        <button onClick={() => onBuy(stock, qty)}>Buy</button>
        <button onClick={() => onSell(stock, qty)}>Sell</button>
      </div>
    </div>
  );
}
