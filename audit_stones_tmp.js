const assert = require('assert');

global.window = global;
const dummyEl = (id) => ({
  id,
  classList: { contains: () => false, add: () => {}, remove: () => {}, toggle: () => {} },
  addEventListener: () => {}, style: {}, appendChild: () => {},
  querySelectorAll: () => [], querySelector: () => null,
  innerHTML: '', textContent: '', value: '0', disabled: false
});
global.document = {
  activeElement: null,
  addEventListener: () => {}, removeEventListener: () => {},
  getElementById: dummyEl,
  createElement: () => dummyEl('x'),
  querySelector: () => null, querySelectorAll: () => [],
  body: { classList: { contains: () => false, add: () => {}, remove: () => {}, toggle: () => {} } }
};
global.localStorage = { _store: {}, getItem(k) { return this._store[k] || null; }, setItem(k, v) { this._store[k] = String(v); }, removeItem(k) { delete this._store[k]; }, clear() { this._store = {}; } };
global.requestAnimationFrame = (fn) => setTimeout(fn, 16);
global.cancelAnimationFrame = (id) => clearTimeout(id);
global.confirm = () => true;

const { GameSystems, ITEMS, Monsters } = require('./game.js');
const log = [];
const renderer = {
  addFloatingText: () => {},
  triggerShake: () => {},
  setScene: () => {},
  spawnSmokeParticles: () => {},
  setStatusText: () => {},
  checkVisibilityAndResume: () => {}
};
const systems = new GameSystems(renderer, (m) => log.push(m));
systems.setupLifecycleListeners = () => {};
systems.startLoops = () => {};
systems.saveToLocalStorage = () => {};
systems.updateUI = () => {};
systems.renderMarketUI = () => {};
systems.renderOpenWorldUI = () => {};
systems.renderSectUI = () => {};
systems.recalculatePlayerStats = () => {};

function player(stones = 500) {
  return {
    name: 'Test', age: 18, maxLifespan: 100, month: 1, realmIndex: 0, exp: 0,
    curHp: 500, maxHp: 500, curMp: 100, maxMp: 100,
    totalAtk: 50, totalDef: 30, totalSpd: 20, totalCrit: 0.05,
    comprehension: 100, spiritStones: stones, inventory: {}, inventoryQuality: {},
    worldLocation: 'region_1', worldGridPosition: { x: 0, y: 0 },
    worldRelations: {}, worldAlliances: [], worldMetTravelers: [],
    equippedWeapon: null, equippedArmor: null, equippedArtifact: null,
    skillLevels: {}, knownSkills: [], skills: [],
    sectContrib: 0, sectContribTotal: 0, sectManualsBought: [], sectQuestKills: {}, sectPatrolKills: 0
  };
}

function run(name, fn) {
  try { fn(); console.log('OK  ', name); }
  catch (e) { console.log('FAIL', name, '::', e.message); }
}

// 1. Market buy/sell roundtrip
run('market buy/sell', () => {
  systems.player = player(100);
  systems.refreshMarket();
  assert.strictEqual(systems.marketItems.length, 6);
  const it = systems.marketItems[0];
  const before = systems.player.spiritStones;
  systems.buyItem(it.id);
  assert.strictEqual(systems.player.spiritStones, before - it.price);
  assert.strictEqual(systems.player.inventory[it.id], 1);
  const sellBefore = systems.player.spiritStones;
  systems.sellItem(it.id);
  assert.strictEqual(systems.player.spiritStones, sellBefore + Math.max(1, Math.floor(ITEMS[it.id].price * 0.5)));
});

// 2. Cannot buy with insufficient stones
run('market insufficient blocks', () => {
  systems.player = player(0);
  systems.refreshMarket();
  const it = systems.marketItems[0];
  systems.buyItem(it.id);
  assert.strictEqual(systems.player.spiritStones, 0);
  assert.strictEqual(systems.player.inventory[it.id] || 0, 0);
});

// 3. Refining from inventory: stones deducted once
run('refine stones', () => {
  systems.player = player(2000);
  systems.player.inventory.ore_huyenthiet = 10;
  systems.player.inventory.wpn_thanhphong = 1;
  const rnd = Math.random;
  Math.random = () => 0; // always success
  systems.refineEquipment('wpn_thanhphong', 'inventory');
  Math.random = rnd;
  assert.strictEqual(systems.player.spiritStones, 1800);
  assert.strictEqual(systems.player.equippedWeapon.refineLevel, 1);
});

