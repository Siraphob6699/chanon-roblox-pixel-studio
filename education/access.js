(() => {
  try { window.educationAccess = sessionStorage.getItem('chanon-education-auth') === 'ok'; }
  catch { window.educationAccess = false; }
  if (!window.educationAccess) {
    document.documentElement.classList.add('access-locked');
    location.replace(new URL('../'.repeat(location.pathname.includes('/education/physics') ? 2 : 1) + 'index.html', location.href).href);
  }
})();
