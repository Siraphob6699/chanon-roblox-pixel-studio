(() => {
  try { window.educationAccess = sessionStorage.getItem('chanon-education-auth') === 'ok'; }
  catch { window.educationAccess = false; }
  if (!window.educationAccess) {
    document.documentElement.classList.add('access-locked');
    const login = new URL('/index.html', location.href);
    login.searchParams.set('education_return', location.pathname + location.search + location.hash);
    location.replace(login.href);
  }
})();
