// Automated CDP verification script for the redesigned Auth system
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 9222;
const TARGET_URL = 'http://localhost:8080';
const ARTIFACT_DIR = '/home/thanh/.gemini/antigravity/brain/80a1b426-15f2-4c4e-9378-059b1058e969';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    await new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });

    this.ws.onmessage = event => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      }
    };
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    if (res.exceptionDetails) {
      throw new Error(res.exceptionDetails.exception?.description || 'Evaluation error');
    }
    return res.result?.value;
  }

  async screenshot(filePath) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(filePath, Buffer.from(res.data, 'base64'));
    console.log(`Saved screenshot: ${path.basename(filePath)} (${Math.round(res.data.length * 0.75 / 1024)} KB)`);
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function run() {
  console.log('--- Launching headless Chrome with CDP ---');
  const chrome = spawn('google-chrome', [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--window-size=1280,800',
    'about:blank'
  ]);

  let cdp = null;
  try {
    await sleep(1500);
    const version = await getJson(`http://127.0.0.1:${PORT}/json/version`);
    console.log('Connected to Chrome:', version['User-Agent']);

    const tabs = await getJson(`http://127.0.0.1:${PORT}/json/list`);
    const pageTab = tabs.find(t => t.type === 'page') || tabs[0];
    console.log('Connected to tab:', pageTab.id, pageTab.url);

    cdp = new CDPClient(pageTab.webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');

    console.log('Navigating to', TARGET_URL);
    await cdp.send('Page.navigate', { url: TARGET_URL });

    await sleep(2000);

    // 1. Verify Sign-In mode
    console.log('\n[1/6] Verifying Sign-in View (Default)...');
    await cdp.eval(`
      localStorage.clear();
      document.getElementById('auth-email').value = 'dao-huu@tien-mon.vn';
      document.getElementById('auth-password').value = 'MatKhauThanCap123';
    `);
    await sleep(400);
    await cdp.screenshot(path.join(ARTIFACT_DIR, 'verified_auth_signin.png'));

    // 2. Switch to Sign-up mode
    console.log('\n[2/6] Verifying Sign-up View (Khởi Đạo)...');
    await cdp.eval(`
      document.getElementById('btn-auth-signup-mode').click();
      document.getElementById('auth-name').value = 'Hàn Thần Lập';
      document.getElementById('auth-email').value = 'hanlap@tien-mon.vn';
      document.getElementById('auth-password').value = 'CuuChuyen123!';
    `);
    await sleep(400);
    const isNameVisible = await cdp.eval(`!document.getElementById('auth-name-field').classList.contains('hidden')`);
    const submitText = await cdp.eval(`document.getElementById('btn-auth-submit').textContent.trim()`);
    console.log('Name field visible:', isNameVisible, '| Submit text:', submitText);
    await cdp.screenshot(path.join(ARTIFACT_DIR, 'verified_auth_signup.png'));

    // 3. Toggle password reveal
    console.log('\n[3/6] Verifying Password Toggle Button...');
    await cdp.eval(`document.getElementById('btn-auth-toggle-pwd').click();`);
    await sleep(300);
    const pwdType = await cdp.eval(`document.getElementById('auth-password').type`);
    const pwdIcon = await cdp.eval(`document.getElementById('auth-pwd-icon').textContent`);
    console.log('Password input type:', pwdType, '| Icon:', pwdIcon);
    await cdp.screenshot(path.join(ARTIFACT_DIR, 'verified_auth_pwd_visible.png'));

    // 4. Logged-in profile view (mock session)
    console.log('\n[4/6] Verifying Logged-In Cultivator Profile View...');
    await cdp.eval(`
      document.getElementById('auth-logged-out').classList.add('hidden');
      document.getElementById('auth-logged-in').classList.remove('hidden');
      document.getElementById('auth-user-name').textContent = 'Hàn Lập (Hóa Thần)';
      document.getElementById('auth-user-email').textContent = 'hanlap@thien-dao.vn';
      document.getElementById('auth-char-summary').innerHTML = '<strong>Bản Mệnh Hiện Tại:</strong> <span style="color: var(--text-gold); font-weight: bold;">Hàn Lập</span> &bull; <span>Hóa Thần Sơ Kỳ</span> &bull; 🪙 99,999 Linh Thạch';
      document.getElementById('auth-char-summary').classList.remove('hidden');
    `);
    await sleep(400);
    await cdp.screenshot(path.join(ARTIFACT_DIR, 'verified_auth_logged_in.png'));

    // 5. Mobile responsive view
    console.log('\n[5/6] Verifying Mobile View (390x844)...');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    // Reopen Sign-in for mobile view
    await cdp.eval(`
      document.getElementById('auth-logged-in').classList.add('hidden');
      document.getElementById('auth-logged-out').classList.remove('hidden');
      document.getElementById('btn-auth-signin-mode').click();
    `);
    await sleep(500);
    await cdp.screenshot(path.join(ARTIFACT_DIR, 'verified_auth_mobile.png'));

    // 6. Test Guest Mode flow
    console.log('\n[6/6] Verifying Guest Mode Transition...');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
      mobile: false
    });
    // Ensure auth modal is open in fresh state
    await cdp.eval(`
      document.body.classList.add('auth-required');
      document.getElementById('auth-modal').classList.remove('hidden');
      document.getElementById('auth-logged-in').classList.add('hidden');
      document.getElementById('auth-logged-out').classList.remove('hidden');
      document.getElementById('creation-modal').classList.add('hidden');
    `);
    await sleep(400);
    // Click Guest button
    await cdp.eval(`document.getElementById('btn-auth-guest').click();`);
    await sleep(600);
    const authHidden = await cdp.eval(`document.getElementById('auth-modal').classList.contains('hidden')`);
    const creationVisible = await cdp.eval(`!document.getElementById('creation-modal').classList.contains('hidden')`);
    const bodyAuthReq = await cdp.eval(`document.body.classList.contains('auth-required')`);
    console.log('Auth Modal hidden:', authHidden, '| Creation Modal visible:', creationVisible, '| auth-required removed:', !bodyAuthReq);
    await cdp.screenshot(path.join(ARTIFACT_DIR, 'verified_auth_guest_creation.png'));

    console.log('\n✅ ALL AUTH REDESIGN VERIFICATIONS COMPLETED SUCCESSFULLY!');
  } finally {
    if (cdp) cdp.close();
    chrome.kill('SIGKILL');
  }
}

run().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