// 4. Refining a second copy loses the first copy's refine investment
run('refine two copies preserves both?', () => {
  systems.player = player(10000);
  systems.player.inventory.ore_huyenthiet = 100;
  systems.player.inventory.wpn_thanhphong = 2;
  const rnd = Math.random;
  Math.random = () => 0;
  systems.refineEquipment('wpn_thanhphong', 'inventory'); // +1 equipped, 1 left in bag
  const equippedLvl1 = systems.player.equippedWeapon.refineLevel;
  systems.refineEquipment('wpn_thanhphong', 'inventory'); // refine the second base copy
  Math.random = rnd;
  const stillTwo = (systems.player.inventory.wpn_thanhphong || 0) + (systems.player.equippedWeapon ? 1 : 0);
  console.log('      after 2 refines: equipped +' + systems.player.equippedWeapon.refineLevel +
    ', bag copy count ' + (systems.player.inventory.wpn_thanhphong || 0) +
    ', total weapons ' + stillTwo + ', stones ' + systems.player.spiritStones);
  assert.strictEqual(equippedLvl1, 1);
  // The un-equipped +1 is now just a bag count; re-equipping it will lose the refine.
  systems.unequipItem('weapon');
  const bagItem = systems.player.equippedWeapon;
  assert.strictEqual(bagItem, null);
  // equip from bag via useInventoryItem
  systems.useInventoryItem('wpn_thanhphong');
  console.log('      re-equipped bag weapon refine = +' + (systems.player.equippedWeapon.refineLevel || 0));
});

// 5. Defeat 10% loss
run('defeat loss', () => {
  systems.player = player(105);
  systems.monster = { name: 'X', hp: 1, atk: 1 };
  systems.monsterCombat = { curHp: 1 };
  systems.playerCombat = { curHp: 0 };
  systems.showResultModal = () => {};
  systems.handleDefeat();
  assert.strictEqual(systems.player.spiritStones, 94);
});

// 6. Dungeon treasure cannot be looted twice
run('dungeon treasure once', () => {
  systems.player = player(0);
  systems.startDungeon('region_1');
  const node = systems.player.dungeonState.nodes.find(n => n.type === 'treasure');
  systems.enterDungeonNode(node.id);
  const afterFirst = systems.player.spiritStones;
  systems.enterDungeonNode(node.id);
  assert.strictEqual(systems.player.spiritStones, afterFirst);
});

// 7. Sect quest cost/reward
run('sect quest flow', () => {
  systems.player = player(1000);
  systems.player.sectId = 'sect_thanhvan';
  systems.player.sectContribTotal = 0;
  systems.player.inventory.herb_linhchi = 3;
  systems.completeSectQuest('quest_herb');
  assert.strictEqual(systems.player.inventory.herb_linhchi, 0);
  assert.strictEqual(systems.player.spiritStones, 1030);
});

// 8. Salary twice
run('salary once per year', () => {
  systems.player = player(0);
  systems.player.sectId = 'sect_thanhvan';
  systems.player.sectSalaryClaimedYear = -1;
  systems.claimSectSalary();
  const first = systems.player.spiritStones;
  systems.claimSectSalary();
  assert.strictEqual(systems.player.spiritStones, first);
});

// 9. Save/load preserves stones
run('save/load stones', () => {
  systems.player = player(4321);
  systems.marketItems = [];
  systems.saveToLocalStorage();
  const systems2 = new GameSystems(renderer, () => {});
  systems2.updateUI = () => {};
  systems2.startLoops = () => {};
  systems2.renderMarketUI = () => {};
  systems2.renderOpenWorldUI = () => {};
  systems2.renderSectUI = () => {};
  systems2.recalculatePlayerStats = () => {};
  const ok = systems2.loadFromLocalStorage();
  assert.strictEqual(ok, true);
  assert.strictEqual(systems2.player.spiritStones, 4321);
});

