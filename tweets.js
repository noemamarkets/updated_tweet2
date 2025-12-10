// 📰 PULSE SECTION - SEMI-MANUAL METHOD (RELIABLE!)
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
//   timestamp: "2025-12-08T14:30:00",
//   url: "https://x.com/username/status/1234567890"
// }
//
// TIME FORMAT: "YYYY-MM-DDTHH:MM:SS"
// Today's date: 2025-12-08
// Examples:
//   2:30 PM = "2025-12-08T14:30:00"
//   9:45 AM = "2025-12-08T09:45:00"
//   
// TIP: Just use current time!
// TIP: Keep 5-8 most recent tweets, delete old ones

const tweets = [
  {
    handle: "@unusual_whales",
    text: "China's DeepSeek is using its banned Nvidia, $NVDA, Blackwell AI chips. $NVDA has refuted the report.",
    timestamp: "2025-12-09T8:13:00",
    url: "https://x.com/unusual_whales/status/1998773502921371899?s=46s=20"
  },
  {
    handle: "@StockMKTNewz",
    text: "Apple $AAPL said today that ChatGPT was the most downloaded app on its app store in 2025 - Tech Crunch",
    timestamp: "2025-12-08T13:45:00",
    url: "https://x.com/stockmktnewz/status/1998775904797884640?s=46s=46s=46"
  },
  {
    handle: "@zerohedge",
    text: "Timiraos: “As many as five of the 12 voting members of the Fed’s policy committee, and 10 of all 19 members, have signaled in speeches or public interviews that they didn’t see a strong case to cut. Of those, only one formally dissented from the central bank’s decision to cut rates in October."Polymarket has 4+ dissents at 22%"",
    timestamp: "2025-12-08T13:15:00",
    url: "https://x.com/zerohedge/status/1998788457255055637?s=46s=46"
  },
  {
    handle: "@DeItaone",
    text: "APPLE: Supply chain sources indicate strong iPhone 16 demand in China.",
    timestamp: "2025-12-08T12:50:00",
    url: "https://x.com/DeItaone/status/1865495678901234567"
  },
  {
    handle: "@WSJ",
    text: "Bitcoin surges past $100K as institutional buying accelerates.",
    timestamp: "2025-12-08T12:20:00",
    url: "https://x.com/WSJ/status/1865488890123456789"
  }
];

// DON'T EDIT BELOW THIS LINE
// ========================================

// Helper function to calculate relative time
function getRelativeTime(timestamp) {
  const now = new Date();
  const tweetTime = new Date(timestamp);
  const diffMs = now - tweetTime;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

// Load and display tweets
function loadTweets() {
  const pulseSection = document.getElementById('pulse-section');
  
  if (!pulseSection) return;
  
  // Render tweets with auto-calculated time
  pulseSection.innerHTML = tweets.map((tweet, index) => {
    const relativeTime = getRelativeTime(tweet.timestamp);
    return `
      <div data-tweet-index="${index}">
        <a href="${tweet.url}" target="_blank" class="text-cyan-400 hover:underline font-medium">
          ${tweet.handle}
        </a>
        <span class="text-gray-500 tweet-time"> · ${relativeTime}</span>
        <br>
        <span class="text-gray-300">"${tweet.text}"</span>
      </div>
    `;
  }).join('');
}

// Update relative times every minute
function updateTimes() {
  const tweetElements = document.querySelectorAll('#pulse-section > div');
  
  tweetElements.forEach((element, index) => {
    if (tweets[index]) {
      const timeElement = element.querySelector('.tweet-time');
      if (timeElement) {
        const newTime = getRelativeTime(tweets[index].timestamp);
        timeElement.textContent = ` · ${newTime}`;
      }
    }
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  loadTweets();
  
  // Update times every minute so they stay fresh
  setInterval(updateTimes, 60000);
});
