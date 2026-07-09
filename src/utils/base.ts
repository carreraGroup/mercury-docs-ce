// Prefixes a root-relative path with the site's configured base, for use in
// JSX-style links (<a href>, <LinkCard href>) inside .mdx content — these
// bypass the markdown pipeline, so they aren't covered by
// src/plugins/rehype-base-links.mjs and need this instead.
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return base + path;
}
