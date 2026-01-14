# Free Tier Deployment Guide

## ⚠️ Important Limitations

You're using **FREE tiers** for both Vercel and Render. Here's what you need to know:

---

## 🆓 Free Tier Features

### Vercel Free Tier ✅
- **Bandwidth**: 100GB/month
- **Deployments**: Unlimited
- **Projects**: Unlimited
- **HTTPS**: Automatic
- **Custom Domain**: 1 domain
- **Performance**: Excellent (Global CDN)

**Verdict**: ✅ **Vercel free tier is PERFECT** for this project!

---

### Render Free Tier ⚠️

| Feature | Free Tier | Impact |
|---------|-----------|--------|
| **CPU** | 0.1 CPU | ⚠️ VERY SLOW processing |
| **RAM** | 512MB | ⚠️ May crash on large videos |
| **Spin Down** | After 15 min | ⚠️ CRITICAL ISSUE |
| **Restart** | 1-2 minutes | ⚠️ First request very slow |
| **Bandwidth** | 100GB/month | ✅ OK |
| **Disk** | Ephemeral | ⚠️ Cannot add persistent disk |
| **Concurrent** | 1 instance | ⚠️ One user at a time |

**Verdict**: ⚠️ **Usable but with MAJOR limitations**

---

## 🚨 Critical Issues with Free Render

### 1. **Spin Down (BIGGEST ISSUE)**
```
After 15 minutes of inactivity:
┌─────────────────────┐
│  Service SLEEPS 💤  │
└─────────────────────┘
         ↓
First request after sleep:
┌─────────────────────┐
│  Wait 1-2 MINUTES   │ ← User sees loading
│  to wake up         │
└─────────────────────┘
         ↓
Then normal processing begins
```

**Impact:**
- First video upload after sleep: **3-5 minute wait** (wake up + processing)
- Every 15 minutes of no activity = service sleeps again
- Users will think app is broken

### 2. **Very Slow Processing**

| Video Length | Free Tier Time | Paid Tier Time |
|--------------|----------------|----------------|
| 5 seconds | 3-5 minutes | 30-60 seconds |
| 10 seconds | 5-10 minutes | 1-2 minutes |
| 30 seconds | 15-30 minutes | 3-5 minutes |

**Why?** 0.1 CPU is 10x slower than paid tier (1 CPU)

### 3. **No Persistent Disk**
```
Free tier cannot add disk storage:
┌─────────────────────────────┐
│  Files stored in memory     │
│  Lost on service restart    │
│  Cleanup may not work       │
└─────────────────────────────┘
```

**Impact:**
- Uploads/outputs folder wiped on restart
- 30-minute cleanup might not work properly
- Videos may disappear unexpectedly

### 4. **Memory Crashes**

512MB RAM is tight:
```
Large video (50MB+) processing:
┌──────────────────┐
│  Frame 1 ✓       │  100MB memory
│  Frame 2 ✓       │  200MB memory
│  Frame 3 ✓       │  300MB memory
│  Frame 4 ✓       │  450MB memory
│  Frame 5 💥      │  CRASH! Out of memory
└──────────────────┘
```

**Impact:**
- Videos > 20MB may crash
- Multiple uploads = crash
- Unpredictable failures

---

## ✅ Optimized Free Tier Setup

To make free tier work better, follow these steps:

### Step 1: Update Render Configuration

Edit `render.yaml`:

```yaml
services:
  - type: web
    name: asciier-backend
    env: node
    region: oregon
    plan: free  # ← Explicitly set to free
    buildCommand: npm install
    startCommand: npm run server
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5000
      - key: FRONTEND_URL
        sync: false
    # Remove disk section - not available on free tier
```

### Step 2: Reduce Memory Usage

Update `.env.example` and Render environment:

```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-app.vercel.app
MAX_VIDEO_SIZE=20971520  # 20MB max
```

### Step 3: Add Warning to Frontend

Let's add a warning message for users about free tier limitations.

Create warning component for frontend to display:
```
⚠️ Free Tier Notice:
- First upload may take 2-3 minutes (server waking up)
- Video processing is slow (test with <10 second videos)
- Large videos (>20MB) may fail
- Service sleeps after 15 minutes
```

---

## 📝 Deployment Steps (Free Tier)

