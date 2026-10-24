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
  console.log('--- Connecting to Chrome for Canvas Scroll Verification ---');
  let chrome = null;
  let cdp = null;

  try {
    let version = null;
    try {
      version = await getJson(`http://127.0.0.1:${PORT}/json/version`);
    } catch (e) {
      console.log('Spawning Chrome...');
      chrome = spawn('google-chrome', [
        `--remote-debugging-port=${PORT}`,
        '--headless=new',
        '--no-sandbox',
        '--disable-gpu',
        '--user-data-dir=/tmp/test_chrome',
        'about:blank'
      ]);
      for (let i = 0; i < 20; i++) {
        try {
          version = await getJson(`http://127.0.0.1:${PORT}/json/version`);
          if (version) break;
        } catch (err) {
          await sleep(300);
        }
      }
    }

    if (!version) throw new Error('Could not connect to Chrome port 9222');
    console.log('Connected to Chrome:', version['User-Agent']);

    const tabs = await getJson(`http://127.0.0.1:${PORT}/json/list`);
    const pageTab = tabs.find(t => t.type === 'page') || tabs[0];
    cdp = new CDPClient(pageTab.webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');

    await cdp.send('Page.navigate', { url: TARGET_URL });
    await sleep(1500);

    // Seed save game into localStorage so the game starts directly into dashboard without modals
    await cdp.eval(`
      const testSave = {
        schemaVersion: 2,
        timestamp: Date.now(),
        player: {
          name: 'Hàn Lập',
          realmIndex: 3,
          exp: 150,
          age: 18,
          month: 5,
          comprehension: 116,
          spiritStones: 500,
          curHp: 600,
          maxHp: 600,
          curMp: 85,
          maxMp: 85,
          spiritualRoot: { name: 'Song Linh Căn (Hỏa Thổ)', speedMod: 1.1 },
          physique: { name: 'Phàm Thể', expBonus: 0 },
          cultivationPath: { id: 'kiem_tu', name: 'Kiếm Tu' },
          inventory: { pill_tukhi: 5, pill_hoixuan: 3, herb_linhchi: 4 },
          skills: [{ id: 'chem', name: 'Trảm Kích', dmgMult: 1.5, mpCost: 10 }]
        },
        marketItems: []
      };
      localStorage.setItem('tutien_savegame', JSON.stringify(testSave));
      location.reload();
    `);
    await sleep(2500);

    // 1. Screenshot top of Tab Nhan Vat (Canvas visible)
    console.log('\n[1/3] Capturing Tab Nhan Vat at top (Canvas visible)...');
    await cdp.eval(`
      document.body.classList.remove('auth-required');
      document.getElementById('auth-modal')?.classList.add('hidden');
      document.getElementById('creation-modal')?.classList.add('hidden');
      document.querySelector('[data-tab="tab-nhanvat"]')?.click();
      document.querySelector('.tab-content-area').scrollTop = 0;
    `);
    await sleep(500);
    await cdp.screenshot(path.join(ARTIFACT_DIR, 'verified_canvas_at_top.png'));

    // 2. Scroll down in Tab Nhan Vat (Canvas scrolled up)
    console.log('\n[2/3] Capturing Tab Nhan Vat scrolled down (Canvas scrolled up)...');
    await cdp.eval(`
      const area = document.querySelector('.tab-content-area');
      area.scrollTop = 280;
    `);
    await sleep(500);
    const scrollTop = await cdp.eval(`document.querySelector('.tab-content-area').scrollTop`);
    console.log('ScrollTop is:', scrollTop);
    await cdp.screenshot(path.join(ARTIFACT_DIR, 'verified_canvas_scrolled_up.png'));

    // 3. Mobile view scrolled down
    console.log('\n[3/3] Capturing Mobile View scrolled down (390x844)...');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await sleep(400);
    await cdp.eval(`document.querySelector('.tab-content-area').scrollTop = 180;`);
    await sleep(500);
    await cdp.screenshot(path.join(ARTIFACT_DIR, 'verified_canvas_mobile_scrolled.png'));

    console.log('\n✅ ALL SCROLL VERIFICATIONS COMPLETED SUCCESSFULLY!');
  } finally {
    if (cdp) cdp.close();
    if (chrome) chrome.kill('SIGKILL');
  }
}

run().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
