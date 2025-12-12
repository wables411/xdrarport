# R2 Setup - Fresh Start

## Step 1: Delete the Old Bucket

1. Go to Cloudflare Dashboard → R2
2. Click on your bucket (`xdrarport-media` or whatever it's named)
3. Click "Delete Bucket"
4. Confirm deletion

## Step 2: Create New R2 Bucket

1. In Cloudflare Dashboard → R2
2. Click "Create bucket"
3. Name it: `xdrarport-media` (or any name you want)
4. Location: Choose closest to you (e.g., Eastern North America)
5. Click "Create bucket"

## Step 3: Make Bucket Public

1. Click on your new bucket
2. Go to "Settings" tab
3. Under "Public Access", click "Allow Access"
4. Save

## Step 4: Get Public URL

1. In bucket settings, find "Public Development URL"
2. Copy it (looks like: `https://pub-xxxxx.r2.dev`)
3. Save this - you'll need it

## Step 5: Create API Token

1. Go to R2 → "Manage R2 API Tokens"
2. Click "Create API Token"
3. Name: `R2 Upload Token`
4. Permissions: "Object Read & Write"
5. TTL: Leave blank (no expiration)
6. Click "Create API Token"
7. **SAVE THESE VALUES** (you can only see them once):
   - Access Key ID
   - Secret Access Key

## Step 6: Get Account ID

1. In Cloudflare Dashboard, look at the right sidebar
2. Find "Account ID" (under your account name)
3. Copy it

## Step 7: Update .env File

Create/update `.env` in the project root:

```bash
R2_ACCOUNT_ID=your_account_id_here
R2_ACCESS_KEY_ID=your_access_key_id_here
R2_SECRET_ACCESS_KEY=your_secret_access_key_here
R2_BUCKET_NAME=xdrarport-media
R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
```

Replace all the values with your actual values from steps above.

## Step 8: Update Cloudflare Pages Environment Variables

1. Go to Cloudflare Dashboard → Pages → Your site
2. Go to "Settings" → "Environment Variables"
3. Add/Update:
   - `VITE_R2_PUBLIC_URL` = your public URL from step 4

## Step 9: Upload All Videos

```bash
npm run upload-videos
```

This will upload ALL video files from `public/media/` to R2.

## Step 10: Regenerate Manifest

```bash
R2_PUBLIC_URL=https://pub-xxxxx.r2.dev npm run generate-media
```

Replace with your actual public URL.

## Step 11: Commit and Push

```bash
git add -A
git commit -m "Update R2 URLs after fresh setup"
git push
```

## Verification

After deployment, check:
- Videos load in browser
- Network tab shows requests to your R2 URL
- No 404 errors for videos



