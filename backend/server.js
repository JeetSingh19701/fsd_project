// backend/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// ----- In-memory storage for MVP -----
let users = {
  "demo": { id: "demo", name: "Demo", balance: 100000, holdings: {} } // holdings: { SYMBOL: {qty, avgPrice} }
};
let trades = []; // list of trade objects

// Dummy NIFTY50 data (replace with RapidAPI fetch in production)
const dummyNifty = [
  { symbol: 'RELIANCE', price: 2450, changePercent: 1.2, sector: 'Energy' },
  { symbol: 'TCS', price: 3300, changePercent: -0.5, sector: 'IT' },
  { symbol: 'INFY', price: 1500, changePercent: 0.9, sector: 'IT' },
  // ... include up to 50 for later
];

// GET live stocks (MVP returns dummy data)
app.get('/api/stocks/live', (req, res) => {
  res.json({ data: dummyNifty, timestamp: Date.now() });
});

// POST buy trade
app.post('/api/trade/buy', (req, res) => {
  const { userId = 'demo', symbol, qty, price } = req.body;
  if (!symbol || !qty || !price) return res.status(400).json({ error: 'symbol, qty, price required' });

  const user = users[userId];
  const cost = qty * price;
  if (user.balance < cost) return res.status(400).json({ error: 'Insufficient balance' });

  // deduct balance
  user.balance -= cost;

  // update holdings
  const h = user.holdings[symbol] || { qty: 0, avgPrice: 0 };
  const newQty = h.qty + qty;
  const newAvg = newQty === 0 ? 0 : ((h.qty * h.avgPrice) + (qty * price)) / newQty;
  user.holdings[symbol] = { qty: newQty, avgPrice: newAvg };

  const trade = { id: trades.length+1, userId, symbol, qty, price, type: 'BUY', date: new Date() };
  trades.push(trade);

  res.json({ ok: true, user, trade });
});

// POST sell trade
app.post('/api/trade/sell', (req, res) => {
  const { userId = 'demo', symbol, qty, price } = req.body;
  if (!symbol || !qty || !price) return res.status(400).json({ error: 'symbol, qty, price required' });

  const user = users[userId];
  const h = user.holdings[symbol];
  if (!h || h.qty < qty) return res.status(400).json({ error: 'Not enough holdings' });

  // add balance
  const proceeds = qty * price;
  user.balance += proceeds;

  // update holdings
  const remaining = h.qty - qty;
  if (remaining === 0) delete user.holdings[symbol];
  else user.holdings[symbol] = { qty: remaining, avgPrice: h.avgPrice };

  const trade = { id: trades.length+1, userId, symbol, qty, price, type: 'SELL', date: new Date() };
  trades.push(trade);

  res.json({ ok: true, user, trade });
});

// GET user portfolio
app.get('/api/user/portfolio/:id', (req, res) => {
  const id = req.params.id || 'demo';
  const user = users[id];
  if (!user) return res.status(404).json({ error: 'User not found' });

  // attach current prices from dummyNifty
  const portfolio = Object.entries(user.holdings).map(([symbol, {qty, avgPrice}]) => {
    const stock = dummyNifty.find(s => s.symbol === symbol) || { price: 0, changePercent: 0 };
    const currentPrice = stock.price;
    const pnl = (currentPrice - avgPrice) * qty;
    const pnlPercent = avgPrice > 0 ? ((currentPrice/avgPrice - 1) * 100).toFixed(2) : 0;
    return { symbol, qty, avgPrice, currentPrice, pnl, pnlPercent };
  });

  res.json({ userId: id, balance: user.balance, portfolio });
});

// GET AI advice (rule-based)
app.get('/api/ai/advice/:id', (req, res) => {
  const id = req.params.id || 'demo';
  const user = users[id];
  if (!user) return res.status(404).json({ error: 'User not found' });

  const totalStocks = Object.keys(user.holdings).length;
  const sectorCount = {}; // count holdings per sector based on dummyNifty
  let investedValue = 0, techValue = 0;

  for (const [symbol, {qty, avgPrice}] of Object.entries(user.holdings)) {
    const current = dummyNifty.find(s => s.symbol === symbol) || { sector: 'Other', price: avgPrice };
    const value = qty * (current.price || avgPrice);
    investedValue += value;
    if (current.sector === 'IT' || current.sector === 'Technology') techValue += value;
    sectorCount[current.sector] = (sectorCount[current.sector] || 0) + 1;
  }

  const messages = [];
  if (investedValue > 0 && techValue / investedValue > 0.5) messages.push("You're overexposed to IT. Consider diversifying.");
  if (user.balance > 50000) messages.push("You have unused cash — consider deploying some in stable stocks.");
  if (messages.length === 0) messages.push("Portfolio looks balanced for an MVP demo.");

  res.json({ messages, sectorBreakdown: sectorCount });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
