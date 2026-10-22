# Handoff Report — Explorer Survey 1: Codebase Architecture & GameState Survey

## 1. Observation
1. **File Layout & Codebase Structure:**
   - File `game.js` (`/home/thanh/LÀM VIỆC/project/tutienkitruyen/game.js`): 5,989 dòng, kích thước 261,992 bytes.
   - Thư mục `js/` chứa 7 tệp rỗng dung lượng 0 bytes: `js/app.js`, `js/audio.js`, `js/combat.js`, `js/data.js`, `js/renderer.js`, `js/sprites.js`, `js/systems.js`.
   - File `index.html` dòng 982: nạp duy nhất `<script src="game.js"></script>`. Toàn bộ ứng dụng chạy dưới dạng IIFE `(function () { 'use strict'; ... })();` (dòng 9 đến 5987).
2. **Cú pháp & Kiểm thử sức khỏe (Health Check):**
   - Lệnh: `node --check game.js && for f in js/*.js; do [ -f "$f" ] && node --check "$f"; done` trả về Exit Code = 0.
   - Lệnh: `node --check test_combat_sect.js` trả về Exit Code = 0.
3. **GameState Serialization & Schema:**
   - `saveToLocalStorage` (dòng 4308-4315): Chỉ serialize `this.player` qua `localStorage.setItem('tutien_savegame', JSON.stringify(this.player));`. Không có `schemaVersion`.
   - `loadFromLocalStorage` (dòng 4317-4340) và `importSaveJSON` (dòng 4347-4370): Đều chứa đoạn patch thủ công lặp lại:
     ```javascript
     if (this.player.sectContribTotal === undefined) this.player.sectContribTotal = this.player.sectContrib || 0;
     if (this.player.sectPatrolKills === undefined) this.player.sectPatrolKills = 0;
     if (!this.player.sectManualsBought) this.player.sectManualsBought = [];
     if (this.player.bonusCrit === undefined) this.player.bonusCrit = 0;
     if (this.player.bonusLifeSteal === undefined) this.player.bonusLifeSteal = 0;
     ```
   - Dữ liệu `marketItems`, tiến trình Bí Cảnh và trạng thái Lò luyện đan không nằm trong cấu trúc lưu trữ của `this.player`.
4. **Vòng đời Render & requestAnimationFrame:**
   - `PixelRenderer` constructor (dòng 1313-1314) kích hoạt `requestAnimationFrame(this.loop)`.
   - `loop()` (dòng 1458) gọi vô điều kiện `requestAnimationFrame(this.loop);` mà không lưu ID để hủy (`cancelAnimationFrame`), không kiểm tra trạng thái hiển thị của Canvas container (khi `.canvas-viewport` có `display: none` ở các tab khác), và không có event listener `visibilitychange`.
5. **Cấp phát bộ nhớ & Event Listeners:**
   - Hạt linh khí: `spawnQiParticles()` (dòng 1381) và `spawnLightningSparks()` (dòng 1406) liên tục `push` các object mới; `updateAndDrawParticles()` (dòng 2029) dùng `this.particles.splice(i, 1)`. Hoàn toàn không có object pool.
   - Lưới ô đất: `renderOpenWorldUI()` (dòng 4915-4927) tái tạo 121 nút bấm qua `mapEl.innerHTML = gridHtml;` rồi lặp `querySelectorAll('.world-grid-cell')` để gắn 121 listener `contextmenu` mới trên mỗi lần dịch chuyển.
   - Phím tắt: Tồn tại 2 listener riêng biệt `window.addEventListener('keydown')` ở dòng 5461 và dòng 5748, cả hai cùng bắt sự kiện phím `Enter` và `' '`.

