# Pointing `docs.getcql.com` at GitHub Pages (Cloudflare DNS)

Click-by-click setup for the Mercury docs subdomain.

| | |
|---|---|
| **DNS host** | Cloudflare (zone `getcql.com`) |
| **Docs hosting** | GitHub Pages — repo `carreraGroup/mercury-docs-ce`, deployed by GitHub Actions |
| **Target hostname** | `docs.getcql.com` |
| **Marketing site** | `getcql.com` — a Cloudflare Worker (`mercury-pitch-pack`, `wrangler.jsonc`). **Leave its records alone.** |

**Recommended path:** one `CNAME` for the `docs` label → the GitHub Pages
host, with the Cloudflare proxy **off (grey cloud)**. That's the whole change.
No apex edits, no A records, no page rules.

The grey cloud is the part people get wrong — see step 3.

Steps 1–2 are already done in this repo and pushed; you only need steps 3–5.

---

## Step 1 — Repo config (done)

In `astro.config.mjs`:

```js
const SITE = 'https://docs.getcql.com';
const BASE = '/';
```

And `public/CNAME` contains exactly:

```text
docs.getcql.com
```

`public/CNAME` is copied verbatim into `dist/` on every build, which is what
tells GitHub Pages the custom domain. If it ever goes missing, Pages silently
drops the custom domain on the next deploy.

> With `BASE = '/'`, never reintroduce a project-page base such as
> `/mercury-docs-ce` — asset URLs would break on the subdomain.

## Step 2 — The Actions deploy (done)

`.github/workflows/deploy.yml` builds and deploys on every push to `main`.
Check **Actions** in the repo — the most recent *Deploy docs to GitHub Pages*
run should be green before you touch DNS, so you're only debugging one thing
at a time.

## Step 3 — Cloudflare DNS record

