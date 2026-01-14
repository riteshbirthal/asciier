# Deployment Guide

## ⚠️ Important: Vercel Is NOT Suitable

This application **cannot be deployed on Vercel** due to:
- FFmpeg dependency (system binary not supported)
- Long processing times (up to 10 minutes)
- Large file uploads (up to 100MB)
- Temporary file system requirements
- Stateful processing needs

## ✅ Recommended: Railway

### Prerequisites
- GitHub account
- Railway account (https://railway.app)
- Git repository

### Quick Deploy to Railway

#### Option 1: GitHub Integration (Easiest)

1. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/your-username/asciier.git
   git push -u origin main
   ```

2. **Deploy on Railway**
   - Go to https://railway.app
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway will auto-detect Node.js and deploy

3. **Configuration**
   - Railway automatically installs FFmpeg via nixpacks
   - No additional configuration needed
   - Get your deployment URL from dashboard

4. **Environment Variables** (Optional)
   ```
   NODE_ENV=production
   PORT=5000
   ```

#### Option 2: Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize in project directory
railway init

# Deploy
railway up

# View logs
railway logs

# Open in browser
railway open
```

### Railway Configuration Files

The project includes:
- `railway.toml` - Railway configuration
- `nixpacks.toml` - Build configuration with FFmpeg

### Cost
- Free tier: 500 hours/month, $5 credit
- Hobby plan: $5/month
- Scales automatically

---

## Alternative Options

### Option 1: Render.com

1. **Create render.yaml**
   ```yaml
   services:
     - type: web
       name: asciier
       env: node
       buildCommand: npm run install-all
       startCommand: npm run dev
       disk:
         name: asciier-storage
         mountPath: /opt/render/project/src
         sizeGB: 10
   ```

2. **Deploy**
   - Connect GitHub repository
   - Render auto-deploys on push
   - FFmpeg pre-installed

3. **Cost**
   - Free tier available
   - Paid: $7/month for persistent disk

### Option 2: DigitalOcean App Platform

1. **Create .do/app.yaml**
   ```yaml
   name: asciier
   services:
     - name: web
       github:
         repo: your-username/asciier
         branch: main
       run_command: npm run dev
       build_command: npm run install-all
       instance_size_slug: basic-xs
   ```

2. **Deploy**
   - Connect repository
   - Auto-deploy on git push

3. **Cost**
   - $5/month basic plan

### Option 3: Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Create app and add buildpacks**
   ```bash
   heroku create asciier-app
   heroku buildpacks:add --index 1 https://github.com/jonathanong/heroku-buildpack-ffmpeg-latest
   heroku buildpacks:add --index 2 heroku/nodejs
   ```

3. **Deploy**
   ```bash
   git push heroku main
   ```

4. **Cost**
   - Eco plan: $5/month
   - Basic: $7/month

### Option 4: VPS (DigitalOcean, Linode, AWS EC2)

**For more control and scalability:**

```bash
# On Ubuntu VPS
sudo apt update
sudo apt install nodejs npm ffmpeg nginx

# Clone repository
git clone https://github.com/your-username/asciier.git
cd asciier

# Install dependencies
npm run install-all

# Use PM2 for process management
npm install -g pm2
pm2 start npm --name "asciier" -- run dev
pm2 startup
pm2 save

# Configure Nginx as reverse proxy
sudo nano /etc/nginx/sites-available/asciier
```

**Nginx Config:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        client_max_body_size 150M;
        proxy_read_timeout 600s;
    }
}
```

**Cost:**
- Basic VPS: $5-10/month
- More control and customization

---

## If You Need Vercel (Split Architecture)

To use Vercel, you must split the application:

### Architecture

```
Frontend (Vercel)
    ↓
Backend API (Railway/Render)
    ↓
Storage (AWS S3 / Cloudinary)
```

### Steps

1. **Frontend on Vercel**
   - Deploy only React app
   - Update API URL to point to Railway backend

2. **Backend on Railway**
   - Deploy Express server
   - Handle video processing

3. **Changes Required**
   ```javascript
   // client/.env.production
   REACT_APP_API_URL=https://your-railway-app.railway.app

   // Update axios calls
   axios.post(`${process.env.REACT_APP_API_URL}/api/video/upload`, ...)
   ```

---

## Post-Deployment Checklist

- [ ] FFmpeg is installed and working
- [ ] File upload works (test with small video)
- [ ] Video processing completes successfully
- [ ] Audio is preserved in output
- [ ] Download works correctly
- [ ] File cleanup runs (check after 30 min)
- [ ] Environment variables set correctly
- [ ] HTTPS enabled (most platforms do this automatically)
- [ ] Logs are accessible for debugging
- [ ] Storage space is sufficient

## Monitoring

### Railway
```bash
railway logs
railway status
```

### Check FFmpeg
```bash
# SSH into server (if applicable)
ffmpeg -version
```

### Monitor Disk Space
```bash
# Check uploads and outputs folders
du -sh uploads/ outputs/
```

## Scaling Considerations

For high traffic:
1. Use external storage (AWS S3, Cloudinary)
2. Implement queue system (Redis Queue, AWS SQS)
3. Separate worker processes for video processing
4. Use CDN for serving converted files
5. Implement rate limiting

## Troubleshooting

### "FFmpeg not found"
- Ensure buildpack includes FFmpeg
- Check Railway nixpacks.toml includes ffmpeg
- Verify with: `ffmpeg -version`

### "Timeout errors"
- Increase timeout in deployment config
- Railway: automatically handles long processes
- Vercel: Not possible, use alternative platform

### "Out of disk space"
- Monitor uploads/ and outputs/ folders
- Verify cleanup runs every 60 seconds
- Reduce file expiry time if needed

### "Upload fails"
- Check body size limits in deployment
- Railway: No limit
- Nginx: Set `client_max_body_size`

## Recommended: Railway

**Railway is the best option for this application** because:
- ✅ Easy deployment (one command)
- ✅ FFmpeg included automatically
- ✅ No timeout limits
- ✅ Affordable ($5/month)
- ✅ Great developer experience
- ✅ Automatic HTTPS
- ✅ Built-in monitoring and logs

Deploy now: https://railway.app
