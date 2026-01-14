# Deployment Guide: Vercel (Frontend) + Render (Backend)

This guide will help you deploy the split architecture with React frontend on Vercel and Express backend on Render.

## Architecture Overview

```
┌─────────────────────┐
│   Vercel (Frontend) │
│   React App         │
│   Port: 443 (HTTPS) │
└──────────┬──────────┘
           │
           │ API Calls
           ▼
┌─────────────────────┐
│   Render (Backend)  │
│   Express + FFmpeg  │
│   Port: 5000        │
└─────────────────────┘
```

---

## Part 1: Deploy Backend to Render

### Step 1: Prepare Repository

```bash
# Commit all changes
git add .
git commit -m "Prepare for split deployment"
git push origin main
```

### Step 2: Create Render Account

1. Go to https://render.com
2. Sign up with GitHub account
3. Authorize Render to access your repositories

### Step 3: Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure settings:

**Basic Settings:**
- **Name**: `asciier-backend` (or your choice)
- **Region**: Oregon (or closest to you)
- **Branch**: `main`
- **Root Directory**: (leave empty)
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm run server`

**Instance Type:**
- Select **"Starter"** ($7/month) or **"Free"** (0.1 CPU, spins down)
- Note: Free tier will be slow and spin down after inactivity

### Step 4: Add Environment Variables

In Render dashboard, go to **"Environment"** tab and add:

```
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-app.vercel.app
```

(You'll update `FRONTEND_URL` after deploying frontend)

### Step 5: Add Persistent Disk (Important!)

1. Go to **"Disks"** tab
2. Click **"Add Disk"**
3. Configure:
   - **Name**: `asciier-storage`
   - **Mount Path**: `/opt/render/project/src`
   - **Size**: `10 GB`
4. Click **"Create Disk"**

### Step 6: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. FFmpeg will be installed automatically
4. **Copy your backend URL**: `https://asciier-backend.onrender.com`

### Step 7: Verify Backend

Test your backend is working:

```bash
curl https://your-backend.onrender.com/api/health
```

Should return:
```json
{"status":"ok","message":"ASCIIer API is running"}
```

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Update Environment Variables

Edit `client/.env.production`:

```env
REACT_APP_API_URL=https://your-backend.onrender.com
```

Replace with your actual Render backend URL.

### Step 2: Commit Changes

```bash
git add client/.env.production
git commit -m "Update API URL for production"
git push origin main
```

### Step 3: Create Vercel Account

1. Go to https://vercel.com
2. Sign up with GitHub account
3. Authorize Vercel to access your repositories

### Step 4: Import Project

1. Click **"Add New..."** → **"Project"**
2. Select your repository
3. Configure:

**Project Settings:**
- **Framework Preset**: Create React App
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `build`

### Step 5: Add Environment Variable

In Vercel:
1. Go to **"Settings"** → **"Environment Variables"**
2. Add variable:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://your-backend.onrender.com`
   - **Environment**: Production, Preview, Development

### Step 6: Deploy

1. Click **"Deploy"**
2. Wait for deployment (2-3 minutes)
3. **Copy your frontend URL**: `https://your-app.vercel.app`

### Step 7: Update Backend CORS

Go back to **Render dashboard**:

1. Open your backend service
2. Go to **"Environment"** tab
3. Update `FRONTEND_URL` variable:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
4. Save (this will redeploy)

---

## Part 3: Testing

### Test Image Conversion

1. Open your Vercel URL: `https://your-app.vercel.app`
2. Switch to **"🖼️ Image Mode"**
3. Upload a small image
4. Wait for conversion
5. Verify you can view and download

### Test Video Conversion

1. Switch to **"📹 Video Mode"**
2. Upload a SHORT video (< 10 seconds for testing)
3. Wait for processing (may take 2-5 minutes)
4. Verify:
   - Video processes successfully
   - Audio is preserved
   - Download works

---

## Troubleshooting

### CORS Errors

**Problem**: "Access to XMLHttpRequest has been blocked by CORS policy"

**Solution**:
1. Check `FRONTEND_URL` in Render environment matches your Vercel URL exactly
2. Include protocol: `https://your-app.vercel.app` (not `www.` or trailing `/`)
3. Redeploy backend after changing environment variable

### Backend Timeout

**Problem**: "504 Gateway Timeout" or "503 Service Unavailable"

**Solution**:
1. If using Render **Free tier**, upgrade to **Starter** ($7/month)
2. Free tier spins down after 15 minutes of inactivity
3. First request after spin-down takes 1-2 minutes

### Upload Fails

**Problem**: "Network Error" or "Request failed"

