# Contact Form Setup Guide

This portfolio uses EmailJS for form submissions. Here are setup instructions and alternatives.

## Current Setup: EmailJS (Recommended)

EmailJS is free for up to 200 emails/month and works on any hosting platform.

### Setup Steps:

1. **Sign up at [emailjs.com](https://www.emailjs.com/)**

2. **Create an Email Service:**
   - Go to "Email Services" → "Add New Service"
   - Choose your email provider (Gmail, Outlook, etc.)
   - Follow the connection steps

3. **Create an Email Template:**
   - Go to "Email Templates" → "Create New Template"
   - Use these variables in your template:
     - `{{from_name}}` - Sender's name
     - `{{from_email}}` - Sender's email
     - `{{message}}` - Message content
   - Set your email subject and body
   - Save the template

4. **Get Your Keys:**
   - Go to "Account" → "General"
   - Copy your **Public Key**
   - Go to "Email Services" and copy your **Service ID**
   - Go to "Email Templates" and copy your **Template ID**

5. **Configure the App:**
   - Create a `.env` file in the project root
   - Add your keys (Vite uses `VITE_` prefix):
     ```
     VITE_EMAILJS_SERVICE_ID=your_service_id
     VITE_EMAILJS_TEMPLATE_ID=your_template_id
     VITE_EMAILJS_PUBLIC_KEY=your_public_key
     ```
   - Restart your dev server

6. **For Production:**
   - Add these environment variables to your hosting platform (Vercel, Netlify, etc.)
   - They'll be available as `import.meta.env.VITE_EMAILJS_*`

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

