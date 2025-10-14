// frontend/src/components/StockDrawer.jsx
import React, { useState } from 'react';

export default function StockDrawer({ stock, onClose, onBuy, onSell }) {
  const [qty, setQty] = useState(1);

  if (!stock) return null;

  return (
    <div style={{
      position: 'fixed', right: 0, top: 0, width: 360, height: '100%',
      background: '#fff', boxShadow: '-2px 0 8px rgba(0,0,0,0.2)', padding: 16, zIndex: 50
    }}>
      <button onClick={onClose}>Close</button>
      <h2>{stock.symbol}</h2>
      <p>Price: ₹{stock.price}</p>
      <p>Change: {stock.changePercent}%</p>
      <p>Sector: {stock.sector || '—'}</p>

      <div style={{ marginTop: 12 }}>
        <input type="number" min="1" value={qty} onChange={e => setQty(Number(e.target.value))} />
        <button onClick={() => onBuy(stock, qty)}>Buy</button>
        <button onClick={() => onSell(stock, qty)}>Sell</button>
      </div>
    </div>
  );
}
