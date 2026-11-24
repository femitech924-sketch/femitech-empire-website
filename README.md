# FEMITECH EMPIRE — Vercel-ready website

A responsive static agency website built with HTML, CSS and vanilla JavaScript.

## Project files
- `index.html` — page content, metadata and structured business information
- `styles.css` — visual system and responsive layouts
- `script.js` — mobile navigation, project filters, inquiry form and Botpress panel
- `assets/` — supplied founder/office image
- `vercel.json` — static deployment settings and baseline security/cache headers
- `favicon.svg` — browser icon
- `robots.txt` — crawler access rules

## Deploy to Vercel
1. Extract this ZIP.
2. Import the project folder into a GitHub repository, or upload it through a supported Vercel deployment workflow.
3. In Vercel, create a **New Project** and import the repository.
4. Framework Preset: **Other**. Build Command: leave empty. Output Directory: `.`. Install Command: leave empty.
5. Deploy. No build step or environment variables are required for the current static site.

## Current integrations and limitations
- **AI assistant:** embedded Botpress webchat. Test the deployed domain and configure allowed domains in Botpress if required.
- **Project inquiry:** validates fields and opens WhatsApp with a pre-filled message. It does not store inquiries in a database or send email automatically.
- **Portfolio:** current tiles are marked as concept/demo projects, not commissioned client work.
- **Books:** book inquiry links currently lead to the contact section; add direct product/reading links when available.

## Before launch
- Verify the WhatsApp number, email, founder image rights and all copy.
- Test the mobile menu, project filters, form, WhatsApp handoff and Botpress assistant on the deployed URL.
- Add a real domain, then add a canonical URL and sitemap using that confirmed domain.
- If you need stored inquiries, connect a secure form service or backend before advertising the form as a submission database.


## Recent brand and portfolio upgrades
- Added the official FEMITECH EMPIRE logo asset and animated brand reveal.
- Added AI Chatbot & Chatbox Development to service cards and inquiry form.
- Added a featured live project link to the SUPER NEXUS website.
- Added subtle scroll reveals, light sweeps, hover motion, and reduced-motion support.
