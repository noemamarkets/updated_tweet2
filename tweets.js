// PULSE SECTION - SEMI-MANUAL METHOD
// 
// HOW TO UPDATE (30 seconds per tweet):
// 1. Find a good tweet on X (Twitter)
// 2. Copy the tweet text and handle
// 3. Come to GitHub → Edit this file
// 4. Add the tweet info below
// 5. Commit changes → Site updates in 30 seconds!
//
// TWEET FORMAT:
// {
//   handle: "@username",
//   text: "The tweet text goes here",
//   timestamp: "2025-12-14T14:30:00",
//   url: "https://x.com/username/status/1234567890",
//   featured: true  // First slot = featured (most expensive)
// }

const tweets = [
  {
    handle: "@unusual_whales",
    text: "BREAKING: NVDA breaks above $180 resistance. Heavy call volume detected with institutional buying accelerating into close.",
    timestamp: "2025-12-14T14:30:00",
    url: "https://x.com/unusual_whales/status/1865517692858212609",
    featured: true  // Slot #1 - 8:30 AM - FEATURED
  },
  {
    handle: "@Fxhedgers",
    text: "FED OFFICIAL: Rate cuts to proceed cautiously amid persistent inflation concerns. Markets digest hawkish commentary.",
    timestamp: "2025-12-14T13:45:00",
    url: "https://x.com/Fxhedgers/status/1865510234567890123",
    featured: false  // Slot #2
  },
  {
    handle: "@WSJ",
    text: "Bitcoin surges past $100K as institutional buying accelerates. ETF inflows reach new all-time highs.",
    timestamp: "2025-12-14T13:15:00",
    url: "https://x.com/WSJ/status/1865502456789012345",
    featured: false  // Slot #3
  },
  {
    handle: "@DeItaone",
    text: "APPLE: Supply chain sources indicate strong iPhone 16 demand in China. Production ramping up for holiday quarter.",
    timestamp: "2025-12-14T12:50:00",
    url: "https://x.com/DeItaone/status/1865495678901234567",
    featured: false  // Slot #4
  },
  {
    handle: "@elonmusk",
    text: "Tesla production hitting new records. Q4 deliveries tracking ahead of guidance. Cybertruck demand exceeding expectations.",
    timestamp: "2025-12-14T12:20:00",
    url: "https://x.com/elonmusk/status/1865488890123456789",
    featured: false  // Slot #5
  }
];

// Helper function to calculate relative time
function getRelativeTime(timestamp) {
  const now = new Date();
  const tweetTime = new Date(timestamp);
  const diffMs = now - tweetTime;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

// Load and display tweets (static, no auto-scroll)
function loadTweets() {
  const pulseSection = document.getElementById('pulse-section');
  
  if (!pulseSection) return;
  
  // Render all tweets
  pulseSection.innerHTML = tweets.map((tweet, index) => {
    const relativeTime = getRelativeTime(tweet.timestamp);
    const cardClass = tweet.featured ? 'featured' : 'standard';
    const featuredBadge = tweet.featured ? '<div class="text-xs text-cyan-400 font-bold mb-2">FEATURED</div>' : '';
    
    return `
      <div class="pulse-tweet ${cardClass}" style="padding: 20px; border-radius: 12px;">
        ${featuredBadge}
        <a href="${tweet.url}" 
           target="_blank" 
           class="text-cyan-400 hover:underline font-semibold text-base"
           onclick="trackTweetClick('${tweet.handle}', '${tweet.url}', event)">
          ${tweet.handle}
        </a>
        <span class="text-gray-500 text-sm"> · ${relativeTime}</span>
        <div class="mt-2 text-gray-200 leading-relaxed">${tweet.text}</div>
      </div>
    `;
  }).join('');
}

// Track tweet clicks with Google Analytics
function trackTweetClick(handle, url, event) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'tweet_click', {
      'tweet_author': handle,
      'tweet_url': url,
      'event_category': 'engagement',
      'event_label': handle
    });
  }
}

// Update relative times every minute
function updateTimes() {
  const tweetElements = document.querySelectorAll('.pulse-tweet');
  
  tweetElements.forEach((element, index) => {
    if (tweets[index]) {
      const timeElement = element.querySelector('.text-gray-500');
      if (timeElement) {
        const newTime = getRelativeTime(tweets[index].timestamp);
        const handle = tweets[index].handle;
        timeElement.innerHTML = ` · ${newTime}`;
      }
    }
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  loadTweets();
  
  // Update times every minute
  setInterval(updateTimes, 60000);
});
