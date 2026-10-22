# Project: Tu Tiên Kỳ Truyện — Core Systems Upgrade & Adversarial Convergence

## Architecture
- **Single-Bundle Application**: `game.js` (5,989 lines), `index.html` (984 lines), `style.css` (3,109 lines).
- **Core Entities**:
  - `Game`: Top-level coordinator, manages `player`, `renderer`, `sound`, `combat`, `dungeon`, and UI subtabs.
  - `PixelRenderer`: Canvas (640x360 internal resolution, 16:9 aspect-ratio), scene drawing (`SCENES.MEDITATE`, `SCENES.COMBAT`, `SCENES.ALCHEMY`, etc.), particle systems (`ParticlePool`), floating combat text.
  - `CombatEngine`: Turn-based ATB engine (70ms ticks, 100 gauge trigger), player skills, monster AI with intent & rage, status effect manager (`CombatStatusManager`).
  - `AlchemyEngine`: Interactive furnace control, Văn Hỏa (Gentle Flame) vs Vũ Hỏa (Martial Flame) balance, purity meter, 4 pill grades (Hạ, Trung, Thượng, Cực), screen shake and smoke burst on explosion.
  - `DungeonManager`: Roguelike DAG node-branching explorer (Floor 1-5, Rooms: Combat, Treasure, Rest, Event, Boss).
  - `SectManager`: 5-tier rank hierarchy (Tạp Dịch → Ngoại Môn → Nội Môn → Chân Truyền → Trưởng Lão), rank-specific quests, yearly stipend, Tàng Kinh Các active martial arts.
  - `GameStateManager`: Schema-versioned serialization (`schemaVersion: 2`), `migrateSaveData()`, `normalizePlayerState()`, LocalStorage auto-save with integrity check.

---

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| F1.1 | 5 Daoist Paths Skills | Active skills & passive traits for Kiếm Tu, Pháp Tu, Thể Tu, Đan Tu, Ma Tu | M2 (Combat) | ORIGINAL_REQUEST §R1 |
| F1.2 | Status Effects Engine | 5 Statuses: Stun, Burn, Bleed, Poison, Shield (with tick turns, DoT, floating text) | M2 (Combat) | ORIGINAL_REQUEST §R1 |
| F1.3 | Combat Math Calibration | Evasion (Thân Pháp), Crit, Damage Reduction, Realm Suppression | M2 (Combat) | ORIGINAL_REQUEST §R1 |
| F1.4 | Monster AI & Visuals | Intent telegraphing, Rage accumulation, special moves, Canvas pixel animations | M2 (Combat) | ORIGINAL_REQUEST §R1 |
| F2.1 | Interactive Alchemy Mini-game | Temperature control (Văn Hỏa vs Vũ Hỏa), sweet-spot timing, purity meter | M3 (Alchemy) | ORIGINAL_REQUEST §R2 |
| F2.2 | Pill Quality & Explosion | 4 Pill grades (Hạ, Trung, Thượng, Cực), explosion with screen shake & smoke | M3 (Alchemy) | ORIGINAL_REQUEST §R2 |
| F2.3 | Dược Điển & Đan Phương | Herbal encyclopedia & recipes unlocked by cultivation realm, linked to Bí Cảnh | M3 (Alchemy) | ORIGINAL_REQUEST §R2 |
| F3.1 | Roguelike Dungeon (Bí Cảnh) | 5-floor DAG node-branching (Combat, Treasure, Rest, Event, Boss) | M4 (Sect/Bí Cảnh) | ORIGINAL_REQUEST §R3 |
| F3.2 | Sect Hierarchy & Quests | 5 Ranks (Tạp Dịch → Trưởng Lão), rank-tiered quests, stipend countdown | M4 (Sect/Bí Cảnh) | ORIGINAL_REQUEST §R3 |
| F3.3 | Tàng Kinh Các Expansion | Exchange active sect techniques and passive cultivation scriptures | M4 (Sect/Bí Cảnh) | ORIGINAL_REQUEST §R3 |
| F4.1 | Schema Versioning & Migration | `schemaVersion: 2`, `migrateSaveData()` backwards compatibility for old saves | M1 (Architecture) | ORIGINAL_REQUEST §R4 |
| F4.2 | Zero-Leak Memory Lifecycle | ParticlePool, RAF pause on hidden canvas/visibilitychange, event delegation | M1 (Architecture) | ORIGINAL_REQUEST §R4 |
| F4.3 | Responsive UI & Syntax Health | `node --check game.js` = 0, 16:9 Canvas ratio on PC (1280x750, 1920x1080) & Mobile (390x844) | M1 (Architecture) | ORIGINAL_REQUEST §R4 |
| F5.1 | Adversarial Test & Convergence | Red Team attack (stress, edge cases, memory leaks), Sub-Agent B sign-off | M5 (Final/Adversarial)| ORIGINAL_REQUEST §AC |

