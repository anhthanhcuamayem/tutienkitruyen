# BÁO CÁO KHẢO SÁT CHUYÊN SÂU: HỆ THỐNG CHIẾN ĐẤU & BÍ CẢNH ROGUELIKE
**Dự án:** Tu Tiên Kỳ Truyện: Thiên Đạo Luân Hồi  
**Phân hệ phụ trách:** Explorer 2 (Combat Engine & Roguelike Dungeon Survey)  
**Thời gian khảo sát:** 2026-10-22  
**Đối tượng khảo sát:** `game.js`, `index.html`, `style.css`, `test_combat_sect.js`

---

## 1. TỔNG QUAN KIẾN TRÚC & ĐÁNH GIÁ CHUNG

### 1.1. Hiện trạng Kiến trúc Codebase
Toàn bộ mã nguồn ứng dụng hiện tập trung chủ yếu trong file nguyên khối `game.js` (5,988 dòng code, ~262 KB), được bao bọc trong một IIFE `(function () { 'use strict'; ... })();`. Các file trong thư mục `js/` (`combat.js`, `systems.js`, `data.js`, v.v.) hiện đều là file rỗng (0 bytes), và `index.html` (dòng 982) nạp trực tiếp file `game.js`.

Kiến trúc logic trong `game.js` phân bổ thành 4 khối lớp chính:
1. `class SoundSystem` (dòng 460 - 644): Xử lý Web Audio API tổng hợp sóng âm retro 8-bit/16-bit.
2. `class PixelRenderer` (dòng 1286 - 2054): Quản lý vòng lặp vẽ Canvas 640x360 (tỷ lệ 16:9), các cảnh (`SCENES.MEDITATE`, `COMBAT`, `TRIBULATION`, `ALCHEMY`), hạt linh khí (particles) và floating texts.
3. `class CombatEngine` (dòng 2059 - 2865): Động cơ giao tranh theo lượt bán thời gian thực (ATB gauge), quản lý hành động người chơi/quái vật, tính toán sát thương cơ bản và kết thúc trận.
4. `class GameSystems` (dòng 2870 - 5440): Quản lý vòng đời nhân vật, đả tọa, độ kiếp, thế giới mở, tông môn, phường thị, luyện đan và lưu trữ `localStorage`.

### 1.2. Đánh giá Khái quát về 2 Phân hệ Cốt lõi (R1 & R3)
- **Hệ Thống Chiến Đấu (R1):** Đã có khung sườn ATB (Action Time Battle) cơ bản, diễn họa Canvas 2 bên đối kháng, hỗ trợ Tự động (Auto) và Tốc độ 2x, thanh máu trên Canvas và các phím tắt 1-5. Tuy nhiên, logic chiều sâu chiến thuật còn cực kỳ thô sơ: **chưa hề có cơ chế Né Đòn (Evasion)**, **chưa có Giảm Thương (Damage Reduction)**, **chưa có Áp Chế Cảnh Giới (Realm Suppression)**, **các hiệu ứng trạng thái (Status Effects) bị bỏ quên hoặc chưa kích hoạt trong code**, và **AI quái vật hoàn toàn ngẫu nhiên**.
- **Hệ Thống Bí Cảnh (R3):** Hiện tại **chưa hề tồn tại cấu trúc Roguelike phân nhánh**. Phân mục "Bí Cảnh" (`subtab-world`) chỉ là một giao diện chọn vùng đất rồi bấm một nút "Khám Phá" đơn lẻ (`exploreWorld()`), trả về kết quả ngẫu nhiên (45% gặp quái, 30% gặp modal kỳ ngộ 3 lựa chọn, 25% nhặt đồ). Cần phải xây dựng mới hoàn toàn hệ thống Roguelike Dungeon dạng sơ đồ nút (Node-branching Map) kết nối các phòng chuyên biệt.

---

## 2. KHẢO SÁT CHI TIẾT: HỆ THỐNG CHIẾN ĐẤU (COMBAT ENGINE)

### 2.1. Cấu Trúc Lượt Đấu & Cơ Chế Nạp Tốc Độ (ATB Action Gauge)
Hệ thống chiến đấu trong `CombatEngine` hoạt động theo mô hình nạp thanh hành động theo thời gian thực (ATB - Action Time Battle):
- **Vòng lặp nạp lượt (`runCombatLoop`, dòng 2156 - 2179):**
  - Sử dụng `setInterval` với nhịp `tickMs = 70ms`.
  - Tốc độ nạp điểm nạp lượt:
    ```javascript
    const pSpeed = Math.max(12, this.player.totalSpd || 15);
    const mSpeed = Math.max(10, this.monster.spd || 12);
    const speedRate = (this.combatSpeed || 1) * 0.22;

    this.playerCombat.actionGauge += pSpeed * speedRate;
    this.monsterCombat.actionGauge += mSpeed * speedRate;
    ```
  - **Lỗi bất đối xứng lượt (Priority Starvation):**
    ```javascript
    if (this.playerCombat.actionGauge >= 100) {
      this.playerCombat.actionGauge = 0;
      this.triggerPlayerTurn();
    } else if (this.monsterCombat.actionGauge >= 100) {
      this.monsterCombat.actionGauge = 0;
      this.triggerMonsterTurn();
    }
    ```
    Khi cả người chơi và quái vật cùng chạm mốc 100 trong cùng một tick, người chơi luôn được ưu tiên đi trước, quái vật bị hoãn lại ở lượt sau. Nếu tốc độ người chơi áp đảo, quái vật có nguy cơ bị kẹt thanh nạp.

