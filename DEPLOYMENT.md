# Deployment Guide

## Step 1: Push to GitHub

Run these commands in your terminal:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: XD.RAR portfolio website"

# Add remote repository
git remote add origin https://github.com/wables411/xdrar.git

# Push to GitHub (use main branch)
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Netlify

1. **Go to [netlify.com](https://www.netlify.com/)**
   - Sign up or log in with your GitHub account

2. **Import your project:**
   - Click "Add new site" → "Import an existing project"
   - Select "Deploy with GitHub"
   - Authorize Netlify to access your GitHub
   - Select the `wables411/xdrar` repository

3. **Configure build settings:**
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - These should auto-detect from `netlify.toml`, but verify them

4. **Add build environment variable (if needed):**
   - Go to Site settings → Build & deploy → Environment
   - No environment variables needed for basic setup

5. **Click "Deploy site"**

## Step 3: Configure Netlify Forms

After deployment:

1. **Go to your site dashboard on Netlify**

2. **Navigate to Forms:**
   - Click "Forms" in the left sidebar
   - You should see your "contact" form listed (Netlify detects it from the hidden form in `index.html`)

3. **Set up email notifications:**
   - Click on the "contact" form
   - Go to "Settings" or "Notifications" tab
   - Under "Email notifications", click "Add notification"
   - Enter the email address where you want to receive submissions
   - Save the notification

4. **Test the form:**
   - Visit your deployed site
   - Fill out and submit the contact form
   - Check your email inbox for the notification
   - Check Netlify dashboard → Forms → Submissions to see all submissions

## Step 4: Custom Domain (Optional)

1. Go to Site settings → Domain management
2. Add your custom domain
3. Follow Netlify's DNS configuration instructions

## Important Notes

- **Form submissions:** All form submissions are stored in Netlify dashboard
- **Free tier limits:** 100 form submissions per month
- **Build process:** Netlify will automatically rebuild when you push to GitHub
- **Media files:** All media files in `public/media/` are included in the build

## Troubleshooting

- **Form not detected?** Make sure the hidden form is in `index.html` and redeploy
- **Not receiving emails?** Check spam folder and verify email in Netlify settings
- **Build fails?** Check build logs in Netlify dashboard








