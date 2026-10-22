# BÁO CÁO KHẢO SÁT KIẾN TRÚC TOÀN DIỆN & GAMESTATE LIFECYCLE
**Dự án:** Tu Tiên Kỳ Truyện: Thiên Đạo Luân Hồi (Retro Pixel RPG)  
**Thời gian khảo sát:** 2026-10-22  
**Người thực hiện:** Explorer 1 (Codebase Architecture & GameState Survey)  
**Tệp mục tiêu:** `game.js`, `index.html`, `style.css`, `js/*.js`, `test_combat_sect.js`

---

## 1. TỔNG QUAN ĐIỀU HÀNH (EXECUTIVE SUMMARY)

Qua khảo sát toàn diện mã nguồn tại `/home/thanh/LÀM VIỆC/project/tutienkitruyen`, hiện trạng dự án như sau:
1. **Kiến trúc mã nguồn:** Toàn bộ logic chạy thực tế của game đang được đóng gói trong một file đơn khối duy nhất là `game.js` (5,989 dòng, dung lượng ~262 KB), được bọc trong một IIFE `(function () { 'use strict'; ... })();`. Trong thư mục `js/` có 7 file (`app.js`, `audio.js`, `combat.js`, `data.js`, `renderer.js`, `sprites.js`, `systems.js`) nhưng toàn bộ đều có dung lượng **0 bytes (rỗng)**. `index.html` chỉ nạp duy nhất `<script src="game.js"></script>` ở dòng 982.
2. **Cú pháp & Tính toàn vẹn:** `node --check game.js` đạt mã thoát 0 (100% không lỗi cú pháp JavaScript). File test `test_combat_sect.js` (5.4 KB, chạy qua Puppeteer) cũng vượt qua `node --check` với mã thoát 0.
3. **GameState & Lưu trữ:** Trạng thái người chơi nằm trong đối tượng `this.player` của `GameSystems`. Cơ chế lưu trữ dùng `localStorage.setItem('tutien_savegame', JSON.stringify(this.player))`. Hiện tại **hoàn toàn chưa có `schemaVersion`**, việc bù khuyết thuộc tính khi tải save cũ đang được chắp vá thủ công rải rác ở `loadFromLocalStorage()`, `importSaveJSON()` và `ensureWorldState()`. Các dữ liệu động quan trọng như `marketItems`, trạng thái phòng ốc Bí Cảnh, hay tiến trình luyện đan chưa được lưu trữ nhất quán.
4. **Vòng đời Render & requestAnimationFrame:** `PixelRenderer` khởi tạo một vòng lặp `requestAnimationFrame(this.loop)` vô tận. Ngay cả khi người chơi chuyển sang Tab Bách Bảo, Tab Kim Thủ Chỉ hay Thế Giới (khi khung canvas `.canvas-viewport` bị ẩn bằng CSS `display: none;`), vòng lặp render vẫn miệt mài tính toán và vẽ lại 60 FPS trên Canvas ẩn, gây lãng phí CPU/GPU và hao pin trên thiết bị di động.
5. **Rò rỉ bộ nhớ (Memory Leaks & GC Pressure):**
   - Hạt linh khí (`particles`) và Floating Texts được cấp phát liên tục (`push({...})`) và hủy bằng `splice()`, tạo áp lực Garbage Collection (GC) lớn trong các phiên chơi cày cuốc dài hạn do thiếu cơ chế **Particle Pooling**.
   - Hàm `renderOpenWorldUI()` tái tạo 121 ô lưới bản đồ (`.world-grid-cell`) và gắn lại 121 event listener `contextmenu` trên mỗi lần di chuyển/cập nhật thay vì dùng event delegation.
   - Tồn tại đồng thời 2 listener sự kiện bàn phím toàn cục `window.addEventListener('keydown')` (dòng 5461 và dòng 5748) cùng bắt phím `Enter` và `Space` mà không được dọn dẹp hoặc gộp luồng.
