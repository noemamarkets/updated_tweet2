// Backend API Configuration
const BACKEND_URL = 'https://noema-backend-0f8z.onrender.com';

// Default watchlist - Expanded to show 10 stocks (2 rows of 5)
let watchlist = JSON.parse(localStorage.getItem('watchlist')) || ['NVDA', 'AAPL', 'TSLA', 'MSFT', 'AMD', 'GOOGL', 'META', 'AMZN', 'NFLX', 'INTC'];

// Suggested stocks
const suggestedStocks = ['TSM', 'SMCI', 'ASML', 'DELL', 'PLTR', 'COIN'];

// Last update time
let lastUpdateTime = null;

// Dynamic greetings (Claude-style)
const greetings = [
  "Good morning",
  "Happy trading",
  "Here's what's moving today",
  "Welcome back",
  "Markets are open"
];

// Get random greeting
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

// Set dynamic greeting on load
function setGreeting() {
  const greetingElement = document.getElementById('greeting');
  if (greetingElement) {
    greetingElement.textContent = getGreeting();
  }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', async () => {
  setGreeting();
  await loadWatchlist();
  await loadSuggestedStocks();
  await loadMarketIndices();
  await loadMarketSummary();
  
  // Refresh every 30 seconds
  setInterval(async () => {
    await loadWatchlist();
    await loadMarketIndices();
  }, 30000);
  
  // Refresh AI summary every 4 hours
  setInterval(async () => {
    await loadMarketSummary();
  }, 4 * 60 * 60 * 1000);
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
    
    if (data.last_update) {
      lastUpdateTime = new Date(data.last_update);
    }
    
    return Object.values(data.quotes || {});
  } catch (error) {
    console.error('Error fetching from backend:', error);
    return null;
  }
}

// Fetch market indices
async function fetchMarketIndices() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/market-indices`);
    
    if (!response.ok) {
      console.error(`Backend error: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    
    if (data.last_update) {
      lastUpdateTime = new Date(data.last_update);
    }
    
    return data.indices || {};
  } catch (error) {
    console.error('Error fetching market indices:', error);
    return null;
  }
}

// Load watchlist with new card design
async function loadWatchlist() {
  const container = document.getElementById('watchlist-container');
  container.innerHTML = '<div class="col-span-full text-center pulse-anim">Loading...</div>';
  
  const quotes = await fetchQuotesFromBackend(watchlist);
  
  if (!quotes || quotes.length === 0) {
    container.innerHTML = '<div class="col-span-full text-center text-gray-400">Unable to load quotes</div>';
    return;
  }
  
  // Calculate portfolio average
  const avgChange = quotes.reduce((sum, q) => sum + q.changePercent, 0) / quotes.length;
  const changeElement = document.getElementById('watchlist-change');
  const changeColor = avgChange >= 0 ? 'text-green-400' : 'text-red-400';
  const arrow = avgChange >= 0 ? 'up' : 'down';
  changeElement.className = changeColor;
  changeElement.textContent = `${avgChange >= 0 ? '+' : ''}${avgChange.toFixed(2)}% ${arrow}`;
  
  // Render new Apple Stocks-style cards
  container.innerHTML = quotes.map(quote => {
    const isPositive = quote.changePercent >= 0;
    const changeColor = isPositive ? 'text-green-400' : 'text-red-400';
    const cardClass = isPositive ? 'positive' : 'negative';
    
    return `
      <div class="stock-card ${cardClass}" onclick="removeStock('${quote.symbol}')">
        <div class="stock-ticker">${quote.symbol}</div>
        <div class="stock-name">${quote.name}</div>
        <div class="stock-price">$${quote.price.toFixed(2)}</div>
        <div class="stock-change ${changeColor}">
          ${isPositive ? '+' : ''}${quote.change.toFixed(2)} (${isPositive ? '+' : ''}${quote.changePercent.toFixed(2)}%)
        </div>
      </div>
    `;
  }).join('');
}

