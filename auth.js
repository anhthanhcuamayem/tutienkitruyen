/**
 * Neon Auth bridge for the game's plain HTML/JS frontend.
 * The Auth URL is public; DATABASE_URL must remain server-side only.
 */
(function () {
  'use strict';

  const authUrl = String(window.NEON_AUTH_URL || '').replace(/\/$/, '');
  let currentUser = null;
  let authMode = 'signin';
  let pendingVerificationEmail = '';

  const $ = id => document.getElementById(id);

  function setStatus(message, type = '') {
    const status = $('auth-status');
    if (!status) return;
    status.textContent = message || '';
    status.className = `auth-status ${type}`.trim();
  }

  function getErrorMessage(payload, fallback) {
    return payload?.error?.message || payload?.message || payload?.error || fallback;
  }

  function getNetworkErrorMessage(error) {
    if (!(error instanceof TypeError) || !/fetch|network/i.test(error.message || '')) {
      return error.message || 'Không thể kết nối Neon Auth.';
    }
    const origin = window.location.origin === 'null' ? 'file:// (mở trực tiếp file)' : window.location.origin;
    return `Không kết nối được Neon Auth từ ${origin}. Hãy mở bằng Vercel hoặc http://localhost:8080 và thêm đúng domain này trong Neon > Better Auth > Domains.`;
  }

  function recordAuthError(error, context = {}) {
    if (window.gameDebug?.capture) {
      window.gameDebug.capture(error, { scope: 'neon-auth', ...context });
    }
  }

  async function authRequest(path, options = {}) {
    if (!authUrl) throw new Error('Chưa cấu hình NEON_AUTH_URL.');

    let response;
    try {
      response = await fetch(`${authUrl}/${path.replace(/^\//, '')}`, {
        method: options.method || 'GET',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          ...(options.body ? { 'Content-Type': 'application/json' } : {})
        },
        body: options.body ? JSON.stringify(options.body) : undefined
      });
    } catch (error) {
      recordAuthError(error, { endpoint: path, method: options.method || 'GET' });
      throw error;
    }

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(getErrorMessage(payload, `Auth thất bại (${response.status}).`));
      recordAuthError(error, { endpoint: path, method: options.method || 'GET', status: response.status, code: payload?.code || '' });
      throw error;
    }
    return payload?.data || payload;
  }

  function extractUser(payload) {
    return payload?.user || payload?.session?.user || null;
  }

  function publishAuthState() {
    const accountLabel = $('auth-account-label');
    const accountIcon = $('auth-account-icon');
    const accountButton = $('btn-account');
    if (accountLabel) accountLabel.textContent = currentUser ? (currentUser.name || 'Tài khoản') : 'Đăng nhập';
    if (accountIcon) accountIcon.textContent = currentUser ? '✅' : '👤';
    if (accountButton) accountButton.title = currentUser ? 'Mở tài khoản' : 'Đăng nhập tài khoản';

    const loggedOut = $('auth-logged-out');
    const loggedIn = $('auth-logged-in');
    if (loggedOut) loggedOut.classList.toggle('hidden', Boolean(currentUser));
    if (loggedIn) loggedIn.classList.toggle('hidden', !currentUser);
    if (currentUser) {
      if ($('auth-user-name')) $('auth-user-name').textContent = currentUser.name || 'Đạo hữu vô danh';
      if ($('auth-user-email')) $('auth-user-email').textContent = currentUser.email || '';
      if ($('auth-session-status')) $('auth-session-status').textContent = 'Session Neon Auth đang hoạt động.';
    }

    window.dispatchEvent(new CustomEvent('neon-auth-change', { detail: { user: currentUser } }));
  }

  function setMode(mode) {
    authMode = mode === 'signup' ? 'signup' : 'signin';
    const isSignup = authMode === 'signup';
    $('btn-auth-signin-mode')?.classList.toggle('active', !isSignup);
    $('btn-auth-signup-mode')?.classList.toggle('active', isSignup);
    $('auth-name-field')?.classList.toggle('hidden', !isSignup);
    const submit = $('btn-auth-submit');
    if (submit) submit.textContent = isSignup ? 'Tạo tài khoản' : 'Đăng nhập';
    const password = $('auth-password');
    if (password) password.autocomplete = isSignup ? 'new-password' : 'current-password';
    $('auth-verify-section')?.classList.add('hidden');
    setStatus('');
  }

  function openModal() {
    $('auth-modal')?.classList.remove('hidden');
    if (currentUser) publishAuthState();
    else $('auth-email')?.focus();
  }

  function closeModal() {
    $('auth-modal')?.classList.add('hidden');
  }

  async function refreshSession() {
    try {
      const payload = await authRequest('get-session');
      currentUser = extractUser(payload);
    } catch (error) {
      // A missing session is normal. Avoid showing an error before the user opens the modal.
      currentUser = null;
      console.info('Neon Auth session chưa sẵn sàng:', error.message);
    }
    publishAuthState();
    return currentUser;
  }

  async function submitAuth(event) {
    event.preventDefault();
    const email = $('auth-email')?.value.trim();
    const password = $('auth-password')?.value || '';
    const name = $('auth-name')?.value.trim() || 'Đạo hữu';
    const submit = $('btn-auth-submit');

    if (!email || !password) {
      setStatus('Vui lòng nhập email và mật khẩu.', 'error');
      return;
    }
    if (authMode === 'signup' && password.length < 8) {
      setStatus('Mật khẩu cần ít nhất 8 ký tự.', 'error');
      return;
    }

    if (submit) {
      submit.disabled = true;
      submit.textContent = authMode === 'signup' ? 'Đang lập đạo...' : 'Đang đăng nhập...';
    }
    setStatus('Đang kết nối Neon Auth...', 'loading');

    try {
      const path = authMode === 'signup' ? 'sign-up/email' : 'sign-in/email';
      const body = authMode === 'signup'
        ? { email, password, name }
        : { email, password, rememberMe: true };
      const payload = await authRequest(path, { method: 'POST', body });
      // Khi bật Verify at Sign-up, API có thể tạo user nhưng chưa tạo session.
      currentUser = payload?.session ? extractUser(payload) : await refreshSession();
      publishAuthState();

      if (!currentUser && authMode === 'signup') {
        pendingVerificationEmail = email;
        $('auth-verify-section')?.classList.remove('hidden');
        setStatus('Đăng ký thành công. Hãy xác minh email rồi đăng nhập.', 'success');
        return;
      }
      if (!currentUser) throw new Error('Đăng nhập thành công nhưng chưa nhận được session.');
      setStatus(authMode === 'signup' ? 'Tạo tài khoản thành công!' : 'Đăng nhập thành công!', 'success');
      setTimeout(closeModal, 700);
    } catch (error) {
      setStatus(getNetworkErrorMessage(error), 'error');
    } finally {
      if (submit) {
        submit.disabled = false;
        submit.textContent = authMode === 'signup' ? 'Tạo tài khoản' : 'Đăng nhập';
      }
    }
  }

  async function verifyEmail() {
    const email = pendingVerificationEmail || $('auth-email')?.value.trim();
    const otp = $('auth-otp')?.value.trim();
    if (!email || !otp) {
      setStatus('Vui lòng nhập mã xác minh.', 'error');
      return;
    }

    const button = $('btn-auth-verify');
    if (button) button.disabled = true;
    setStatus('Đang xác minh email...', 'loading');
    try {
      await authRequest('email-otp/verify-email', {
        method: 'POST',
        body: { email, otp }
      });
      setMode('signin');
      $('auth-verify-section')?.classList.add('hidden');
      if ($('auth-email')) $('auth-email').value = email;
      if ($('auth-password')) $('auth-password').value = '';
      setStatus('Xác minh thành công. Bạn có thể đăng nhập.', 'success');
      $('auth-password')?.focus();
    } catch (error) {
      setStatus(error.message || 'Mã xác minh không hợp lệ.', 'error');
    } finally {
      if (button) button.disabled = false;
    }
  }

  async function signOut() {
    const button = $('btn-auth-signout');
    if (button) button.disabled = true;
    try {
      await authRequest('sign-out', { method: 'POST' });
      currentUser = null;
      publishAuthState();
      setMode('signin');
      setStatus('Đã đăng xuất.', 'success');
    } catch (error) {
      const status = $('auth-session-status');
      if (status) status.textContent = error.message || 'Đăng xuất thất bại.';
    } finally {
      if (button) button.disabled = false;
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    $('btn-account')?.addEventListener('click', openModal);
    $('btn-auth-close')?.addEventListener('click', closeModal);
    $('btn-auth-signin-mode')?.addEventListener('click', () => setMode('signin'));
    $('btn-auth-signup-mode')?.addEventListener('click', () => setMode('signup'));
    $('auth-form')?.addEventListener('submit', submitAuth);
    $('btn-auth-verify')?.addEventListener('click', verifyEmail);
    $('btn-auth-signout')?.addEventListener('click', signOut);
    $('auth-modal')?.addEventListener('click', event => {
      if (event.target.id === 'auth-modal') closeModal();
    });
    setMode('signin');
    refreshSession();
  });

  window.neonAuth = {
    getUser: () => currentUser,
    refreshSession,
    open: openModal,
    close: closeModal,
    signOut
  };
})();
