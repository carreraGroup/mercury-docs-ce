// Prefixes root-relative internal links (e.g. href="/quickstart") with the
// configured Astro `base`, so authored links keep working whether the site
// is deployed at a project path (BASE='/mercury-docs') or at a domain root
// (BASE='/'). Sidebar/nav links are already base-aware via Starlight; this
// covers links written directly in page content (Markdown, <a>, LinkCard).
import { visit } from 'unist-util-visit';

export function rehypeBaseLinks(base) {
  const prefix = base.replace(/\/$/, '');
  return () => (tree) => {
    if (!prefix) return;
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'a') return;
      const href = node.properties?.href;
      if (
        typeof href === 'string' &&
        href.startsWith('/') &&
        !href.startsWith('//') &&
        !href.startsWith(prefix + '/') &&
        href !== prefix
      ) {
        node.properties.href = prefix + href;
      }
    });
  };
}
