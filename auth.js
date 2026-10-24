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
    if (accountLabel) accountLabel.textContent = currentUser ? (currentUser.name || 'Đạo Hữu') : 'Đăng nhập';
    if (accountIcon) accountIcon.textContent = currentUser ? '✅' : '👤';
    if (accountButton) accountButton.title = currentUser ? `Tài khoản: ${currentUser.name || currentUser.email}` : 'Đăng nhập tài khoản';

    const loggedOut = $('auth-logged-out');
    const loggedIn = $('auth-logged-in');
    if (loggedOut) loggedOut.classList.toggle('hidden', Boolean(currentUser));
    if (loggedIn) loggedIn.classList.toggle('hidden', !currentUser);
    if (currentUser) {
      if ($('auth-user-name')) $('auth-user-name').textContent = currentUser.name || 'Đạo Hữu Vô Danh';
      if ($('auth-user-email')) $('auth-user-email').textContent = currentUser.email || '';
      if ($('auth-session-status')) $('auth-session-status').textContent = 'Session Neon Auth đang hoạt động bảo toàn dữ liệu.';

      const charSummary = $('auth-char-summary');
      if (charSummary) {
        const player = window.activeGameSystems?.player;
        if (player) {
          const realmName = player.realmTitle || (window.REALMS?.[player.realmIndex]?.name) || 'Luyện Khí Tầng 1';
          charSummary.innerHTML = `<strong>Bản Mệnh Hiện Tại:</strong> <span style="color: var(--text-gold); font-weight: bold;">${player.name}</span> &bull; <span>${realmName}</span> &bull; 🪙 ${player.spiritStones || 0} Linh Thạch`;
          charSummary.classList.remove('hidden');
        } else {
          charSummary.innerHTML = '<em>Chưa tạo nhân vật. Đạo hữu có thể bước vào Tiên Đồ để khởi tạo bản mệnh.</em>';
          charSummary.classList.remove('hidden');
        }
      }
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
    if (submit) submit.innerHTML = isSignup ? '📜 Khắc Tên Khởi Đạo' : '⛩️ Nhập Đạo Vào Tiên Giới';
    const password = $('auth-password');
    if (password) password.autocomplete = isSignup ? 'new-password' : 'current-password';
    $('auth-verify-section')?.classList.add('hidden');
    setStatus('');
  }

  function togglePasswordVisibility() {
    const pwdInput = $('auth-password');
    const pwdIcon = $('auth-pwd-icon');
    if (!pwdInput) return;
    const isPwd = pwdInput.type === 'password';
    pwdInput.type = isPwd ? 'text' : 'password';
    if (pwdIcon) pwdIcon.textContent = isPwd ? '🙈' : '👁️';
  }

  function playAsGuest() {
    document.body.classList.remove('auth-required');
    document.body.classList.add('guest-mode-active');
    closeModal();
    window.dispatchEvent(new CustomEvent('neon-auth-guest-play'));
  }

  function syncCloudSave() {
    if (window.activeGameSystems?.saveToLocalStorage) {
      window.activeGameSystems.saveToLocalStorage();
      const status = $('auth-session-status');
      if (status) {
        status.textContent = '✨ Tu vi đã được ghi vào thần thức và đồng bộ bảo hộ tài khoản!';
        status.className = 'auth-status-text success';
      }
    }
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
      setStatus('Mật khẩu cần ít nhất 8 ký tự hộ mệnh.', 'error');
      return;
    }

    if (submit) {
      submit.disabled = true;
      submit.innerHTML = authMode === 'signup' ? '⏳ Đang lập tiên tịch...' : '⏳ Đang nhập đạo...';
    }
    setStatus('Đang câu thông Thiên Đạo (Neon Auth)...', 'loading');

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
        setStatus('Đăng ký thành công. Hãy nhập mã xác minh trong email rồi đăng nhập.', 'success');
        return;
      }
      if (!currentUser) throw new Error('Đăng nhập thành công nhưng chưa nhận được session.');
      setStatus(authMode === 'signup' ? 'Tạo tiên tịch thành công!' : 'Nhập đạo thành công!', 'success');
      setTimeout(closeModal, 700);
    } catch (error) {
      setStatus(getNetworkErrorMessage(error), 'error');
    } finally {
      if (submit) {
        submit.disabled = false;
        submit.innerHTML = authMode === 'signup' ? '📜 Khắc Tên Khởi Đạo' : '⛩️ Nhập Đạo Vào Tiên Giới';
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
    setStatus('Đang xác minh thiên thư...', 'loading');
    try {
      await authRequest('email-otp/verify-email', {
        method: 'POST',
        body: { email, otp }
      });
      setMode('signin');
      $('auth-verify-section')?.classList.add('hidden');
      if ($('auth-email')) $('auth-email').value = email;
      if ($('auth-password')) $('auth-password').value = '';
      setStatus('Xác minh thành công! Đạo hữu có thể đăng nhập ngay.', 'success');
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
      setStatus('Đã tạm biệt Tiên Môn (Đăng xuất thành công).', 'success');
    } catch (error) {
      const status = $('auth-session-status');
      if (status) status.textContent = error.message || 'Đăng xuất thất bại.';
    } finally {
      if (button) button.disabled = false;
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    $('btn-account')?.addEventListener('click', openModal);
    $('btn-mobile-account')?.addEventListener('click', () => {
      $('mobile-menu-modal')?.classList.add('hidden');
      openModal();
    });
    $('btn-auth-close')?.addEventListener('click', () => {
      if (document.body.classList.contains('auth-required') && !window.activeGameSystems?.player) {
        playAsGuest();
      } else {
        closeModal();
      }
    });
    $('btn-auth-signin-mode')?.addEventListener('click', () => setMode('signin'));
    $('btn-auth-signup-mode')?.addEventListener('click', () => setMode('signup'));
    $('btn-auth-toggle-pwd')?.addEventListener('click', togglePasswordVisibility);
    $('btn-auth-guest')?.addEventListener('click', playAsGuest);
    $('btn-auth-sync-cloud')?.addEventListener('click', syncCloudSave);
    $('auth-form')?.addEventListener('submit', submitAuth);
    $('btn-auth-verify')?.addEventListener('click', verifyEmail);
    $('btn-auth-signout')?.addEventListener('click', signOut);
    $('auth-modal')?.addEventListener('click', event => {
      if (event.target.id === 'auth-modal') {
        if (document.body.classList.contains('auth-required') && !window.activeGameSystems?.player) {
          playAsGuest();
        } else {
          closeModal();
        }
      }
    });
    setMode('signin');
    refreshSession();
  });

  window.neonAuth = {
    getUser: () => currentUser,
    refreshSession,
    open: openModal,
    close: closeModal,
    playAsGuest,
    signOut
  };
})();
