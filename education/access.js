(() => {
  const enforce = () => {
    try { window.educationAccess = window.ChanonEducationAuth.isAuthorized(); }
    catch { window.educationAccess = false; }
    if (window.educationAccess) {
      document.documentElement.classList.remove('access-locked');
      return;
    }
    document.documentElement.classList.add('access-locked');
    const login = new URL('/index.html', location.href);
    login.searchParams.set('education_return', location.pathname + location.search + location.hash);
    location.replace(login.href);
  };
  enforce();
  window.addEventListener('pageshow', enforce);
  window.addEventListener('focus', enforce);
  window.addEventListener('storage', event => {
    if (event.key === null || event.key === window.ChanonEducationAuth?.key) enforce();
  });
})();