---

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | GameState & Zero-Leak Integrity (R4) | Schema versioning, migration pipeline, ParticlePool, RAF throttling, event cleanup | None | IN_PROGRESS |
| M2 | Deep Turn-Based Combat Engine (R1) | 5 Paths skills, 5 status effects, Evasion/DR/Realm math, Monster AI intent/rage | M1 | PLANNED |
| M3 | Interactive Alchemy System (R2) | Hỏa hầu mini-game, 4 pill grades, cauldron explosion, Dược Điển & Đan Phương | M1 | PLANNED |
| M4 | Roguelike Dungeon & Sect Progression (R3)| DAG node dungeon (5 room types), 5 sect ranks & quests, Tàng Kinh Các | M1, M2, M3 | PLANNED |
| M5 | Adversarial Hardening & Final Convergence | Red Team (Sub-Agent B) adversarial attack, bug fixes, forensic audit, sign-off | M1-M4 | PLANNED |

---

## Interface Contracts

### GameStateManager ↔ All Subsystems
- `Game.saveToLocalStorage()`: Serializes envelope `{ schemaVersion: 2, timestamp: Date.now(), player: this.player, world: {...} }`.
- `Game.migrateSaveData(rawJson)`: Checks `schemaVersion`. If legacy (v1 or unversioned), passes through migration steps to populate missing arrays, status effects, and dungeon progress.
- `Game.normalizePlayerState(player)`: Ensures all required keys (`skills`, `daoPath`, `statusEffects`, `dungeonProgress`, `herbBook`, `discoveredHerbs`) exist with valid defaults.

### CombatEngine ↔ PixelRenderer
- `CombatStatusManager`:
  - `applyStatus(target, effectType, duration, value)`
  - `tickTurn(target)`: Triggers DoT, decrements turns, spawns floating text via `renderer.spawnDamageText(text, x, y, color)`.
- `MonsterAI`:
  - `calculateIntent(turn)`: Returns `{ type: 'attack'|'defend'|'skill'|'enrage', label: string, icon: string }`.
  - Displayed above monster sprite on canvas.

### AlchemyEngine ↔ Game UI & Renderer
- `startInteractiveAlchemy(recipeId)`: Switches scene to `SCENES.ALCHEMY`, mounts UI sliders/buttons for Văn Hỏa / Vũ Hỏa.
- `onAlchemyComplete(result)`:
  - If success: yields pill with quality grade (`grade: 'ha'|'trung'|'thuong'|'cuc'`), stat boost multiplier.
  - If fail/explosion: calls `renderer.triggerShake(500, 15)`, spawns smoke particles from `ParticlePool`, plays sound.

### DungeonManager ↔ Combat & Inventory
- `generateDungeon(regionId, floor)`: Generates DAG node map:
  - Node types: `'combat'`, `'treasure'`, `'rest'`, `'event'`, `'boss'`.
- `enterNode(nodeId)`: Transition to combat scene or rewards modal; updates player dungeon state.

---

## Code Layout
- `game.js`: Primary engine and systems implementation. All core classes (`Game`, `PixelRenderer`, `CombatEngine`, `DungeonManager`, `SECTS`, `RECIPES`, `ITEMS`, `MONSTERS`).
- `test_combat_sect.js`: Existing test harness.
- `test_adversarial.js`: Sub-Agent B adversarial stress test suite (edge cases, DoT death, RAF pause, save migration, schema integrity).
- `index.html`: UI modals, canvas viewport, and subtab containers.
- `style.css`: Responsive styles, 16:9 canvas constraints, mobile drawer.
