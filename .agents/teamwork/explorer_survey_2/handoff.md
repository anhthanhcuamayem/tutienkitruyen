# BÁO CÁO BÀN GIAO (HANDOFF REPORT) - EXPLORER 2: COMBAT ENGINE & ROGUELIKE DUNGEON

**Agent:** Explorer 2 (Combat Engine & Roguelike Dungeon Survey)  
**Parent Orchestrator:** `510cb232-0f10-44ba-9cf6-e4a342779d9b`  
**Working Directory:** `/home/thanh/LÀM VIỆC/project/tutienkitruyen/.agents/teamwork/explorer_survey_2`  
**Handoff Type:** Hard (Task complete)  
**Target Output Artifact:** `/home/thanh/LÀM VIỆC/project/tutienkitruyen/.agents/teamwork/explorer_survey_2/survey_combat_dungeon.md`

---

## 1. OBSERVATION (Quan Sát Trực Tiếp)

1. **Cấu trúc File & Kiến trúc Nguyên khối:**
   - Thư mục `js/` (`combat.js`, `systems.js`, `data.js`, `app.js`, `audio.js`, `renderer.js`, `sprites.js`) toàn bộ đều là file rỗng (kích thước 0 bytes, đã xác nhận qua lệnh `ls -lh js/`).
   - `index.html:982` nạp trực tiếp `<script src="game.js"></script>`.
   - File `game.js` gồm 5,988 dòng code, chứa toàn bộ logic ứng dụng trong một IIFE.
   - `node --check game.js` trả về Exit Code 0 (cú pháp hợp lệ).

2. **Cơ Chế Chiến Đấu Trong `CombatEngine` (`game.js:2059 - 2865`):**
   - Vòng lặp nạp lượt ATB sử dụng `setInterval` nhịp 70ms (`game.js:2158`).
   - Xử lý mốc 100 điểm nạp lượt:
     ```javascript
     if (this.playerCombat.actionGauge >= 100) {
       this.playerCombat.actionGauge = 0;
       this.triggerPlayerTurn();
     } else if (this.monsterCombat.actionGauge >= 100) {
       this.monsterCombat.actionGauge = 0;
       this.triggerMonsterTurn();
     }
     ```
     (`game.js:2171-2177`).
   - Công thức sát thương người chơi đánh thường (`game.js:2292-2305`):
     `let dmg = Math.max(1, Math.floor(baseAtk * (1 + (Math.random() - 0.5) * 0.2) - monDef * 0.4));`
     `if (isCrit) dmg = Math.floor(dmg * (1.5 + (this.player.totalCritDmg || 0.5)));`
   - Tuyệt kỹ (`game.js:2358`):
     `let dmg = Math.max(1, Math.floor(this.player.totalAtk * (skill.dmgMult || 1.8) - this.monster.def * 0.3));`
   - Đòn đánh quái vật (`game.js:2528`):
     `let dmg = Math.max(1, Math.floor(monAtk * (1 + (Math.random() - 0.5) * 0.15) - playerDef * 0.35));`

3. **Lỗ Hổng Thiếu Sót Trong Tính Toán Chỉ Số & Status Effects:**
   - **Né Đòn (Evasion):** Trong `playerNormalAttack()` và `triggerMonsterTurn()`, không hề có phép kiểm tra né đòn nào; mọi đòn đánh đều trúng đích 100%.
   - **Giảm Thương & Áp Chế Cảnh Giới:** Hoàn toàn thiếu công thức giảm thương theo tỷ lệ phần trăm và hệ số chênh lệch cảnh giới tu vi giữa người chơi và quái vật.
   - **Hiệu ứng Trạng Thái (Status Effects):**
     - `poisonTurns`, `burnTurns`, `frozenTurns` được khai báo trong constructor nhưng không có kỹ năng nào của người chơi hoặc quái vật thiết lập giá trị này (ngoại trừ Thể Tu gán `stunnedTurns = 1` ở `game.js:2388`).
     - Kỹ năng Pháp Tu *Cửu Thiên Huyền Hỏa* có `burnChance: 0.5` (`game.js:777`), nhưng ở `playerCastSkill` (`game.js:2353`) chỉ dùng để đổi màu hiệu ứng chém `'fire'`, không hề gán `monsterCombat.burnTurns`.
     - Quái vật `snake_novice` có `skills: [{ poison: true }]` (`game.js:1026`) và `tiger_fire` có `skills: [{ burn: true }]` (`game.js:1032`), nhưng trong `triggerMonsterTurn` (`game.js:2512-2563`) hoàn toàn không có lệnh kiểm tra để gán `playerCombat.poisonTurns` hay `burnTurns`.
     - Trong lượt của quái vật (`game.js:2489-2563`), hoàn toàn không có lệnh trừ máu do độc hoặc thiêu đốt cho quái vật.
     - Xuất Huyết (Bleed) và Kim Thân / Hộ Thuẫn (Shield với chỉ số HP) hoàn toàn chưa có trong mã nguồn.

