# Resend Domain Verification Setup

## Problem
Resend's free tier only allows sending emails to your own account email (`portionclub69@gmail.com`) when using the test sender `onboarding@resend.dev`. To send emails to other recipients (like `xd.rar@gmail.com`), you need to verify your domain.

## Solution: Verify `xdrar.xyz` in Resend

### Step 1: Add Domain in Resend
1. Go to https://resend.com/domains
2. Click **"Add Domain"**
3. Enter `xdrar.xyz` (or use a subdomain like `mail.xdrar.xyz` for better isolation)
4. Click **"Add"**

### Step 2: Get DNS Records from Resend
After adding the domain, Resend will show you DNS records to add:
- **SPF record** (TXT)
- **DKIM record** (TXT) 
- **MX record** (optional, for receiving emails)

Copy these records exactly as shown.

### Step 3: Add DNS Records to Cloudflare
Since your domain uses Cloudflare nameservers:

1. Go to Cloudflare Dashboard → **DNS** → **Records**
2. For each DNS record Resend provided:
   - Click **"Add record"**
   - Select the **Type** (TXT for SPF/DKIM)
   - Enter the **Name** (e.g., `@` for root domain, or `mail` for subdomain)
   - Enter the **Content** exactly as Resend provided
   - **Important**: If Cloudflare auto-appends your domain, add a trailing `.` at the end of the value
   - Click **"Save"**

### Step 4: Wait for DNS Propagation
- DNS changes can take up to 72 hours, but usually work within minutes
- Check propagation at https://dns.email

### Step 5: Verify in Resend
1. Go back to Resend dashboard → **Domains**
2. Click **"Restart verification"** on your domain
3. Wait for verification to complete (green checkmark)

### Step 6: Update Cloudflare Pages Environment Variables
Once verified, update your Cloudflare Pages environment variables:

1. Go to Cloudflare Pages → your site → **Settings** → **Environment variables**
2. Update `FROM_EMAIL` to use your verified domain:
   - For root domain: `noreply@xdrar.xyz`
   - For subdomain: `noreply@mail.xdrar.xyz` (if you used a subdomain)
3. Save and redeploy

### Step 7: Test the Form
1. Go to https://xdrar.xyz
2. Submit the contact form
3. Check that emails are sent successfully

## Troubleshooting

**Domain not verifying?**
- Check DNS records are exactly as Resend provided (no extra spaces/quotes)
- Use https://dns.email to verify records are publicly visible
- Ensure you're adding records in Cloudflare (not GoDaddy) since Cloudflare manages your DNS
- Wait 24 hours and try "Restart verification" again

**Still having issues?**
- Contact Resend support with your domain name and DNS screenshots
- Check Resend docs: https://resend.com/docs/dashboard/domains/introduction
