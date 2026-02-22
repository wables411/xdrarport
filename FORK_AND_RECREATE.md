# Fork and Recreate: xdrarport

This document lets another agent (or human) on a different machine fork this repo and recreate the **exact same** portfolio site and deployment. Follow the sections in order.

---

## 1. Repo and local setup

- **Fork or clone** the repo. Ensure **Node.js 18+** and **Python 3** are installed.
- From the repo root:
  ```bash
  npm install
  ```
- Start the local dev server:
  ```bash
  npm run dev
  ```
- Open **http://localhost:8000** in a browser. The static site is served by Python’s HTTP server on port 8000.

---

## 2. Environment variables

There is **no `.env.example` in the repo** (it is gitignored). This document is the source of truth for required variables.

### Local (R2 upload script only)

Create a **`.env`** file in the **repo root**. Do not commit it. Use it only for the R2 upload script (`npm run upload-xdrar2-media`).

| Variable | Required | Description |
|----------|----------|-------------|
| `R2_ACCOUNT_ID` | Yes | Cloudflare account ID (R2 dashboard) |
| `R2_ACCESS_KEY_ID` | Yes | R2 API token access key |
| `R2_SECRET_ACCESS_KEY` | Yes | R2 API token secret |
| `R2_BUCKET_NAME` | Yes | R2 bucket name (e.g. `xdrarport-media`) |
| `R2_PUBLIC_URL` | No (but useful) | Public URL of the R2 bucket (e.g. `https://pub-xxxx.r2.dev`) |

**Note:** The contact form does **not** use local env. It runs on Cloudflare Pages and uses Resend (see Cloudflare env below).

### Cloudflare Pages (production)

Set these in **Cloudflare Dashboard → Pages → your project → Settings → Environment variables** (Production and/or Preview as needed):

| Variable | Required | Description |
|----------|----------|-------------|
| `RESEND_API_KEY` | Yes (for contact form) | Resend API key (starts with `re_`) |
| `CONTACT_EMAIL` | Yes | Email address that receives form submissions |
| `FROM_EMAIL` | Yes (for production) | Sender address; must use a **verified domain** (e.g. `contact@xdrar.xyz`) |

**Note:** R2 variables are **not** required in Cloudflare Pages for the site to run. They are only used by the local upload script. The site reads `window.R2_PUBLIC_URL` from the HTML (set in each page’s `<script>` block).

---

## 3. Cloudflare R2

Media (hero video, client reels, images) are served from Cloudflare R2. The site builds URLs from `window.R2_PUBLIC_URL` set in the HTML.

