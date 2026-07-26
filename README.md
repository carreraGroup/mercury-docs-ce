# Mercury — Documentation Site

The documentation site for **Mercury**, the Rust-based CQL evaluation engine for FHIR quality measures. Built with **Astro + Starlight**, styled to match Mercury's brand, and deployed on **GitHub Pages** at its canonical URL **<https://docs.getcql.com>**.

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

**Canonical URL: <https://docs.getcql.com>.** Hosting is **GitHub Pages** (repo `carreraGroup/mercury-docs-ce`, deployed by GitHub Actions) behind a custom domain.

- `SITE='https://docs.getcql.com'`, `BASE='/'` (set in `astro.config.mjs`, mirrored in `src/config.ts` and `.github/ISSUE_TEMPLATE/config.yml`).
- `public/CNAME` contains `docs.getcql.com` — it's copied into `dist/` on build and is what tells Pages the custom domain. Don't delete it.
- DNS lives in **GoDaddy**: a `CNAME` for the `docs` label → `carreraGroup.github.io`. Full click-by-click steps, pitfalls, and a smoke checklist: **[`DNS_DOCS_SUBDOMAIN_GODADDY.md`](./DNS_DOCS_SUBDOMAIN_GODADDY.md)**.

**Legacy:** `https://carreraGroup.github.io/mercury-docs-ce` still resolves to the same Pages site, but it is **not canonical** — don't link to it. If you ever revert to that project-site layout you must change `SITE`, `BASE`, and `public/CNAME` together.

**In-page content links are base-path-safe.** Markdown/`<a>`/`LinkCard` links are auto-prefixed at build time by a rehype plugin (`src/plugins/rehype-base-links.mjs`); the hero's frontmatter action links go through a small `Hero.astro` override (`src/utils/base.ts`). Sidebar/nav links are base-aware natively via Starlight. So switching `SITE`/`BASE` never requires touching content.

**Image convention:** customer examples use `IMAGE_URI` / `MERCURY_IMAGE` from a private registry or Marketplace subscription. Source builds such as `docker build -t mercury:community .` belong only in contributor notes for people with the private source repository.

---

## Deploy to GitHub Pages

1. Push to `main` in **`carreraGroup/mercury-docs-ce`**.
2. In **Settings → Pages**, **Source = GitHub Actions** and **Custom domain = `docs.getcql.com`**.
3. The included workflow (`.github/workflows/deploy.yml`) builds and deploys on every push to `main`.
4. DNS is a one-time GoDaddy step — see [`DNS_DOCS_SUBDOMAIN_GODADDY.md`](./DNS_DOCS_SUBDOMAIN_GODADDY.md). Tick **Enforce HTTPS** once the DNS check passes.

The docs deploy path is **GitHub Pages only** — it is not on Cloudflare, unlike the marketing site.

---

## The two-site setup

Mercury's web presence is two linked static sites — deliberately not one app:

| Site | Repo | Host | Role |
|---|---|---|---|
| <https://getcql.com> | `mercury-pitch-pack` | Cloudflare (Wrangler) | Marketing, benchmarks, **request access** |
| <https://docs.getcql.com> | `mercury-docs` (this repo) | GitHub Pages | Partner docs, **quickstart**, evaluation feedback |

Cross-links are single-sourced: `MARKETING_URL` and `REQUEST_ACCESS_URL` in
`src/config.ts` (mirrored in `astro.config.mjs`) drive the header links, the
sidebar's *Evaluation program* group, and the copy in `index.mdx`.

Partner one-liner: **request at getcql.com → docs at docs.getcql.com/quickstart**.

---

## Feedback (two separate inboxes)

| Moment | Where | Mechanism |
|---|---|---|
| Wants access | getcql.com | Early-access Formspree form (`xlgyyaqa`) |
| In trial, product/docs feedback | docs.getcql.com/feedback | Evaluation-feedback Formspree form — **needs a form ID** |
| A specific wrong page or bug | any docs page footer | Prefilled GitHub issue form |
| Anything else | email | `hello@carrera.io` |

**To turn the feedback form on:** create a *second* Formspree form (so access
requests and product feedback don't land in the same inbox) and paste its ID
into `FEEDBACK_FORM_ID` in `src/config.ts`. Until then, `/feedback` renders an
email fallback rather than a form that silently drops submissions.

Fields collected: work email, organization, what you tried, what broke, parity
notes, would-you-deploy, free text.

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
├── astro.config.mjs            # site/base, sidebar, theme, fonts, GitHub repo, marketing links
├── DNS_DOCS_SUBDOMAIN_GODADDY.md  # one-time GoDaddy → GitHub Pages setup
├── package.json
├── src/
│   ├── config.ts               # GITHUB_REPO, marketing links, FEEDBACK_FORM_ID
│   ├── content.config.ts       # Starlight docs collection
│   ├── styles/mercury.css      # Mercury theme
│   ├── assets/logo.png
│   ├── utils/base.ts           # withBase() for JSX-style links in .mdx (LinkCard, <a>)
│   ├── plugins/
│   │   └── rehype-base-links.mjs  # auto base-prefixes Markdown links at build time
│   ├── components/
│   │   ├── Footer.astro         # per-page "Report an issue" + feedback buttons
│   │   ├── ReportIssue.astro    # prefilled GitHub issue link
│   │   ├── SocialIcons.astro    # header links back to getcql.com
│   │   ├── FeedbackForm.astro   # evaluation-feedback form (Formspree)
│   │   └── Hero.astro           # base-prefixes frontmatter hero.actions links
│   └── content/docs/
│       ├── index.mdx            # Overview / what's free
│       ├── quickstart.mdx
│       ├── feedback.mdx         # Evaluation feedback form
│       ├── containers.mdx
│       ├── loading-data.mdx
│       ├── data-persistence.mdx
│       ├── reference/{cqf-api,rest-api,cli}.mdx
│       └── support/{troubleshooting,faq,conformance}.mdx
├── public/
│   ├── CNAME                   # docs.getcql.com — required by GitHub Pages
│   ├── logo.png
│   └── quickstart/             # fixtures the Quickstart downloads
└── .github/
    ├── workflows/deploy.yml     # GitHub Pages deploy
    └── ISSUE_TEMPLATE/          # bug + docs issue forms
```

---

## Content rules (keep these accurate)

Load-bearing positioning — don't let edits drift:

- **Limited release** — CTA is "register interest," not download. **No pricing.**
- Free invite-only **Community Edition** Core image (self-hosted) + planned paid **AWS Marketplace Core** container and AMI listings on 1-month / 12-month contracts. Single binary/container, no JVM.
- Add-on packs (**Connect, Insight, HA, Security, Trust/Quality**) are **additive & independent, not tiers**. All *in development*.
- Speed claims are **preliminary** (~10–100× vs CQF Ruler) — always labelled.
- Conformance: **1,783 of 1,795** CQL 1.5.2 cases passing (100% of executed).
- Community Edition attests to **no** compliance posture — never add a HIPAA/SOC 2 claim. Mark unknowns `[TBD]`.