### 2.2. Trạng Thái Giao Tranh Cục Bộ (`playerCombat` & `monsterCombat`)
Khi trận chiến bắt đầu (`startCombat`, dòng 2093 - 2154):
- `playerCombat`:
  - `curHp`, `maxHp`, `curMp`, `maxMp`
  - `actionGauge`, `skillCooldown`, `artifactCooldown`
  - `immortalTriggered` (cờ Bất Tử Chi Khu của Kim Thủ Chỉ)
  - `isDefending` (cờ thủ thế tạm thời khi dùng pháp bảo)
  - `poisonTurns`, `burnTurns`, `frozenTurns`
- `monsterCombat`:
  - `curHp`, `maxHp`, `curMp`
  - `actionGauge`, `frozenTurns`, `stunnedTurns`, `poisonTurns`, `burnTurns`

### 2.3. Công Thức Tính Toán Sát Thương Hiện Tại & Các Lỗ Hổng Nghiêm Trọng

#### A. Đánh Thường Của Người Chơi (`playerNormalAttack`, dòng 2277 - 2318)
- **Công thức sát thương gốc:**
  ```javascript
  const baseAtk = this.player.totalAtk;
  const monDef = this.monster.def;
  let dmg = Math.max(1, Math.floor(baseAtk * (1 + (Math.random() - 0.5) * 0.2) - monDef * 0.4));
  ```
- **Bạo kích:**
  ```javascript
  const isCrit = Math.random() < this.player.totalCrit;
  if (isCrit) {
    dmg = Math.floor(dmg * (1.5 + (this.player.totalCritDmg || 0.5)));
  }
  ```
- **Xuyên giáp Thể Chất:**
  ```javascript
  if (this.player.physique && this.player.physique.armorPen) {
    dmg += Math.floor(monDef * 0.3);
  }
  ```
- **Hút máu:** Gọi `handleLifeSteal(dmg)` tính theo `lifeStealMod` của Linh Căn và Ma Tu.

#### B. Tuyệt Kỹ Của Người Chơi (`playerCastSkill`, dòng 2320 - 2396)
- Tiêu hao MP: `this.playerCombat.curMp -= skill.mpCost;`
- Tiêu hao HP (Ma Tu): `const hpLoss = Math.floor(this.playerCombat.curHp * skill.hpCostPercent);`
- **Công thức sát thương tuyệt kỹ:**
  ```javascript
  let dmg = Math.max(1, Math.floor(this.player.totalAtk * (skill.dmgMult || 1.8) - this.monster.def * 0.3));
  if (isCrit) dmg = Math.floor(dmg * 1.8);
  ```

#### C. Pháp Bảo Của Người Chơi (`playerUseArtifact`, dòng 2398 - 2435)
- Hồi chiêu: `artifactCooldown = 3;`
- Sát thương: `const dmg = Math.floor(this.player.totalAtk * 1.5 + (art.atk || 50));`
- Tự động bật cờ thủ thế: `this.playerCombat.isDefending = true;`

#### D. Đòn Đánh Của Quái Vật (`triggerMonsterTurn`, dòng 2489 - 2563)
- Kiểm tra choáng: `if (this.monsterCombat.stunnedTurns > 0) ...`
- Kiểm tra đóng băng: `if (this.monsterCombat.frozenTurns > 0) ...`
- Sử dụng kỹ năng ngẫu nhiên:
  ```javascript
  const useSkill = this.monster.skills && this.monster.skills.length > 0 && Math.random() < 0.4;
  let dmgMult = useSkill ? (this.monster.skills[0].dmgMult || 1.3) : 1.0;
  ```
- Tính sát thương lên người chơi:
  ```javascript
  let playerDef = this.player.totalDef;
  if (this.playerCombat.isDefending) {
    playerDef *= 1.4;
    this.playerCombat.isDefending = false;
  }
  let dmg = Math.max(1, Math.floor(monAtk * (1 + (Math.random() - 0.5) * 0.15) - playerDef * 0.35));
  if (this.player.physique && this.player.physique.tier === 'Bá Thể') dmg = Math.floor(dmg * 0.8);
  ```
