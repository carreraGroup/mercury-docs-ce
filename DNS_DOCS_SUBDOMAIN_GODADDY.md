# Pointing `docs.getcql.com` at GitHub Pages (GoDaddy DNS)

Click-by-click setup for the Mercury docs subdomain.

| | |
|---|---|
| **Domain registrar / DNS host** | GoDaddy (`getcql.com`) |
| **Docs hosting** | GitHub Pages — repo `carreraGroup/mercury-docs-ce`, deployed by GitHub Actions |
| **Target hostname** | `docs.getcql.com` |
| **Marketing site** | `getcql.com` — served by Cloudflare from the `mercury-pitch-pack` repo. **Do not touch its DNS.** |

**Recommended path:** a single `CNAME` record for the `docs` label pointing at
the GitHub Pages host. No apex changes, no A records, no forwarding. Steps 1–2
below are already done in this repo; you only need steps 3–5.

---

## Step 1 — Repo config (already done)

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

## Step 2 — Confirm the Actions deploy still works

`.github/workflows/deploy.yml` builds and deploys on every push to `main`.
Push, then check **Actions** in the repo — the *Deploy docs to GitHub Pages*
run should end green. That must pass **before** you change DNS, otherwise
you'll be debugging two things at once.

## Step 3 — GitHub repo settings

Repo → **Settings** → **Pages**:

1. **Build and deployment → Source**: `GitHub Actions`.
2. **Custom domain**: type `docs.getcql.com`, click **Save**.
   - GitHub will immediately run a DNS check and show a ⚠️ error until step 4
     propagates. That's expected — leave it saved.
3. **Enforce HTTPS**: leave it alone for now. You'll come back for it in
   step 5, once the DNS check passes and the certificate is issued.

Saving the custom domain also commits a `CNAME` file to the repo in some
configurations. Ours is generated from `public/CNAME` — if GitHub adds a
duplicate at the repo root, that's harmless, but keep `public/CNAME` as the
source of truth.

## Step 4 — GoDaddy DNS record

1. Sign in at [godaddy.com](https://godaddy.com).
2. Top-right avatar → **My Products**.
3. Find **`getcql.com`** → click **DNS** (or the **⋮** menu → **Manage DNS**).
   - You want the page titled **DNS Management** / **DNS Records**.
     **Not** the **Forwarding** section.
4. Look for any existing record with **Name = `docs`** — an `A`, a `CNAME`, or
   a parked/placeholder record. If one exists, **delete it** (or edit it in
   place in the next step). Conflicting records are the single most common
   cause of a stuck DNS check.
5. Click **Add New Record** and enter exactly:

   | Field | Value |
   |---|---|
   | **Type** | `CNAME` |
   | **Name** | `docs` |
   | **Value** (a.k.a. *Points to* / *Data*) | `carreraGroup.github.io` |
   | **TTL** | Default (1 hour) |

6. Click **Save**.

### Two things to get right

- **Name is `docs`, not `docs.getcql.com`.** GoDaddy appends the domain for
  you. Entering the full hostname creates `docs.getcql.com.getcql.com`.
- **Value is the Pages *host*, not the project URL.** It's
  `carreraGroup.github.io` — the org's Pages hostname — with no `https://`, no
  `/mercury-docs-ce`, and no trailing slash. GoDaddy may display it back with a
  trailing dot (`carreraGroup.github.io.`); that's normal.

  *Confirm the host before saving:* on the repo's **Settings → Pages** page,
  the "Your site is live at …" URL shows the Pages host GitHub is actually
  serving from. Use whatever hostname appears before the first `/`.

### What not to do

- ❌ Don't use GoDaddy **Domain Forwarding** or **masking** for `docs`. It
  serves an HTTP redirect or a frame, GitHub's DNS check will never pass, and
  HTTPS will never be issued.
- ❌ Don't add `A` records for `docs`. The four GitHub Pages `A` records
  (`185.199.108-111.153`) are for **apex** domains only. `docs` is a subdomain
  → `CNAME`.
- ❌ Don't touch the apex `@` or `www` records. Those point `getcql.com` at
  Cloudflare for the marketing site, which already works.

## Step 5 — Wait, then enforce HTTPS

Propagation is usually **minutes**, occasionally **a few hours**.

1. Back on **Settings → Pages**, the custom domain should switch to
   ✅ *DNS check successful*. (Click **Remove**/**Save** again to re-run the
   check if it looks stale, or just reload.)
2. GitHub then provisions a Let's Encrypt certificate — this can take another
   several minutes and shows as *Certificate being provisioned*.
3. Once it's ready, tick **Enforce HTTPS**.

If the checkbox is greyed out, the certificate isn't issued yet. Wait and
reload; don't change DNS again in the meantime.

---

## Smoke checklist

Work down the list; each line depends on the one above it.

1. **GoDaddy** shows `CNAME` · `docs` → `carreraGroup.github.io`.
2. **DNS resolves** — the answer should be the GitHub Pages host:

   ```bash
   dig docs.getcql.com CNAME +short
   ```

   Expected: `carreragroup.github.io.` (case-insensitive, trailing dot normal).
   If it returns nothing, also try `dig docs.getcql.com +short` — you should
   see the Pages IPs (`185.199.108-111.153`).

3. **GitHub Pages** → Settings → Pages shows the custom domain with a ✅ DNS
   check.
4. **Enforce HTTPS** is ticked and the page loads without a certificate
   warning.
5. **Docs load:**

   ```bash
   curl -sSI https://docs.getcql.com/quickstart | head -1
   ```

   Expected: `HTTP/2 200`. Then open
   <https://docs.getcql.com/quickstart> in a browser — the sidebar, search box,
   and logo should all render (broken styling means a stale `BASE`).

6. **Fixtures resolve** — the Quickstart tells partners to download these:

   ```bash
   curl -fsS https://docs.getcql.com/quickstart/patient-bundle.json | head -c 80
   curl -fsS https://docs.getcql.com/quickstart/QuickstartLibrary.Library.json | head -c 80
   ```

   Both should return JSON, not a 404 page.

---

## Aftermath

- **The old URL keeps working.** `https://carreraGroup.github.io/mercury-docs-ce/…`
  continues to resolve to the same Pages site, but it now has the wrong base
  path and is **not canonical**. Update any link that still points there —
  marketing copy, decks, emails, issue templates.
- **Canonical is `https://docs.getcql.com`.** The partner entry point is
  `https://docs.getcql.com/quickstart`.
- **If you ever revert** to the bare project site, you must change *three*
  things together: `SITE`, `BASE`, and `public/CNAME` — plus clear the custom
  domain in Settings → Pages. Changing only one leaves the site half-broken.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Pages DNS check stuck on ⚠️ | Old `A`/`CNAME`/parking record for `docs` still present, or the record was entered as an FQDN | Delete the conflicting record; re-check that **Name** is `docs` |
| Site loads but unstyled | `BASE` still set to `/mercury-docs-ce` | Set `BASE = '/'`, rebuild, redeploy |
| Custom domain disappears after a deploy | `public/CNAME` missing from the build output | Restore `public/CNAME`; confirm `dist/CNAME` exists after `npm run build` |
| "Enforce HTTPS" greyed out | Certificate not issued yet | Wait; don't change DNS while waiting |
| Redirect loop or a framed page | GoDaddy Forwarding/masking is on for `docs` | Remove the forwarding rule; use only the DNS record |
