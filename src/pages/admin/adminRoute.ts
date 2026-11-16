/**
 * The admin sub-page lives in the URL hash, as `#admin/users`.
 *
 * The app drives its top-level page from history state and never writes a
 * path, so a hash is the one place a sub-page survives a reload without
 * needing server-side rewrites. It also makes an admin screen linkable.
 */

export const DEFAULT_ADMIN_PAGE = 'dashboard';

const PREFIX = '#admin';

/** True when the current URL asks for the admin panel. */
export function isAdminHash(hash: string = window.location.hash): boolean {
  return hash === PREFIX || hash.startsWith(`${PREFIX}/`);
}

/** The sub-page named by the URL, or the default when it names none. */
export function readAdminPage(hash: string = window.location.hash): string {
  if (!isAdminHash(hash)) return DEFAULT_ADMIN_PAGE;
  const page = hash.slice(PREFIX.length).replace(/^\//, '');
  return page || DEFAULT_ADMIN_PAGE;
}

/**
 * Points the URL at an admin sub-page. `replace` swaps the current history
 * entry instead of adding one, used when landing on the panel so that Back
 * leaves the panel rather than stepping through it.
 */
export function writeAdminPage(page: string, replace = false): void {
  const target = `${PREFIX}/${page}`;
  if (window.location.hash === target) return;
  if (replace) {
    window.history.replaceState(window.history.state, '', target);
  } else {
    window.location.hash = target;
  }
}

/** Drops the admin hash, without leaving a stray `#` behind. */
export function clearAdminHash(): void {
  if (!isAdminHash()) return;
  window.history.replaceState(
    window.history.state,
    '',
    window.location.pathname + window.location.search
  );
}
