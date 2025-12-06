# Cloudflare Setup Guide

This project uses **GitHub** for code and **Cloudflare** for hosting (Pages) and media storage (R2).

## Architecture

- **GitHub**: Code repository (no large files)
- **Cloudflare Pages**: Static site hosting (free, unlimited bandwidth)
- **Cloudflare R2**: Video file storage (10GB free, unlimited egress)

---

## Step 1: Set Up Cloudflare R2 (Video Storage)

### 1.1 Create R2 Bucket

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **R2** → **Create bucket**
3. Name your bucket (e.g., `xdrarport-media`)
4. Click **Create bucket**

### 1.2 Create API Token

1. In R2 dashboard, go to **Manage R2 API Tokens**
2. Click **Create API token**
3. Set permissions:
   - **Object Read & Write**
   - Select your bucket
4. Copy the credentials:
   - **Account ID**
   - **Access Key ID**
   - **Secret Access Key**

### 1.3 Set Up Public Access (Optional but Recommended)

**Option A: Use R2.dev subdomain (Free, Quick)**
- Go to your bucket → **Settings** → **Public Access**
- Enable public access
- Your URL will be: `https://your-bucket-name.r2.dev`

**Option B: Use Custom Domain (Recommended)**
- Go to your bucket → **Settings** → **Custom Domain**
- Add your domain (e.g., `media.yourdomain.com`)
- Follow DNS setup instructions
- Your URL will be: `https://media.yourdomain.com`

### 1.4 Configure Environment Variables

1. Create a `.env` file in the project root:

```bash
# Cloudflare R2 Configuration
R2_ACCOUNT_ID=your_account_id_here
R2_ACCESS_KEY_ID=your_access_key_here
R2_SECRET_ACCESS_KEY=your_secret_key_here
R2_BUCKET_NAME=your_bucket_name_here
R2_PUBLIC_URL=https://your-bucket-name.r2.dev
VITE_R2_PUBLIC_URL=https://your-bucket-name.r2.dev
```

2. **Never commit `.env` to git** (already in `.gitignore`)

### 1.5 Upload Videos to R2

1. Install dependencies:
```bash
npm install
```

2. Upload all videos:
```bash
npm run upload-videos
```

This will:
- Scan `public/media/` for video files
- Upload them to R2 (skips already uploaded files)
- Preserve folder structure

3. Generate media manifest with R2 URLs:
```bash
npm run generate-media
```

---

## Step 2: Set Up Cloudflare Pages (Site Hosting)

### 2.1 Connect GitHub Repository

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages** → **Create a project**
3. Click **Connect to Git**
4. Select **GitHub** and authorize
5. Choose your repository: `wables411/xdrarport`
6. Click **Begin setup**

### 2.2 Configure Build Settings

**Build configuration:**
- **Framework preset**: Vite
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` (leave as default)

**Environment variables:**
Add these in the Pages dashboard:
- `VITE_R2_PUBLIC_URL` = Your R2 public URL (e.g., `https://your-bucket.r2.dev`)
- `VITE_FORMSPREE_ENDPOINT` = Your Formspree form endpoint (see Step 3)

### 2.3 Deploy

1. Click **Save and Deploy**
2. Cloudflare will:
   - Clone your repo
   - Install dependencies
   - Run `npm run build`
   - Deploy to `*.pages.dev` domain

### 2.4 Custom Domain (Optional)

1. In Pages dashboard → **Custom domains**
2. Add your domain
3. Update DNS records as instructed
4. SSL is automatic

---

## Step 3: Set Up Contact Form (Resend)

The contact form sends emails directly from your site using Resend API.

### 3.1 Sign Up for Resend (Free)

1. Go to [resend.com](https://resend.com)
2. Sign up (free tier: 3,000 emails/month)
3. Verify your email address
4. Go to **API Keys** in dashboard
5. Click **Create API Key**
6. Copy your API key

### 3.2 Configure Environment Variables

**In Cloudflare Pages:**
1. Go to Pages dashboard → Your site → **Settings** → **Environment variables**
2. Add these variables:
   - `RESEND_API_KEY` = Your Resend API key
   - `CONTACT_EMAIL` = Your email address (e.g., `xdrar@gmail.com`)
   - `FROM_EMAIL` = Email to send from (e.g., `noreply@yourdomain.com` or use Resend's default)
3. Make sure they're set for **Production**

### 3.3 How It Works

When someone submits the form:
- Form data is sent to `/api/contact` (Cloudflare Pages Function)
- Function sends email to you with their message
- Function sends confirmation email to the client
- Both emails are sent automatically - no email client needed!

### 3.4 Test the Form

1. Deploy your site
2. Fill out the contact form
3. Check your email inbox
4. Client should receive confirmation email too

---

## Step 4: Workflow

### Daily Development

1. **Make code changes** (images can stay in `public/media/`)
2. **Commit and push to GitHub:**
   ```bash
   git add .
   git commit -m "Your changes"
   git push
   ```
3. **Cloudflare Pages auto-deploys** (connected to GitHub)

### Adding New Videos

1. **Add video to `public/media/`** (don't commit to git)
2. **Upload to R2:**
   ```bash
   npm run upload-videos
   ```
3. **Update manifest:**
   ```bash
   npm run generate-media
   ```
4. **Commit manifest changes:**
   ```bash
   git add src/data/media-manifest.json
   git commit -m "Add new video"
   git push
   ```

---

## File Structure

```
xdrarport/
├── public/
│   ├── media/           # Images (committed), Videos (not committed)
│   └── _redirects       # SPA routing for Cloudflare Pages
├── src/
│   └── data/
│       └── media-manifest.json  # Auto-generated with R2 URLs
├── scripts/
│   ├── generate-media-manifest.js  # Generates manifest
│   └── upload-to-r2.js            # Uploads videos to R2
└── .env                 # R2 credentials (not in git)
```

---

## Free Tier Limits

### Cloudflare Pages
- ✅ Unlimited sites
- ✅ Unlimited bandwidth
- ✅ Unlimited requests
- ✅ 500 builds/month
- ✅ Custom domains included

### Cloudflare R2
- ✅ 10GB storage free
- ✅ Unlimited egress (bandwidth)
- ✅ 1M Class A operations/month
- ✅ 10M Class B operations/month

**Note:** Your videos (~3GB) fit comfortably in the free tier!

---

## Troubleshooting

### Videos not loading?
- Check `R2_PUBLIC_URL` is set correctly
- Verify videos are uploaded: `npm run upload-videos`
- Check R2 bucket public access is enabled
- Regenerate manifest: `npm run generate-media`

### Build fails on Cloudflare Pages?
- Check build logs in Pages dashboard
- Verify `VITE_R2_PUBLIC_URL` environment variable is set
- Ensure `package.json` scripts are correct

### Can't push to GitHub?
- Videos are in `.gitignore` (good!)
- Only commit code and images
- Use `git status` to see what will be committed

---

## Cost

**Everything is FREE** on the free tier:
- GitHub: Free for public repos
- Cloudflare Pages: Free (unlimited bandwidth)
- Cloudflare R2: Free (10GB storage, unlimited egress)

You only pay if you exceed free tier limits (unlikely for a portfolio site).

---

## Next Steps

1. ✅ Set up R2 bucket and upload videos
2. ✅ Set your email address in `ContactModal.jsx`
3. ✅ Connect GitHub to Cloudflare Pages
4. ✅ Configure environment variables in Cloudflare Pages (`VITE_R2_PUBLIC_URL`)
5. ✅ Deploy your site
6. ✅ (Optional) Set up custom domain
7. ✅ Share your portfolio! 🎉
