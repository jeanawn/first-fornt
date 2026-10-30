/**
 * Prefixe des journaux de dedoublonnage du pixel Meta
 *
 * Ces entrees ne sont pas des donnees de compte : les effacer
 * reautoriserait l'envoi d'evenements de conversion deja comptes
 */
export const PIXEL_LOG_PREFIX = 'fb_tracked_';

/**
 * Vide le localStorage en conservant les journaux du pixel
 *
 * Remplace localStorage.clear() partout ou l'on nettoie une session :
 * deconnexion, changement de compte, token invalide
 */
export function clearAppStorage(): void {
  try {
    const preserved: [string, string][] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith(PIXEL_LOG_PREFIX)) continue;

      const value = localStorage.getItem(key);
      if (value !== null) preserved.push([key, value]);
    }

    localStorage.clear();

    preserved.forEach(([key, value]) => localStorage.setItem(key, value));
  } catch {
    // Stockage indisponible : il n'y a alors rien a nettoyer
  }
}
