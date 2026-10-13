(() => {
  const form = document.getElementById('education-login');
  const input = document.getElementById('education-passcode');
  const error = document.getElementById('education-error');
  const button = document.getElementById('enterEducation');
  const field = input.closest('.field');
  const note = document.getElementById('education-session-note');
  const auth = window.ChanonEducationAuth;
  const requested = new URL(location.href).searchParams.get('education_return');
  const returnTarget = () => {
    if (!requested) return null;
    try {
      const target = new URL(requested, location.href);
      if (target.origin === location.origin && target.pathname.startsWith('/education/') && !target.username && !target.password) return target;
    } catch {}
    return null;
  };
  const destination = () => returnTarget() || new URL('./education/', location.href);
  const refresh = () => {
    const remembered = auth?.isAuthorized() === true;
    if (remembered) error.textContent = '';
    field.hidden = remembered;
    input.disabled = remembered;
    input.required = !remembered;
    if (note) note.textContent = remembered
      ? 'เบราว์เซอร์นี้เข้าใช้งานแล้ว กดเข้าสื่อการสอนได้ทันที'
      : 'จำการเข้าใช้งาน 30 วันในเบราว์เซอร์นี้ กด “ล็อกสื่อการสอน” เมื่อต้องการให้ถามรหัสอีกครั้ง';
    return remembered;
  };
  if (refresh() && returnTarget()) {
    location.replace(destination().href);
    return;
  }
  window.addEventListener('pageshow', refresh);
  window.addEventListener('storage', event => {
    if (event.key === null || event.key === auth?.key) refresh();
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    error.textContent = ''; button.disabled = true;
    try {
      if (!refresh()) {
        const bytes = new TextEncoder().encode(input.value.trim());
        const digest = await crypto.subtle.digest('SHA-256', bytes);
        const hash = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
        if (hash !== 'ec9c3833d2daef77604a3cfc097bbc5e919e4c96e8fd13bc34fdf0a2e4474e79') {
          error.textContent = 'รหัสไม่ถูกต้อง กรุณาลองใหม่'; input.focus(); input.select(); return;
        }
        if (!auth.authorize()) throw new Error('Browser storage unavailable');
      }
      input.value = '';
      location.href = destination().href;
    } catch {
      error.textContent = 'ยังจำการเข้าใช้งานไม่ได้ กรุณาเปิดใน Safari และอนุญาตการบันทึกข้อมูลของเว็บไซต์';
    } finally { button.disabled = false; }
  });
})();