**Solution**:
1. Check backend is running: `curl https://your-backend.onrender.com/api/health`
2. Verify file size < 100MB
3. Check Render logs for errors

### Video Processing Hangs

**Problem**: Status stuck on "Processing..."

**Solution**:
1. Check Render logs: Dashboard → Logs
2. Look for FFmpeg errors
3. Verify disk space available
4. Free tier may be too slow - upgrade to Starter

### Files Not Cleaning Up

**Problem**: Disk fills up over time

**Solution**:
1. Check cleanup scheduler is running (see logs)
2. Verify `/opt/render/project/src` is mounted correctly
3. Manually clear: SSH into Render and run `rm -rf uploads/* outputs/*`

---

## Cost Breakdown

### Minimum Cost (Free Tier)

- **Render Free**: $0/month (slow, spins down)
- **Vercel Free**: $0/month
- **Total**: **$0/month**

⚠️ **Warning**: Free tier is VERY slow for video processing and spins down after inactivity.

### Recommended (Production)

- **Render Starter**: $7/month (512MB RAM, 0.5 CPU)
- **Vercel Hobby**: $0/month (or $20/month Pro)
- **Total**: **$7-27/month**

### Scaling (High Traffic)

- **Render Standard**: $25/month (2GB RAM, 1 CPU)
- **Vercel Pro**: $20/month
- **Total**: **$45/month**

---

## Monitoring & Logs

### Render Logs

```bash
# View in dashboard: Dashboard → Logs
# Or use Render CLI:
npm install -g render-cli
render login
render logs
```

### Vercel Logs

```bash
# View in dashboard: Deployments → Click deployment → Logs
# Or use Vercel CLI:
npm install -g vercel
vercel login
vercel logs
```

---

## Development Workflow

### Local Development

```bash
# Terminal 1: Backend
npm run server

# Terminal 2: Frontend  
cd client
npm start
```

Frontend will use `http://localhost:5000` from `.env.development`

### Deploy Updates

**Frontend Only:**
```bash
git add client/
git commit -m "Update frontend"
git push
# Vercel auto-deploys
```

**Backend Only:**
```bash
git add server/
git commit -m "Update backend"  
git push
# Render auto-deploys
```

**Both:**
```bash
git add .
git commit -m "Update app"
git push
# Both auto-deploy
```

---

## Custom Domain (Optional)

### Add Domain to Vercel

1. Go to **"Settings"** → **"Domains"**
2. Add your domain: `asciier.com`
3. Update DNS records as instructed
4. Wait for SSL certificate (automatic)

### Add Domain to Render

1. Go to **"Settings"** → **"Custom Domain"**
2. Add subdomain: `api.asciier.com`
3. Update DNS records
4. Update frontend env: `REACT_APP_API_URL=https://api.asciier.com`

---

## Security Checklist

- [ ] HTTPS enabled on both services (automatic)
- [ ] CORS configured with specific frontend URL
- [ ] Environment variables set correctly
- [ ] No sensitive data in code
- [ ] File cleanup running (check logs)
- [ ] API rate limiting considered (optional)

---

## Backup & Recovery

### Backup Configuration

- Environment variables documented in `.env.example`
- All code in Git repository
- User files deleted after 30 minutes (no backup needed)

### Disaster Recovery

1. Redeploy from Git repository
2. Restore environment variables from `.env.example`
3. Recreate disk storage on Render

---

## Performance Optimization

### Frontend (Vercel)

- Automatically optimized
- Global CDN
- Image optimization
- Gzip compression

### Backend (Render)

1. **Upgrade instance** for faster processing
2. **Add Redis** for processing queue (advanced)
3. **Use CDN** for serving output files
4. **Implement caching** for repeated conversions

---

## Next Steps

1. ✅ Deploy backend to Render
2. ✅ Deploy frontend to Vercel
3. ✅ Test full workflow
4. ✅ Monitor logs for errors
5. ⏭️ Add custom domain (optional)
6. ⏭️ Set up monitoring/alerts
7. ⏭️ Consider scaling strategy

---

## Support

- **Render**: https://render.com/docs
- **Vercel**: https://vercel.com/docs
- **FFmpeg**: https://ffmpeg.org/documentation.html

## Quick Reference

**Render Backend URL**: `https://asciier-backend.onrender.com`  
**Vercel Frontend URL**: `https://your-app.vercel.app`  
**Health Check**: `curl https://backend-url/api/health`  
**Cleanup Status**: `curl https://backend-url/api/cleanup/status`

---

🎉 **Deployment Complete!** Your ASCII converter is now live with split architecture.
