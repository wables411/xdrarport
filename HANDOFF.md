# XDRAR Portfolio — Handoff Guide

This repo is the full source for the XDRAR portfolio site. Follow the steps below to put it live on **xdrar.xyz** under your own accounts. Everything used here has a free tier.

**Current state (at handoff):**
- The site is live at a temporary address, **https://xdrarport.pages.dev**, hosted on the developer's Cloudflare account.
- **xdrar.xyz** is registered at GoDaddy and currently shows GoDaddy's parked page. It is not connected to the site yet.
- Videos and large images load from the developer's Cloudflare R2 storage. They stay up until the developer shuts it down, so move them to your account (step 5) before then.

---

## What you need

- A **GitHub** account (the developer will transfer this repo to it)
- A **Cloudflare** account (free): https://dash.cloudflare.com/sign-up
- A **Resend** account (free, for the contact form): https://resend.com
- Your **GoDaddy** login for xdrar.xyz

---

## 1. Move xdrar.xyz's DNS to Cloudflare

The domain stays registered (and billed) at GoDaddy. Only its DNS moves to Cloudflare.

1. In Cloudflare: **Add a domain** → enter `xdrar.xyz` → choose the **Free** plan.
2. Cloudflare shows you **two nameservers** (for example `xxx.ns.cloudflare.com`).
3. In GoDaddy: **My Products → xdrar.xyz → DNS → Nameservers → Change nameservers → "I'll use my own nameservers"**. Paste the two Cloudflare nameservers and save.
4. Wait until Cloudflare emails you that the domain is **Active**. This usually takes minutes, but can take up to 24 hours.

## 2. Deploy the site on Cloudflare Pages

1. In Cloudflare: **Workers & Pages → Create → Pages → Connect to Git** → pick this repo.
2. Build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
3. Click **Deploy**. You get a `something.pages.dev` address. Check that the site loads there.

## 3. Connect xdrar.xyz

1. In your Pages project: **Custom domains → Set up a custom domain** → `xdrar.xyz`.
2. Repeat for `www.xdrar.xyz`.
3. Cloudflare adds the DNS records itself. After a few minutes, https://xdrar.xyz shows the site.

## 4. Contact form (Resend)

The form sends email through Resend from `contact@xdrar.xyz`. That address only works once Resend has verified the domain.

1. In Resend: **Domains → Add domain** → `xdrar.xyz`.
2. Resend lists a few DNS records. Add each one in **Cloudflare → xdrar.xyz → DNS → Records**, then click **Verify** in Resend.
3. In Resend: **API Keys → Create API key** and copy it (it starts with `re_`).
4. In your Pages project: **Settings → Variables and Secrets**, add:

   | Name | Value |
   |------|-------|
   | `RESEND_API_KEY` | the key from step 3 (mark it as a secret) |
   | `CONTACT_EMAIL` | the inbox that should receive form messages |
   | `FROM_EMAIL` | `contact@xdrar.xyz` |

5. **Deployments → Retry deployment** (or push any commit) so the new settings take effect.
6. Submit the form on xdrar.xyz and check that the email arrives.

## 5. Move the media to your own storage

The videos and images are not stored in this repo. Get the media folders and `XDRAR.mp4` from the developer, then:

1. In Cloudflare: **R2 → Create bucket** (for example `xdrar-media`).
2. Upload the files into the bucket with **exactly the same folder structure and file names** as the developer's copy.
3. In the bucket's **Settings → Public access**, enable the **r2.dev URL** and copy it (it looks like `https://pub-xxxxxxxx.r2.dev`).
4. In this repo, find and replace this URL across all `.html` files:
   ```
   https://pub-e843659987fb49ce82d3227ae212d21c.r2.dev
   ```
   with your new r2.dev URL. Commit and push, and Cloudflare redeploys automatically.
5. Check that the homepage video and the client pages load, then tell the developer they can delete the old storage.

## 6. Fonts: license needed ⚠️

The site uses **PP NeueBit** and **PP Mondwest** by Pangram Pangram. The copies in `fonts/` are the **free personal-use** version (see the EULA PDF in that folder), which doesn't cover a commercial website. Buy a web license at https://pangrampangram.com, or ask a developer to swap the fonts.

---

## Making changes later

- Edit the files and push to GitHub. Cloudflare Pages redeploys automatically within a minute or two.
- To preview locally: `npm install`, then `npm run dev`, then open http://localhost:8000.
- The pages are plain HTML: `index.html` (home), `clients/<name>/index.html` (each client), `branding/`, `archive/`, `personal/` and so on. The shared styling is in `styles.css` and the shared behavior in `script.js`.

## Known issues

- The branding and visuals category pages still show placeholder text ("Projects will be displayed here").

## Other docs in this repo

- `FORK_AND_RECREATE.md`: the full technical setup reference
- `FORM_SETUP.md`, `RESEND_DOMAIN_SETUP.md`: contact form details
