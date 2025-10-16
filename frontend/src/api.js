const API_ROOT = 'http://localhost:5000';

export async function fetchLiveStocks() {
  const res = await fetch(`${API_ROOT}/api/stocks/live`);
  return res.json();
}

export async function buyStock({ userId='demo', symbol, qty, price }) {
  const res = await fetch(`${API_ROOT}/api/trade/buy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, symbol, qty, price })
  });
  return res.json();
}

export async function sellStock({ userId='demo', symbol, qty, price }) {
  const res = await fetch(`${API_ROOT}/api/trade/sell`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, symbol, qty, price })
  });
  return res.json();
}

export async function getPortfolio(userId='demo') {
  const res = await fetch(`${API_ROOT}/api/user/portfolio/${userId}`);
  return res.json();
}

export async function getAIAdvice(userId='demo') {
  const res = await fetch(`${API_ROOT}/api/ai/advice/${userId}`);
  return res.json();
}