4. **AI Quái Vật & Diễn Hoạt Canvas:**
   - Quái vật chỉ có hành vi ngẫu nhiên `Math.random() < 0.4` tung chiêu đầu tiên (`game.js:2512`). Không có ý đồ (intent), không có thanh Nộ (Rage).
   - Diễn họa Canvas trong `PixelRenderer.renderCombatScene()` (`game.js:1712-1939`) đã có nền Huyết Nguyệt, sấm sét ma đạo, vòng bát quái dưới chân người chơi, phi kiếm Kiếm Tu, vòng ma trận dưới chân quái, thanh máu overhead mini bar, hiệu ứng chém và floating text.

5. **Hệ Thống Bí Cảnh Hiện Tại (`exploreWorld`, `game.js:3504-3560`):**
   - Chỉ là một nút bấm đơn lẻ trong `subtab-world`: 45% vào combat ngẫu nhiên, 30% mở modal 4 kỳ ngộ tĩnh `RANDOM_EVENTS`, 25% nhặt thảo dược/khoáng thạch.
   - Hoàn toàn chưa có cấu trúc phân nhánh Roguelike (các phòng Combat, Treasure, Rest, Event, Boss) theo yêu cầu R3.

---

## 2. LOGIC CHAIN (Chuỗi Lập Luận Kỹ Thuật)

1. Từ **Quan sát 1**, nhận thấy dự án đang duy trì toàn bộ logic trong `game.js`, các file trong `js/` đang trống. Để đảm bảo không phá vỡ liên kết và tương thích 100% với `index.html`, việc nâng cấp có thể thực hiện trực tiếp trong `game.js` hoặc chuyển dịch dần nếu có sự đồng thuận kiến trúc, nhưng trước mắt phải giữ vững tính nguyên vẹn không lỗi cú pháp (`node --check game.js` = 0).
2. Từ **Quan sát 2 & 3**, công thức giao tranh hiện tại chỉ là phép trừ tuyến tính cơ bản (`ATK - DEF * factor`). Việc thiếu vắng Né Đòn, Giảm Thương và Áp Chế Cảnh Giới khiến trải nghiệm tu tiên mất đi tính chân thực (tu sĩ cảnh giới cao không tạo được uy áp lên yêu thú cấp thấp, thân pháp cao không né được đòn).
3. Từ **Quan sát 3**, sự tồn tại của các biến trạng thái (`burnTurns`, `poisonTurns`, `frozenTurns`) trong state nhưng không được gán hay tick sát thương chứng tỏ đây là các tính năng dang dở (incomplete stubs). Việc xây dựng một `CombatStatusManager` đồng nhất là yêu cầu tối khẩn cấp để đáp ứng trọn vẹn tiêu chí R1.
4. Từ **Quan sát 4**, AI quái vật hiện tại thiếu tính chiến thuật vì người chơi không thể phản ứng lại các đòn đánh nguy hiểm. Bổ sung cơ chế Ý Đồ (Intent telegraphing) và tích Nộ (Rage meter) sẽ biến turn-based combat thành một cuộc đấu trí chiến thuật đúng nghĩa.
5. Từ **Quan sát 5**, tính năng khám phá bí cảnh hiện tại chỉ là nút bấm RNG phẳng (flat random clicker). Để đạt tiêu chuẩn R3, bắt buộc phải kiến trúc một hệ thống Roguelike Dungeon dạng sơ đồ nút (Directed Acyclic Graph) với 5 loại phòng riêng biệt và vòng lặp thám hiểm trọn vẹn.

---

## 3. CAVEATS (Vấn Đề Cần Lưu Ý & Giới Hạn Phạm Vi)

1. **Phạm vi khảo sát:** Báo cáo này tập trung sâu vào Phân hệ Chiến Đấu (R1) và Bí Cảnh Roguelike / Tông Môn (R3). Phân hệ Luyện Đan & Dược Điển (R2) do Explorer 1 khảo sát độc lập, nhưng các liên kết tài nguyên (dược thảo thu thập từ bí cảnh dùng làm nguyên liệu luyện đan) đã được tích hợp chặt chẽ trong thiết kế.
2. **Khả năng tương thích Savegame Cũ:** Bất kỳ thay đổi nào đối với cấu trúc dữ liệu người chơi (`player.cultivationPath`, `player.skills`, `player.dungeonState`) đều phải có cơ chế migration an toàn trong `loadFromLocalStorage()` để không làm crash game đối với người chơi cũ.
3. **Hiệu năng Canvas trên Mobile:** Bổ sung các icon ý đồ và hiệu ứng hạt trạng thái trên Canvas cần được tối ưu hóa thông qua cơ chế gom hạt (Particle Pooling) để tránh giật lag hoặc tụt FPS trên thiết bị di động.

