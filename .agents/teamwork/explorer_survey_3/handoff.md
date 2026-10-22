# Handoff Report: Explorer 3 — Alchemy System, Sect Progression & Responsive UI Survey

## 1. Observation
1. **Codebase Architecture & File Structure:**
   - Command: `ls -la js/` output confirmed that all 7 files in `js/` (`app.js`, `audio.js`, `combat.js`, `data.js`, `renderer.js`, `sprites.js`, `systems.js`) are empty 0-byte placeholders.
   - Command: `wc -l game.js index.html style.css` showed that the active codebase is a single-bundle vanilla web app: `game.js` (5,988 lines), `index.html` (984 lines), `style.css` (3,109 lines).
   - Command: `node --check game.js` exited with code 0 (clean baseline syntax).

2. **Inventory & Items Structure:**
   - In `game.js:1103 - 1151`, `ITEMS` contains 7 herbs (`herb_linhchi`, `herb_thanh_u`, `herb_hoaviem`, `herb_bachnien`, `herb_longhuyet`, `herb_cuuchuyen`, `herb_thienkiem`) and 13 pills (`pill_hoixuan`, `pill_tulinh`, `pill_tukhi`, `pill_trucco`, `pill_kimdan`, `pill_ngungan`, `pill_hoathan`, `pill_huthien`, `pill_hopnguyen`, `pill_cankhon`, `pill_dokiep`, `pill_daotam`, `pill_tho_nguyen`).
   - In `game.js:2929 - 2935`, player inventory is stored as an object mapping IDs to integer quantities:
     ```javascript
     inventory: {
       pill_hoixuan: 3,
       pill_tulinh: 2,
       pill_tukhi: 2,
       herb_linhchi: 5,
       ore_huyenthiet: 3
     }
     ```

3. **Current Alchemy Implementation:**
   - In `game.js:1153 - 1164`, `RECIPES` has only 6 alchemy recipes and 4 forge recipes. Recipes for high-tier breakthrough pills (`pill_ngungan`, `pill_hoathan`, `pill_huthien`, etc.) are absent.
   - In `game.js:3978 - 4012`, `craftRecipe(recipeId)` executes an instantaneous 1.5-second timeout:
     ```javascript
     this.renderer.setScene(SCENES.ALCHEMY);
     let rate = recipe.successRate;
     if (p.cultivationPath && p.cultivationPath.id === 'dan_y_tu') rate += 0.15;
     setTimeout(() => {
       this.renderer.setScene(SCENES.MEDITATE);
       if (Math.random() < rate) { ... } else { ... }
       this.updateUI();
     }, 1500);
     ```
   - In `game.js:1941 - 1973`, `renderAlchemyScene()` draws a static furnace (`SPRITES.sceneFurnace`) with simple flickering flame rectangles, without interactive QTE, temperature gauges, or explosion burst triggers.
   - In `game.js:1357 - 1360`, `triggerShake(duration, intensity)` and particle smoke/spark rendering (`updateAndDrawParticles()`) already exist in `PixelRenderer`, but are not hooked into alchemy failure/explosion.

4. **Sect System Status:**
   - In `game.js:1209 - 1267`, `SECTS` defines 3 sects (`sect_thanhvan`, `sect_dandinh`, `sect_thienma`) with 6 hierarchical ranks each (Tạp Dịch / Ngoại Môn / Nội Môn / Chân Truyền / Trưởng Lão / Chưởng Môn).
   - In `game.js:1269 - 1274`, `SECT_QUESTS` has only 4 fixed quests for all ranks (`quest_herb`, `quest_ore`, `quest_patrol`, `quest_donate`).
   - In `game.js:4068 - 4085`, `claimSectSalary()` checks `p.sectSalaryClaimedYear === p.age`, allowing salary claims once per in-game year (every 60 seconds).
   - In `game.js:1223, 1242, 1261`, each sect has 3 passive stat manuals in Tàng Kinh Các; no active skills or martial arts are available for exchange.

5. **UI & Responsive Layout:**
   - In `game.js:1290 - 1291`, `PixelRenderer` initializes `this.width = canvas.width = 640; this.height = canvas.height = 360` (16:9 aspect ratio).
   - In `style.css:827 - 840`, `.canvas-viewport` uses `aspect-ratio: 16 / 9; max-width: 540px; height: auto;`.
   - In `style.css:2861 - 2866`, mobile styling sets:
     ```css
     .canvas-viewport {
       height: auto !important;
       aspect-ratio: 16 / 9;
       max-height: 190px !important;
       margin-bottom: 4px;
     }
     ```
     On mobile 390x844, this naturally constrains the width to ~337.7px and centers cleanly without stretching.
   - In `index.html`, 8 modals are defined with overlay containers (`.modal-overlay.hidden`).
   - In `game.js:5213 - 5218`, Canvas is conditionally displayed: `tab-nhanvat` toggles `body.tab-nhanvat-active`, and combat toggles `body.combat-active-mode`, cleanly hiding Canvas in other tabs to preserve performance.

