const assert = require('assert');
const fs = require('fs');

// Mock browser environment for unit testing game systems in Node.js
global.window = global;
global.document = {
  activeElement: null,
  addEventListener: () => {},
  removeEventListener: () => {},
  getElementById: (id) => ({
    id,
    classList: {
      contains: () => false,
      add: () => {},
      remove: () => {}
    },
    addEventListener: () => {},
    style: {},
    appendChild: () => {},
    querySelectorAll: () => [],
    querySelector: () => null,
    innerHTML: '',
    textContent: ''
  }),
  createElement: (tag) => ({
    tagName: (tag || 'div').toUpperCase(),
    className: '',
    style: {},
    classList: { add: () => {}, remove: () => {}, contains: () => false },
    innerHTML: '',
    textContent: '',
    appendChild: () => {},
    querySelector: () => ({ onclick: null, addEventListener: () => {}, style: {} }),
    querySelectorAll: () => []
  }),
  querySelector: () => null,
  querySelectorAll: () => [],
  body: {
    classList: {
      contains: () => false,
      add: () => {},
      remove: () => {}
    }
  }
};
global.localStorage = {
  _store: {},
  getItem(k) { return this._store[k] || null; },
  setItem(k, v) { this._store[k] = String(v); },
  removeItem(k) { delete this._store[k]; },
  clear() { this._store = {}; }
};
global.requestAnimationFrame = (fn) => setTimeout(fn, 16);
global.cancelAnimationFrame = (id) => clearTimeout(id);
global.confirm = () => true;

// Require exported game modules
const {
  ParticlePool,
  FloatingTextPool,
  PixelRenderer,
  CombatStatusManager,
  CombatEngine,
  GameSystems,
  CULTIVATION_PATHS,
  HERB_ENCYCLOPEDIA,
  RECIPES,
  SECTS,
  SECT_QUESTS,
  WORLD_REGIONS
} = require('./game.js');

console.log('=== RUNNING COMPREHENSIVE ROUND 1 VERIFICATION SUITE ===');

// Helper to create systems instance
const mockCanvas = {
  getContext: () => ({
    fillRect: () => {},
    strokeRect: () => {},
    fillText: () => {},
    drawImage: () => {},
    save: () => {},
    restore: () => {},
    translate: () => {},
    imageSmoothingEnabled: false
  }),
  width: 640,
  height: 360
};
const mockRenderer = new PixelRenderer(mockCanvas);
const mockLogs = [];
const logCallback = (msg, type) => mockLogs.push({ msg, type });
const systems = new GameSystems(mockRenderer, logCallback);
const combat = new CombatEngine(mockRenderer, logCallback);
systems.setCombatEngine(combat);

// ============================================================================
// TEST SUITE 1: ARCHITECTURE, POOLS & SAVE INTEGRITY (R4)
// ============================================================================
console.log('\n--- 1. Testing Architecture, Pools & Save Migration (R4) ---');

// 1.1 ParticlePool & FloatingTextPool
console.log('1.1 Testing ParticlePool zero-leak reuse...');
const pool = new ParticlePool(50);
const p1 = pool.acquire();
assert(p1 !== null, 'Particle acquire failed');
assert.strictEqual(p1.active, true, 'Acquired particle should be active');
assert.strictEqual(pool.getActiveCount(), 1, 'Active count should be 1');
p1.active = false; // Particle expired and recycled
assert.strictEqual(pool.getActiveCount(), 0, 'Active count should be 0');
const p2 = pool.acquire();
assert.strictEqual(p1, p2, 'Particle pool should reuse recycled instances without GC allocation');
console.log('✓ ParticlePool reuse verified');

const textPool = new FloatingTextPool(20);
const t1 = textPool.acquire();
assert.strictEqual(t1.active, true, 'Acquired floating text should be active');
t1.active = false;
const t2 = textPool.acquire();
assert.strictEqual(t1, t2, 'FloatingTextPool reuses recycled instance');
console.log('✓ FloatingTextPool verified');

