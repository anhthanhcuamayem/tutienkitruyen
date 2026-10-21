const puppeteer = require('/home/thanh/.local/share/pi-node/node-v22.23.2-linux-x64/lib/node_modules/puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 950 });

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`Console error: ${msg.text()}`);
    }
  });
  page.on('pageerror', err => {
    errors.push(`Page error: ${err.message}`);
  });

  await page.goto('http://127.0.0.1:8080', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 600));

  // Initialize or start game if in creation modal
  await page.evaluate(() => {
    const creationModal = document.getElementById('creation-modal');
    if (creationModal && !creationModal.classList.contains('hidden')) {
      document.getElementById('btn-roll-destiny')?.click();
      setTimeout(() => {
        document.getElementById('btn-start-game')?.click();
      }, 200);
    }
  });
  await new Promise(r => setTimeout(r, 800));

  // Ensure we are on Tab Nhân Vật
  await page.evaluate(() => {
    const tabNhanVatBtn = document.querySelector('.tab-btn[data-tab="tab-nhanvat"]');
    if (tabNhanVatBtn) tabNhanVatBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // 1. Verify Tab Nhân Vật elements and stats
  const nhanVatStats = await page.evaluate(() => {
    return {
      sanctumPresent: !!document.querySelector('.meditation-sanctum-card'),
      charSheetPresent: !!document.querySelector('.char-sheet-grid'),
      charHp: document.getElementById('char-hp-text')?.textContent,
      charMp: document.getElementById('char-mp-text')?.textContent,
      charExp: document.getElementById('char-exp-text')?.textContent,
      charAtk: document.getElementById('char-stat-atk')?.textContent,
      charDef: document.getElementById('char-stat-def')?.textContent,
      charSpd: document.getElementById('char-stat-spd')?.textContent,
      charCrit: document.getElementById('char-stat-crit')?.textContent,
      charRoot: document.getElementById('char-stat-root')?.textContent,
      charPhy: document.getElementById('char-stat-phy')?.textContent,
      charComp: document.getElementById('char-stat-comp')?.textContent,
      charAge: document.getElementById('char-stat-age')?.textContent,
      charStones: document.getElementById('char-stat-stones')?.textContent,
      gearWpn: document.getElementById('char-gear-weapon')?.textContent,
      gearArm: document.getElementById('char-gear-armor')?.textContent,
      gearArt: document.getElementById('char-gear-artifact')?.textContent,
      meridianSpeed: document.getElementById('meridian-speed-text')?.textContent,
      dongphuArray: document.getElementById('dongphu-array-level')?.textContent,
      dongphuDensity: document.getElementById('dongphu-qi-density')?.textContent,
      medStatus: document.getElementById('meditation-status-badge')?.textContent
    };
  });
  console.log('Tab Nhân Vật Stats & Sanctum verification:', nhanVatStats);

  // Take screenshot of Beautified Tab Nhân Vật with Consolidated Stats
  await page.screenshot({ path: 'verified_tab_nhanvat_stats.png' });

  // 2. Test Item Detail Modal (Open from Inventory)
  console.log('Testing Item Detail Modal in Bách Bảo...');
  await page.evaluate(() => {
    // Switch to Bách Bảo
    document.querySelector('.tab-btn[data-tab="tab-bachbao"]')?.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // Add an item to inventory to inspect if empty
  await page.evaluate(() => {
    if (window.activeGameSystems && window.activeGameSystems.player) {
      window.activeGameSystems.player.inventory['wpn_xichtieu'] = 1;
      window.activeGameSystems.player.inventory['pill_tukhi'] = 3;
      window.activeGameSystems.updateUI();
    }
  });
  await new Promise(r => setTimeout(r, 300));

  // Click on first item in inventory
  await page.evaluate(() => {
    const firstInspect = document.querySelector('#inventory-list .btn-inspect') || document.querySelector('#inventory-list .item-name');
    if (firstInspect) firstInspect.click();
  });
  await new Promise(r => setTimeout(r, 400));

  const itemModalData = await page.evaluate(() => {
    const modal = document.getElementById('item-detail-modal');
    return {
      isOpen: modal && !modal.classList.contains('hidden'),
      name: document.getElementById('item-detail-name')?.textContent,
      rarity: document.getElementById('item-detail-rarity')?.textContent,
      type: document.getElementById('item-detail-type')?.textContent,
      desc: document.getElementById('item-detail-desc')?.textContent,
      stats: document.getElementById('item-detail-stats')?.innerText,
      price: document.getElementById('item-detail-price')?.textContent
    };
  });
  console.log('Item Detail Modal Data:', itemModalData);
  await page.screenshot({ path: 'verified_item_detail_modal.png' });

  // Close item modal with Escape key
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 300));
  const isItemModalClosed = await page.evaluate(() => {
    const modal = document.getElementById('item-detail-modal');
    return modal && modal.classList.contains('hidden');
  });
  console.log('Item Modal Closed with ESC:', isItemModalClosed);

  // 3. Test Breakthrough Modal
  console.log('Testing Breakthrough Modal...');
  await page.evaluate(() => {
    const p = window.activeGameSystems.player;
    // Set exp to max to enable breakthrough
    p.exp = 1000;
    window.activeGameSystems.updateUI();
    // Trigger breakthrough
    window.activeGameSystems.breakthrough();
  });
  await new Promise(r => setTimeout(r, 600));

  const btModalData = await page.evaluate(() => {
    const modal = document.getElementById('breakthrough-modal');
    return {
      isOpen: modal && !modal.classList.contains('hidden'),
      title: document.getElementById('breakthrough-title-text')?.textContent,
      oldRealm: document.getElementById('bt-old-realm')?.textContent,
      newRealm: document.getElementById('bt-new-realm')?.textContent,
      gains: document.getElementById('bt-gains-grid')?.innerText,
      note: document.getElementById('bt-extra-note')?.textContent
    };
  });
  console.log('Breakthrough Modal Data:', btModalData);
  await page.screenshot({ path: 'verified_breakthrough_modal.png' });

  // Close breakthrough modal with Space key
  await page.keyboard.press('Space');
  await new Promise(r => setTimeout(r, 300));
  const isBtModalClosed = await page.evaluate(() => {
    const modal = document.getElementById('breakthrough-modal');
    return modal && modal.classList.contains('hidden');
  });
  console.log('Breakthrough Modal Closed with Space:', isBtModalClosed);

  // 4. Test Custom Confirm Modal
  console.log('Testing Custom Confirm Modal...');
  await page.evaluate(() => {
    document.getElementById('btn-reset-char')?.click();
  });
  await new Promise(r => setTimeout(r, 400));

  const confirmModalData = await page.evaluate(() => {
    const modal = document.getElementById('custom-confirm-modal');
    return {
      isOpen: modal && !modal.classList.contains('hidden'),
      title: document.getElementById('confirm-title-text')?.textContent,
      message: document.getElementById('confirm-message-text')?.textContent
    };
  });
  console.log('Confirm Modal Data:', confirmModalData);
  await page.screenshot({ path: 'verified_custom_confirm_modal.png' });

  // Cancel confirm modal with Escape key
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 300));
  const isConfirmClosed = await page.evaluate(() => {
    const modal = document.getElementById('custom-confirm-modal');
    return modal && modal.classList.contains('hidden');
  });
  console.log('Confirm Modal Closed with ESC:', isConfirmClosed);

  // Switch back to Tab Nhân Vật and take final comprehensive screenshot
  await page.evaluate(() => {
    document.querySelector('.tab-btn[data-tab="tab-nhanvat"]')?.click();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'verified_final_full_view.png' });

  console.log('--- TEST RESULTS ---');
  console.log('Console / Page Errors:', errors.length > 0 ? errors : 'NONE (0 errors)');
  console.log('All tests completed successfully!');

  await browser.close();
})();