1. **Create an R2 bucket** in the Cloudflare dashboard (R2 → Create bucket). Name it (e.g. `xdrarport-media`).
2. **Enable public access** for the bucket and note the **public URL** (e.g. `https://pub-xxxx.r2.dev`). This becomes `R2_PUBLIC_URL`.
3. **Create an R2 API token** (R2 → Manage R2 API Tokens) with read/write for this bucket. Map the token to the five local env vars: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`.
4. **Local folder structure for uploads:** The script `scripts/upload-xdrar2-media.js` uploads from **repo root**. It looks for:
   - **Client directories** (exact names): `Crybaby_Oakland`, `Bussdown`, `Planeta_Pisces_November_2025`, `YNB`, `ZMO`, `411_Oakland`, `DNA_Lounge`, `Text-Me-Records`, `Louie-El-Ser`, `JoogMaster J`, `portionclub69`, `personal`
   - **Root file:** `XDRAR.mp4` (hero video)
   These directories and the video are not in git (large/media). Create them locally and add your media.
5. **Run the upload:**
   ```bash
  npm run upload-xdrar2-media
  ```
6. **Set the public URL in the site:** After the first upload, set `window.R2_PUBLIC_URL` in every HTML file that loads media (or at least in `index.html` and any section/client pages that use R2). Example:
   ```html
   <script>window.R2_PUBLIC_URL = 'https://pub-xxxx.r2.dev';</script>
   ```
   Replace with your actual R2 public URL.

---

## 4. Resend (contact form)

The contact form is handled by a Cloudflare Pages Function (`functions/api/contact.js`) and sends email via the Resend API.

1. **Sign up** at [resend.com](https://resend.com) and create an **API key** (Resend Dashboard → API Keys).
2. **Verify your sending domain** (e.g. `xdrar.xyz` or a subdomain like `mail.xdrar.xyz`) using [RESEND_DOMAIN_SETUP.md](./RESEND_DOMAIN_SETUP.md). Add the DNS records Resend provides (e.g. in Cloudflare DNS).
3. In **Cloudflare Pages → your project → Settings → Environment variables**, add:
   - `RESEND_API_KEY` = your Resend API key  
   - `CONTACT_EMAIL` = email that receives submissions  
   - `FROM_EMAIL` = sender address on your verified domain (e.g. `contact@xdrar.xyz`)
4. **Redeploy** the project so the function picks up the new variables.

For more detail, see [FORM_SETUP.md](./FORM_SETUP.md) and [RESEND_DOMAIN_SETUP.md](./RESEND_DOMAIN_SETUP.md).

---

## 5. Cloudflare Pages deployment

1. **Connect the repo** to Cloudflare Pages (Pages → Create project → Connect to Git → select the forked repo).
2. **Build settings:**
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** leave default (unless this repo is in a monorepo subfolder).
3. **Environment variables:** Add the Resend variables listed in section 2 (Cloudflare Pages). R2 vars are **not** needed in Pages for the site to run; they are only for the local upload script.
4. Deploy. The build runs `node scripts/build.js`, which copies the static site and `functions/` into `dist/`. Cloudflare Pages serves from `dist/` and automatically runs `dist/functions` as serverless functions (so `POST /api/contact` works).

---

## 6. Post-recreate checks

After deployment, verify:

- **Homepage** loads at your Pages URL.
- **Navigation:** Open Work, Branding, Visuals, Personal, Archive, and Clients. Open at least one client subpage (e.g. `/clients/crybaby-oakland`).
- **Contact form:** Submit the form; confirm the owner receives the email and (if implemented) the user receives a confirmation.
- **Media:** Hero video and client media load. If they do not, ensure `window.R2_PUBLIC_URL` is set correctly in the HTML and matches your R2 bucket’s public URL.

### Known issues (fix as needed)

- **CLIENTS link on home:** In `index.html`, the main “CLIENTS” nav link may point to `clients.html`. The build only outputs the `clients/` directory, so the correct link is **`/clients`** (or `href="/clients"`).
- **Fonts 404:** CSS references `fonts/...` (e.g. `/fonts/PPNeueBit-Bold.otf`), but the build puts fonts under `public/fonts/`. So `/fonts/` may 404. Either change the CSS to use `/public/fonts/...` or add a build step that copies `public/fonts` to `dist/fonts`.
- **Work section placeholder:** The category pages (e.g. /branding, /visuals) use `loadProjectsByCategory()` in `script.js`, which is still a placeholder (“Projects will be displayed here”). Implementing real project data and filtering is a follow-up task.

---

## 7. Optional: custom fonts

The site uses custom fonts referenced in `styles.css`. The CSS expects:

- `fonts/PPNeueBit-Bold.otf`
- `fonts/PPMondwest-Regular.otf`

So the browser requests `/fonts/PPNeueBit-Bold.otf` etc. The repo has no top-level `fonts/` directory; fonts live under **`public/fonts/`**. The build copies `public/` to `dist/public/`, so in production fonts are at **`/public/fonts/`**, not `/fonts/`. Until the build or CSS is updated:

- Either add a build step that copies `public/fonts` to `dist/fonts`, or  
- Change the CSS `url(...)` to use `/public/fonts/PPNeueBit-Bold.otf` and `/public/fonts/PPMondwest-Regular.otf`.

**Font files:** [public/fonts/README.md](public/fonts/README.md) mentions downloading Neuebit (e.g. from Behance). The CSS uses **`.otf`** and names **PPNeueBit-Bold** and **PPMondwest-Regular**. If you only have `.woff`/`.woff2` or different filenames, you must update the `@font-face` rules in `styles.css` and ensure the files are placed where the URLs point (e.g. `public/fonts/` and, if you fix the build, `dist/fonts/`).