6. **Khoảng cách so với 4 Yêu Cầu Cốt Lõi (R1 - R4):**
   - **R1 (Chiến Đấu):** Các Đạo Đồ hiện chỉ có 1 kỹ năng chủ động duy nhất; thiếu hệ thống buff/debuff đầy đủ (chưa có Bleed, Shield; đếm lượt chỉ xử lý Độc của Player, bỏ qua Burn và quái vật); công thức Né đòn (Evasion) và Giảm thương theo chênh lệch cảnh giới chưa tồn tại; AI quái vật chỉ dùng xác suất 40% tung skill 1 chứ không kiểm tra hiệu ứng thuộc tính kỹ năng của quái.
   - **R2 (Luyện Đan):** Hiện chỉ là bấm nút với `setTimeout(1500ms)` và `Math.random() < successRate`. Chưa có mini-game điều phối Hỏa Hầu (Văn Hỏa / Vũ Hỏa), chưa có phân cấp phẩm vị đan dược (Hạ/Trung/Thượng/Cực phẩm), chưa có Dược Điển mở khóa theo cảnh giới.
   - **R3 (Bí Cảnh & Tông Môn):** Chưa có hệ thống Bí Cảnh dạng nút phân nhánh Roguelike (Combat, Chest, Rest, Event, Boss); nhiệm vụ Tông Môn hiện tại là mảng tĩnh 4 nhiệm vụ cố định, chưa phân cấp theo chức vị.
   - **R4 (Kiến Trúc & Zero-Leak):** Cần hệ thống Migration phiên bản hóa, Particle Pool, RAF visibility pause, và Event Delegation.

---

## 2. CẤU TRÚC TỆP TIN & KHẢO SÁT KIẾN TRÚC MÃ NGUỒN

### 2.1. Phân bổ tệp tin (File Topology)
```
tutienkitruyen/
├── index.html                   (53 KB, 985 dòng - UI Dashboard 3 cột, modals, mobile HUD)
├── style.css                    (67.9 KB, 3,109 dòng - Retro Pixel Cổ Phong, responsive PC & Mobile)
├── game.js                      (262 KB, 5,989 dòng - Toàn bộ mã nguồn vận hành của trò chơi)
├── js/
│   ├── app.js                   (0 bytes - File rỗng)
│   ├── audio.js                 (0 bytes - File rỗng)
│   ├── combat.js                (0 bytes - File rỗng)
│   ├── data.js                  (0 bytes - File rỗng)
│   ├── renderer.js              (0 bytes - File rỗng)
│   ├── sprites.js               (0 bytes - File rỗng)
│   └── systems.js               (0 bytes - File rỗng)
├── css/                         (Thư mục rỗng)
├── test_combat_sect.js          (5.4 KB, 148 dòng - Puppeteer integration test)
├── test_mobile_ui.js            (0 bytes)
└── test_popups_and_char_sheet.js(0 bytes)
```

### 2.2. Điểm nhập (Entry Point) & Trật tự khởi tạo
Trong `index.html`:
- Dòng 11: `<link rel="stylesheet" href="style.css">`
- Dòng 982: `<script src="game.js"></script>`

Trong `game.js`:
- Khởi đầu bằng IIFE: `(function () { 'use strict'; ... })();` (dòng 9 - dòng 5987).
- Sự kiện nạp DOM: `document.addEventListener('DOMContentLoaded', () => { ... })` tại dòng 5254.
- Chuỗi khởi tạo:
  1. `const renderer = new PixelRenderer(mainCanvas);` (dòng 5256)
  2. `const systems = new GameSystems(renderer, addLog);` (dòng 5257)
  3. `renderer.setSystems(systems);` (dòng 5260)
  4. `const combatEngine = new CombatEngine(renderer, addLog, callback);` (dòng 5262)
  5. `systems.setCombatEngine(combatEngine);` (dòng 5268)
  6. Vẽ Avatar Pixel tĩnh trên Canvas nhỏ (`avatar-canvas`, `mobile-avatar-canvas`) (dòng 5270 - 5286).
  7. Kiểm tra savegame qua `systems.loadFromLocalStorage()` (dòng 5288):
     - Nếu có save: Ẩn `creation-modal`, gọi `systems.updateUI()`.
     - Nếu không có save: Gọi `initCreationModal(systems)` mở quy trình 3 bước Thiên Mệnh Luân Hồi.
  8. Gắn sự kiện giao diện: `setupUIEvents(systems, combatEngine, renderer);` (dòng 5296).

