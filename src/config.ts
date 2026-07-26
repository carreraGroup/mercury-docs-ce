// Single source of truth for links used by page components.
// Keep GITHUB_REPO / MARKETING_URL / REQUEST_ACCESS_URL in sync with the
// constants of the same name in astro.config.mjs.
export const GITHUB_REPO = 'carreraGroup/mercury-docs-ce';

/** Marketing site — canonical home for positioning and access requests. */
export const MARKETING_URL = 'https://getcql.com';

/** Anchor on the marketing site that holds the early-access form. */
export const REQUEST_ACCESS_URL = 'https://getcql.com/#request-access';

/**
 * Formspree form ID for the evaluation-feedback form (docs → us).
 *
 * Create a second form at formspree.io (separate from the marketing
 * early-access form `xlgyyaqa`, so access requests and product feedback land
 * in different inboxes) and paste its ID here — e.g. 'xabcdefg'.
 *
 * While this is empty the feedback page renders an email fallback instead of
 * a form, so the site is never broken by a missing endpoint.
 */
export const FEEDBACK_FORM_ID = '';

/** Where feedback and access questions go if someone would rather just email. */
export const CONTACT_EMAIL = 'hello@carrera.io';
