# Deployment Summary: Vercel + Render

## ✅ What Was Changed

Your application has been split into separate frontend and backend deployments:

### Architecture
```
┌──────────────────────┐         ┌──────────────────────┐
│  Vercel (Frontend)   │  ←────→ │  Render (Backend)    │
│  - React App         │  HTTPS  │  - Express API       │
│  - Static Files      │  Calls  │  - FFmpeg            │
│  - Global CDN        │         │  - Video Processing  │
└──────────────────────┘         └──────────────────────┘
```

## 📁 New Files Created

### Deployment Configuration
- ✅ `render.yaml` - Render backend configuration
- ✅ `vercel.json` - Vercel frontend configuration  
- ✅ `.env.example` - Environment variables template
- ✅ `DEPLOY_VERCEL_RENDER.md` - Complete deployment guide

### Frontend Configuration
- ✅ `client/.env.development` - Local dev API URL (http://localhost:5000)
- ✅ `client/.env.production` - Production API URL (template)
- ✅ `client/src/config.js` - API URL configuration module
- ✅ `client/.gitignore` - Client-specific gitignore

### Modified Files
- ✅ All components now use `API_URL` from config
- ✅ Server CORS updated for cross-origin requests
- ✅ Removed proxy from client package.json

## 🚀 Quick Deployment Steps

### 1. Deploy Backend to Render (5 minutes)

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Select your repository
5. Configure:
   - **Name**: asciier-backend
   - **Build Command**: `npm install`
   - **Start Command**: `npm run server`
   - **Add Disk**: 10GB at `/opt/render/project/src`
6. Add Environment Variable:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
   (Update this after deploying frontend)
7. Click "Create Web Service"
8. **Copy your backend URL**: `https://asciier-backend.onrender.com`

### 2. Update Frontend Configuration (1 minute)

Edit `client/.env.production`:
```env
REACT_APP_API_URL=https://your-backend.onrender.com
```
Replace with your actual Render URL.

Commit and push:
```bash
git add client/.env.production
git commit -m "Update production API URL"
git push origin main
```

### 3. Deploy Frontend to Vercel (3 minutes)

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New..." → "Project"
4. Select your repository
5. Configure:
   - **Framework**: Create React App
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
6. Add Environment Variable:
   - Name: `REACT_APP_API_URL`
   - Value: `https://your-backend.onrender.com`
7. Click "Deploy"
8. **Copy your frontend URL**: `https://your-app.vercel.app`

### 4. Update Backend CORS (1 minute)

Go back to Render:
1. Open your backend service
2. Go to "Environment" tab
3. Update `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
4. Save (auto-redeploys)

### 5. Test! (2 minutes)

1. Open your Vercel URL
2. Try uploading an image (quick test)
3. Try uploading a short video
4. Verify download works

## 🎯 Environment Variables Reference

### Backend (Render)
```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-app.vercel.app
```

### Frontend (Vercel)
```env
REACT_APP_API_URL=https://your-backend.onrender.com
```

## 💰 Cost

### Minimum (Testing)
- Render Free: $0/month ⚠️ Very slow, spins down
- Vercel Free: $0/month
- **Total: $0/month**

### Recommended (Production)
- Render Starter: **$7/month** (512MB RAM, 0.5 CPU, persistent)
- Vercel Hobby: $0/month
- **Total: $7/month**

## 📝 What Works Now

### Local Development
```bash
npm run dev
```
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Uses `.env.development` automatically

### Production
- Frontend on Vercel (automatic deployments)
- Backend on Render (automatic deployments)
- CORS configured correctly
- HTTPS enabled automatically
- Files auto-delete after 30 minutes

## ⚠️ Important Notes

### After Deploying Backend
1. Copy the Render URL
2. Update `client/.env.production`
3. Commit and push
4. Vercel will auto-deploy

### After Deploying Frontend
1. Copy the Vercel URL
2. Update `FRONTEND_URL` in Render
3. Render will auto-redeploy

### Testing
- Test with small files first
- Free tier is VERY slow for videos
- Upgrade to Starter ($7/month) for production

### Monitoring
- **Render Logs**: Dashboard → Logs
- **Vercel Logs**: Deployments → Click deployment → Logs
- **Health Check**: `curl https://backend-url/api/health`

## 🔧 Troubleshooting

### CORS Error
- Verify `FRONTEND_URL` matches Vercel URL exactly
- Include protocol: `https://` not `http://`
- No trailing slash
- Redeploy backend after changing

### 504 Timeout
- Free tier is too slow
- Upgrade to Render Starter ($7/month)
- First request after spin-down takes 1-2 minutes

### Upload Fails
- Check backend health: `curl https://backend-url/api/health`
- Check Render logs for errors
- Verify file size < 100MB

### Files Not Deleting
- Check cleanup scheduler in logs
- Verify disk mounted correctly
- May need to manually clear: `rm -rf uploads/* outputs/*`

## 📚 Documentation

- **Complete Guide**: `DEPLOY_VERCEL_RENDER.md`
- **Local Setup**: `SETUP.md`
- **Changelog**: `CHANGELOG.md`
- **Main README**: `README.md`

## ✅ Deployment Checklist

- [ ] Backend deployed to Render
- [ ] Backend URL copied
- [ ] Frontend `.env.production` updated
- [ ] Frontend deployed to Vercel
- [ ] Frontend URL copied
- [ ] Backend `FRONTEND_URL` updated
- [ ] Image upload tested
- [ ] Video upload tested (short clip)
- [ ] Download works
- [ ] Logs accessible

## 🎉 You're Done!

Your ASCII converter is now live with:
- ✅ Global CDN (Vercel)
- ✅ FFmpeg support (Render)
- ✅ Automatic HTTPS
- ✅ Auto-deploy from Git
- ✅ 30-minute file cleanup
- ✅ Scalable architecture

**Next Steps:**
1. Share your Vercel URL
2. Monitor Render logs for issues
3. Consider upgrading to Starter plan ($7/month)
4. Add custom domain (optional)

---

Need help? Check `DEPLOY_VERCEL_RENDER.md` for detailed instructions.