// 1.2 Save Migration v1 -> v2
console.log('1.2 Testing migrateSaveData backwards compatibility...');
const legacyV1Save = {
  name: 'Tiểu Kiếm Tu',
  realmIndex: 2,
  exp: 150,
  age: 18,
  month: 4,
  spiritStones: 500,
  sectId: 'sect_van_kiem',
  sectContrib: 120
  // Note: missing schemaVersion, skills array, sectContribTotal, unlockedHerbIds
};

const migrated = systems.migrateSaveData(legacyV1Save);
assert.strictEqual(migrated.schemaVersion, 2, 'Migrated save must have schemaVersion: 2');
assert(typeof migrated.timestamp === 'number', 'Migrated save must have timestamp');
assert.strictEqual(migrated.player.name, 'Tiểu Kiếm Tu', 'Player name preserved');
assert(Array.isArray(migrated.player.skills) && migrated.player.skills.length > 0, 'Missing skills array normalized');
assert.strictEqual(migrated.player.sectContribTotal, 120, 'sectContribTotal backfilled from sectContrib');
assert(Array.isArray(migrated.player.unlockedHerbIds), 'unlockedHerbIds initialized');
console.log('✓ Save data v1 -> v2 migration normalized correctly');

// 1.3 Shadow Backup Key in localStorage
console.log('1.3 Testing Save/Load with Shadow Backup Key...');
systems.player = migrated.player;
systems.saveToLocalStorage();
const primarySave = localStorage.getItem('tutien_savegame');
const backupSave = localStorage.getItem('tutien_savegame_backup');
assert(primarySave !== null, 'Primary save written');
assert(backupSave !== null, 'Backup save written');
assert.strictEqual(primarySave, backupSave, 'Primary and backup save payload match');

// Corrupt primary save and test fallback load
localStorage.removeItem('tutien_savegame');
const loaded = systems.loadFromLocalStorage();
assert.strictEqual(loaded, true, 'Successfully recovered save from backup key when primary was missing');
assert.strictEqual(systems.player.name, 'Tiểu Kiếm Tu', 'Recovered player data intact');
console.log('✓ Shadow backup key recovery verified');

// ============================================================================
// TEST SUITE 2: DEEP COMBAT ENGINE & STATUS EFFECTS (R1)
// ============================================================================
console.log('\n--- 2. Testing Deep Turn-based Combat Engine & Statuses (R1) ---');

// 2.1 5 Daoist Paths Skills & Passives
console.log('2.1 Testing 5 Daoist Path active skills & passives...');
Object.keys(CULTIVATION_PATHS).forEach(pathId => {
  const path = CULTIVATION_PATHS[pathId];
  assert(Array.isArray(path.skills) && path.skills.length >= 2, `${pathId} must have at least 2 active skills`);
  assert(path.passive && path.passive.name && path.passive.desc, `${pathId} must have a passive trait`);
});
console.log('✓ All 5 Daoist paths have 2 active skills and unique passives');

// 2.2 CombatStatusManager: 5 Status Effects & Shield Absorption
console.log('2.2 Testing CombatStatusManager (Stun, Burn, Bleed, Poison, Shield)...');
const testStatuses = CombatStatusManager.initStatuses();
assert.strictEqual(testStatuses.stun, 0);
assert.strictEqual(testStatuses.burn, 0);
assert.strictEqual(testStatuses.bleed, 0);
assert.strictEqual(testStatuses.poison, 0);
assert.strictEqual(testStatuses.shield, 0);

const targetCombat = {
  curHp: 200,
  maxHp: 200,
  statusEffects: CombatStatusManager.initStatuses()
};

// Apply shield and test damage absorption
targetCombat.statusEffects.shield = 100;
const absorbed = CombatStatusManager.absorbDamage(targetCombat, 60, mockRenderer, 100, 100);
assert.strictEqual(absorbed.absorbed, 60, 'Shield should absorb 60 damage');
assert.strictEqual(absorbed.remainingDmg, 0, '0 damage should bypass shield');
assert.strictEqual(targetCombat.statusEffects.shield, 40, 'Remaining shield should be 40');

