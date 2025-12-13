# Noema Financial - Live Site

Your financial news platform at [noema.financial](https://noema.financial)

## 📰 How to Update Tweets (Every 2 Hours) - SEMI-MANUAL METHOD

### ⚡ Quick & Reliable - 30 Seconds Per Tweet!

**What You Enter:**
- Handle (copy from tweet)
- Text (copy from tweet)  
- Timestamp
- URL (copy link)

**What Happens Automatically:**
- ✅ Calculates "5 min ago", "1 hour ago" automatically
- ✅ Updates time as users stay on page
- ✅ No API issues - always works!

---

### 📝 **Step-by-Step:**

1. **Find a tweet on X (Twitter)**
2. **Copy these 4 things:**
   - Handle (e.g., `@elonmusk`)
   - Tweet text
   - Click "Share" → Copy link
   - Note current time

3. **Go to GitHub → Click `tweets.js` → Click pencil icon ✏️**

4. **Add the tweet:**
```javascript
{
  handle: "@elonmusk",
  text: "Tesla production hitting new records. Q4 looking strong.",
  timestamp: "2025-12-08T14:30:00",
  url: "https://x.com/elonmusk/status/1865517692858212609"
},
```

5. **Scroll down → Click "Commit changes"**
6. **Site updates in 30 seconds!**

---

### 🕐 **Timestamp Format:**

**Format:** `YYYY-MM-DDTHH:MM:SS`

**Examples for December 8, 2025:**
- **2:30 PM** = `2025-12-08T14:30:00`
- **9:45 AM** = `2025-12-08T09:45:00`
- **5:15 PM** = `2025-12-08T17:15:00`

**Tip:** Just use current time!

---

### 🎯 **Finding Good Tweets:**
- Search X for: `#stocks`, `#trading`, `$NVDA`, `$AAPL`
- Follow: @unusual_whales, @Fxhedgers, @DeItaone, @WSJ, @elonmusk
- Look for: Breaking news, earnings, major moves, market updates

---

### 💡 **Quick Example:**

**You see this tweet on X:**
```
@Fxhedgers
FED OFFICIAL: Rate cuts to proceed cautiously amid inflation concerns.
```

**You add to GitHub:**
```javascript
{
  handle: "@Fxhedgers",
  text: "FED OFFICIAL: Rate cuts to proceed cautiously amid inflation concerns.",
  timestamp: "2025-12-08T14:30:00",  // Current time
  url: "https://x.com/Fxhedgers/status/1234567890"
},
```

**Done! Site shows:**
```
@Fxhedgers · 5 min ago
"FED OFFICIAL: Rate cuts to proceed cautiously amid inflation concerns."
```

And the "5 min ago" auto-updates to "6 min ago", "7 min ago", etc.!

---

## 🔧 Files:
- `index.html` - Main page (don't edit)
- `app.js` - Quote logic (don't edit)
- `tweets.js` - **EDIT THIS ONE!** ✏️

---

## 🚀 Connected Services:
- **Frontend:** Netlify (auto-deploys from this repo)
- **Backend:** Render.com (Polygon.io quotes)
- **Domain:** noema.financial (GoDaddy DNS)