---

## 2. Logic Chain
1. **From Observation 1 & 2 to Architecture Strategy:**  
   Because all logic lives in `game.js` and `js/` contains 0-byte placeholders, any feature enhancement must either be made directly in `game.js` or through cleanly integrated modules imported into `index.html`. To avoid regressions, modifications must keep `node --check game.js` at 0 errors and preserve existing data schemas in `LocalStorage`.

2. **From Observation 2 & 3 to Alchemy Mini-Game (R2) Feasibility:**  
   The current crafting mechanism (`craftRecipe`) is purely timer-based without gameplay depth. Because `PixelRenderer` already supports scene switching (`SCENES.ALCHEMY`), screen shaking (`triggerShake`), and particle rendering (`isSmoke`, `isSpark`), building an interactive mini-game with temperature regulation (Văn Hỏa vs Vũ Hỏa), sweet-spot timing, and explosive cauldron failures can be implemented cleanly using the existing Canvas engine without third-party dependencies.

3. **From Observation 3 to Herbal Encyclopedia & Recipe Unlocking (R2):**  
   Herbs drop from specific regions in `WORLD_REGIONS` (Linh Sơn, Vạn Yêu, Cổ Kiếm, Huyết Sát, Thượng Cổ), but player recipes are statically exposed from level 1. Adding a `reqRealmIndex` to `RECIPES` and tracking discovered herbs in a `HERB_ENCYCLOPEDIA` will immediately fulfill R2 requirements and create a satisfying progression loop linked to Bí Cảnh.

4. **From Observation 4 to Sect Progression (R3):**  
   The 6-rank hierarchy is already modeled in `SECTS`, but quests and manuals are static. Categorizing quests with `minRank` and adding active sect techniques to Tàng Kinh Các will satisfy R3 without requiring structural rewrites.

5. **From Observation 5 to UI Layout Integrity (R4):**  
   The 16:9 Canvas ratio is enforced through CSS `aspect-ratio: 16 / 9` and internal canvas pixel dimensions 640x360. Layout adapts from 3 columns on PC to single-column stacking with a sliding drawer for logs on mobile. Modal overlays and tab switching already function without layout breakage.

---

## 3. Caveats
- **Multi-Pill Crafting Batching:** The current investigation focuses on single-craft mini-game loops; bulk crafting (luyện đan hàng loạt 10x/100x) is not specified in R2, but could be considered as a high-realm perk or quality-of-life feature.
- **Save Migration:** Adding pill grades (Hạ, Trung, Thượng, Cực) will require backward-compatible parsing so players with existing inventory entries (`pill_hoixuan: 3`) do not lose items upon loading.
- **Audio Synthesis:** Cauldron explosion sound currently relies on `sound.playHurt()`. Creating a dedicated Web Audio oscillator blast for explosions would enhance immersion.

---

## 4. Conclusion
1. The codebase is healthy, well-structured, and syntactically clean, providing an ideal foundation for implementing the R2, R3, and R4 requirements.
2. The detailed survey report has been generated and written to:
   `/home/thanh/LÀM VIỆC/project/tutienkitruyen/.agents/teamwork/explorer_survey_3/survey_alchemy_sect_ui.md`
3. Concrete architectural specifications have been delivered for:
   - Interactive Alchemy Mini-game (Văn Hỏa vs Vũ Hỏa, purity meter, 4 pill grades, screen shake & smoke explosion).
   - Dược Điển & Đan Phương unlocking linked to cultivation realms and Bí Cảnh gathering.
   - Sect progression (rank-tiered quests, stipend countdown, Tàng Kinh Các active skill exchange).
   - Responsive UI integrity (16:9 canvas scaling, 3-column PC vs mobile single column).

---

## 5. Verification Method
1. **Syntax Check:**
   ```bash
   node --check /home/thanh/LÀM\ VIỆC/project/tutienkitruyen/game.js
   ```
   *Expected result:* Return code 0 with zero syntax errors.

2. **File Inspection:**
   - Verify that survey report exists:
     ```bash
     ls -la /home/thanh/LÀM\ VIỆC/project/tutienkitruyen/.agents/teamwork/explorer_survey_3/survey_alchemy_sect_ui.md
     ```
   - Check line numbers quoted in this report match `game.js`, `index.html`, and `style.css`.

3. **Invalidation Conditions:**
   - If `node --check game.js` returns non-zero.
   - If `ITEMS` or `RECIPES` definitions are modified or deleted without migration.
   - If `.canvas-viewport` CSS ratio is altered from `16 / 9`.