// 10. double_loot perk consistency across stone sources
run('double_loot applies to every stone source', () => {
  const mk = () => {
    const s = new GameSystems(renderer, () => {});
    s.updateUI = () => {}; s.startLoops = () => {}; s.recalculatePlayerStats = () => {};
    s.player = player(0);
    s.player.cheatPerk = { id: 'double_loot' };
    return s;
  };
  // gathering: bonus stones are random 20-69, so compare many trials
  const assertRange = (label, low, high, fn) => {
    for (let i = 0; i < 30; i++) {
      const s = mk();
      s.player.curMp = 1000;
      s.player.maxMp = 1000;
      s.player.spiritStones = 0;
      fn(s);
      const v = s.player.spiritStones;
      if (v !== 0 && (v < low * 2 || v > high * 2)) {
        console.log(`      ${label} with double_loot = ${v} (expected range x2: ${low * 2}-${high * 2})`);
      }
    }
  };
  assertRange('gather bonus', 20, 69, (s) => { s.gatherRegionalResources(); });
  // chest
  const s = mk();
  s.player.inventory.chest_bi_canh = 1;
  s.useInventoryItem('chest_bi_canh');
  console.log('      chest_bi_canh with double_loot gave', s.player.spiritStones, '(base 300-800)');
});

// 11. Socialize after save/load with reward flag
run('socialize reward once', () => {
  systems.player = player(0);
  systems.player.worldEncounterRewardClaimed = false;
  systems.worldEncounter = { id: 'traveler_linh_nhi', name: 'Linh Nhi', realmIndex: 2 };
  systems.socializeWorldTraveler();
  const v = systems.player.spiritStones;
  systems.socializeWorldTraveler();
  assert.strictEqual(systems.player.spiritStones, v);
});

console.log('\nLast logs:', log.slice(-2));

console.log('\n--- extra ---');
run('market buy with enough stones deducts once', () => {
  systems.player = player(100000);
  systems.refreshMarket();
  const it = systems.marketItems[0];
  const before = systems.player.spiritStones;
  systems.buyItem(it.id);
  assert.strictEqual(systems.player.spiritStones, before - it.price);
  assert.strictEqual(systems.player.inventory[it.id], 1);
  assert.strictEqual(it.stock, 0);
});

run('selling refined gear ignores refinement', () => {
  systems.player = player(100000);
  systems.player.inventory.ore_huyenthiet = 100;
  systems.player.inventory.wpn_thanhphong = 1;
  const rnd = Math.random; Math.random = () => 0;
  systems.refineEquipment('wpn_thanhphong', 'inventory'); // +1 equipped
  Math.random = rnd;
  systems.unequipItem('weapon'); // now bag has 1 base wpn (refine lost)
  const before = systems.player.spiritStones;
  systems.sellItem('wpn_thanhphong');
  console.log('      sold refined(now base) for', systems.player.spiritStones - before);
});

run('sect switch refunds salary same year', () => {
  systems.player = player(0);
  systems.player.sectId = 'sect_thanhvan';
  systems.player.sectSalaryClaimedYear = -1;
  systems.claimSectSalary();
  const first = systems.player.spiritStones;
  systems.joinSect('sect_dandinh');
  systems.claimSectSalary();
  const second = systems.player.spiritStones;
  console.log('      salary claims same year:', first, '->', second);
  assert.notStrictEqual(first, second);
});

run('free dungeon reroll', () => {
  systems.player = player(0);
  let total = 0;
  for (let i = 0; i < 20; i++) {
    systems.startDungeon('region_1');
    const node = systems.player.dungeonState.nodes.find(n => n.type === 'treasure');
    const before = systems.player.spiritStones;
    systems.enterDungeonNode(node.id);
    total += systems.player.spiritStones - before;
  }
  console.log('      20 free rerolls of floor-1 treasure gave', total, 'stones');
});

run('elder guard MP->stone loop', () => {
  systems.player = player(0);
  systems.player.sectId = 'sect_thanhvan';
  systems.player.sectContribTotal = 6000;
  systems.player.curMp = 100000;
  systems.completeSectQuest('quest_elder_guard');
  systems.completeSectQuest('quest_elder_guard');
  console.log('      two elder-guard turn-ins:', systems.player.spiritStones, 'stones, MP left', systems.player.curMp);
  assert.strictEqual(systems.player.spiritStones, 1100);
});
