# XDRAR Portfolio

Artist portfolio website built with React and Vite.

## Tech Stack

- **React** + **Vite** - Frontend framework
- **GitHub** - Code repository
- **Cloudflare Pages** - Static site hosting
- **Cloudflare R2** - Video file storage

## Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Cloudflare account (free)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Building

```bash
npm run build
```

## Media Management

### Adding Videos

1. Place video files in `public/media/` (they're gitignored)
2. Upload to Cloudflare R2:
   ```bash
   npm run upload-videos
   ```
3. Generate/update media manifest:
   ```bash
   npm run generate-media
   ```
4. Commit the updated manifest:
   ```bash
   git add src/data/media-manifest.json
   git commit -m "Add new video"
   ```

### Adding Images

Images can be committed to git (they're small). Just add them to `public/media/` and run:

```bash
npm run generate-media
```

## Deployment

See [CLOUDFLARE_SETUP.md](./CLOUDFLARE_SETUP.md) for complete deployment instructions.

**Quick summary:**
1. Set up Cloudflare R2 bucket and upload videos
2. Connect GitHub repo to Cloudflare Pages
3. Auto-deploys on every push to main

## Project Structure

```
xdrarport/
├── public/
│   ├── media/              # Media files (images in git, videos not)
│   └── _redirects          # SPA routing
├── src/
│   ├── components/         # React components
│   ├── data/
│   │   └── media-manifest.json  # Auto-generated
│   └── utils/
├── scripts/
│   ├── generate-media-manifest.js
│   └── upload-to-r2.js
└── dist/                   # Build output (gitignored)
```

## Scripts

- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run generate-media` - Generate media manifest
- `npm run upload-videos` - Upload videos to R2

## License

Private project.