### 2.3. Các phân vùng chức năng trong `game.js`
`game.js` được phân chia thành 8 khối rõ ràng bằng comment headers:
1. **Phần 1 (Dòng 13 - 457):** Procedural Pixel Sprites & Render Helper (`SPRITES`, `drawPixelSprite`).
2. **Phần 2 (Dòng 458 - 644):** Sound Synthesizer (`SoundSynthesizer` sử dụng Web Audio API).
3. **Phần 3 (Dòng 645 - 1276):** Static Game Data (`REALMS`, `SPIRIT_ROOTS`, `PHYSIQUES`, `CULTIVATION_PATHS`, `CHEAT_CORES`, `CHEAT_PERKS`, `WORLD_REGIONS`, `MONSTERS`, `ITEMS`, `RECIPES`, `SECTS`, `SECT_QUESTS`, `RANDOM_EVENTS`, `WORLD_FACTIONS`).
4. **Phần 4 (Dòng 1277 - 2056):** Canvas Pixel Renderer & Particle Engine (`PixelRenderer`, `SCENES`).
5. **Phần 5 (Dòng 2057 - 2868):** Turn-based Combat Engine (`CombatEngine`).
6. **Phần 6 (Dòng 2869 - 5105):** Core Game Systems (`GameSystems` - Tu luyện, Đột phá, Thế giới mở, Tông môn, Chợ, Túi đồ).
7. **Phần 7 (Dòng 5106 - 5829):** App Controller, Logging & DOM Event Wire-up (`switchTab`, `setupUIEvents`).
8. **Phần 8 (Dòng 5830 - 5985):** Modal Thiên Mệnh Luân Hồi (`initCreationModal`).

---

## 3. GAMESTATE & DATA MODEL SURVEY

### 3.1. Cấu trúc thực tế của `this.player`
Đối tượng trạng thái trung tâm được tạo tại `initNewCharacter()` (dòng 2895 - 2946):
```javascript
this.player = {
  name: daoHieu || 'Vô Danh Tu Sĩ',
  realmIndex: 0,
  exp: 0,
  age: 16,
  month: 1,
  spiritualRoot: root,              // Object tham chiếu từ SPIRIT_ROOTS
  physique: physique,                // Object tham chiếu từ PHYSIQUES
  comprehension: comprehension,      // Number (40 - 100)
  cultivationPath: path,            // Object tham chiếu từ CULTIVATION_PATHS

  cheatSystemName: cheatName,
  cheatCore: core,                  // Object tham chiếu từ CHEAT_CORES
  cheatPerk: perk,                  // Object tham chiếu từ CHEAT_PERKS
  cheatPoints: 50,
  lastSignInYear: -1,
  signedRegions: {},
  worldLocation: 'region_1',
  worldGridPosition: { x: 0, y: 0 },
  worldResidence: null,
  worldFaction: null,
  worldAlliances: [],
  worldRelations: {},
  worldMetTravelers: [],
  skillMastery: 1,

  bonusHp: 0, bonusMp: 0, bonusAtk: 0, bonusDef: 0, bonusSpd: 0,

  equippedWeapon: path.startArtifact.type === 'weapon' ? path.startArtifact : null,
  equippedArmor: path.startArtifact.type === 'armor' ? path.startArtifact : null,
  equippedArtifact: path.startArtifact.type === 'artifact' ? path.startArtifact : null,
  activeSkill: path.startSkill,

  spiritStones: 100,
  inventory: {
    pill_hoixuan: 3,
    pill_tulinh: 2,
    pill_tukhi: 2,
    herb_linhchi: 5,
    ore_huyenthiet: 3
  },

  sectId: null,
  sectContrib: 0,
  sectContribTotal: 0,
  sectSalaryClaimedYear: -1,
  sectPatrolKills: 0,
  sectManualsBought: [],
  bonusCrit: 0,
  bonusLifeSteal: 0,
  isInjured: false
};
```

### 3.2. Cơ chế Lưu & Tải (Serialization & Persistence)
- **Lưu tự động:** `setInterval` mỗi 5000ms (`this.saveTimer`, dòng 3018) gọi `this.saveToLocalStorage()`.
- **Phương thức lưu:**
  ```javascript
  saveToLocalStorage() {
    if (!this.player) return;
    try {
      localStorage.setItem('tutien_savegame', JSON.stringify(this.player));
    } catch (e) {
      console.error('Lưu game thất bại:', e);
    }
  }
  ```
- **Phương thức nạp:**
  ```javascript
  loadFromLocalStorage() {
    try {
      const dataStr = localStorage.getItem('tutien_savegame');
      if (dataStr) {
        this.player = JSON.parse(dataStr);
        if (this.player.sectContribTotal === undefined) this.player.sectContribTotal = this.player.sectContrib || 0;
        if (this.player.sectPatrolKills === undefined) this.player.sectPatrolKills = 0;
        if (!this.player.sectManualsBought) this.player.sectManualsBought = [];
        if (this.player.bonusCrit === undefined) this.player.bonusCrit = 0;
        if (this.player.bonusLifeSteal === undefined) this.player.bonusLifeSteal = 0;
        this.ensureWorldState();
        this.currentRegion = this.getWorldRegion(this.player.worldLocation);
        this.recalculatePlayerStats();
        this.refreshMarket();
        this.startLoops();
        return true;
      }
    } catch (e) { ... }
    return false;
  }
  ```

