# Mercury — Documentation Site

The community documentation site for **Mercury**, the Rust-based CQL evaluation engine for FHIR quality measures. Built with **Astro + Starlight**, styled to match Mercury's brand, and set up to deploy free on **GitHub Pages**.

It covers the free, self-hosted **Community Edition** experience: quickstart, running the containers, loading data, mounting your data drive, the CQF and REST APIs, the CLI, troubleshooting, and conformance. Nothing proprietary from the engine's source is included.

---

## Run it locally

Requires **Node 18.20+ / 20.3+ / 22+**.

```bash
cd mercury-docs
npm install
npm run dev        # http://localhost:4321
```

```bash
npm run build      # outputs static site to ./dist
npm run preview    # preview the production build
```

Search (offline, via Pagefind) is built in and works on the static build automatically.

---

## Deployment target

Currently configured for the **`carreraGroup/mercury-docs-ce`** repo as a GitHub Pages project site:

- `SITE='https://carreraGroup.github.io'`, `BASE='/mercury-docs-ce'` (set in `astro.config.mjs`, mirrored in `src/config.ts` and `.github/ISSUE_TEMPLATE/config.yml`).
- Site lives at `https://carreraGroup.github.io/mercury-docs-ce`.

**In-page content links are base-path-safe.** Markdown/`<a>`/`LinkCard` links are auto-prefixed at build time by a rehype plugin (`src/plugins/rehype-base-links.mjs`); the hero's frontmatter action links go through a small `Hero.astro` override (`src/utils/base.ts`). Sidebar/nav links are base-aware natively via Starlight. This means switching `SITE`/`BASE` later — e.g. to move to a custom domain — doesn't require touching any content.

**To move to a custom domain later** (e.g. `docs.getcql.com`): set `SITE='https://docs.getcql.com'` and `BASE='/'` in `astro.config.mjs`, update the same two constants in `src/config.ts`, add a `public/CNAME` file containing the domain, and point its DNS at GitHub Pages. Content requires no changes.

**Remaining `[TBD]` marker:** the published container image reference (`containers.mdx`, `data-persistence.mdx`) — there's no established registry/tag convention yet (only local dev tags like `mercury:dev` exist internally). Fill in once the Community Edition image is actually published. Search `grep -rn "\[TBD" src`.

---

## Deploy to GitHub Pages

1. Create the **`carreraGroup/mercury-docs-ce`** repo (public, empty — no README/license) and push this folder as its root.
2. In **Settings → Pages**, set **Source = GitHub Actions**.
3. The included workflow (`.github/workflows/deploy.yml`) builds and deploys on every push to `main`. First push → site goes live at `SITE + BASE`.

---

## Logging tickets (no backend needed)

GitHub Pages is static, so ticket logging uses **GitHub's own issue forms** — no server, no database:

- **Every docs page** has a **"Report an issue with this page"** button in the footer (`src/components/ReportIssue.astro`, wired via `src/components/Footer.astro`). It opens GitHub's new-issue form, prefilled with the page title and the `docs` label.
- The **sidebar** has a persistent **Report an issue ↗** link.
- Prefilled **issue forms** live in `.github/ISSUE_TEMPLATE/` — a 🐞 bug report and a 📖 docs issue. Edit their fields to taste.
- `config.yml` optionally points people to **Discussions** for how-to questions (enable Discussions on the repo to use it).

There's nothing to host for this to work — it all runs off the repo's Issues tab once the repo exists.

---

## Editing content

- Pages live in `src/content/docs/**` as Markdown/MDX. Add a page → it's routed by file path; add it to the `sidebar` in `astro.config.mjs`.
- Global look: `src/styles/mercury.css` (IBM Plex + the `#1B6FC4` blue theme; light-first with a tuned dark mode).
- Reusable UI: `src/components/`.
- Docs are intentionally **not** community-editable — there are no "Edit this page" links. Feedback comes in as issues.

---

## Project layout

```
mercury-docs/
├── astro.config.mjs            # site/base, sidebar, theme, fonts, GitHub repo
├── package.json
├── src/
│   ├── config.ts               # GITHUB_REPO (keep in sync with astro.config)
│   ├── content.config.ts       # Starlight docs collection
│   ├── styles/mercury.css      # Mercury theme
│   ├── assets/logo.png
│   ├── utils/base.ts           # withBase() for JSX-style links in .mdx (LinkCard, <a>)
│   ├── plugins/
│   │   └── rehype-base-links.mjs  # auto base-prefixes Markdown links at build time
│   ├── components/
│   │   ├── Footer.astro         # adds the per-page "Report an issue" button
│   │   ├── ReportIssue.astro    # prefilled GitHub issue link
│   │   └── Hero.astro           # base-prefixes frontmatter hero.actions links
│   └── content/docs/
│       ├── index.mdx            # Overview / what's free
│       ├── quickstart.mdx
│       ├── containers.mdx
│       ├── loading-data.mdx
│       ├── data-persistence.mdx
│       ├── reference/{cqf-api,rest-api,cli}.mdx
│       └── support/{troubleshooting,conformance}.mdx
├── public/logo.png
└── .github/
    ├── workflows/deploy.yml     # GitHub Pages deploy
    └── ISSUE_TEMPLATE/          # bug + docs issue forms
```

---

## Content rules (keep these accurate)

Load-bearing positioning — don't let edits drift:

- **Limited release** — CTA is "register interest," not download. **No pricing.**
- Free **Community Edition** (whole engine, self-host) + paid one-click **AWS Marketplace** package. Single binary/Docker, no JVM.
- Add-on packs (**Connect, Insight, HA, Security, Trust/Quality**) are **additive & independent, not tiers**. All *in development*.
- Speed claims are **preliminary** (~10–100× vs CQF Ruler) — always labelled.
- Conformance: **1,783 of 1,795** CQL 1.5.2 cases passing (100% of executed).
- Community Edition attests to **no** compliance posture — never add a HIPAA/SOC 2 claim. Mark unknowns `[TBD]`.
