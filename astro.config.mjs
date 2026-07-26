// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { rehypeBaseLinks } from './src/plugins/rehype-base-links.mjs';

// ─────────────────────────────────────────────────────────────────────────
//  WHERE THE SITE LIVES  — change these two when you know the URL.
//
//  GitHub Pages behind the custom domain (current — canonical):
//      SITE = 'https://docs.getcql.com'         BASE = '/'
//      (requires public/CNAME + the Cloudflare CNAME record — see
//       DNS_DOCS_SUBDOMAIN_CLOUDFLARE.md)
//  GitHub Pages, bare project site (legacy fallback):
//      SITE = 'https://carreraGroup.github.io'  BASE = '/mercury-docs-ce'
//
//  In-page content links are automatically prefixed with BASE at build
//  time (see src/plugins/rehype-base-links.mjs), so switching between the
//  two above only ever requires changing these two constants.
// ─────────────────────────────────────────────────────────────────────────
const SITE = 'https://docs.getcql.com';
const BASE = '/';

// Your public repo (used for the GitHub link + "Report an issue" buttons).
// Also update src/config.ts to the same value.
const GITHUB_REPO = 'carreraGroup/mercury-docs-ce';

// The marketing site. Keep in sync with src/config.ts.
const MARKETING_URL = 'https://getcql.com';
const REQUEST_ACCESS_URL = 'https://getcql.com/#request-access';

export default defineConfig({
  site: SITE,
  base: BASE,
  markdown: {
    rehypePlugins: [rehypeBaseLinks(BASE)],
  },
  integrations: [
    starlight({
      title: 'Mercury',
      tagline: 'CQL evaluation for FHIR quality measures',
      logo: { src: './src/assets/logo.png', alt: 'Mercury' },
      favicon: '/logo.png',
      customCss: ['./src/styles/mercury.css'],
      // Override the page footer to add a per-page "Report an issue" button,
      // and the hero to base-prefix its frontmatter-defined action links.
      components: {
        Footer: './src/components/Footer.astro',
        Hero: './src/components/Hero.astro',
        // Adds "Mercury home" / "Request access" links to the header, next to
        // the social icons — the visible way back to the marketing site.
        SocialIcons: './src/components/SocialIcons.astro',
      },
      // Docs are not community-editable — no "Edit this page" link (editLink omitted).
      head: [
        { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
        { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true } },
        {
          tag: 'link',
          attrs: {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap',
          },
        },
      ],
      social: [
        { icon: 'github', label: 'GitHub', href: `https://github.com/${GITHUB_REPO}` },
      ],
      // Dark code blocks that match the Mercury pitch-pack palette.
      expressiveCode: {
        themes: ['github-dark'],
      },
      sidebar: [
        {
          label: 'Start here',
          items: [
            { label: 'Overview', link: '/' },
            { label: 'Quickstart', slug: 'quickstart' },
            { label: 'Running the containers', slug: 'containers' },
            { label: 'AWS Marketplace', slug: 'aws-marketplace' },
          ],
        },
        {
          label: 'Working with data',
          items: [
            { label: 'Loading data: preload vs inline', slug: 'loading-data' },
            { label: 'Mounting your data drive', slug: 'data-persistence' },
          ],
        },
        {
          label: 'API reference',
          items: [
            { label: 'CQF API (/cqf)', slug: 'reference/cqf-api' },
            { label: 'REST surface (/api, /fhir)', slug: 'reference/rest-api' },
            { label: 'CLI', slug: 'reference/cli' },
          ],
        },
        {
          label: 'Support',
          items: [
            { label: 'Troubleshooting & FAQ', slug: 'support/troubleshooting' },
            { label: 'FAQ & security', slug: 'support/faq' },
            { label: 'Conformance & correctness', slug: 'support/conformance' },
            { label: 'Evaluation feedback', slug: 'feedback' },
            {
              label: 'Report an issue ↗',
              link: `https://github.com/${GITHUB_REPO}/issues/new/choose`,
              attrs: { target: '_blank', rel: 'noopener' },
            },
          ],
        },
        {
          label: 'Evaluation program',
          items: [
            {
              label: 'Mercury home ↗',
              link: MARKETING_URL,
              attrs: { target: '_blank', rel: 'noopener' },
            },
            {
              label: 'Request access ↗',
              link: REQUEST_ACCESS_URL,
              attrs: { target: '_blank', rel: 'noopener' },
            },
          ],
        },
      ],
    }),
  ],
});