### 3.3. Các lỗ hổng kiến trúc trong Quản lý Trạng thái (GameState Vulnerabilities)
1. **Thiếu Schema Versioning:** Không có trường `version` hay `schemaVersion`. Khi Sub-Agent A bổ sung các hệ thống mới (kỹ năng chủ động/bị động của R1, Dược Điển & lò đan của R2, node graph Bí Cảnh của R3), người chơi tải save cũ sẽ gặp lỗi `TypeError: cannot read property of undefined` nếu truy cập trực tiếp.
2. **Trùng lặp logic Patch dữ liệu (DRY Violation):** Các dòng gán mặc định (`sectContribTotal`, `sectPatrolKills`, `sectManualsBought`, `bonusCrit`, `bonusLifeSteal`) bị duplicate nguyên vẹn ở cả `loadFromLocalStorage` (dòng 4322-4326) và `importSaveJSON` (dòng 4352-4356).
3. **Mất mát dữ liệu động không được lưu:**
   - `marketItems` không được serialize. Mỗi lần F5 trang, danh sách vật phẩm chợ bị xáo trộn mới (`refreshMarket`).
   - Tiến trình Bí Cảnh (nếu người chơi thoát giữa chừng một ải Roguelike) chưa có vị trí lưu trong `this.player`.
   - Trạng thái Lò Luyện Đan (mini-game đang nấu dở) không có vị trí trong schema.
4. **Nguy cơ lỗi hỏng JSON (State Corruption):**
   - Không có cơ chế lưu dự phòng (Safe Backup / Shadow Key): Nếu trình duyệt tắt đột ngột đúng khoảnh khắc `localStorage.setItem` ghi dữ liệu hoặc đầy bộ nhớ (`QuotaExceededError`), file save bị hỏng và không thể khôi phục.
   - Chưa có kiểm tra tính hợp lệ kiểu dữ liệu (Schema Validation) trước khi gán `this.player = parsed`.

---

## 4. VÒNG ĐỜI RENDER & ENGINE LIFECYCLE

### 4.1. Kiến trúc `PixelRenderer`
- **Canvas:** Kích thước gốc `width = 640`, `height = 360` (tỷ lệ chuẩn 16:9).
- **Context 2D:** `this.ctx = canvas.getContext('2d')`, đặt `this.ctx.imageSmoothingEnabled = false` để giữ độ sắc nét Pixel Art.
- **Vòng lặp chính (Render Loop):**
  ```javascript
  loop() {
    this.time++;
    this.ctx.save();
    // Xử lý rung màn hình
    if (this.shakeDuration > 0) { ... }
    // Xóa nền đen
    this.ctx.fillStyle = '#07090e';
    this.ctx.fillRect(0, 0, this.width, this.height);

    switch (this.currentScene) {
      case SCENES.MEDITATE: this.renderMeditateScene(); break;
      case SCENES.TRIBULATION: this.renderTribulationScene(); break;
      case SCENES.COMBAT: this.renderCombatScene(); break;
      case SCENES.ALCHEMY: this.renderAlchemyScene(); break;
      default: this.renderMeditateScene();
    }

    this.updateAndDrawParticles();
    this.updateAndDrawFloatingTexts();
    this.ctx.restore();

    requestAnimationFrame(this.loop);
  }
  ```

### 4.2. Vấn đề Hiệu năng & Rò rỉ Chu kỳ (RAF Overdraw)
- **Vẽ vô ích khi Canvas bị ẩn:**
  Trong `style.css`:
  ```css
  .canvas-viewport { display: none; }
  body.tab-nhanvat-active .canvas-viewport { display: block; }
  body.combat-active-mode .canvas-viewport { display: block; }
  ```
  Khi người chơi bấm sang Tab Bách Bảo (`tab-bachbao`), Tab Kim Thủ Chỉ (`tab-cheat`), hoặc Tab Thế Giới (`tab-tiengioi`), `.canvas-viewport` chuyển sang `display: none`. Tuy nhiên, `requestAnimationFrame(this.loop)` vẫn tiếp tục chạy liên tục 60 lần/giây, thực hiện toàn bộ việc vẽ các lớp Gradient, 85 ngôi sao, mây mù Parallax, và cập nhật tọa độ hạt!
