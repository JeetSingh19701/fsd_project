const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Load dummy stock data
let stocks = JSON.parse(fs.readFileSync('./data/stocks.json', 'utf-8'));

// Dummy in-memory portfolio
let portfolio = {
  demo: {
    balance: 100000,
    holdings: []
  }
};

// Routes
app.get('/api/stocks/live', (req, res) => {
  res.json({ data: stocks });
});

app.post('/api/trade/buy', (req, res) => {
  const { userId, symbol, qty, price } = req.body;
  if (!portfolio[userId]) portfolio[userId] = { balance: 100000, holdings: [] };

  const cost = qty * price;
  if (portfolio[userId].balance < cost) return res.status(400).json({ error: "Not enough balance" });

  portfolio[userId].balance -= cost;
  const existing = portfolio[userId].holdings.find(h => h.symbol === symbol);
  if (existing) existing.qty += qty;
  else portfolio[userId].holdings.push({ symbol, qty, avgPrice: price });

  res.json({ portfolio: portfolio[userId] });
});

app.post('/api/trade/sell', (req, res) => {
  const { userId, symbol, qty, price } = req.body;
  if (!portfolio[userId]) return res.status(400).json({ error: "User not found" });

  const holding = portfolio[userId].holdings.find(h => h.symbol === symbol);
  if (!holding || holding.qty < qty) return res.status(400).json({ error: "Not enough holdings" });

  holding.qty -= qty;
  portfolio[userId].balance += qty * price;

  // Remove holding if zero
  if (holding.qty === 0) portfolio[userId].holdings = portfolio[userId].holdings.filter(h => h.qty > 0);

  res.json({ portfolio: portfolio[userId] });
});

app.get('/api/user/portfolio/:id', (req, res) => {
  const userId = req.params.id;
  res.json(portfolio[userId] || { balance: 100000, holdings: [] });
});

// Dummy AI advice
app.get('/api/ai/advice/:id', (req, res) => {
  const userId = req.params.id;
  const userPortfolio = portfolio[userId] || { balance: 100000, holdings: [] };
  const advice = [];

  const techStocks = userPortfolio.holdings.filter(h => ['TCS','INFY'].includes(h.symbol)).length;
  const totalStocks = userPortfolio.holdings.length || 1;

  if (techStocks / totalStocks > 0.5) advice.push("You're overexposed to IT sector. Consider diversification.");
  if (userPortfolio.balance > 50000) advice.push("You have unused cash — explore new opportunities.");

  res.json({ messages: advice });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