- Phản đòn thể chất: `if (this.player.physique && this.player.physique.reflectBonus) ...`
- Cứu mạng Kim Thủ Chỉ: Kích hoạt `immortal_body` hồi 35% HP khi máu về <= 0.

---

## 3. PHÂN TÍCH CẢNH GIỚI, CHỈ SỐ CHIẾN ĐẤU & CÁC THIẾU SÓT CỐT LÕI

### 3.1. Hệ Thống Cảnh Giới (`REALMS`)
Trong `game.js` (dòng 647 - 707), hệ thống định nghĩa 10 đại cảnh giới với 36 tiểu cảnh giới:
1. **Luyện Khí (10 tầng):** `lk_1` (maxExp: 100, HP 150, ATK 25, DEF 12, SPD 15) đến `lk_10` (Đỉnh Phong, cần Trúc Cơ Đan).
2. **Trúc Cơ (4 giai đoạn):** Sơ Kỳ, Trung Kỳ, Hậu Kỳ, Đỉnh Phong (cần Kim Đan Hóa Thần Hoàn).
3. **Kim Đan (4 giai đoạn):** Sơ Kỳ đến Đỉnh Phong (cần Ngưng Anh Đan).
4. **Nguyên Anh (4 giai đoạn):** Sơ Kỳ đến Đỉnh Phong (cần Hóa Thần Đan).
5. **Hóa Thần (4 giai đoạn):** Sơ Kỳ đến Đỉnh Phong (cần Hư Thiên Đan).
6. **Luyện Hư (4 giai đoạn):** Sơ Kỳ đến Đỉnh Phong (cần Hợp Nguyên Đan).
7. **Hợp Thể (4 giai đoạn):** Sơ Kỳ đến Đỉnh Phong (cần Càn Khôn Đan).
8. **Đại Thừa (4 giai đoạn):** Sơ Kỳ đến Đỉnh Phong (cần Cửu Thiên Độ Kiếp Đan).
9. **Độ Kiếp (4 giai đoạn):** Sơ Kỳ đến Đỉnh Phong (Độ Kiếp Viên Mãn - Phi Thăng).

*Lưu ý về "Khí Chu chuyển":* Trong `index.html` (dòng 250 - 272), khái niệm "Chu Thiên Vận Khí" hiện đang được thể hiện ở thanh tiến độ kinh mạch đả tọa tự động nhận Tu Vi (`tickCultivation`), chưa phải là một cảnh giới trước Luyện Khí. Cần đồng bộ hóa để người chơi cảm nhận rõ rệt từng vòng chu thiên vận khí khí huyết.

### 3.2. Tính Toán Chỉ Số Người Chơi (`recalculatePlayerStats`, dòng 2960 - 3002)
- `maxHp = (base.hp + path.hp + armHp + artHp + bonusHp) * (1 + phyHp)`
- `maxMp = (base.mp + path.mp + artMp + bonusMp) * (1 + root.mpMod)`
- `totalAtk = (base.atk + path.atk + wpnAtk + artAtk + bonusAtk) * (1 + phyAtk) * root.dmgMod`
- `totalDef = (base.def + path.def + armDef + artDef + bonusDef) * (1 + phyDef)`
- `totalSpd = (base.spd + bonusSpd) * spdMod`
- `totalCrit = 0.05 + path.crit + root.critMod + phy.critBonus + wpn.crit + bonusCrit`
- `totalCritDmg = 0.5 + path.critDmg`

### 3.3. Các Thiếu Sót & Lỗ Hổng Nghiêm Trọng So Với Yêu Cầu R1
1. **Thiếu hoàn toàn cơ chế Né Đòn (Evasion):**
   - Trong `game.js`, thuộc tính `dodgeMod: 0.2` được khai báo trong Phong Linh Căn (dòng 721), nhưng trong `CombatEngine.playerNormalAttack()` và `CombatEngine.triggerMonsterTurn()`, **hoàn toàn không có dòng lệnh nào kiểm tra xác suất né đòn!** Mọi đòn đánh đều trúng 100%.
2. **Thiếu cơ chế Giảm Thương (Damage Reduction) tổng thể:**
   - Hiện tại phòng thủ chỉ được tính bằng phép trừ thô sơ: `- monDef * 0.4` hoặc `- playerDef * 0.35`. Không có công thức giảm thương theo tỷ lệ phần trăm (diminishing returns).
3. **Thiếu cơ chế Áp Chế Cảnh Giới (Realm Suppression):**
   - Sự chênh lệch giữa các cảnh giới (ví dụ Luyện Khí đối đầu Trúc Cơ hoặc Kim Đan) chỉ đơn thuần là so sánh chỉ số ATK/DEF thô. Hoàn toàn thiếu hệ số uy áp cảnh giới đặc trưng của tu tiên (khi tu vi cao hơn thì gây thêm sát thương và giảm sát thương nhận vào, khi tu vi thấp hơn thì bị áp chế toàn diện).