- **Thiếu kiểm soát Tab Visibility:** Game không lắng nghe sự kiện `visibilitychange` của document. Khi người chơi chuyển sang tab trình duyệt khác, vòng lặp và các timer (`idleTimer`, `saveTimer`, `combatInterval`) vẫn tiếp tục tiêu tốn tài nguyên máy khách.
- **Không có cơ chế Hủy Render (`destroy` / `stop`):** `PixelRenderer` không lưu `requestId` trả về từ `requestAnimationFrame`, không thể gọi `cancelAnimationFrame(this.rafId)`.

---

## 5. VÒNG ĐỜI BỘ NHỚ & ĐIỂM NÓNG RÒ RỈ (MEMORY LEAKS & LIFECYCLE)

### 5.1. Rò rỉ qua Cấp phát Hạt & Áp lực Rác (GC Churn)
- **Vị trí quan sát:** Dòng 1381 - 1421 (`spawnQiParticles`, `spawnLightningSparks`) và Dòng 1975 - 2052 (`updateAndDrawParticles`, `updateAndDrawFloatingTexts`).
- **Cơ chế hiện tại:**
  - Mỗi khi gọi `spawnQiParticles()`, một object mới toanh được tạo bằng object literal `{ isSpiral: true, r: ..., theta: ... }` rồi `push` vào `this.particles`.
  - Hàm `spawnLightningSparks()` tạo một vòng lặp 15 lần, mỗi lần `push` một object mới vào mảng.
  - Khi hạt hết đời (`p.life <= 0`), code gọi `this.particles.splice(i, 1)`.
  - Việc liên tục cấp phát object và đẩy vào mảng rồi xóa bằng `splice` tạo ra hàng chục nghìn đối tượng rác mỗi phút. Trên các thiết bị di động hoặc trình duyệt chạy nhiều giờ, điều này dẫn đến hiện tượng khựng giật (GC stutter / frame drops) định kỳ.
- **Giải pháp bắt buộc cho R4:** Xây dựng **ParticlePool** với số lượng hạt cố định được cấp phát trước (ví dụ: mảng tĩnh 120 phần tử), tái sử dụng đối tượng bằng cờ `active: boolean` và hàm `reset()`, tuyệt đối không dùng `new` / object literal hoặc `splice` trong render loop.

### 5.2. Rò rỉ Listeners khi Render Lưới Thế Giới (`renderOpenWorldUI`)
- **Vị trí quan sát:** Dòng 4915 - 4927 trong `game.js`.
- **Cơ chế hiện tại:**
  ```javascript
  mapEl.innerHTML = gridHtml; // Tạo 121 ô button .world-grid-cell
  mapEl.querySelectorAll('.world-grid-cell').forEach(cell => {
    cell.addEventListener('contextmenu', event => {
      event.preventDefault();
      this.openWorldCellMenu(...);
    });
  });
  ```
- Mỗi lần người chơi di chuyển ô đất hoặc đổi khu vực, hàm `renderOpenWorldUI()` chạy lại, tạo mới 121 DOM button và đăng ký 121 closure function mới.
- **Giải pháp bắt buộc cho R4:** Dùng **Event Delegation** (chỉ lắng nghe một sự kiện duy nhất trên thẻ cha `#world-map`, dùng `event.target.closest('.world-grid-cell')` để xác định ô được tương tác).

### 5.3. Xung đột và Dư thừa Listeners Toàn cục (Global Keydown)
- **Vị trí quan sát:**
  - Listener 1: Dòng 5461 - 5487 (`window.addEventListener('keydown', (e) => { ... })`) xử lý phím chiến đấu `[1..5]`, `[A]`, `[S]`, `[Space/Enter]`.
  - Listener 2: Dòng 5748 - 5826 (`window.addEventListener('keydown', (e) => { ... })`) xử lý phím `[L]`, `[Escape]`, `[Enter/Space]`.
- Cả hai listener đều gắn vào `window` và cùng kiểm tra `e.key === ' ' || e.key === 'Enter'`. Điều này tạo ra xung đột tiềm ẩn khi một hành động đóng modal và kích hoạt đòn đánh chiến đấu cùng diễn ra trên một phím gõ.
- Cần hợp nhất thành một bộ điều phối phím duy nhất (`InputManager` hoặc `KeyDispatcher`) có kiểm tra trạng thái modal / context hiện hành.

