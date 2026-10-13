(() => {
  const KEY = 'chanon-education-access-v2';
  const VERSION = 'chanon-education-access-version';
  const LEGACY = 'chanon-education-auth';
  const SECONDS = 30 * 24 * 60 * 60;
  const readLocal = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const writeLocal = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
  const removeLocal = key => { try { localStorage.removeItem(key); } catch {} };
  const readCookie = key => {
    try {
      const entry = document.cookie.split(';').map(x => x.trim()).find(x => x.startsWith(key + '='));
      return entry ? decodeURIComponent(entry.slice(key.length + 1)) : null;
    } catch { return null; }
  };
  const writeCookie = (key, value, maxAge) => {
    try { document.cookie = key + '=' + encodeURIComponent(value) + '; Path=/; Max-Age=' + maxAge + '; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : ''); } catch {}
  };
  const removeLegacy = () => { try { sessionStorage.removeItem(LEGACY); } catch {} };
  const valid = raw => {
    try {
      const value = JSON.parse(raw);
      return value.version === 2 && Number.isFinite(value.expiresAt) && value.expiresAt > Date.now();
    } catch { return false; }
  };
  const remembered = () => valid(readLocal(KEY)) || valid(readCookie(KEY));
  const markVersion = () => {
    writeLocal(VERSION, '2');
    writeCookie(VERSION, '2', 365 * 24 * 60 * 60);
  };
  const clear = () => {
    // Keep the version marker so an older tab cannot restore a logged-out session.
    markVersion();
    removeLocal(KEY);
    writeCookie(KEY, '', 0);
    removeLegacy();
  };
  const authorize = () => {
    const value = JSON.stringify({ version: 2, expiresAt: Date.now() + SECONDS * 1000 });
    writeLocal(KEY, value);
    writeCookie(KEY, value, SECONDS);
    markVersion();
    removeLegacy();
    return remembered();
  };
  const isAuthorized = () => {
    if (remembered()) return true;
    if (readLocal(VERSION) === '2' || readCookie(VERSION) === '2') return false;
    // Upgrade an existing tab which already passed the old PIN check.
    try { if (sessionStorage.getItem(LEGACY) === 'ok') return authorize(); } catch {}
    return false;
  };
  window.ChanonEducationAuth = Object.freeze({ isAuthorized, authorize, clear, key: KEY });
})();
