// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { rehypeBaseLinks } from './src/plugins/rehype-base-links.mjs';

// ─────────────────────────────────────────────────────────────────────────
//  WHERE THE SITE LIVES  — change these two when you know the URL.
//
//  GitHub Pages, project site (current):
//      SITE = 'https://carreraGroup.github.io'  BASE = '/mercury-docs-ce'
//  GitHub Pages, user/org site OR custom domain (e.g. docs.getcql.com):
//      SITE = 'https://docs.getcql.com'         BASE = '/'
//
//  In-page content links are automatically prefixed with BASE at build
//  time (see src/plugins/rehype-base-links.mjs), so switching between the
//  two above only ever requires changing these two constants.
// ─────────────────────────────────────────────────────────────────────────
const SITE = 'https://carreraGroup.github.io';
const BASE = '/mercury-docs-ce';

// Your public repo (used for the GitHub link + "Report an issue" buttons).
// Also update src/config.ts to the same value.
const GITHUB_REPO = 'carreraGroup/mercury-docs-ce';

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
            { label: 'Conformance & correctness', slug: 'support/conformance' },
            {
              label: 'Report an issue ↗',
              link: `https://github.com/${GITHUB_REPO}/issues/new/choose`,
              attrs: { target: '_blank', rel: 'noopener' },
            },
          ],
        },
      ],
    }),
  ],
});
