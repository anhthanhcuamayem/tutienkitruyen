const puppeteer = require('/home/thanh/.local/share/pi-node/node-v22.23.2-linux-x64/lib/node_modules/puppeteer-core');
const path = require('path');

const ARTIFACT_DIR = '/home/thanh/.gemini/antigravity/brain/80a1b426-15f2-4c4e-9378-059b1058e969';

async function run() {
  console.log('Launching browser for visual verification...');
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.error('BROWSER ERROR:', err));

  console.log('Navigating to http://127.0.0.1:8080/index.html...');
  await page.goto('http://127.0.0.1:8080/index.html', { waitUntil: 'networkidle2' });

  // 1. Setup rich test player data with companions, items, gear
  const isCreationModal = await page.evaluate(() => {
    const modal = document.getElementById('creation-modal');
    return modal && !modal.classList.contains('hidden');
  });

  if (isCreationModal) {
    console.log('Completing character creation...');
    await page.click('#btn-roll-destiny');
    await new Promise(r => setTimeout(r, 200));
    await page.evaluate(() => {
      const firstPath = document.querySelector('#paths-container .path-card');
      if (firstPath) firstPath.click();
      const firstCore = document.querySelector('#cheat-cores-container .cheat-card');
      if (firstCore) firstCore.click();
      const firstPerk = document.querySelector('#cheat-perks-container .cheat-card');
      if (firstPerk) firstPerk.click();
    });
    await page.click('#btn-start-game');
    await new Promise(r => setTimeout(r, 600));
  }

  await page.evaluate(() => {
    const sys = window.activeGameSystems;
    if (!sys || !sys.player) return;
    const p = sys.player;
    p.curMp = 200;
    p.maxMp = 200;
    p.spiritStones = 5000;
    p.inventory = {
      herb_linhchi: 10,
      herb_thanh_u: 5,
      herb_hoaviem: 4,
      herb_longhuyet: 3,
      herb_cuuchuyen: 2,
      herb_thienkiem: 2,
      ore_huyenthiet: 20,
      ore_tutinh: 10,
      pill_hoixuan: 5,
      pill_quy_nguyen: 3,
      talisman_dan_loi: 4,
      talisman_bang_phong: 3,
      talisman_an_than: 2,
      talisman_thien_nhan: 2,
      talisman_don_dia: 3,
      map_tang_bao: 3,
      tome_cong_phap_tan_thien: 2,
      pet_linh_thu_noan: 2,
      wpn_thanhphong: 1,
      wpn_xichtieu: 1,
      arm_tinhvan: 1,
      arm_longlan: 1,
      art_guong: 1,
      art_chuoi: 1
    };

    // Equip gear
    p.equippedWeapon = window.ITEMS ? window.ITEMS['wpn_thanhphong'] : null;
    p.equippedArmor = window.ITEMS ? window.ITEMS['arm_longlan'] : null;
    p.equippedArtifact = window.ITEMS ? window.ITEMS['art_chuoi'] : null;

    // Hatch companion
    sys.useInventoryItem('pet_linh_thu_noan');

    sys.recalculatePlayerStats();
    sys.updateUI();
  });

  await new Promise(r => setTimeout(r, 600));

  // Screenshot 1: Tab Nhân Vật with hatched companion beside the lotus throne and in stats
  console.log('Capturing verified_pet_companion_meditate.png...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_pet_companion_meditate.png') });

  // Screenshot 2: Switch to Bách Bảo -> Inventory with icons and refine badges
  await page.evaluate(() => {
    window.switchTab('tab-inventory');
  });
  await new Promise(r => setTimeout(r, 400));
  console.log('Capturing verified_inventory_with_icons.png...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_inventory_with_icons.png') });

  // Screenshot 3: Open Item Detail Modal for weapon with Refine button
  await page.evaluate(() => {
    window.activeGameSystems.showItemDetail('wpn_thanhphong', 'inventory');
  });
  await new Promise(r => setTimeout(r, 400));
  console.log('Capturing verified_item_detail_refine.png...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_item_detail_refine.png') });

  // Click Refine button to test in-game refinement!
  await page.evaluate(() => {
    const btnRefine = document.getElementById('btn-item-action-refine');
    if (btnRefine) btnRefine.click();
  });
  await new Promise(r => setTimeout(r, 400));

  // Screenshot 4: Close modal, switch to Compendium to see traits and icons
  await page.evaluate(() => {
    const closeBtn = document.getElementById('btn-close-item-detail');
    if (closeBtn) closeBtn.click();
    window.switchTab('tab-compendium');
  });
  await new Promise(r => setTimeout(r, 400));
  console.log('Capturing verified_compendium_traits_icons.png...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_compendium_traits_icons.png') });

  // Screenshot 5: Combat screen with Combat Talisman & Item Picker
  await page.evaluate(() => {
    const dummyMon = {
      id: 'wolf_novice',
      name: 'U Minh Yêu Lang',
      hp: 1200,
      mp: 100,
      atk: 45,
      def: 25,
      spd: 18,
      spriteKey: 'monsterWolf'
    };
    window.activeCombatEngine.startCombat(window.activeGameSystems.player, dummyMon);
    window.activeCombatEngine.isPlayerTurn = true;
    window.activeCombatEngine.isProcessingTurn = false;
    window.activeCombatEngine.updateCombatButtons(true);
    const btnTalisman = document.getElementById('btn-combat-talisman');
    if (btnTalisman) btnTalisman.click();
  });
  await new Promise(r => setTimeout(r, 500));
  console.log('Capturing verified_combat_talisman_picker.png...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_combat_talisman_picker.png') });

  // Screenshot 6: Mobile view verification (390x844)
  await page.setViewport({ width: 390, height: 844, isMobile: true });
  await page.evaluate(() => {
    window.switchTab('tab-nhanvat');
  });
  await new Promise(r => setTimeout(r, 500));
  console.log('Capturing verified_mobile_pet_meditation.png...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_mobile_pet_meditation.png') });

  await page.evaluate(() => {
    window.switchTab('tab-inventory');
  });
  await new Promise(r => setTimeout(r, 400));
  console.log('Capturing verified_mobile_inventory_icons.png...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_mobile_inventory_icons.png') });

  await browser.close();
  console.log('Visual verification complete!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
