# XDRAR Portfolio

Static HTML portfolio website.

## Tech Stack

- **Static HTML/CSS/JS** - Frontend
- **GitHub** - Code repository
- **Cloudflare Pages** - Static site hosting
- **Cloudflare R2** - Media file storage
- **Resend API** - Contact form email service

## Setup

### Prerequisites

- Node.js 18+ (for media upload scripts)
- Cloudflare account (free)
- Resend account (for contact form)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

This starts a local HTTP server on port 8000. Open `http://localhost:8000` in your browser.

## Media Management

### Uploading Media to R2

1. Place media files in the `Crybaby_Oakland/` directory structure
2. Upload to Cloudflare R2:
   ```bash
   npm run upload-xdrar2-media
   ```
3. Update `window.R2_PUBLIC_URL` in `index.html` with your R2 public URL

## Contact Form

The contact form uses Cloudflare Pages Functions with Resend API.

### Setup

1. See [FORM_SETUP.md](./FORM_SETUP.md) for detailed instructions
2. See [RESEND_DOMAIN_SETUP.md](./RESEND_DOMAIN_SETUP.md) for domain verification

### Environment Variables (Cloudflare Pages)

- `RESEND_API_KEY` - Your Resend API key
- `CONTACT_EMAIL` - Email address to receive form submissions
- `FROM_EMAIL` - Sender email (must use verified domain)

## Project Structure

```
xdrarport/
├── functions/
│   └── api/
│       └── contact.js          # Contact form handler
├── public/
│   ├── fonts/                  # Custom fonts
│   └── _redirects              # Cloudflare Pages routing
├── scripts/
│   └── upload-xdrar2-media.js  # R2 media upload script
├── index.html                  # Main HTML file
├── script.js                   # Main JavaScript
└── styles.css                  # Main stylesheet
```

## Scripts

- `npm run dev` - Start local development server
- `npm run preview` - Preview production build
- `npm run upload-xdrar2-media` - Upload media files to R2

## Deployment

1. Push to GitHub
2. Connect repository to Cloudflare Pages
3. Configure build settings:
   - **Build command:** (leave empty)
   - **Build output directory:** `/`
4. Add environment variables for contact form
5. Deploy

## License

Private project.