4. **Quái vật không có Bạo Kích:**
   - Quái vật chỉ có chỉ số ATK thô nhân hệ số ngẫu nhiên `(1 + (Math.random() - 0.5) * 0.15)`, không có cơ chế bạo kích chí mạng.

---

## 4. KHẢO SÁT CHI TIẾT: NĂM ĐẠO ĐỒ TU TIÊN (DAOIST PATHS)

Trong `game.js` (dòng 737 - 878), bảng dữ liệu `CULTIVATION_PATHS` định nghĩa 5 đạo đồ, nhưng mỗi đạo đồ hiện tại **chỉ sở hữu duy nhất 1 kỹ năng khởi đầu** và **chưa có cây đặc tính bị động**:

| Đạo Đồ | Trạng thái hiện tại trong Code | Yêu cầu R1 | Lỗ hổng kỹ thuật phát hiện |
| :--- | :--- | :--- | :--- |
| **Kiếm Tu** | Bonus: ATK +25, Crit +15%, CritDmg +30%.<br>Kỹ năng: *Nhất Kiếm Tây Lai* (CD 2, MP 25, mult 2.2). Mô tả ghi "35% bỏ qua giáp". | Bạo kích & Kiếm Khí tích tầng | Trong `playerCastSkill()`, **dòng kiểm tra 35% bỏ qua giáp của kỹ năng hoàn toàn không tồn tại** (chỉ có physique.armorPen của thể chất). Chưa có cơ chế tích lũy "Kiếm Khí" (Sword Qi stacks). |
| **Pháp Tu** | Bonus: MP +100, ATK +20, DEF +15.<br>Kỹ năng: *Cửu Thiên Huyền Hỏa* (CD 2, MP 35, mult 2.0, burnChance: 0.5). | Quần công ngũ hành & Hộ thuẫn | `skill.burnChance` chỉ dùng để chọn màu tia chém canvas (`fire`), **không hề kích hoạt gán `burnTurns` lên quái vật**! Chưa có kỹ năng tạo khiên chắn ngũ hành. |
| **Thể Tu** | Bonus: HP +250, DEF +35, ATK +15.<br>Kỹ năng: *Bá Vương Khí Kình* (CD 3, MP 20, mult 1.8, stunChance: 0.4). | Phản chấn & Hồi huyết | Đã gán `stunnedTurns = 1`. Tuy nhiên đặc tính phản chấn bị khóa cứng trong thể chất `Cửu Dương Bá Thể`, bản thân class Thể Tu không có phản chấn nội tại và không có hồi huyết tự nhiên mỗi lượt. |
| **Đan Tu** | Bonus: HP +120, MP +80, alchemyBonus +25%.<br>Kỹ năng: *Bách Thảo Hồi Xuân* (CD 2, MP 30, mult 1.2, heal: 35%). | Giải trừ & Độc công | Chỉ có hồi máu 35%. Hoàn toàn thiếu kỹ năng Giải Trừ hiệu ứng xấu (Cleanse) và Kỹ năng Đầu Độc (Poison application). |
| **Ma Tu** | Bonus: ATK +35, HP -50, Lifesteal +20%.<br>Kỹ năng: *Huyết Ảnh Thao Thiên* (CD 2, MP 20, tự trừ 10% HP, mult 2.8, hút 30%). | Hút máu & Cuồng bạo | Đã có hút máu và đốt máu bản thân. Chưa có cơ chế Cuồng Bạo (Berserk - tăng mạnh công kích và tốc độ khi lượng máu giảm sâu). |

---

## 5. KHẢO SÁT CHI TIẾT: CƠ CHẾ HIỆU ỨNG TRẠNG THÁI (STATUS EFFECTS)

Đây là khu vực phát hiện **lỗ hổng hồi quy và đứt gãy logic lớn nhất** trong hệ thống combat hiện tại:

### 5.1. Bảng Khảo Sát Hiện Trạng Từng Hiệu Ứng

