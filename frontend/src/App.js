import React, { useEffect, useState } from 'react';
import { fetchLiveStocks, buyStock, sellStock, getPortfolio, getAIAdvice } from './api';
import Heatmap from './components/Heatmap';
import StockDrawer from './components/StockDrawer';
import './App.css';

function App(){
  const [stocks, setStocks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [advice, setAdvice] = useState([]);

  const load = async () => {
    const res = await fetchLiveStocks();
    setStocks(res.data || []);
  };

  const loadPortfolio = async () => {
    const p = await getPortfolio('demo');
    setPortfolio(p);
  };

  const loadAdvice = async () => {
    const a = await getAIAdvice('demo');
    setAdvice(a.messages || []);
  };

  useEffect(() => {
    load();
    loadPortfolio();
    loadAdvice();
    const iv = setInterval(() => load(), 10000);
    return () => clearInterval(iv);
  }, []);

  const handleBuy = async (stock, qty) => {
    await buyStock({ symbol: stock.symbol, qty, price: stock.price });
    await loadPortfolio();
    await loadAdvice();
    setSelected(null);
  };

  const handleSell = async (stock, qty) => {
    await sellStock({ symbol: stock.symbol, qty, price: stock.price });
    await loadPortfolio();
    await loadAdvice();
    setSelected(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>FinPilot — MVP Heatmap</h1>
      </header>

      <main style={{ display: 'flex', gap: 16 }}>
        <section style={{ flex: 2 }}>
          <h3>NIFTY50 Heatmap</h3>
          <Heatmap stocks={stocks} onSelect={s => setSelected(s)} />
        </section>

        <aside style={{ width: 320 }}>
          <h3>Portfolio</h3>
          <pre>{JSON.stringify(portfolio, null, 2)}</pre>

          <h3>FinBot</h3>
          <ul>{advice.map((m,i) => <li key={i}>{m}</li>)}</ul>
        </aside>
      </main>

      <StockDrawer
        stock={selected}
        onClose={() => setSelected(null)}
        onBuy={handleBuy}
        onSell={handleSell}
      />
    </div>
  );
}

export default App;