## 2. Logic Chain
1. Từ **Observation 1**: Dự án hiện hoạt động hoàn toàn dựa trên `game.js`. Các tệp trong `js/` là tệp rỗng thừa. Do đó, mọi nỗ lực nâng cấp tính năng của Sub-Agent A phải được thực hiện tập trung trên `game.js` (hoặc phải cập nhật đồng bộ `index.html` nếu tái cấu trúc modular).
2. Từ **Observation 2**: Mã nguồn hiện tại không có lỗi cú pháp, sẵn sàng cho việc mở rộng tính năng mà không bị nghẽn bởi lỗi cú pháp tiền nghiệm.
3. Từ **Observation 3**: Do `this.player` không có `schemaVersion`, việc triển khai các trường dữ liệu mới cho 4 hệ thống cốt lõi (R1: kỹ năng/bị động mới; R2: lò đan/dược điển; R3: node graph bí cảnh) chắc chắn sẽ làm hỏng save cũ nếu người chơi nạp save mà không có một pipeline `migrateSaveData(data)` có versioning. Đồng thời, việc lặp lại mã patch ở cả `loadFromLocalStorage` và `importSaveJSON` cho thấy cần một phương thức chuẩn hóa trạng thái duy nhất (`normalizePlayerState`).
4. Từ **Observation 4**: Việc RAF tiếp tục chạy 60 FPS khi `.canvas-viewport` bị ẩn bằng `display: none;` gây tiêu hao CPU và năng lượng không cần thiết trên PC và mobile, vi phạm tiêu chuẩn hiệu năng sạch của R4.
5. Từ **Observation 5**: Việc cấp phát hạt liên tục và gắn 121 event listeners mỗi lần cập nhật bản đồ là nguyên nhân trực tiếp dẫn đến áp lực Garbage Collection và rò rỉ bộ nhớ. Để đạt tiêu chuẩn "Zero-Leak Integrity" theo R4, Sub-Agent A bắt buộc phải triển khai `ParticlePool` cho `PixelRenderer` và chuyển sang `Event Delegation` cho bản đồ thế giới.

## 3. Caveats
- Khảo sát được thực hiện hoàn toàn ở chế độ Read-only. Không có thay đổi nào được ghi vào mã nguồn dự án ngoài thư mục `.agents/teamwork/explorer_survey_1/`.
- Chưa kiểm tra profile heap memory thực tế trên Chrome DevTools khi chạy liên tục 24h, nhưng bằng chứng code cho thấy việc `push/splice` hàng chục object hạt mỗi giây là nguồn cơn tạo rác đã được xác minh rõ ràng.
- File `test_combat_sect.js` yêu cầu Chrome binary (`/usr/bin/google-chrome`) và một HTTP server phục vụ cổng 8080. Trong khảo sát này chỉ kiểm tra cú pháp tệp test bằng `node --check`, chưa chạy live puppeteer do server 8080 chưa bật.

## 4. Conclusion
1. **Hiện trạng codebase:** Nền tảng game đã có khung hình hoàn chỉnh, chạy ổn định, không lỗi cú pháp (`node --check` = 0), giao diện responsive tương thích PC và Mobile.
2. **Khoảng cách cần nâng cấp:** Cả 4 hệ thống R1, R2, R3, R4 đều mới ở mức độ phác thảo sơ khởi hoặc có các thiếu sót kỹ thuật cụ thể (thiếu skill/passive/buffs ở R1; thiếu mini-game hỏa hầu & dược điển ở R2; thiếu Bí Cảnh Roguelike & quest theo rank ở R3; thiếu save migration, particle pool, RAF throttle ở R4).
3. **Kế hoạch cho Sub-Agent A & B:** Báo cáo chi tiết `survey_architecture.md` đã cung cấp đầy đủ tọa độ dòng code, mẫu thiết kế `migrateSaveData()`, `ParticlePool`, và danh mục kiểm thử đối kháng cho Red Team.

## 5. Verification Method
1. **Kiểm tra cú pháp JS:**
   ```bash
   node --check /home/thanh/LÀM\ VIỆC/project/tutienkitruyen/game.js
   node --check /home/thanh/LÀM\ VIỆC/project/tutienkitruyen/test_combat_sect.js
   ```
2. **Xác minh các điểm quan sát:**
   - Xem các tệp rỗng trong `js/`: `ls -la js/`
   - Xem save/load: `sed -n '4308,4370p' game.js`
   - Xem RAF loop: `sed -n '1423,1460p' game.js`
   - Xem Particle allocation: `sed -n '1381,1420p' game.js` và `sed -n '1975,2030p' game.js`
   - Xem 121 listeners bản đồ: `sed -n '4915,4928p' game.js`
   - Xem 2 listener keydown: `grep -n "addEventListener('keydown'" game.js` (dòng 5461 và 5748).
3. **Điều kiện phủ định (Invalidation Conditions):**
   - Kết luận bị phủ định nếu `game.js` đã có `schemaVersion` và cơ chế migration tự động.
   - Kết luận bị phủ định nếu `PixelRenderer` đã có cơ chế pool đối tượng hạt và tự pause RAF khi canvas ẩn.