| Hiệu Ứng | Khai báo biến | Cơ chế Gán (Apply) | Cơ chế Trừ Lượt / Gây Hại (Tick) | Cơ chế Giao Diện / Floating Text |
| :--- | :--- | :--- | :--- | :--- |
| **Tê Liệt (Stun)** | `monsterCombat.stunnedTurns` | Chỉ gán ở Thể Tu: `skill.stunChance` (dòng 2388). Không gán lên người chơi. | Quái vật bị mất lượt (dòng 2492-2496). Người chơi không có biến `stunnedTurns`. | Không có Floating Text "Choáng". Chỉ có text log console. |
| **Thiêu Đốt (Burn)** | `playerCombat.burnTurns`, `monsterCombat.burnTurns` | **KHÔNG CÓ CHỖ NÀO GÁN.** Kể cả kỹ năng Pháp Tu lẫn quái vật `tiger_fire` đều không gán giá trị này. | **KHÔNG CÓ DÒNG NÀO TÍNH SÁT THƯƠNG BURN.** Biến chỉ nằm chết trong state. | Có badge HTML `#combat-monster-statuses`, nhưng badge không bao giờ hiện vì turns = 0. |
| **Xuất Huyết (Bleed)** | **CHƯA ĐƯỢC KHAI BÁO.** | Không có trong code. | Không có trong code. | Không có. |
| **Trúng Độc (Poison)** | `playerCombat.poisonTurns`, `monsterCombat.poisonTurns` | **KHÔNG CÓ CHỖ NÀO GÁN.** Quái `snake_novice` có `skills: [{ poison: true }]` nhưng bị code bỏ qua hoàn toàn. | Chỉ có người chơi bị trừ máu độc ở đầu hiệp (dòng 2190-2196). **Quái vật bị trúng độc không bao giờ bị trừ máu!** | Có floating text `-${pDmg} Độc` nếu người chơi bị độc (dòng 2193). |
| **Kim Thân / Hộ Thuẫn (Shield)** | Chỉ có cờ boolean `playerCombat.isDefending`. | Bật khi dùng Pháp bảo (`playerUseArtifact`). | Tăng DEF x1.4 ở đòn đánh kế tiếp của quái rồi lập tức tắt (dòng 2524-2525). Không có lượng HP khiên thực thụ. | Không có floating text hiển thị khiên hấp thụ sát thương. |

### 5.2. Kết Luận Về Status Effects
Hệ thống Status Effects hiện hữu chỉ là các trường giả lập (placeholder stubs) chưa hoàn chỉnh. Cần tái cấu trúc thành một bộ máy quản lý trạng thái đồng nhất (`StatusManager`) cho cả người chơi lẫn quái vật với đầy đủ 5 trạng thái theo yêu cầu R1.

---

## 6. KHẢO SÁT CHI TIẾT: AI QUÁI VẬT & DIỄN HOẠT CANVAS

### 6.1. Logic AI Quái Vật Hiện Tại
- Danh sách yêu thú định nghĩa trong `MONSTERS` (dòng 1010 - 1101) gồm 12 loài từ Luyện Khí (`wolf_novice`) đến Hóa Thần+ (`golem_divine`).
- Trong lượt của quái vật (`triggerMonsterTurn`, dòng 2512):
  - Quyết định hành vi hoàn toàn dựa trên xác suất `Math.random() < 0.4`.
  - Nếu `< 0.4`: dùng kỹ năng đầu tiên `this.monster.skills[0]`.
  - Nếu `>= 0.4`: đánh thường.
- **Hoàn toàn không có khái niệm Ý Đồ (Intent):** Người chơi không biết trước quái chuẩn bị tung đòn gì.
- **Hoàn toàn không có Nộ Khí (Rage/Anger):** Quái không tích nộ khi bị tấn công, không có cơ chế Enrage hay Boss Phase khi máu tụt xuống thấp.

### 6.2. Diễn Họa Pixel Canvas (`PixelRenderer.renderCombatScene`, dòng 1712 - 1939)
- **Điểm mạnh đã đạt được:**
  - Bầu trời chiến trận màu tím thẫm ma mị kèm Huyết Nguyệt (`#ef4444`) tỏa quầng sáng radial gradient.
  - Sấm sét ma đạo procedural ngẫu nhiên giật chân trời.
  - Mặt đất chiến trường nứt nẻ, có tia lửa đỏ/vàng bay lơ lửng.
  - Đạo Hữu có vòng bát quái màu xanh lam/vàng dưới chân; Kiếm Tu có Phi Kiếm lơ lửng xoay quanh người.
  - Quái vật có vòng ma trận huyết sắc xoay ngược chiều dưới chân.
  - Vẽ Sprite Pixel nhân vật và quái vật với hiệu ứng nhấp nháy trắng/đỏ khi trúng đòn (`playerFlash`, `monsterFlash`).
  - Thanh máu nhỏ nổi trên đầu (Overhead Mini HUD) trực tiếp trên Canvas.
  - Hiệu ứng chém (`slashEffect` kiếm, lửa, sét), rung màn hình (`triggerShake`).
  - Chữ nổi sát thương (`updateAndDrawFloatingTexts`) trôi lên và mờ dần.
- **Điểm cần nâng cấp cho R1:**
  - Cần vẽ biểu tượng Ý Đồ Quái (Intent Icon: ⚔️ Công, 🛡️ Thủ, ⚡ Nộ) lơ lửng trên đầu quái.
  - Cần vẽ thanh Nộ Khí (Rage Gauge) màu cam/đỏ dưới thanh máu của quái.
  - Bổ sung hiệu ứng hình ảnh đại diện cho các trạng thái: vòng kim quang (Kim Thân), khói tím (Trúng Độc), đốm lửa bập bùng (Thiêu Đốt), giọt máu rơi (Xuất Huyết), vòng sét xoay tròn (Tê Liệt).

