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
  await new Promise(r => setTimeout(r, 800));

  // Initialize or start game
  await page.evaluate(() => {
    if (!window.activeGameSystems || !window.activeGameSystems.player) {
      document.getElementById('btn-roll-destiny')?.click();
      document.getElementById('btn-start-game')?.click();
    }
  });
  await new Promise(r => setTimeout(r, 800));

  // 1. Test Sect Joining and Contribution
  console.log('Testing Sect...');
  await page.evaluate(() => {
    switchTab('tab-sect');
    const firstSectBtn = document.querySelector('#sect-options-list .selectable-card button');
    if (firstSectBtn) firstSectBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // Give resources to test quest completion
  await page.evaluate(() => {
    const p = window.activeGameSystems.player;
    p.inventory.herb_linhchi = 10;
    p.inventory.ore_huyenthiet = 10;
    p.spiritStones = 5000;
    window.activeGameSystems.updateUI();
  });
  await new Promise(r => setTimeout(r, 400));

  // Click submit quest
  await page.evaluate(() => {
    const btn = document.querySelector('#sect-quest-list .btn-submit:not([disabled])');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  const sectRank = await page.$eval('#sect-rank-display', el => el.textContent);
  const sectContrib = await page.$eval('#sect-contrib-display', el => el.textContent);
  console.log(`Current Sect Rank: ${sectRank}, Contrib: ${sectContrib}`);

  // Test buying manual without rank demotion
  console.log('Testing manual purchase with 2500 contrib...');
  await page.evaluate(() => {
    const p = window.activeGameSystems.player;
    p.sectContrib = 2500;
    p.sectContribTotal = 2500;
    window.activeGameSystems.checkSectPromotion();
    window.activeGameSystems.updateUI();
  });
  await new Promise(r => setTimeout(r, 400));

  const rankBeforeBuy = await page.$eval('#sect-rank-display', el => el.textContent);
  console.log(`Rank before buying manual: ${rankBeforeBuy}`);

  // Buy first manual
  await page.evaluate(() => {
    const btn = document.querySelector('#sect-manual-list .btn-buy-manual:not([disabled])');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  const rankAfterBuy = await page.$eval('#sect-rank-display', el => el.textContent);
  const contribAfterBuy = await page.$eval('#sect-contrib-display', el => el.textContent);
  console.log(`Rank after buying manual: ${rankAfterBuy}, Remaining spendable contrib: ${contribAfterBuy}`);

  if (rankBeforeBuy !== rankAfterBuy) {
    errors.push(`Rank demotion bug detected: was ${rankBeforeBuy} now ${rankAfterBuy}`);
  } else {
    console.log('SUCCESS: Rank remained unchanged after spending contribution!');
  }

  await page.screenshot({ path: 'sect_upgraded_verified.png' });
  console.log('Saved sect_upgraded_verified.png');

  // 2. Test Combat State Transition
  console.log('Testing Combat State Transition...');
  await page.evaluate(() => {
    const mon = {
      id: 'test_wolf',
      name: 'U Minh Ma Lang Vương',
      spriteKey: 'monsterWolf',
      hp: 500,
      mp: 100,
      atk: 25,
      def: 15,
      spd: 30,
      exp: 80,
      stone: 50
    };
    window.activeGameSystems.combatEngine.startCombat(window.activeGameSystems.player, mon);
  });
  await new Promise(r => setTimeout(r, 800));

  const isCombatMode = await page.$eval('body', el => el.classList.contains('combat-active-mode'));
  const isHeaderVisible = await page.$eval('#combat-active-header', el => !el.classList.contains('hidden'));
  const playerHpText = await page.$eval('#combat-player-hp-text', el => el.textContent);
  const monsterHpText = await page.$eval('#combat-monster-hp-text', el => el.textContent);
  const turnText = await page.$eval('#combat-turn-text', el => el.textContent);

  console.log(`In Combat Mode: ${isCombatMode}`);
  console.log(`Combat Active Banner Visible: ${isHeaderVisible}`);
  console.log(`Player HP HUD: ${playerHpText}`);
  console.log(`Monster HP HUD: ${monsterHpText}`);
  console.log(`Turn Status: ${turnText}`);

  await page.screenshot({ path: 'combat_mode_verified.png' });
  console.log('Saved combat_mode_verified.png');

  // Test attacking with keypress 1
  console.log('Waiting for player turn and testing keypress [1]...');
  await new Promise(r => setTimeout(r, 1200));
  await page.keyboard.press('1');
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: 'combat_action_verified.png' });
  console.log('Saved combat_action_verified.png');

  console.log('Total console/page errors:', errors.length);
  if (errors.length > 0) {
    console.error('Errors:', errors);
  }

  await browser.close();
})();