### Backend (Render Free) - 10 minutes

1. **Go to https://render.com**
2. Sign up (no credit card required)
3. Click **"New +"** → **"Web Service"**
4. Connect GitHub repository
5. Configure:
   ```
   Name: asciier-backend
   Region: Oregon
   Branch: main
   Build Command: npm install
   Start Command: npm run server
   Plan: Free (0.1 CPU, 512MB)
   ```
6. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=5000
   FRONTEND_URL=https://your-app.vercel.app
   ```
7. Click **"Create Web Service"**
8. Wait 10-15 minutes for first deploy
9. Copy URL: `https://asciier-backend.onrender.com`

### Frontend (Vercel Free) - 3 minutes

1. **Update** `client/.env.production`:
   ```env
   REACT_APP_API_URL=https://asciier-backend.onrender.com
   ```

2. **Commit and push**:
   ```bash
   git add client/.env.production
   git commit -m "Update production API URL"
   git push origin main
   ```

3. **Go to https://vercel.com**
4. Sign up with GitHub (no credit card)
5. Click **"Add New..."** → **"Project"**
6. Select repository
7. Configure:
   ```
   Framework: Create React App
   Root Directory: client
   Build Command: npm run build
   Output Directory: build
   ```
8. Add Environment Variable:
   ```
   REACT_APP_API_URL=https://asciier-backend.onrender.com
   ```
9. Click **"Deploy"**
10. Copy URL: `https://your-app.vercel.app`

### Update Backend CORS

1. Go back to Render dashboard
2. Update `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
3. Save (auto-redeploys, 2-3 minutes)

---

## 🧪 Testing Free Tier

### Test 1: Wake Up Time
```bash
# First request after deploy or sleep
curl https://your-backend.onrender.com/api/health

# Expected: 1-2 minute wait, then:
{"status":"ok","message":"ASCIIer API is running"}
```

### Test 2: Small Image (Should Work)
1. Open your Vercel URL
2. Switch to Image Mode
3. Upload small image (<1MB)
4. Wait 30-60 seconds
5. Should work ✓

### Test 3: Tiny Video (Challenging)
1. Switch to Video Mode
2. Upload VERY short video (<5 seconds, <5MB)
3. Wait 3-10 minutes
4. May work if lucky ⚠️

### Test 4: Regular Video (Will Likely Fail)
1. Upload 10 second video
2. Will probably timeout or crash 💥

---

## 💡 Tips for Free Tier Success

### 1. Keep Service Awake
```bash
# Ping every 10 minutes to prevent sleep
# Use external service like:
- UptimeRobot (free)
- Cron-job.org (free)

# Ping URL:
https://your-backend.onrender.com/api/health
```

### 2. Test with Tiny Files
- Images: < 500KB
- Videos: < 5 seconds, < 5MB
- ASCII width: 60-100 (not 240)

### 3. Warn Users
Add prominent warning on your site:
```
⚠️ Free Tier - Expect Slow Processing
First upload: 2-3 minutes (server starting)
Video processing: 5-10 minutes for 5 second clips
Recommended: Images only
```

### 4. Set Realistic Expectations
```
Free tier is for:
✓ Testing
✓ Portfolio/demo
✓ Small images only