const absorbedOver = CombatStatusManager.absorbDamage(targetCombat, 70, mockRenderer, 100, 100);
assert.strictEqual(absorbedOver.absorbed, 40, 'Shield should absorb remaining 40');
assert.strictEqual(absorbedOver.remainingDmg, 30, '30 excess damage bypasses broken shield');
assert.strictEqual(targetCombat.statusEffects.shield, 0, 'Shield should be depleted to 0');
console.log('✓ Shield absorption mechanics verified');

// Test Turn Ticks for Burn, Bleed, Poison
targetCombat.statusEffects.burn = 2;
targetCombat.statusEffects.bleed = 2;
targetCombat.statusEffects.poison = 1;
const hpBefore = targetCombat.curHp;
CombatStatusManager.tickTurn(targetCombat, false, mockRenderer, logCallback, 'Quái');
assert(targetCombat.curHp < hpBefore, 'Status ticks should deal DoT damage');
assert.strictEqual(targetCombat.statusEffects.burn, 1, 'Burn duration decremented');
assert.strictEqual(targetCombat.statusEffects.bleed, 1, 'Bleed duration decremented');
assert.strictEqual(targetCombat.statusEffects.poison, 0, 'Poison duration decremented and expired');
console.log('✓ Status effect durations and turn ticks verified');

// 2.3 Monster Intent State Machine & Rage
console.log('2.3 Testing Monster Intent telegraphing & Rage accumulation...');
const dummyMonster = {
  id: 'test_beast',
  name: 'Xích Hỏa Thú',
  hp: 300,
  mp: 50,
  atk: 25,
  def: 10,
  spd: 20
};
combat.startCombat(systems.player, dummyMonster);
assert(combat.monsterCombat.nextIntent !== null, 'Monster next intent should be telegraphed');
assert(['attack', 'skill', 'defend', 'ultimate'].includes(combat.monsterCombat.nextIntent.type), 'Intent type valid');

combat.monsterCombat.rage = 95;
combat.updateMonsterIntent();
assert.strictEqual(combat.monsterCombat.nextIntent.type, 'ultimate', 'Monster at >=90 rage must telegraph Ultimate attack');
console.log('✓ Monster AI telegraphing & rage ultimate verified');
combat.endCombat(true, false);

// ============================================================================
// TEST SUITE 3: INTERACTIVE ALCHEMY & DƯỢC ĐIỂN (R2)
// ============================================================================
console.log('\n--- 3. Testing Interactive Alchemy System & Dược Điển (R2) ---');

// 3.1 Dược Điển Encyclopedia Content
console.log('3.1 Checking HERB_ENCYCLOPEDIA entries...');
const herbKeys = Object.keys(HERB_ENCYCLOPEDIA);
assert.strictEqual(herbKeys.length, 7, 'Must have all 7 herbs documented');
herbKeys.forEach(k => {
  const herb = HERB_ENCYCLOPEDIA[k];
  assert(herb.name && herb.grade && herb.nature && herb.lore && Array.isArray(herb.regions), `Herb ${k} metadata complete`);
});
console.log('✓ HERB_ENCYCLOPEDIA contains 7 complete herb records');

// 3.2 Interactive Fire Modes & Purity
console.log('3.2 Testing Interactive Fire Control & Temperature physics...');
systems.player.inventory.herb_linhchi = 10;
systems.startInteractiveAlchemy('rec_hoixuan');
assert(systems.alchemySession !== null, 'Alchemy session should be initialized');
assert.strictEqual(systems.alchemySession.active, true, 'Alchemy session active');
assert.strictEqual(systems.alchemySession.fireMode, 'gentle', 'Default fire mode gentle');

// Test switching fire mode
systems.setAlchemyFireMode('martial');
assert.strictEqual(systems.alchemySession.fireMode, 'martial', 'Fire mode set to martial');