---

## 7. KHẢO SÁT CHI TIẾT: BÍ CẢNH KHÁM PHÁ (ROGUELIKE DUNGEON)

### 7.1. Hiện Trạng Khám Phá Thế Giới (`exploreWorld`, dòng 3504 - 3560)
Hiện tại, mục "Bí Cảnh" trong giao diện (`tab-tiengioi` -> `subtab-world`) chỉ là một bộ chọn Dropdown 5 khu vực (`WORLD_REGIONS`):
1. `region_1`: Linh Sơn Ngoại Vi (Luyện Khí)
2. `region_2`: Vạn Yêu Sơn Mạch (Trúc Cơ)
3. `region_3`: Cổ Kiếm Bí Cảnh (Kim Đan)
4. `region_4`: Huyết Sát Ma Vực (Nguyên Anh)
5. `region_5`: Thượng Cổ Vực Thẳm (Hóa Thần+)

Khi người chơi bấm nút "🧭 Bắt Đầu Du Ngoạn / Lịch Luyện":
- Đổ xúc xắc ngẫu nhiên `const rng = Math.random();`:
  - `rng < 0.45`: Chọn ngẫu nhiên 1 con quái từ danh sách khu vực và gọi `combatEngine.startCombat()`.
  - `rng < 0.75`: Mở modal kỳ ngộ ngẫu nhiên `RANDOM_EVENTS` (chỉ có 4 sự kiện mẫu: Di hài tiền bối, Nữ tu gặp nạn, Cổ tuyền linh thủy, Tà tu mời chào).
  - Còn lại (25%): Nhặt linh thảo/khoáng thạch và linh thạch.

### 7.2. So Sánh Với Yêu Cầu R3 (Roguelike Dungeon & Sect Progression)
Yêu cầu R3 nêu rõ:
> *"Bí Cảnh Khám Phá dạng nút phân nhánh Roguelike: Phòng chiến đấu, Phòng bảo rương, Phòng tĩnh dưỡng, Kỳ ngộ phân nhánh ngẫu nhiên và Phòng Boss trấn thủ."*

Hiện trạng hoàn toàn chưa đáp ứng được yêu cầu này. Cần phải thiết kế một kiến trúc Roguelike Bí Cảnh hoàn chỉnh:
1. **Mô hình Dữ liệu Sơ Đồ Nút (Node Graph Map):**
   - Mỗi Bí Cảnh gồm một số Tầng (Floors / Depths, ví dụ 5 - 7 tầng).
   - Mỗi tầng gồm 2 - 3 phòng lựa chọn phân nhánh (hướng đi dạng cây DAG - Directed Acyclic Graph).
   - 5 loại phòng chức năng độc lập:
     - ⚔️ **Phòng Chiến Đấu (Combat Room):** Đối đầu tiểu yêu/quái vật tinh anh.
     - 💎 **Phòng Bảo Rương (Treasure Room):** Nhặt đan dược, pháp bảo, linh thạch (hoặc giải bẫy cơ quan).
     - 🧘 **Phòng Tĩnh Dưỡng (Rest Room):** Lựa chọn đả tọa hồi phục HP/MP hoặc lĩnh ngộ tăng thêm Tu Vi.
     - ❓ **Kỳ Ngộ Ngẫu Nhiên (Event Room):** Tình huống lựa chọn rủi ro - phần thưởng ngẫu nhiên.
     - 👑 **Phòng Boss Trấn Thủ (Boss Room):** Tầng cuối cùng gặp Yêu Vương thủ lĩnh, vượt qua để thông quan Bí Cảnh.
2. **Tiến trình & Lưu trữ Trạng thái (Dungeon State & Inventory):**
   - Quản lý túi đồ tạm thời thu thập được trong Bí Cảnh.
   - Cơ chế Rút Lui an toàn (mang theo toàn bộ chiến lợi phẩm) vs Tử Trận (mất 50% tài nguyên thu thập trong chuyến đi).
3. **Giao diện Trực quan Hóa (Interactive Roguelike Map):**
   - Hiển thị bản đồ phân nhánh Pixel Art dạng lưới hoặc sơ đồ trực quan với các icon phòng, đường nối liên kết giữa các phòng đã đi, phòng hiện tại và các phòng có thể chọn tiếp theo.

---

## 8. KHẢO SÁT HỆ THỐNG TÔNG MÔN (SECT PROGRESSION)

### 8.1. Các Thành Phần Tông Môn Đã Có
- Danh sách 3 Tông môn lớn trong `SECTS` (dòng 1209 - 1268): Thanh Vân Kiếm Tông, Đan Đỉnh Thần Môn, Cửu U Ma Giáo.
- Nấc thang địa vị: Tạp Dịch (0 điểm cống hiến), Ngoại Môn (100), Nội Môn (500), Chân Truyền (2000), Trưởng Lão (6000), Chưởng Môn (15000).
- Bổng lộc hàng năm (`claimSectSalary`).
- Đổi bí kíp tại Tàng Kinh Các (`buySectManual`) không bị giáng chức (đã sửa dùng `sectContribTotal`).

