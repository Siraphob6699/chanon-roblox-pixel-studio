(() => {
  const form = document.getElementById('education-login');
  const input = document.getElementById('education-passcode');
  const error = document.getElementById('education-error');
  const button = document.getElementById('enterEducation');
  form.addEventListener('submit', async event => {
    event.preventDefault();
    error.textContent = ''; button.disabled = true;
    try {
      const bytes = new TextEncoder().encode(input.value.trim());
      const digest = await crypto.subtle.digest('SHA-256', bytes);
      const hash = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
      if (hash !== 'ec9c3833d2daef77604a3cfc097bbc5e919e4c96e8fd13bc34fdf0a2e4474e79') {
        error.textContent = 'รหัสไม่ถูกต้อง กรุณาลองใหม่'; input.focus(); input.select(); return;
      }
      sessionStorage.setItem('chanon-education-auth', 'ok');
      input.value = '';
      let destination = new URL('./education/', location.href);
      const requested = new URL(location.href).searchParams.get('education_return');
      if (requested) {
        try {
          const target = new URL(requested, location.href);
          if (target.origin === destination.origin && target.pathname.startsWith('/education/') && !target.username && !target.password) destination = target;
        } catch { /* Keep the normal subject chooser for an invalid return URL. */ }
      }
      location.href = destination.href;
    } catch {
      error.textContent = 'ยังเข้าใช้งานไม่ได้ กรุณาเปิดผ่าน HTTPS และอนุญาตการบันทึกข้อมูลในเบราว์เซอร์';
    } finally { button.disabled = false; }
  });
})();