### 5.4. Vấn đề Dọn dẹp Modal Buttons
- Trong `showConfirm` (dòng 3463) và `showAlert` (dòng 3494), code đã có hàm `cleanup()` gỡ bỏ `.onclick = null`.
- Nhưng trong `showItemDetailModal` (dòng 3375 - 3421), khi người chơi đóng modal bằng phím `Escape` (dòng 5792: `itemModal.classList.add('hidden')`), các handler `btnPrimary.onclick` và `btnSell.onclick` vẫn giữ nguyên tham chiếu closure đến `item` và `source` cũ trong DOM, không được dọn dẹp sạch sẽ.

---

## 6. KIỂM TRA SỨC KHỎE CÚ PHÁP & TƯƠNG THÍCH LAYOUT

### 6.1. Kiểm tra Cú pháp (Syntax Health)
- Lệnh thực thi:
  ```bash
  node --check game.js
  node --check test_combat_sect.js
  ```
  **Kết quả:** Exit Code = 0, không có bất kỳ lỗi SyntaxError nào.

### 6.2. Kiểm tra Layout Tương thích (PC & Mobile)
- **PC (1280x750, 1920x1080):**
  - Layout chia 3 cột: Cột trái (Thông tin nhân vật & HP/MP: 260px), Cột giữa (Dashboard chính + Canvas: flex 1, max-width 780px), Cột phải (Thiên Cơ Lục: 290px cố định hoặc trượt rút).
  - Tỷ lệ khung canvas duy trì 16:9 (`aspect-ratio: 16 / 9`, `max-width: 540px`).
- **Mobile (390x844 - iPhone 12/13/14, Pixel 7):**
  - Bố cục responsive qua CSS `@media (max-width: 768px)`:
    - Ẩn cột trái `.left-panel` (`display: none !important`), đưa HP/MP lên thanh `.mobile-top-hud` đỉnh màn hình.
    - Cột giữa chiếm 100% chiều rộng màn hình.
    - Thanh điều hướng 4 trụ cột chuyển xuống đáy (`.mobile-bottom-nav`), cố định bằng `position: fixed; bottom: 0;`.
    - Menu quản lý dữ liệu (Lưu, Nhập, Xuất, Luân Hồi) chuyển vào popup `mobile-menu-modal`.
  - Chiều cao container sử dụng đơn vị hiện đại `100dvh` (Dynamic Viewport Height) tránh bị thanh địa chỉ trình duyệt mobile đè lấp.

---

## 7. MAPPING ĐỐI SOÁT VỚI 4 HỆ THỐNG CỐT LÕI (R1 - R4)

Bảng đối soát chi tiết giữa yêu cầu nghiệp vụ và hiện trạng mã nguồn:

| Phân hệ | Yêu cầu nghiệp vụ | Hiện trạng trong Codebase (`game.js`) | Hạng mục cần xây dựng / Tái cấu trúc |
|---|---|---|---|
| **R1: Chiến Đấu** | Bộ kỹ năng chủ động & đặc tính bị động riêng biệt theo 5 Đạo Đồ (Kiếm Tu, Pháp Tu, Thể Tu, Đan Tu, Ma Tu). | Mỗi Đạo Đồ chỉ có 1 skill duy nhất trong `CULTIVATION_PATHS` (dòng 745, 773, 801, 829, 857). Chưa có kỹ năng thứ 2 hoặc đặc tính bị động. | Xây dựng danh mục kỹ năng chủ động (Skill Tree / Active Skill List) và nội tại bị động (Passives) theo cấp cảnh giới. |
| **R1: Chiến Đấu** | Hệ thống Status Effects: Stun, Burn, Bleed, Poison, Shield có tick turns và hiển thị Floating Text Canvas. | Trong `CombatEngine` chỉ có `poisonTurns`, `burnTurns`, `frozenTurns`, `stunnedTurns`. Thiếu `bleedTurns` và `shield`. Tick turn chỉ xử lý Poison trên player; quái vật hoàn toàn không bị dính sát thương theo lượt. | Bổ sung đầy đủ 5 trạng thái; chuẩn hóa hàm tick turn 2 chiều (Player & Monster); vẽ icon trạng thái trên Canvas HUD. |
| **R1: Chiến Đấu** | Tỷ lệ Né đòn (Evasion), Bạo kích (Crit), Giảm thương theo Thân pháp và chênh lệch cảnh giới. | Hoàn toàn chưa có công thức Né đòn (Evasion); quái vật không có Crit; công thức trừ giáp là tuyến tính thô sơ (`- playerDef * 0.35`). | Tích hợp công thức Né đòn dựa trên Thân Pháp (`spd`), Bạo kích 2 chiều, và hệ số đè bẹp cảnh giới (Realm Gap Modifier). |
| **R1: Chiến Đấu** | AI quái vật (tấn công, tích nộ, tuyệt kỹ) và diễn hoạt Canvas. | AI quái chỉ kiểm tra xác suất ngẫu nhiên 40% tung skill 1; bỏ qua các cờ `poison`, `burn`, `lifeSteal` của quái. | Xây dựng AI State Machine (Normal -> Enraged / Ultimate khi HP thấp hoặc nộ đầy), áp dụng hiệu ứng debuff từ quái lên player. |
| **R2: Luyện Đan** | Mini-game tương tác điều phối Hỏa Hầu (Văn Hỏa, Vũ Hỏa) và timing phản ứng dược liệu. | Chỉ là hàm `craftRecipe()` (dòng 3980) với `setTimeout` 1500ms và `Math.random() < successRate`. | Xây dựng mini-game tương tác: thanh nhiệt kế Hỏa Hầu (Văn Hỏa / Vũ Hỏa), nút bấm điều phối nhiệt độ trong khung thời gian vàng. |
| **R2: Luyện Đan** | Phân định 4 phẩm cấp đan dược: Hạ phẩm, Trung phẩm, Thượng phẩm, Cực phẩm; tính tỷ lệ thành đan và nổ lò rung lắc. | Chỉ có 2 kết quả nhị phân: Thành công x1 hoặc Thất bại mất nguyên liệu. Chưa có phẩm cấp đan dược. | Phân định 4 phẩm cấp dựa trên điểm timing hỏa hầu; gia tăng hiệu quả theo phẩm cấp; hiệu ứng nổ lò với screen shake & khói bụi. |
| **R2: Luyện Đan** | Kho Dược Điển & Đan Phương mở khóa theo cảnh giới, liên kết nguồn thảo dược bí cảnh. | `RECIPES` là mảng tĩnh 6 công thức lộ thiên, không có hệ thống mở khóa hay Dược Điển tra cứu. | Bổ sung Dược Điển (Alchemical Codex), hệ thống mở khóa đan phương theo cảnh giới tu vi và thành tựu luyện đan. |
| **R3: Bí Cảnh & Tông Môn** | Bí Cảnh Roguelike dạng nút phân nhánh: Chiến đấu, Bảo rương, Tĩnh dưỡng, Kỳ ngộ, Boss trấn thủ. | Chỉ có hàm `exploreWorld()` (dòng 3504) tung xúc xắc ngẫu nhiên 1 lần và bản đồ ô lưới 11x11 đơn giản. | Xây dựng engine Bí Cảnh Roguelike (Dungeon Node Graph): sinh bản đồ phân nhánh ngẫu nhiên, lưu trạng thái chạy ải, boss cuối mỗi tầng. |
| **R3: Bí Cảnh & Tông Môn** | Nấc thang địa vị môn phái hoàn chỉnh, nhiệm vụ phân hóa theo chức vị, bổng lộc định kỳ, đổi tuyệt học Tàng Kinh Các. | Đã có rank và bổng lộc, nhưng nhiệm vụ `SECT_QUESTS` là mảng cố định 4 nhiệm vụ dùng chung cho mọi chức vị. | Nâng cấp hệ thống nhiệm vụ Tông Môn đa dạng theo chức vị (Tạp Dịch, Ngoại Môn, Nội Môn, Chân Truyền, Trưởng Lão). |
| **R4: GameState & Zero-Leak** | Serialization an toàn, cơ chế migration chống lỗi schema cũ, tự động lưu ổn định. | Serialization dùng `JSON.stringify(this.player)` thô; không có schema version; patch dữ liệu rải rác. | Xây dựng `SaveMigrationManager` có versioning (v1 -> v2 -> v3), checksum kiểm tra toàn vẹn, và backup key. |
| **R4: GameState & Zero-Leak** | Quản lý vòng đời RAF sạch sẽ, dọn dẹp listeners, pooling hạt trong `PixelRenderer`. | RAF chạy liên tục kể cả khi ẩn canvas; thiếu Particle Pool (GC churn); duplicate keydown listeners; re-bind 121 listeners ô lưới. | Tích hợp cơ chế tạm dừng RAF khi ẩn canvas/tab; cài đặt `ParticlePool`; áp dụng Event Delegation trên map grid; gộp keydown. |