### 8.2. Điểm Cần Hoàn Thiện Theo Yêu Cầu R3
- **Nhiệm vụ tông môn theo chức vị:** Hiện tại chỉ có 4 nhiệm vụ dùng chung cho tất cả chức vị (`SECT_QUESTS`). Cần phân cấp nhiệm vụ rõ rệt: Tạp Dịch làm việc vặt (hái cỏ, đào khoáng); Ngoại Môn tuần tra, trừ yêu sơn cước; Nội Môn thám hiểm di tích, luyện chế đan dược cấp cao; Chân Truyền / Trưởng Lão săn Boss Bí Cảnh, thảo phạt phản đồ.
- **Liên kết Tông Môn và Bí Cảnh:** Tạo các nhiệm vụ tông môn yêu cầu thu thập vật phẩm đặc thù chỉ rơi trong các phòng của Bí Cảnh.

---

## 9. KHẢO SÁT KIẾN TRÚC GAMESTATE & TỐI ƯU BỘ NHỚ (R4)

### 9.1. Quản lý Trạng Thái & Serialization
- Cơ chế lưu trữ `localStorage` hiện tại (`saveToLocalStorage` / `loadFromLocalStorage`, dòng 4308 - 4340):
  - Đang lưu trực tiếp đối tượng `this.player`.
  - Migration hiện đã có fallback kiểm tra các trường cũ (`sectContribTotal`, `sectPatrolKills`, `sectManualsBought`, `bonusCrit`, `bonusLifeSteal`).
  - **Khuyến nghị cho đợt nâng cấp:** Khi bổ sung hệ thống Bí Cảnh Roguelike và cây Kỹ Năng Đạo Đồ, cần bổ sung hàm `migrateSaveSchema(data)` an toàn để người chơi tải lại trang không bị mất dữ liệu hoặc lỗi `undefined`.

### 9.2. Phân Tích Rò Rỉ Bộ Nhớ & Vòng Đời Animation
1. **Vòng lặp `requestAnimationFrame` (`PixelRenderer`):**
   - Trong `PixelRenderer` (dòng 1314 và 1458), hàm `this.loop` liên tục gọi `requestAnimationFrame(this.loop)` không điều kiện. Kể cả khi người chơi chuyển sang tab Bách Bảo, Kim Thủ Chỉ, vòng lặp vẫn render ngầm.
   - Cần bổ sung cờ kiểm soát tạm dừng hoặc giảm tần suất render khi Canvas không nằm trong tầm nhìn (viewport).
2. **Quản lý Hạt Linh Khí (Particle Allocation Churn):**
   - Trong `renderMeditateScene()` và `updateAndDrawParticles()`, các hạt khói và linh khí được tạo mới liên tục bằng `this.particles.push({...})` và xóa bằng `splice(i, 1)`. Điều này tạo ra áp lực rác bộ nhớ (GC Pressure).
   - Cần hiện thực hóa **Bộ gom hạt (Particle Object Pool)** theo yêu cầu R4: tạo sẵn một mảng cố định (ví dụ 100 hạt), tái kích hoạt hạt nhàn rỗi (isAlive = true/false) thay vì liên tục cấp phát mới.
3. **Event Listeners Bị Nhân Đôi:**
   - Trong `game.js`, phát hiện có 2 bộ lắng nghe sự kiện phím `window.addEventListener('keydown', ...)` riêng biệt (dòng 5461 và dòng 5748). Cần gộp về một trung tâm điều phối phím duy nhất để tránh xung đột sự kiện.

---

## 10. ĐỀ XUẤT THIẾT KẾ KỸ THUẬT CHO SUB-AGENT A & SUB-AGENT B

### 10.1. Đề xuất Kiến Trúc Kỹ Thuật Cho Combat Engine (R1)
1. **Module hóa `CombatEngine` & Tách File:**
   - Đưa logic chiến đấu ra file chuyên biệt `js/combat.js` hoặc module hóa sạch sẽ trong `game.js`.
