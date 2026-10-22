## 2026-10-22T04:45:57Z
You are Sub-Agent A (The Builder / Implementer) for Round 1 of the Adversarial Loop.
Your working directory is: /home/thanh/LÀM VIỆC/project/tutienkitruyen/.agents/teamwork/builder_round1
Authoritative User Request: /home/thanh/LÀM VIỆC/project/tutienkitruyen/.agents/teamwork/ORIGINAL_REQUEST.md

You MUST read /home/thanh/LÀM VIỆC/project/tutienkitruyen/.agents/teamwork/ORIGINAL_REQUEST.md first.
Also read the project master plan and survey reports:
- /home/thanh/LÀM VIỆC/project/tutienkitruyen/.agents/teamwork/orchestrator/PROJECT.md
- /home/thanh/LÀM VIỆC/project/tutienkitruyen/.agents/teamwork/explorer_survey_1/survey_architecture.md
- /home/thanh/LÀM VIỆC/project/tutienkitruyen/.agents/teamwork/explorer_survey_2/survey_combat_dungeon.md
- /home/thanh/LÀM VIỆC/project/tutienkitruyen/.agents/teamwork/explorer_survey_3/survey_alchemy_sect_ui.md

Your exclusive write ownership:
- /home/thanh/LÀM VIỆC/project/tutienkitruyen/game.js
- /home/thanh/LÀM VIỆC/project/tutienkitruyen/index.html (if UI modals or buttons need addition)
- /home/thanh/LÀM VIỆC/project/tutienkitruyen/style.css (if styling for new elements is needed)

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

YOUR MISSION IN ROUND 1:
Implement and upgrade all 4 core systems into the game cleanly, robustly, preserving Pixel Art Cổ Phong and 100% web compatibility:

1. R4: Kiến Trúc GameState & Hiệu Năng Toàn Vẹn (Architecture & Zero-Leak Integrity):
   - Upgrade GameState serialization: add schemaVersion (v2), robust migrateSaveData(rawJson) backwards compatibility so old saves load cleanly without errors, normalizePlayerState().
   - Clean memory lifecycle:
     * Implement ParticlePool in PixelRenderer (reuse particle objects rather than push/splice garbage).
     * Pause requestAnimationFrame loop when canvas viewport is hidden (e.g. non-character tabs) or document.hidden (visibilitychange), resume cleanly.
     * Use event delegation for world map grid buttons instead of 121 individual contextmenu listeners; merge duplicate keydown listeners.
   - Ensure node --check game.js exits with 0.

2. R1: Hệ Thống Chiến Đấu Chuyên Sâu (Deep Turn-based Combat Engine):
   - Active skills & passive traits for 5 Daoist Paths (Kiếm Tu: crit & sword qi; Pháp Tu: AOE elemental & shield; Thể Tu: reflect & heal/regen; Đan Tu: cleanse & poison; Ma Tu: lifesteal & berserk).
   - CombatStatusManager: 5 status effects (Tê Liệt / Stun, Thiêu Đốt / Burn, Xuất Huyết / Bleed, Trúng Độc / Poison, Kim Thân / Shield HP). Each effect has turn ticks, DoT damage or effect trigger, and vivid colored Floating Text on Canvas. Both player and monsters apply and suffer effects.
   - Precise combat math: Evasion (Né Đòn based on Thân Pháp), Crit, Damage Reduction percentage, and Realm Difference suppression.
   - Monster AI: Intent telegraphing (attack, defense, skill, rage) shown on Canvas/HUD, Rage meter (tích nộ) triggering dangerous ultimate moves.

3. R2: Hệ Thống Động Phủ Luyện Đan & Dược Điển (Interactive Alchemy System):
   - Interactive mini-game: temperature regulation (Văn Hỏa vs Vũ Hỏa), sweet-spot timing, reaction progress bar.
   - 4 Pill grades (Hạ phẩm, Trung phẩm, Thượng phẩm, Cực phẩm) based on crafting quality, success rate, and cauldron explosion risk with screen shake (renderer.triggerShake) and smoke particles.
   - Dược Điển (Herbal Encyclopedia) & Đan Phương (Pill Recipes) unlocking by cultivation realm, linked with herbs gathered from Bí Cảnh and world exploration.

4. R3: Hệ Thống Tông Môn & Bí Cảnh Khám Phá (Roguelike Dungeon & Sect Progression):
   - Bí Cảnh Khám Phá: Replace flat RNG clicker with a true 5-floor DAG node-branching Roguelike dungeon (Combat room, Treasure room, Rest/Healing room, Random Encounters/Kỳ ngộ, and Boss room).
   - Sect system: 5-tier rank hierarchy (Tạp Dịch -> Ngoại Môn -> Nội Môn -> Chân Truyền -> Trưởng Lão), rank-specific quests, yearly stipend countdown, and Tàng Kinh Các manual/skill exchange.

Verification Requirements:
1. Run `node --check game.js` and ensure 0 syntax errors.
2. Run `node test_combat_sect.js` or write targeted verification scripts to prove that combat, alchemy, dungeon, save migration, and UI operate without runtime errors.
3. Document all implementation changes, architectural decisions, and verification proofs in your report:
   `/home/thanh/LÀM VIỆC/project/tutienkitruyen/.agents/teamwork/builder_round1/implementation_round1.md`
   and handoff report:
   `/home/thanh/LÀM VIỆC/project/tutienkitruyen/.agents/teamwork/builder_round1/handoff.md`.
4. Send a message to orchestrator upon completion.