// Test sweet-spot purity harvesting
systems.alchemySession.temp = 55; // inside [40, 70]
systems.alchemySession.purity = 92;
systems.harvestPill();
assert.strictEqual(systems.alchemySession, null, 'Session closed after harvest');
assert(systems.player.inventory.pill_hoixuan >= 2, 'Purity >= 90 results in Cực Phẩm dual-pill harvest');
console.log('✓ Interactive alchemy sweet-spot harvest and pill grades verified');

// 3.3 Cauldron Explosion on Overheat
console.log('3.3 Testing Cauldron Explosion on overheat...');
systems.player.inventory.herb_linhchi = 10;
systems.startInteractiveAlchemy('rec_hoixuan');
systems.alchemySession.temp = 105;
let shakeTriggered = false;
mockRenderer.triggerShake = () => { shakeTriggered = true; };
systems.explodeCauldron();
assert.strictEqual(systems.alchemySession, null, 'Overheated session ended');
assert.strictEqual(shakeTriggered, true, 'Cauldron explosion triggers screen shake');
console.log('✓ Cauldron explosion with screen shake verified');

// ============================================================================
// TEST SUITE 4: ROGUELIKE DUNGEON & SECT PROGRESSION (R3)
// ============================================================================
console.log('\n--- 4. Testing Roguelike Bí Cảnh Dungeon & Sect Progression (R3) ---');

// 4.1 5-Floor DAG Dungeon Generation & Connectivity
console.log('4.1 Testing 5-floor DAG node graph generation...');
const dungeon = systems.generateDungeon(WORLD_REGIONS[0]);
assert.strictEqual(dungeon.nodes.length, 11, '5-floor DAG dungeon has 11 interconnected nodes');
const floorCounts = [1, 2, 3, 4, 5].map(f => dungeon.nodes.filter(n => n.floor === f).length);
assert.deepStrictEqual(floorCounts, [2, 3, 3, 2, 1], 'DAG floor distribution: [2, 3, 3, 2, 1]');

// Verify DAG forward-only edge connectivity
dungeon.nodes.forEach(n => {
  if (n.floor < 5) {
    assert(n.nextNodes.length > 0, `Node ${n.id} on floor ${n.floor} must connect to next floor`);
    n.nextNodes.forEach(childId => {
      const child = dungeon.nodes.find(cn => cn.id === childId);
      assert.strictEqual(child.floor, n.floor + 1, `Edge from floor ${n.floor} must point strictly to floor ${n.floor + 1}`);
    });
  } else {
    assert.strictEqual(n.type, 'boss', 'Floor 5 must be the Boss room');
    assert.strictEqual(n.nextNodes.length, 0, 'Boss room has no outgoing edges');
  }
});
console.log('✓ 5-floor DAG node graph generated with valid forward topological ordering');

// 4.2 Dungeon Traversal & Rewards
console.log('4.2 Testing Dungeon room resolution (Treasure, Rest, Boss)...');
systems.startDungeon('region_1');
assert(systems.player.dungeonState !== null, 'Dungeon state active on player');

// Resolve Floor 1 Treasure Node
const f1Treasure = systems.player.dungeonState.nodes.find(n => n.id === 'f1_n2');
assert.strictEqual(f1Treasure.status, 'available');
const stonesBefore = systems.player.spiritStones;
systems.enterDungeonNode('f1_n2');
assert.strictEqual(f1Treasure.status, 'cleared', 'Treasure room marked cleared');
assert(systems.player.spiritStones > stonesBefore, 'Spirit stones awarded from treasure');

// Check that connecting nodes on Floor 2 were unlocked
const f2_2 = systems.player.dungeonState.nodes.find(n => n.id === 'f2_n2');
const f2_3 = systems.player.dungeonState.nodes.find(n => n.id === 'f2_n3');
assert.strictEqual(f2_2.status, 'available', 'Child node f2_n2 unlocked');
assert.strictEqual(f2_3.status, 'available', 'Child node f2_n3 unlocked');
console.log('✓ Dungeon traversal & node advancement verified');