// Load suggested stocks
async function loadSuggestedStocks() {
  const container = document.getElementById('suggested-stocks');
  container.innerHTML = '<div class="col-span-full text-center pulse-anim">Loading...</div>';
  
  const quotes = await fetchQuotesFromBackend(suggestedStocks);
  
  if (!quotes || quotes.length === 0) {
    container.innerHTML = '<div class="col-span-full text-center text-gray-400">Unable to load</div>';
    return;
  }
  
  container.innerHTML = quotes.map(quote => {
    const isPositive = quote.changePercent >= 0;
    const changeColor = isPositive ? 'text-green-400' : 'text-red-400';
    
    return `
      <div 
        class="cursor-pointer hover:scale-110 transition"
        onclick="addStockToWatchlist('${quote.symbol}')"
        title="Add to watchlist"
      >
        <div class="font-bold text-lg">${quote.symbol}</div>
        <div class="${changeColor} text-sm font-semibold">
          ${isPositive ? '+' : ''}${quote.changePercent.toFixed(1)}%
        </div>
      </div>
    `;
  }).join('');
}

// Load market indices (sticky bar)
async function loadMarketIndices() {
  const indices = await fetchMarketIndices();
  
  if (!indices) return;
  
  // SPY
  if (indices.SPY) {
    const spy = indices.SPY;
    const elem = document.getElementById('spx-futures');
    const isPositive = spy.changePercent >= 0;
    elem.className = isPositive ? 'text-green-400' : 'text-red-400';
    elem.textContent = `${isPositive ? '+' : ''}${spy.changePercent.toFixed(2)}%`;
  }
  
  // QQQ
  if (indices.QQQ) {
    const qqq = indices.QQQ;
    const elem = document.getElementById('ndx-futures');
    const isPositive = qqq.changePercent >= 0;
    elem.className = isPositive ? 'text-green-400' : 'text-red-400';
    elem.textContent = `${isPositive ? '+' : ''}${qqq.changePercent.toFixed(2)}%`;
  }
  
  // VIX
  if (indices.UVXY) {
    const uvxy = indices.UVXY;
    const elem = document.getElementById('vix-quote');
    const isPositive = uvxy.changePercent >= 0;
    elem.className = isPositive ? 'text-red-400' : 'text-green-400';
    elem.textContent = `${uvxy.price.toFixed(2)}`;
  }
  
  // Bitcoin
  if (indices['BTC/USD']) {
    const btc = indices['BTC/USD'];
    const elem = document.getElementById('btc-quote');
    const isPositive = btc.changePercent >= 0;
    elem.className = isPositive ? 'text-green-400' : 'text-red-400';
    elem.textContent = `$${btc.price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  }
}

// Load AI market summary
async function loadMarketSummary() {
  const container = document.getElementById('ai-summary');
  const expandBtn = document.getElementById('summary-expand-btn');
  
  container.innerHTML = '<div class="pulse-anim text-gray-400">Loading...</div>';
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/market-summary`);
    
    if (!response.ok) {
      container.innerHTML = '<div class="text-gray-400">Summary unavailable</div>';
      return;
    }
    
    const data = await response.json();
    
    if (data.summary) {
      container.textContent = data.summary;
      container.classList.add('summary-truncated');
      
      // Show expand button
      if (expandBtn) {
        expandBtn.classList.remove('hidden');
      }
    } else {
      container.innerHTML = '<div class="text-gray-400">Summary unavailable</div>';
    }
  } catch (error) {
    console.error('Error loading AI summary:', error);
    container.innerHTML = '<div class="text-gray-400">Summary unavailable</div>';
  }
}

// Toggle summary expansion
function toggleSummary() {
  const container = document.getElementById('ai-summary');
  const expandBtn = document.getElementById('summary-expand-btn');
  
  if (container.classList.contains('summary-truncated')) {
    container.classList.remove('summary-truncated');
    container.classList.add('summary-expanded');
    if (expandBtn) expandBtn.textContent = 'Read less';
  } else {
    container.classList.add('summary-truncated');
    container.classList.remove('summary-expanded');
    if (expandBtn) expandBtn.textContent = 'Read more';
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
  
  // Track in Google Analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', 'add_to_watchlist', {
      'stock_symbol': symbol,
      'event_category': 'engagement',
      'event_label': symbol
    });
  }
  
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
  
  // Track in Google Analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', 'add_to_watchlist', {
      'stock_symbol': symbol,
      'source': 'suggested',
      'event_category': 'engagement',
      'event_label': symbol
    });
  }
  
  loadWatchlist();
}

// Remove stock from watchlist
function removeStock(symbol) {
  if (confirm(`Remove ${symbol} from watchlist?`)) {
    watchlist = watchlist.filter(s => s !== symbol);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    
    // Track in Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'remove_from_watchlist', {
        'stock_symbol': symbol,
        'event_category': 'engagement',
        'event_label': symbol
      });
    }
    
    loadWatchlist();
  }
}
