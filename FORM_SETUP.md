# Contact Form Setup Guide

This portfolio uses **Resend API** for form submissions via Cloudflare Pages Functions.

## Current Setup: Resend API

Resend is free for up to 3,000 emails/month and works seamlessly with Cloudflare Pages.

### Setup Steps:

1. **Sign up at [resend.com](https://resend.com)** (free account)

2. **Get Your API Key:**
   - Go to Resend Dashboard → **API Keys**
   - Click **"Create API Key"**
   - Copy your API key (starts with `re_`)

3. **Verify Your Domain (Required for production):**
   - See [RESEND_DOMAIN_SETUP.md](./RESEND_DOMAIN_SETUP.md) for detailed instructions
   - You need to verify `xdrar.xyz` in Resend to send emails
   - Add DNS records in Cloudflare DNS

4. **Configure Cloudflare Pages Environment Variables:**
   - Go to Cloudflare Dashboard → **Pages** → Your site → **Settings** → **Environment variables**
   - Add these variables:
     ```
     RESEND_API_KEY=re_your_api_key_here
     CONTACT_EMAIL=xd.rar@gmail.com
     FROM_EMAIL=noreply@xdrar.xyz
     ```
   - **Note:** `FROM_EMAIL` must use your verified domain (e.g., `noreply@xdrar.xyz`)
   - Save and redeploy your site

5. **How It Works:**
   - Contact form submits to `/api/contact` (Cloudflare Pages Function)
   - Function at `functions/api/contact.js` handles the submission
   - Sends two emails:
     - One to you (`CONTACT_EMAIL`) with the form submission
     - One to the user confirming their message was received

---

## Testing

After setup, test the form:
1. Fill out all fields (Name, Email, Message)
2. Submit the form
3. Check your email inbox (`CONTACT_EMAIL`)
4. Verify you received the submission
5. Check that the user received a confirmation email

## Troubleshooting

- **Form not submitting?** Check browser console for errors
- **"Email service not configured" error?** Make sure `RESEND_API_KEY` is set in Cloudflare Pages environment variables
- **Not receiving emails?** 
  - Check spam folder
  - Verify domain is verified in Resend (see RESEND_DOMAIN_SETUP.md)
  - Check Resend dashboard for email logs
- **CORS errors?** The function already handles CORS, but check that it's deployed correctly

---

## Alternative: Netlify Forms

If you're deploying to Netlify, this is the easiest option (no JavaScript needed!).

### Setup:

1. **Update the form in `ContactModal.jsx`:**
   ```jsx
   <form 
     name="contact" 
     method="POST" 
     data-netlify="true"
     netlify-honeypot="bot-field"
     onSubmit={handleSubmit}
   >
     <input type="hidden" name="form-name" value="contact" />
     <p className="hidden">
       <label>
         Don't fill this out: <input name="bot-field" />
       </label>
     </p>
     {/* rest of form */}
   </form>
   ```

2. **Update `handleSubmit` to use native form submission:**
   ```jsx
   const handleSubmit = async (e) => {
     e.preventDefault()
     const form = e.target
     const formData = new FormData(form)
     
     try {
       await fetch('/', {
         method: 'POST',
         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
         body: new URLSearchParams(formData).toString(),
       })
       // Success handling
     } catch (error) {
       // Error handling
     }
   }
   ```

3. **Netlify will automatically:**
   - Collect form submissions
   - Send email notifications
   - Store submissions in your Netlify dashboard

---

## Alternative: Formspree

Free tier: 50 submissions/month

### Setup:

1. **Sign up at [formspree.io](https://formspree.io/)**

2. **Create a form and get your form ID**

3. **Update `handleSubmit` in `ContactModal.jsx`:**
   ```jsx
   const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       name: formData.name,
       email: formData.email,
       message: formData.comment,
     }),
   })
   ```

---

## Alternative: Firebase Functions

More complex but very flexible.

### Setup:

1. **Set up Firebase project**

2. **Create a Cloud Function:**
   ```javascript
   const functions = require('firebase-functions')
   const nodemailer = require('nodemailer')

   exports.sendContactEmail = functions.https.onRequest(async (req, res) => {
     // Handle email sending
   })
   ```

3. **Call from your form:**
   ```jsx
   await fetch('YOUR_FIREBASE_FUNCTION_URL', {
     method: 'POST',
     body: JSON.stringify(formData),
   })
   ```

---

## Testing

After setup, test the form:
1. Fill out all fields
2. Submit the form
3. Check your email inbox
4. Verify you received the submission

## Troubleshooting

- **EmailJS not working?** Check that your environment variables are set correctly
- **CORS errors?** Make sure your domain is allowed in EmailJS settings
- **Not receiving emails?** Check spam folder and email service connection

