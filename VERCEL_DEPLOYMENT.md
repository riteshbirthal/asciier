# Vercel Deployment Instructions

## 🚀 Quick Deploy

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Import to Vercel

1. Go to https://vercel.com
2. Click **"Add New..."** → **"Project"**
3. Select your GitHub repository

### Step 3: Configure Project Settings

**IMPORTANT:** Choose ONE of these methods:

#### Method A: Use Root Directory (Recommended)

**Framework Preset:** Create React App

**Root Directory:** `client`

**Build & Development Settings:**
```
Build Command: npm run build (or leave empty - auto-detected)
Output Directory: build (or leave empty - auto-detected)  
Install Command: npm install (or leave empty - auto-detected)
```

#### Method B: Build from Root (Alternative)

**Framework Preset:** Other

**Root Directory:** Leave empty

**Build & Development Settings:**
```
Build Command: cd client && npm ci && npm run build
Output Directory: client/build
Install Command: Leave empty (handled by buildCommand)
```

### Step 4: Environment Variables

Add this environment variable in Vercel dashboard:

```
Name: REACT_APP_API_URL
Value: https://your-backend.onrender.com
```

**Important:** Replace with your actual Render backend URL

### Step 5: Deploy

Click **"Deploy"**

---

## ⚙️ Alternative: Use vercel.json (Current Setup)

The project includes a `vercel.json` that auto-configures deployment.

**What it does:**
- Builds from `client/` directory
- Installs dependencies
- Outputs to `client/build`
- No manual configuration needed!

**To use:**
1. Just import project to Vercel
2. Add environment variable
3. Deploy!

---

## 🔧 Manual Configuration (If Needed)

If automatic config doesn't work:

### Option 1: Dashboard Settings

**General:**
- Root Directory: `client`

**Build & Output:**
- Framework: Create React App
- Build Command: `npm run build`
- Output Directory: `build`
- Install Command: `npm install`

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

When prompted:
- Set up and deploy? **Y**
- Which scope? **Your account**
- Link to existing project? **N**
- Project name? **asciier** (or your choice)
- Directory: `./` (root)
- Override settings? **Y**
- Build command: `cd client && npm run build`
- Output directory: `client/build`
- Development command: **Enter** (skip)

---

## 📝 Environment Variables

### Required Variables

**In Vercel Dashboard:**

1. Go to: **Settings** → **Environment Variables**
2. Add:

```
REACT_APP_API_URL=https://your-backend.onrender.com
```

**For all environments:**
- ✅ Production
- ✅ Preview
- ✅ Development

### Get Backend URL

1. Deploy backend to Render first
2. Copy the URL (e.g., `https://asciier-backend.onrender.com`)
3. Add to Vercel environment variables
4. Redeploy frontend

---

## 🧪 Testing Deployment

### After Deployment:

1. **Visit your Vercel URL**
2. **Test Image Upload:**
   - Switch to Image Mode
   - Upload a small image
   - Should convert successfully

3. **Test Video Upload:**
   - Switch to Video Mode
   - Upload a very short video (<5 seconds)
   - Wait for processing
   - Check download works

4. **Check Console:**
   - Open browser DevTools
   - Look for API errors
   - Should call your Render backend

---

## ❌ Common Errors & Fixes

### Error: "No Output Directory named 'build' found"

**Solution 1: Update vercel.json** (Already done)
```json
{
  "buildCommand": "cd client && npm install && npm run build",
  "outputDirectory": "client/build"
}
```

**Solution 2: Set Root Directory**
- Go to: Project Settings → General
- Set Root Directory: `client`
- Redeploy

**Solution 3: Manual Build Settings**
- Override settings in Vercel
- Build Command: `npm run build`
- Output Directory: `build`
- Root Directory: `client`

### Error: "CORS policy: No 'Access-Control-Allow-Origin'"

**Cause:** Backend URL not set or wrong

**Fix:**
1. Check environment variable is set correctly
2. Verify backend URL is correct
3. Check backend CORS configuration includes your Vercel URL
4. Redeploy both frontend and backend

### Error: "Failed to fetch" or "Network Error"

**Cause:** API URL not configured

**Fix:**
1. Add `REACT_APP_API_URL` to Vercel
2. Must include `https://` protocol
3. No trailing slash
4. Redeploy frontend

### Error: Build fails with "npm ERR!"

**Cause:** Dependency installation issue

**Fix:**
1. Delete `node_modules` and `package-lock.json` locally
2. Run `npm install`
3. Commit changes
4. Redeploy

---

## 🎯 Deployment Checklist

### Before Deploying:

- [ ] Backend deployed to Render
- [ ] Backend URL copied
- [ ] `client/.env.production` updated with backend URL
- [ ] Changes committed and pushed to GitHub
- [ ] Vercel account created

### During Deployment:

- [ ] Project imported to Vercel
- [ ] Build settings configured (or vercel.json present)
- [ ] Environment variable `REACT_APP_API_URL` added
- [ ] Deployment started

### After Deployment:

- [ ] Frontend URL copied
- [ ] Backend `FRONTEND_URL` updated with Vercel URL
- [ ] Backend redeployed with new FRONTEND_URL
- [ ] Test image upload
- [ ] Test video upload (small file)
- [ ] No console errors

---

## 🔄 Continuous Deployment

Once set up, Vercel auto-deploys:

**Automatic Deployments:**
- Push to `main` → Production deploy
- Push to other branch → Preview deploy
- Pull request → Preview deploy

**Manual Redeploy:**
1. Go to Vercel dashboard
2. Select deployment
3. Click **"Redeploy"**

---

## 📱 Custom Domain (Optional)

### Add Your Domain:

1. Go to: **Settings** → **Domains**
2. Add domain: `yourdomain.com`
3. Follow DNS instructions
4. Wait for SSL certificate (automatic)

### Update Backend:

After adding domain, update Render:
```
FRONTEND_URL=https://yourdomain.com
```

---

## 🐛 Debugging

### View Deployment Logs:

1. Go to Vercel dashboard
2. Click on deployment
3. View **"Building"** tab for build logs
4. View **"Functions"** tab for runtime logs

### Check Build Output:

```bash
# Locally test the build
cd client
npm run build

# Should create build/ directory
ls build/
```

### Test Production Build Locally:

```bash
cd client
npm run build
npx serve -s build

# Open http://localhost:3000
# Test if it works locally
```

---

## 💡 Tips

### Faster Builds:
- Vercel caches `node_modules`
- Subsequent builds are faster
- First build: 2-3 minutes
- Later builds: 30-60 seconds

### Preview Deployments:
- Every push gets a preview URL
- Test changes before merging
- Share with others for feedback

### Rollback:
- Go to deployments
- Find previous working version
- Click "Promote to Production"

---

## 🎉 Success!

Once deployed:
- ✅ Frontend on Vercel (fast global CDN)
- ✅ Backend on Render (FFmpeg support)
- ✅ Auto-deploy on git push
- ✅ HTTPS automatic
- ✅ Preview deployments

**Your app is live!** 🚀

---

## 📚 Resources

- Vercel Docs: https://vercel.com/docs
- React Deployment: https://create-react-app.dev/docs/deployment
- Vercel CLI: https://vercel.com/docs/cli

## 🆘 Still Having Issues?

Check:
1. `client/package.json` has build script
2. `client/.env.production` has correct API URL
3. Vercel environment variable is set
4. Backend is running and accessible
5. CORS configured on backend