---

## 8. ĐỀ XUẤT KIẾN TRÚC & HƯỚNG DẪN CHO SUB-AGENT A & B

### 8.1. Hướng dẫn Triển khai cho Sub-Agent A (Builder)
1. **Kiến trúc Tệp (Modular vs Single Bundle):**
   - Hiện tại `index.html` chỉ nạp `game.js`. Nếu giữ nguyên mô hình single script để đảm bảo tính chạy độc lập 100% không cần bundler/HTTP server phức tạp, hãy tổ chức các class và module nội bộ bên trong `game.js` một cách mạch lạc.
2. **Thiết kế Migration Pipeline (R4):**
   - Đặt `SCHEMA_VERSION = 2;` vào metadata của file save: `{ version: 2, timestamp: Date.now(), player: { ... } }`.
   - Viết hàm `migrateSaveData(rawSave)` với các bước chuyển đổi tuần tự:
     ```javascript
     function migrateSaveData(saveObj) {
       let currentVersion = saveObj.version || 1;
       let data = saveObj.player || saveObj; // tương thích save v1 cũ
       if (currentVersion === 1) {
         // Nâng cấp lên v2: Khởi tạo bảng kỹ năng mới, dược điển, tiến trình bí cảnh...
         data.skills = data.skills || [data.activeSkill];
         data.unlockedRecipes = data.unlockedRecipes || ['rec_hoixuan', 'rec_tulinh'];
         data.alchemyStats = data.alchemyStats || { level: 1, exp: 0, furnaceTier: 1 };
         data.dungeonState = null;
         currentVersion = 2;
       }
       return { version: currentVersion, player: data };
     }
     ```
3. **Cài đặt `ParticlePool` trong `PixelRenderer`:**
   - Thay vì `this.particles.push({...})` và `splice()`, khởi tạo sẵn `this.particlePool = new Array(150).fill(null).map(() => new Particle())`.
   - Khi cần phát hạt, lấy phần tử có `active === false`, reset các thuộc tính, và kích hoạt `active = true`.
4. **Kiểm soát Tạm dừng Render (RAF Throttling):**
   - Theo dõi trạng thái hiển thị của Canvas Viewport: nếu không ở Tab Nhân Vật và không ở chế độ Chiến Đấu, bỏ qua các bước vẽ cảnh phức tạp hoặc tạm dừng requestAnimationFrame.
   - Thêm lắng nghe `document.addEventListener('visibilitychange')` để tự động pause khi người chơi chuyển tab trình duyệt.

### 8.2. Danh mục Kiểm thử Rủi ro cho Sub-Agent B (Red Team Critic)
Sub-Agent B cần tập trung rà soát các kịch bản đối kháng sau:
1. **Save Migration Stress Test:** Tải lại savegame cũ từ LocalStorage (phiên bản v1 không có trường mới của R1, R2, R3). Xác nhận game không văng lỗi unhandled exception.
2. **Memory Leak Profiling:** Mở devtools / chạy giả lập đả tọa và chiến đấu liên tục trong 5 phút. Đo số lượng DOM Nodes, Event Listeners, và Heap Allocation xem có tăng tuyến tính không.
3. **Combat State Desync:** Bấm phím tắt đánh [1..5] dồn dập trong lúc đối thủ đang diễn hoạt sát chiêu, kiểm tra xem có bị race condition làm kẹt `isProcessingTurn` hay không.
4. **Alchemy Exploit:** Thử nghiệm bấm liên tục nút Luyện đan khi đang trong quá trình mini-game xem có bị trừ nguyên liệu 2 lần hoặc nhận gấp đôi đan dược không.
5. **Roguelike Dungeon Integrity:** F5 trình duyệt khi đang ở giữa một phòng bí cảnh; xác nhận tiến độ ải không bị reset về 0 hoặc nhân bản phần thưởng.
6. **Mobile Viewport Overflow:** Kiểm tra màn hình 390x844 xem có bị vỡ giao diện, cuộn ngang (horizontal scroll), hay đè lấp nút bấm bởi mobile bottom nav hay không.

---
*Báo cáo được hoàn thành bởi Explorer 1 — Sẵn sàng bàn giao cho Orchestrator và các Sub-Agent đối kháng.*