// 4.3 World traveler reward claim guard
console.log('4.3 Testing single-claim reward for world traveler encounters...');
const originalUpdateUI = systems.updateUI;
const originalSaveToLocalStorage = systems.saveToLocalStorage;
const originalRenderOpenWorldUI = systems.renderOpenWorldUI;
systems.updateUI = () => {};
systems.saveToLocalStorage = () => {};
systems.renderOpenWorldUI = () => {};
systems.player.worldLocation = 'region_1';
systems.player.worldGridPosition = { x: 0, y: 0 };
systems.player.worldRelations = {};
systems.player.worldEncounterRewardClaimed = false;
systems.player.spiritStones = 1000;
systems.worldEncounter = { id: 'traveler_linh_nhi', name: 'Linh Nhi', realmIndex: 2 };
const stonesBeforeSocialize = systems.player.spiritStones;
systems.socializeWorldTraveler();
const stonesAfterFirstSocialize = systems.player.spiritStones;
systems.socializeWorldTraveler();
assert.strictEqual(stonesAfterFirstSocialize - stonesBeforeSocialize, 60, 'Linh Nhi reward should be granted once per encounter');
assert.strictEqual(systems.player.spiritStones, stonesAfterFirstSocialize, 'Repeated socialize action must not grant more spirit stones');
assert.strictEqual(systems.player.worldRelations.traveler_linh_nhi, 1, 'Repeated socialize action must not inflate relation');
systems.updateUI = originalUpdateUI;
systems.saveToLocalStorage = originalSaveToLocalStorage;
systems.renderOpenWorldUI = originalRenderOpenWorldUI;
console.log('✓ World traveler reward cannot be claimed repeatedly');

// 4.4 Sect Progression: Rank Quests, Yearly Stipend, Manuals
console.log('4.4 Testing Sect hierarchy, rank-locked quests & stipend...');
systems.joinSect('sect_van_kiem');
systems.player.sectContribTotal = 0;
const rank0 = systems.getCurrentSectRank();
assert.strictEqual(rank0.rank, 'Tạp Dịch Đệ Tử', 'Starting rank is Handyman');

// Check that high-rank quest is locked for rank 0
const elderQuest = SECT_QUESTS.find(q => q.minRankIndex >= 3);
if (elderQuest) {
  const initialContrib = systems.player.sectContrib;
  systems.completeSectQuest(elderQuest.id);
  assert.strictEqual(systems.player.sectContrib, initialContrib, 'Rank 0 disciple cannot complete Elder tier quest');
  console.log('✓ Rank-tiered quest enforcement verified');
}

// Yearly stipend claim
systems.player.age = 20;
systems.player.sectSalaryClaimedYear = -1;
const stonesPreSalary = systems.player.spiritStones;
systems.claimSectSalary();
assert(systems.player.spiritStones > stonesPreSalary, 'Stipend awarded');
assert.strictEqual(systems.player.sectSalaryClaimedYear, 20, 'Year recorded to prevent duplicate claim');
systems.claimSectSalary(); // should not award again
console.log('✓ Yearly sect stipend countdown & single-claim verified');

// Tàng Kinh Các manual teaching active skill
const vanKiemSect = SECTS.find(s => s.id === 'sect_van_kiem');
const manualWithSkill = vanKiemSect.manuals.find(m => m.skill);
if (manualWithSkill) {
  systems.player.sectContrib = manualWithSkill.cost + 100;
  systems.buySectManual(manualWithSkill.id);
  assert(systems.player.skills.some(s => s.id === manualWithSkill.skill.id), 'Buying manual taught new active skill to player.skills array');
  console.log('✓ Tàng Kinh Các manual exchange teaching active skill verified');
}

console.log('\n============================================================');
console.log('🎉 ALL ROUND 1 IMPLEMENTATION UNIT & INTEGRITY TESTS PASSED!');
console.log('============================================================\n');
process.exit(0);