---

## 4. CONCLUSION (Kết Luận Khảo Sát & Khuyến Nghị Hành Động)

1. **Độ Sẵn Sàng Triển Khai:** Codebase hiện hữu có cấu trúc rõ ràng, Canvas và ATB Engine đã chạy ổn định, tạo tiền đề cực kỳ thuận lợi để Sub-Agent A (Builder) nâng cấp mà không cần đập đi xây lại từ đầu.
2. **Kế hoạch Hành động Cụ Thể cho Sub-Agent A (Builder):**
   - **Bước 1 (Combat Math & Status Effects):** Cài đặt công thức Né Đòn (Thân Pháp + Cảnh Giới), Giảm Thương (Diminishing Returns) và Áp Chế Cảnh Giới. Hiện thực hóa bộ quản lý 5 trạng thái (Tê Liệt, Thiêu Đốt, Xuất Huyết, Trúng Độc, Kim Thân) có tick lượt và Floating Text đa sắc.
   - **Bước 2 (Daoist Paths & Monster AI):** Mở rộng bộ kỹ năng chủ động (ít nhất 2 chiêu/hệ) và đặc tính bị động cho 5 Đạo Đồ. Thêm cơ chế Nộ Khí (Rage 0-100) và Ý Đồ Quái Vật hiển thị trên Canvas/HUD.
   - **Bước 3 (Roguelike Dungeon):** Xây dựng module Bí Cảnh sơ đồ nút 5 tầng gồm 5 loại phòng (Chiến Đấu, Bảo Rương, Tĩnh Dưỡng, Kỳ Ngộ, Boss Trấn Thủ) kèm giao diện tương tác trực quan.
   - **Bước 4 (Sect Progression):** Phân cấp nhiệm vụ Tông Môn theo 5 nấc thang chức vị (Tạp Dịch → Ngoại Môn → Nội Môn → Chân Truyền → Trưởng Lão) và mở rộng Tàng Kinh Các.
   - **Bước 5 (Zero-Leak Integrity):** Cài đặt Object Pool cho hạt linh khí trong `PixelRenderer` và hợp nhất các event listeners.
3. **Tiêu Chí Đối Kháng Cho Sub-Agent B (Red Team):**
   - Kiểm tra rò rỉ bộ nhớ qua profiling heap khi chạy vòng lặp combat liên tục.
   - Kiểm thử edge cases: quái vật chết vì DoT độc/bỏng ở đầu lượt; người chơi bị choáng liên tục; thoát game giữa chừng khi đang ở tầng 3 của Bí Cảnh.

---

## 5. VERIFICATION METHOD (Phương Pháp Độc Lập Kiểm Chứng)

Để kiểm chứng toàn bộ các kết luận trong báo cáo này:

1. **Kiểm tra cú pháp và tính toàn vẹn code:**
   ```bash
   node --check game.js
   ```
   *Kết quả mong đợi:* Exit code = 0, không có lỗi SyntaxError.

2. **Kiểm tra các thư mục và file rỗng:**
   ```bash
   ls -lh js/
   ```
   *Xác nhận:* Toàn bộ các file trong `js/` đều có kích thước 0 bytes, xác nhận code tập trung ở `game.js`.

3. **Kiểm chứng các lỗ hổng logic qua code inspect:**
   - Mở `game.js:2353` để xác nhận `skill.burnChance` chỉ chọn màu slash effect mà không gán `burnTurns`.
   - Mở `game.js:2489-2563` để xác nhận không có dòng lệnh nào tính DoT độc/bỏng cho quái vật và không áp dụng độc/bỏng từ kỹ năng quái vật lên người chơi.
   - Mở `game.js:3504` để xác nhận `exploreWorld()` chỉ là một hàm RNG ngẫu nhiên đơn lẻ, hoàn toàn chưa có sơ đồ nút Roguelike.

4. **Chạy test Puppeteer hiện hữu:**
   ```bash
   node test_combat_sect.js
   ```
   *Kết quả mong đợi:* Trận đấu khởi chạy thành công, kiểm chứng được thanh máu, ATB và việc thăng chức tông môn.