2. **Bộ Công Thức Tính Toán Toàn Diện:**
   - **Tỷ lệ Né Đòn:**
     $$\text{Evasion} = \text{clamp}\left(0.02, 0.45, \frac{\text{DefenderSpd} - \text{AttackerSpd}}{\text{DefenderSpd} + \text{AttackerSpd} \times 1.2} + \text{RootMod} + \Delta\text{Realm} \times 0.04\right)$$
   - **Tỷ lệ Giảm Thương (Damage Mitigation):**
     $$\text{Mitigation} = \frac{\text{Def}}{\text{Def} + 150 + \text{RealmIndex} \times 60}$$
   - **Hệ số Áp Chế Cảnh Giới (Realm Delta $\Delta R = R_{\text{atk}} - R_{\text{def}}$):**
     - Nếu $\Delta R > 0$ (Đánh ép cấp dưới): Sát thương gây ra $\times (1 + \Delta R \times 0.15)$, sát thương nhận vào $\times \max(0.2, 1 - \Delta R \times 0.12)$.
     - Nếu $\Delta R < 0$ (Vượt cấp khiêu chiến): Sát thương gây ra $\times \max(0.15, 1 + \Delta R \times 0.12)$, sát thương nhận vào $\times (1 + |\Delta R| \times 0.18)$.
3. **Bộ Quản Lý 5 Trạng Thái Đồng Nhất (`StatusEffects`):**
   - Định dạng đối tượng trạng thái:
     ```javascript
     {
       stun: { turns: 0 },
       burn: { turns: 0, dmgPercent: 0.06 },
       bleed: { turns: 0, stacks: 0, dmgPerStack: 0.04 },
       poison: { turns: 0, dmgPercent: 0.05, defDebuff: 0.15 },
       shield: { turns: 0, hp: 0 }
     }
     ```
   - Xử lý trừ máu và đếm lượt độc lập ở đầu lượt của cả Người Chơi và Quái Vật, hiển thị Floating Text đa sắc tương ứng trên Canvas.
4. **Bộ Kỹ Năng Đạo Đồ Mở Rộng:**
   - Cung cấp ít nhất 2 kỹ năng chủ động + 1 đặc tính bị động cho từng hệ (Kiếm Tu tích Kiếm Khí; Pháp Tu có Hộ Thuẫn & Thiêu Đốt; Thể Tu có Kim Thân & Phản Đòn; Đan Tu có Trừ Tà & Kịch Độc; Ma Tu có Hút Máu & Cuồng Bạo khi HP < 40%).
5. **AI Quái Vật: Nộ Khí & Ý Đồ:**
   - Thêm thanh Nộ `rage: 0 / 100`. Mỗi lần nhận đòn $+15$ nộ, đòn bạo kích $+25$ nộ. Đạt 100 nộ kích hoạt Tuyệt Kỹ Cuồng Nộ.
   - Đầu mỗi hiệp, tính toán trước Ý Đồ (`nextIntent: { type: 'attack'|'skill'|'defend'|'enrage', label, icon }`) và hiển thị lên HUD + Canvas.

### 10.2. Đề xuất Kiến Trúc Kỹ Thuật Cho Bí Cảnh Roguelike (R3)
1. **Cấu Trúc Dữ Liệu Cây Nút (Dungeon Node DAG):**
   - Mỗi lần vào Bí Cảnh tạo một cây ngẫu nhiên 5 tầng:
     - Tầng 1: Lối vào (2 nút lựa chọn).
     - Tầng 2 - 4: Thân bí cảnh (mỗi tầng 3 nút với các loại Combat, Treasure, Rest, Event xen kẽ có đường nối có hướng).
     - Tầng 5: Phòng Boss Trấn Thủ duy nhất.
2. **Giao Diện Bản Đồ Nút (Node Map UI):**
   - Dựng lưới trực quan các nút phân nhánh trong `subtab-world`.
   - Nút đã qua hiển thị tối màu có dấu tích; nút hiện tại phát sáng vàng; các nút có thể đi tiếp nhấp nháy; nút chưa tới được làm mờ.
3. **Vòng Đời Thám Hiểm (Exploration Lifecycle):**
   - Người chơi di chuyển qua từng phòng, giải quyết sự kiện của phòng đó (đánh quái, mở rương, tĩnh dưỡng, kỳ ngộ).
   - Tích lũy chiến lợi phẩm vào giỏ đồ bí cảnh.
   - Cho phép bấm nút "Rút Lui An Toàn" tại phòng tĩnh dưỡng, hoặc chiến đấu tới cùng với Boss để nhận danh hiệu và bách bảo cực phẩm.

---

## 11. TỔNG KẾT & KẾ HOẠCH HỘI TỤ ĐỐI KHÁNG

Báo cáo khảo sát này cung cấp nền tảng chi tiết về cấu trúc hiện hữu, các lỗi tiềm ẩn (dead code, thiếu logic Né Đòn/Giảm Thương/Status Effects, thiếu AI quái và hệ thống Roguelike) để:
- **Sub-Agent A (Builder):** Có đầy đủ công thức toán học, cấu trúc dữ liệu và lộ trình nâng cấp code mà không làm phá vỡ các tính năng hiện hữu.
- **Sub-Agent B (Ruthless Critic):** Có bộ tiêu chí kiểm thử đối kháng chính xác nhằm kiểm tra biên các lỗi rò rỉ bộ nhớ, tính đúng đắn của các vòng lặp combat và tính trọn vẹn của tiến trình Bí Cảnh.