1. Sign in at [dash.cloudflare.com](https://dash.cloudflare.com).
2. Pick the **`getcql.com`** zone.
3. Left sidebar → **DNS** → **Records**.
4. Scan the list for an existing record named `docs` (or a wildcard `*`). If a
   `docs` record already exists, edit it rather than adding a second one —
   duplicates are the most common cause of a stuck DNS check.
5. **Add record**:

   | Field | Value |
   |---|---|
   | **Type** | `CNAME` |
   | **Name** | `docs` |
   | **Target** | `carreraGroup.github.io` |
   | **Proxy status** | **DNS only** — grey cloud, *not* orange |
   | **TTL** | Auto |

6. **Save**.

### The three things to get right

- **Proxy status must be DNS only (grey cloud).** With the orange cloud on,
  `docs.getcql.com` resolves to Cloudflare's IPs, GitHub's domain check can't
  see its own host, and certificate provisioning never completes — *Enforce
  HTTPS* stays greyed out indefinitely. Grey cloud lets GitHub issue its
  Let's Encrypt certificate and serve HTTPS directly.

  *If you later want the docs proxied* (caching, WAF, analytics): turn the
  orange cloud on **only after** GitHub has issued the certificate and
  *Enforce HTTPS* is ticked, and make sure **SSL/TLS → Overview** is set to
  **Full (strict)**. Flexible produces a redirect loop.

- **Name is `docs`, not `docs.getcql.com`.** Cloudflare appends the zone. It
  displays the full name in the table after saving — that's just the display.

- **Target is the Pages *host*, not the project URL.** It's
  `carreraGroup.github.io` — no `https://`, no `/mercury-docs-ce`, no trailing
  slash. Confirm it against **Settings → Pages** in the repo: the "Your site is
  live at …" URL shows the host GitHub actually serves from; use whatever
  appears before the first `/`.

### What not to do

- ❌ Don't touch the apex `@` or `www` records. Those carry the marketing
  Worker; changing them takes `getcql.com` down.
- ❌ Don't add `A` records for `docs`. The four GitHub Pages IPs
  (`185.199.108-111.153`) are for **apex** domains. A subdomain uses `CNAME`.
- ❌ Don't use a Cloudflare **Redirect Rule**, **Page Rule**, or **Bulk
  Redirect** for `docs`. GitHub has to answer on the hostname itself.
- ❌ Don't add a Worker route for `docs.getcql.com`. The docs aren't served by
  the Worker.

## Step 4 — GitHub repo settings

Repo → **Settings** → **Pages**:

1. **Build and deployment → Source**: `GitHub Actions`.
2. **Custom domain**: enter `docs.getcql.com` → **Save**.
   - A ⚠️ DNS error right after saving is normal; it clears once step 3
     propagates. Leave it saved.
3. **Enforce HTTPS**: wait. GitHub provisions a certificate once the DNS check
   passes — usually a few minutes more. Tick the box when it becomes available.

If the checkbox stays greyed out for more than ~30 minutes, the near-certain
cause is an orange cloud on the `docs` record. Go back to step 3.

## Step 5 — Propagation

Cloudflare publishes changes in **seconds**; resolver caches elsewhere can lag
a few minutes. If a previous `docs` record had a long TTL, allow up to that TTL
before concluding something is wrong.

---

## Smoke checklist

Work down the list; each line depends on the one above it.

1. **Cloudflare** shows `CNAME` · `docs` · `carreraGroup.github.io` · **DNS
   only**.
2. **DNS resolves to GitHub, not Cloudflare:**

   ```bash
   dig docs.getcql.com CNAME +short
   ```

   Expected: `carreragroup.github.io.` (case-insensitive, trailing dot
   normal). Then:

   ```bash
   dig docs.getcql.com +short
   ```

   Expected: the Pages IPs `185.199.108-111.153`. **If you see Cloudflare IPs
   (104.x / 172.67.x), the proxy is still on** — grey-cloud the record.

3. **GitHub Pages** → Settings → Pages shows the custom domain with a ✅ DNS
   check.
4. **Enforce HTTPS** is ticked, and the site loads with no certificate warning.
5. **Docs load:**

   ```bash
   curl -sSI https://docs.getcql.com/quickstart | head -1
   ```

   Expected `HTTP/2 200`. Then open <https://docs.getcql.com/quickstart> in a
   browser — sidebar, search box, and logo should all render. Broken styling
   means a stale `BASE`.

6. **Fixtures resolve** — the Quickstart tells partners to download these:

   ```bash
   curl -fsS https://docs.getcql.com/quickstart/patient-bundle.json | head -c 80
   curl -fsS https://docs.getcql.com/quickstart/QuickstartLibrary.Library.json | head -c 80
   ```

   Both should return JSON, not a 404 page.

7. **Marketing still up:** <https://getcql.com> loads, and its **Docs ↗** link
   lands on the quickstart.

---

## Aftermath

- **The old URL keeps resolving** but is **not canonical**:
  `https://carreraGroup.github.io/mercury-docs-ce/…` now redirects to the
  custom domain. Update any link that still points there — decks, emails,
  partner threads.
- **Canonical is `https://docs.getcql.com`.** The partner entry point is
  `https://docs.getcql.com/quickstart`.
- **If you ever revert** to the bare project site, change *three* things
  together — `SITE`, `BASE`, and `public/CNAME` — and clear the custom domain
  in Settings → Pages. Changing one leaves the site half-broken.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Pages DNS check stuck on ⚠️ | Proxy is on, or a duplicate/wildcard record shadows `docs` | Grey-cloud the record; remove duplicates |
| *Enforce HTTPS* permanently greyed out | Certificate can't be issued through the Cloudflare proxy | Set **DNS only** and wait for provisioning |
| `ERR_TOO_MANY_REDIRECTS` | Proxy on with SSL/TLS mode **Flexible** | Grey-cloud it, or switch SSL/TLS to **Full (strict)** |
| `dig` returns 104.x / 172.67.x | Still proxied | Grey-cloud the record |
| Site loads but unstyled | `BASE` still `/mercury-docs-ce` | Set `BASE = '/'`, rebuild, redeploy |
| Custom domain disappears after a deploy | `public/CNAME` missing from the build | Restore it; confirm `dist/CNAME` exists after `npm run build` |
| `getcql.com` itself breaks | An apex/`www` record got edited | Restore the Worker's records — the docs change should never touch them |
