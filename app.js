// Backend API Configuration
const BACKEND_URL = 'https://noema-backend-0f8z.onrender.com';

// Default watchlist
let watchlist = JSON.parse(localStorage.getItem('watchlist')) || ['NVDA', 'AAPL', 'TSLA', 'MSFT', 'AMD'];

// Suggested stocks
const suggestedStocks = ['TSM', 'SMCI', 'ASML', 'DELL', 'PLTR', 'COIN'];

// Last update time
let lastUpdateTime = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', async () => {
  await loadWatchlist();
  await loadSuggestedStocks();
  await loadMarketIndices();
  await loadMarketSummary(); // Load AI summary
  
  // Refresh every 30 seconds (backend handles caching and API limits)
  setInterval(async () => {
    await loadWatchlist();
    await loadMarketIndices();
    updateTimestamp();
  }, 30000);
  
  // Refresh AI summary every 4 hours
  setInterval(async () => {
    await loadMarketSummary();
  }, 4 * 60 * 60 * 1000);
  
  updateTimestamp();
});

// Allow Enter key to add stock
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('stock-input');
  if (input) {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        addStock();
      }
    });
  }
});

// Fetch quotes from backend
async function fetchQuotesFromBackend(symbols) {
  try {
    const symbolString = symbols.join(',');
    const response = await fetch(`${BACKEND_URL}/api/quotes?symbols=${symbolString}`);
    
    if (!response.ok) {
      console.error(`Backend error: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    
    // Update last update time
    if (data.last_update) {
      lastUpdateTime = new Date(data.last_update);
    }
    
    // Convert object to array
    return Object.values(data.quotes || {});
  } catch (error) {
    console.error('Error fetching from backend:', error);
    return null;
  }
}

// Fetch market indices from backend
async function fetchMarketIndices() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/market-indices`);
    
    if (!response.ok) {
      console.error(`Backend error: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    
    // Update last update time
    if (data.last_update) {
      lastUpdateTime = new Date(data.last_update);
    }
    
    return data.indices || {};
  } catch (error) {
    console.error('Error fetching market indices:', error);
    return null;
  }
}

// Load watchlist
async function loadWatchlist() {
  const container = document.getElementById('watchlist-container');
  container.innerHTML = '<div class="text-center w-full pulse">Loading your stocks...</div>';
  
  const quotes = await fetchQuotesFromBackend(watchlist);
  
  if (!quotes || quotes.length === 0) {
    container.innerHTML = '<div class="text-center w-full text-gray-400">Unable to load quotes. Backend may be starting up...</div>';
    return;
  }
  
  // Calculate total portfolio change
  const avgChange = quotes.reduce((sum, q) => sum + q.changePercent, 0) / quotes.length;
  const changeElement = document.getElementById('watchlist-change');
  const changeColor = avgChange >= 0 ? 'text-green-400' : 'text-red-400';
  const arrow = avgChange >= 0 ? '↑' : '↓';
  changeElement.className = changeColor;
  changeElement.textContent = `${avgChange >= 0 ? '+' : ''}${avgChange.toFixed(2)}% today ${arrow}`;
  
  // Render stock cards
  container.innerHTML = quotes.map(quote => {
    const isPositive = quote.changePercent >= 0;
    const changeColor = isPositive ? 'text-green-400' : 'text-red-400';
    const arrow = isPositive ? '↑' : '↓';
    
    return `
      <div class="card snap-center min-w-72 rounded-2xl p-6 border border-gray-800 relative">
        <button 
          onclick="removeStock('${quote.symbol}')" 
          class="absolute top-2 right-2 text-gray-500 hover:text-red-400 text-xl"
          title="Remove from watchlist"
        >
          ×
        </button>
        <div class="text-3xl font-bold">${quote.symbol}</div>
        <div class="text-4xl mt-2">$${quote.price.toFixed(2)}</div>
        <div class="${changeColor} text-xl">
          ${isPositive ? '+' : ''}${quote.changePercent.toFixed(2)}% ${arrow}
        </div>
        <div class="text-sm mt-3 text-gray-400">${quote.name}</div>
      </div>
    `;
  }).join('');
}

// Load suggested stocks
async function loadSuggestedStocks() {
  const container = document.getElementById('suggested-stocks');
  container.innerHTML = '<div class="col-span-full text-center pulse">Loading...</div>';
  
  const quotes = await fetchQuotesFromBackend(suggestedStocks);
  
  if (!quotes || quotes.length === 0) {
    container.innerHTML = '<div class="col-span-full text-center text-gray-400">Unable to load suggestions</div>';
    return;
  }
  
  container.innerHTML = quotes.map(quote => {
    const isPositive = quote.changePercent >= 0;
    const changeColor = isPositive ? 'text-green-400' : 'text-red-400';
    const arrow = isPositive ? '↑' : '↓';
    
    return `
      <div 
        class="cursor-pointer hover:scale-110 transition"
        onclick="addStockToWatchlist('${quote.symbol}')"
        title="Click to add to watchlist"
      >
        <div class="font-bold">${quote.symbol}</div>
        <div class="${changeColor} text-sm">
          ${isPositive ? '+' : ''}${quote.changePercent.toFixed(1)}% ${arrow}
        </div>
      </div>
    `;
  }).join('');
}

// Load market indices (top bar)
async function loadMarketIndices() {
  const indices = await fetchMarketIndices();
  
  if (!indices) {
    return;
  }
  
  // SPY (S&P 500)
  if (indices.SPY) {
    const spy = indices.SPY;
    const elem = document.getElementById('spx-futures');
    const isPositive = spy.changePercent >= 0;
    elem.className = isPositive ? 'text-green-400' : 'text-red-400';
    elem.textContent = `${isPositive ? '+' : ''}${spy.changePercent.toFixed(2)}% ${isPositive ? '↑' : '↓'}`;
  }
  
  // QQQ (Nasdaq)
  if (indices.QQQ) {
    const qqq = indices.QQQ;
    const elem = document.getElementById('ndx-futures');
    const isPositive = qqq.changePercent >= 0;
    elem.className = isPositive ? 'text-green-400' : 'text-red-400';
    elem.textContent = `${isPositive ? '+' : ''}${qqq.changePercent.toFixed(2)}% ${isPositive ? '↑' : '↓'}`;
  }
  
  // UVXY (VIX proxy)
  if (indices.UVXY) {
    const uvxy = indices.UVXY;
    const elem = document.getElementById('vix-quote');
    const isPositive = uvxy.changePercent >= 0;
    elem.className = isPositive ? 'text-red-400' : 'text-green-400'; // inverse
    elem.textContent = `${uvxy.price.toFixed(2)} ${isPositive ? '↑' : '↓'}`;
  }
  
  // Bitcoin
  if (indices['BTC/USD']) {
    const btc = indices['BTC/USD'];
    const elem = document.getElementById('btc-quote');
    const isPositive = btc.changePercent >= 0;
    elem.className = isPositive ? 'text-green-400' : 'text-red-400';
    elem.textContent = `$${btc.price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} ${isPositive ? '↑' : '↓'}`;
  }
}

// Load AI market summary
async function loadMarketSummary() {
  const container = document.getElementById('ai-summary');
  const timeElement = document.getElementById('summary-time');
  
  container.innerHTML = '<div class="pulse text-gray-400">Loading AI summary...</div>';
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/market-summary`);
    
    if (!response.ok) {
      container.innerHTML = '<div class="text-gray-400">Summary temporarily unavailable</div>';
      return;
    }
    
    const data = await response.json();
    
    if (data.summary) {
      container.textContent = data.summary;
      
      // Update time
      if (data.updated && timeElement) {
        const updated = new Date(data.updated);
        const now = new Date();
        const diffMinutes = Math.floor((now - updated) / 60000);
        
        if (diffMinutes < 60) {
          timeElement.textContent = `Updated ${diffMinutes} min ago`;
        } else {
          const hours = Math.floor(diffMinutes / 60);
          timeElement.textContent = `Updated ${hours} hour${hours > 1 ? 's' : ''} ago`;
        }
      }
    } else {
      container.innerHTML = '<div class="text-gray-400">Summary temporarily unavailable</div>';
    }
  } catch (error) {
    console.error('Error loading AI summary:', error);
    container.innerHTML = '<div class="text-gray-400">Summary temporarily unavailable</div>';
  }
}

// Add stock to watchlist
function addStock() {
  const input = document.getElementById('stock-input');
  const symbol = input.value.trim().toUpperCase();
  
  if (!symbol) {
    alert('Please enter a stock symbol');
    return;
  }
  
  if (watchlist.includes(symbol)) {
    alert(`${symbol} is already in your watchlist`);
    input.value = '';
    return;
  }
  
  watchlist.push(symbol);
  localStorage.setItem('watchlist', JSON.stringify(watchlist));
  input.value = '';
  loadWatchlist();
}

// Add stock from suggested section
function addStockToWatchlist(symbol) {
  if (watchlist.includes(symbol)) {
    alert(`${symbol} is already in your watchlist`);
    return;
  }
  
  watchlist.push(symbol);
  localStorage.setItem('watchlist', JSON.stringify(watchlist));
  loadWatchlist();
}

// Remove stock from watchlist
function removeStock(symbol) {
  if (confirm(`Remove ${symbol} from your watchlist?`)) {
    watchlist = watchlist.filter(s => s !== symbol);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    loadWatchlist();
  }
}

// Update timestamp
function updateTimestamp() {
  const elem = document.getElementById('last-update');
  
  if (lastUpdateTime) {
    const now = new Date();
    const diffSeconds = Math.floor((now - lastUpdateTime) / 1000);
    
    if (diffSeconds < 60) {
      elem.textContent = `${diffSeconds} sec ago`;
    } else if (diffSeconds < 3600) {
      elem.textContent = `${Math.floor(diffSeconds / 60)} min ago`;
    } else {
      elem.textContent = lastUpdateTime.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit'
      });
    }
  } else {
    elem.textContent = 'updating...';
  }
}

// Update timestamp every second for better UX
setInterval(updateTimestamp, 1000);