NOT for:
✗ Real users
✗ Videos
✗ Production use
✗ Multiple concurrent users
```

---

## 🆙 When to Upgrade to Paid ($7/month)

Upgrade when you need:
- ✅ Fast processing (10x faster)
- ✅ No sleep/spin-down
- ✅ Persistent disk storage
- ✅ Reliable video processing
- ✅ Multiple concurrent users
- ✅ Videos longer than 5 seconds

**Cost**: $7/month (Render Starter)

---

## ⚡ Performance Comparison

| Feature | Free | Paid ($7) | Difference |
|---------|------|-----------|------------|
| **Wake-up** | 1-2 min | Instant | 120x faster |
| **5s video** | 5-10 min | 30-60s | 10x faster |
| **Uptime** | Sleeps | 24/7 | Always on |
| **Memory** | 512MB | 512MB | Same |
| **CPU** | 0.1 | 0.5 | 5x faster |
| **Disk** | None | 10GB | Persistent |
| **Users** | 1 | 5-10 | 10x capacity |

---

## 🚨 Common Free Tier Errors

### Error 1: "504 Gateway Timeout"
```
Cause: Service is waking up or processing too long
Solution: Wait 2-3 minutes and try again
Prevention: Use UptimeRobot to keep awake
```

### Error 2: "503 Service Unavailable"
```
Cause: Service crashed (out of memory)
Solution: Restart service in Render dashboard
Prevention: Use smaller files (<5MB)
```

### Error 3: "Processing..." Forever
```
Cause: Processing timed out or crashed
Solution: Refresh page and try smaller file
Prevention: Only test with 5 second videos
```

### Error 4: "No video with supported format"
```
Cause: FFmpeg failed due to memory limits
Solution: Try much smaller video
Prevention: Use images instead
```

---

## 📊 Free Tier Recommendations

### ✅ Good for Free Tier:
- **Images**: All sizes work fine
- **Short videos**: <5 seconds occasionally work
- **Testing**: Perfect for testing deployment
- **Portfolio**: Good for showing "it works"
- **Learning**: Great for learning deployment

### ❌ Bad for Free Tier:
- **Regular videos**: Too slow/unreliable
- **Real users**: Will have bad experience
- **Production**: Not suitable
- **Multiple users**: Only 1 at a time
- **Large files**: Will crash

---

## 🎯 Recommended Strategy

### Phase 1: Free Tier Testing (Now)
```
1. Deploy to free tier
2. Test with images only
3. Try 3-5 second videos
4. Add "Free Tier" warning banner
5. Use for portfolio/demo only
```

### Phase 2: Paid Upgrade (When Ready)
```
1. Get first users/feedback
2. Upgrade Render to Starter ($7/month)
3. Remove warning banner
4. Support real videos
5. Promote to users
```

### Phase 3: Scaling (Future)
```
1. Upgrade to Standard ($25/month)
2. Add Redis queue
3. Multiple workers
4. CDN for files
5. Custom domain
```

---

## 📝 Modified Deployment Checklist

### Pre-Deployment
- [ ] Accept free tier limitations
- [ ] Update render.yaml to remove disk
- [ ] Add free tier warning to UI
- [ ] Set low expectations

### Deployment
- [ ] Deploy backend (wait 10-15 min)
- [ ] Backend URL copied
- [ ] Update frontend .env.production
- [ ] Deploy frontend (wait 2-3 min)
- [ ] Frontend URL copied
- [ ] Update backend FRONTEND_URL

### Testing (Be Patient!)
- [ ] Wait 2 minutes for first request
- [ ] Test image upload (should work)
- [ ] Test 3 second video (may work)
- [ ] Document what works/doesn't
- [ ] Add limitations to README

### Monitoring
- [ ] Set up UptimeRobot (free)
- [ ] Check Render logs daily
- [ ] Track crash frequency
- [ ] Monitor memory usage
- [ ] Plan upgrade timeline

---

## 💬 Sample Warning Message for Users

Add this to your frontend:

```jsx
<div style={{
  background: '#fff3cd',
  border: '2px solid #ffc107',
  padding: '15px',
  borderRadius: '8px',
  marginBottom: '20px'
}}>
  <strong>⚠️ Free Tier Limitations:</strong>
  <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
    <li>First upload: 2-3 minute wait (server starting)</li>
    <li>Video processing: 5-10 minutes for short clips</li>
    <li>Large files may fail or timeout</li>
    <li>Recommended: Use images for best results</li>
  </ul>
  <em style={{ fontSize: '12px' }}>
    Upgrade to paid tier ($7/month) for fast, reliable processing
  </em>
</div>
```

---

## 🎉 Summary

**Free Tier Works For:**
✅ Learning deployment
✅ Testing the application  
✅ Portfolio/demo projects
✅ Image conversion
✅ Showing proof of concept

**Free Tier NOT For:**
❌ Real users
❌ Regular video processing
❌ Production use
❌ Anything reliable

**Bottom Line:**
Free tier is great for testing, but upgrade to $7/month Render Starter as soon as you want real users or reliable video processing.

---

**Next Steps:**
1. Deploy with free tier
2. Test thoroughly
3. Add warning banner
4. Use for portfolio
5. Upgrade when ready

Good luck with your free tier deployment! 🚀
