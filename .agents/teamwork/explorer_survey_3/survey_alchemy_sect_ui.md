# BÁO CÁO KHẢO SÁT CHUYÊN SÂU: LUYỆN ĐAN, TÔNG MÔN & GIAO DIỆN RESPONSIVE UI
**Dự án:** Tu Tiên Kỳ Truyện - Thiên Đạo Luân Hồi (Web Pixel RPG)  
**Phân hệ phụ trách:** Explorer 3 (Alchemy System, Sect Progression & Responsive UI)  
**Tập tin khảo sát:** `game.js`, `index.html`, `style.css`  
**Ngày thực hiện:** 2026-10-22  

---

## 1. TỔNG QUAN KHẢO SÁT (EXECUTIVE SUMMARY)

Game hiện hữu là một ứng dụng Web Single-Bundle thuần túy (Vanilla JS, HTML5, CSS3) với logic tập trung chủ yếu trong tập tin `game.js` (5,988 dòng), `index.html` (984 dòng), và `style.css` (3,109 dòng). Các thư mục con `js/` hiện tại chỉ chứa các tập tin rỗng 0 byte (chưa module hóa). Game đạt chuẩn cú pháp (`node --check game.js` = 0) và đã tích hợp hệ thống đồ họa Procedural Pixel Art trên Canvas 2D tỉ lệ 16:9 (640x360).

Tuy nhiên, đối chiếu với tài liệu yêu cầu cốt lõi **`ORIGINAL_REQUEST.md` (R2, R3, R4)**, ba phân hệ trọng yếu đang ở trạng thái sơ khai hoặc còn tồn tại nhiều giới hạn cấu trúc:

1. **Hệ thống Luyện Đan (R2):** Hiện chỉ là một cơ chế click nút đơn giản với `setTimeout` 1.5 giây, tính toán tỷ lệ thành công nhị phân (Đạt / Mất) dựa trên chỉ số cố định, hoàn toàn chưa có mini-game tương tác điều tiết hỏa hầu (Văn Hỏa vs Vũ Hỏa), chưa có phân định 4 phẩm cấp đan dược (Hạ, Trung, Thượng, Cực phẩm), và chưa có hiệu ứng nổ lò sống động (rung lắc màn hình, khói bụi).
2. **Kho Dược Điển & Đan Phương (R2):** Chưa có giao diện Dược Điển để tra cứu dược thảo; toàn bộ công thức `RECIPES` đang được nạp tĩnh ngay từ đầu mà không có cơ chế mở khóa theo cảnh giới tu vi (Luyện Khí, Trúc Cơ, Kim Đan, Nguyên Anh, v.v.). Các dược thảo cao cấp rơi từ các bí cảnh vùng 3, 4, 5 hầu như chưa có đan phương tương ứng.
3. **Tiến trình Tông Môn (R3):** Đã có khung 3 môn phái và nấc thang 6 cấp bậc, nhưng hệ thống nhiệm vụ (`SECT_QUESTS`) chỉ gồm 4 nhiệm vụ cố định cho mọi cấp bậc, thiếu sự đa dạng phân tầng theo chức vị (Tạp Dịch vs Chân Truyền vs Trưởng Lão). Tàng Kinh Các mới chỉ cung cấp 3 quyển bí tịch bị động tăng chỉ số thô, chưa có tuyệt kỹ chủ động / pháp thuật môn phái.
4. **Giao diện & Responsive UI (R4):** Canvas đã được thiết lập tỉ lệ 16:9 nhưng quy tắc CSS trên thiết bị di động đang áp đặt `max-height: 190px !important`, có thể gây co ép hoặc xuất hiện dải đen (letterboxing) không mong muốn ở một số tỉ lệ màn hình điện thoại (như 390x844). Cần đảm bảo chu kỳ dọn dẹp timer và chuyển đổi ngữ cảnh giao diện an toàn tuyệt đối.

---

## 2. HIỆN TRẠNG TÚI ĐỒ, VẬT PHẨM & LUYỆN ĐAN TRONG GAME.JS

### 2.1. Cấu trúc Dữ liệu Vật phẩm & Kho đồ
- **Vị trí định nghĩa:** `game.js:1103 - 1151` (`ITEMS`).
- **Cấu trúc lưu trữ trong Player:** `this.player.inventory` là một đối tượng dạng key-value: `{ [itemId: string]: number }` (ví dụ: `herb_linhchi: 5`, `pill_hoixuan: 3`).
- **Danh mục dược thảo hiện có (7 loại):**
  1. `herb_linhchi`: Linh Chi Thảo (giá 15 Linh Thạch) - Luyện Khí.
  2. `herb_thanh_u`: Thanh U Thảo (giá 20 Linh Thạch) - Luyện Khí.
  3. `herb_hoaviem`: Hỏa Viêm Thảo (giá 60 Linh Thạch) - Trúc Cơ.
  4. `herb_bachnien`: Bách Niên Linh Dược (giá 150 Linh Thạch) - Trúc Cơ / Kim Đan.
  5. `herb_longhuyet`: Long Huyết Thảo (giá 400 Linh Thạch) - Kim Đan / Nguyên Anh.
  6. `herb_cuuchuyen`: Cửu Chuyển Tiên Thảo (giá 1200 Linh Thạch) - Nguyên Anh / Hóa Thần.
  7. `herb_thienkiem`: Thiên Kiếm Thảo (giá 3000 Linh Thạch) - Hóa Thần / Quy Hư.
- **Danh mục đan dược hiện có (13 loại):**
  - Đan hồi phục: `pill_hoixuan` (hồi 50% HP), `pill_tulinh` (hồi 60% MP).
  - Đan tăng tu vi / thọ nguyên: `pill_tukhi` (+350 EXP), `pill_tho_nguyen` (+50 năm thọ nguyên).
  - Đan dược đột phá cảnh giới: `pill_trucco` (+35%), `pill_kimdan` (+30%), `pill_ngungan` (+25%), `pill_hoathan` (+20%), `pill_huthien` (+20%), `pill_hopnguyen` (+18%), `pill_cankhon` (+15%), `pill_dokiep` (+15%), `pill_daotam` (+20% cho mọi cảnh giới).

### 2.2. Cơ chế Luyện đan hiện tại (`craftRecipe`)
- **Vị trí cài đặt:** `game.js:3978 - 4012`.
- **Mã nguồn quan sát:**
  ```javascript
  craftRecipe(recipeId) {
    const p = this.player;
    const recipe = RECIPES.find(r => r.id === recipeId);
    if (!recipe) return;

    for (const [itemId, count] of Object.entries(recipe.ingredients)) {
      if ((p.inventory[itemId] || 0) < count) {
        this.addLog(`Không đủ nguyên liệu 【${ITEMS[itemId].name}】...`, 'warning');
        return;
      }
    }
    for (const [itemId, count] of Object.entries(recipe.ingredients)) {
      p.inventory[itemId] -= count;
    }

    this.renderer.setScene(SCENES.ALCHEMY);
    let rate = recipe.successRate;
    if (p.cultivationPath && p.cultivationPath.id === 'dan_y_tu') rate += 0.15;

    setTimeout(() => {
      this.renderer.setScene(SCENES.MEDITATE);
      if (Math.random() < rate) {
        sound.playLoot();
        p.inventory[recipe.resultId] = (p.inventory[recipe.resultId] || 0) + 1;
        this.addLog(`🔥 Luyện chế thành công! Lò thần mở nắp, nhận được 【${ITEMS[recipe.resultId].name}】 x1!`, 'loot');
      } else {
        sound.playHurt();
        this.addLog(`💥 Nổ lò! Dược lực mất cân bằng khiến đan dược cháy thành tro bụi!`, 'danger');
      }
      this.updateUI();
    }, 1500);
  }
  ```
- **Hạn chế kỹ thuật phát hiện được:**
  1. **Không có tính tương tác:** Người chơi chỉ click và chờ timer tĩnh 1500ms.
  2. **Tỷ lệ nhị phân:** Chỉ có 2 kết quả là Thành công hoặc Nổ lò, không có phẩm cấp đan dược.
  3. **Thiếu hiệu ứng Canvas diễn hoạt:** Cảnh `SCENES.ALCHEMY` (`game.js:1941`) chỉ vẽ lò luyện đan và đốm lửa nhấp nháy cơ bản; khi nổ lò không hề kích hoạt `triggerShake` hay hạt khói đen cuồn cuộn.
  4. **Lỗi tiềm ẩn về bất đồng bộ:** Nếu người chơi đổi tab trong khoảng 1500ms này, callback của `setTimeout` vẫn gọi `this.renderer.setScene(SCENES.MEDITATE)`, có thể vô tình ghi đè trạng thái của màn hình khác (chẳng hạn nếu đang trong tab Chiến Đấu).

---

## 3. THIẾT KẾ MINI-GAME TƯƠNG TÁC LUYỆN ĐAN (R2 ARCHITECTURE)

Để đáp ứng đầy đủ yêu cầu R2, cần xây dựng một **Interactive Alchemy Mini-game Engine** hoàn chỉnh, có thể tích hợp trực tiếp trên Canvas hiện hành hoặc thông qua một khung điều khiển trực quan.

### 3.1. Mô hình Điều phối Hỏa Hầu (Văn Hỏa vs Vũ Hỏa)
- **Thông số trạng thái Luyện đan (`AlchemySessionState`):**
  - `currentTemp`: Nhiệt độ hiện tại của đan lò (0 - 100°C).
  - `targetMinTemp` & `targetMaxTemp`: Vùng nhiệt độ lý tưởng (Optimal Zone) thay đổi theo từng giai đoạn của bài thuốc (ví dụ: giai đoạn dung hòa cần 40 - 65°C; giai đoạn ngưng đan cần 65 - 85°C).
  - `fireMode`: Trạng thái hỏa diễm:
    - **Văn Hỏa (Wen Huo / Gentle Fire):** Ngọn lửa liu riu, ôn hòa. Tác dụng: Làm giảm nhiệt độ từ từ hoặc duy trì ổn định, tích tụ dược tính tinh thuần, giảm nguy cơ cháy khét lò.
    - **Vũ Hỏa (Wu Huo / Intense Fire):** Ngọn lửa cuồn cuộn, mãnh liệt. Tác dụng: Gia tăng nhanh nhiệt độ đan lò, thúc đẩy phản ứng phân giải thảo dược cứng cỏi.
  - `stabilityMeter`: Thanh ổn định của đan lò (0 - 100%). Nếu nhiệt độ vượt quá 95°C trong hơn 2 giây, thanh ổn định tụt dốc nhanh chóng dẫn đến **Nguy cơ Nổ Lò (Cauldron Explosion)**.

### 3.2. Tiến trình Phản ứng & Thời gian Căn chuẩn (Reaction Timing Stages)
Quá trình luyện một mẻ đan kéo dài khoảng **8 - 12 giây**, chia làm 3 giai đoạn then chốt:
1. **Giai đoạn 1: Nấu Chảy & Hòa Dược (Melting Phase):** Cần tăng nhiệt nhanh bằng Vũ Hỏa để dược thảo tan chảy thành dược dịch.
2. **Giai đoạn 2: Ngưng Tụ Dược Linh (Condensation Phase):** Cần linh hoạt luân chuyển giữa Văn Hỏa và Vũ Hỏa để giữ nhiệt độ nằm chính xác trong "Vùng Hoàng Kim" (Golden Range). Mỗi giây giữ đúng vùng sẽ tích lũy **Điểm Tinh Thuần (Purity Points)**.
3. **Giai đoạn 3: Khai Lò Thu Đan (Harvest Timing Window):** Xuất hiện một vòng tròn thu nhỏ / thanh phản xạ (Quick-Time Event / Timing bar). Người chơi bấm nút **"Thu Đan"** trúng vạch xanh sẽ kích phát Đan Khí cực đại.

### 3.3. Phân định 4 Phẩm cấp Đan Dược Xuất Lò
Dựa trên tổng điểm Tinh Thuần tích lũy và độ chính xác của thao tác Thu Đan:
| Phẩm Cấp | Tỷ Lệ Điểm | Tên Hiển Thị | Hiệu Quả Gia Tăng |
| :--- | :--- | :--- | :--- |
| **Hạ Phẩm** | < 50% | 【Hạ Phẩm】 | 70% hiệu quả chuẩn. Có 20% khả năng tồn dư đan độc nhẹ. |
| **Trung Phẩm**| 50% - 69% | 【Trung Phẩm】 | 100% hiệu quả chuẩn (như vật phẩm gốc). |
| **Thượng Phẩm**| 70% - 89% | 【Thượng Phẩm】 | 140% hiệu quả chuẩn (tăng thêm HP/MP/EXP hoặc tỷ lệ đột phá). |
| **Cực Phẩm** | ≥ 90% | 【Cực Phẩm Đan】 | 180% - 200% hiệu quả chuẩn, kèm đan văn lấp lánh (vĩnh viễn cộng thêm 1-2 điểm căn cốt/ngộ tính). |

*Giải pháp lưu trữ phẩm cấp trong `p.inventory`:*  
Mỗi đan dược có thể lưu dưới dạng mã phân cấp, ví dụ: `pill_hoixuan_ha`, `pill_hoixuan_trung`, `pill_hoixuan_thuong`, `pill_hoixuan_cuc`, hoặc mở rộng thuộc tính `p.inventory[k]` hỗ trợ cả số lượng lẫn phẩm cấp, đảm bảo tính tương thích ngược (backward compatibility) với save game cũ.

### 3.4. Cơ chế Nổ Lò (Cauldron Explosion Dynamics)
Khi nhiệt độ duy trì ở mức báo động đỏ quá lâu hoặc người chơi để thanh ổn định về 0:
- **Rung chấn màn hình:** Gọi trực tiếp `this.renderer.triggerShake(35, 12)` (biên độ rung lắc mạnh trong 35 khung hình).
- **Hạt khói bụi đen & tia lửa bắn tóe:** Đẩy ngay lập tức 40 - 60 hạt particle vào `this.renderer.particles`:
  - 30 hạt khói đen/xám dày đặc (`isSmoke: true`, bán kính lớn, bốc lên cuồn cuộn).
  - 20 hạt tàn lửa đỏ cam (`isSpark: true`, văng tứ phía với vận tốc ngẫu nhiên).
- **Âm thanh:** Kích hoạt chuỗi sóng âm trầm đục nổ bung từ Web Audio Synthesizer (`sound.playExplosion()` bổ sung hoặc kết hợp `sound.playHurt()`).
- **Ghi nhật ký & Thiệt hại:** Toàn bộ thảo dược cháy thành tro; đan lò bốc khói đen; nhân vật nhận phản phệ khí huyết giảm 5-10% HP.

---

## 4. HỆ THỐNG DƯỢC ĐIỂN & ĐAN PHƯƠNG MỞ KHÓA THEO CẢNH GIỚI (R2)

### 4.1. Kiến trúc Bách Thảo Dược Điển (Herbal Encyclopedia)
- **Mục tiêu:** Cung cấp cuốn bách khoa toàn thư ghi chép toàn bộ kỳ hoa dị thảo của Cửu Châu, hiển thị đặc tính, dược tính (Hàn/Nhiệt/Ôn/Lương), khu vực phân bố và trạng thái thu thập của người chơi.
- **Cấu trúc dữ liệu đề xuất:**
  ```javascript
  const HERB_ENCYCLOPEDIA = {
    herb_linhchi: {
      name: 'Linh Chi Thảo',
      grade: 'Nhất Giai Hạ Phẩm',
      nature: 'Ôn tính, ích khí kiện tỳ',
      regions: ['region_1 (Linh Sơn Ngoại Vi)'],
      unlockedRealm: 'Luyện Khí Tầng 1',
      recipesUsed: ['rec_hoixuan', 'rec_tukhi'],
      lore: 'Linh thảo sơ cấp hấp thu sương sớm đầu nguồn, thân cây mềm mại, là dược liệu nền tảng cho mọi đan sinh.'
    },
    herb_hoaviem: {
      name: 'Hỏa Viêm Thảo',
      grade: 'Nhị Giai Trung Phẩm',
      nature: 'Đại nhiệt, thuần dương chân hỏa',
      regions: ['region_2 (Vạn Yêu Sơn Mạch)'],
      unlockedRealm: 'Trúc Cơ Kỳ',
      recipesUsed: ['rec_trucco', 'rec_kimdan'],
      lore: 'Sinh trưởng trên vách đá cạnh miệng núi lửa, rễ cây cắm sâu hút địa hỏa linh mạch.'
    },
    // ... mở rộng cho toàn bộ 7+ loại thảo dược
  };
  ```
- **Trạng thái Mở Khóa (`p.unlockedHerbs`):** Ban đầu hiển thị dưới dạng ẩn thông tin (`??? - Chưa khám phá`). Khi người chơi thu hái thảo dược lần đầu trong Bí Cảnh hoặc giám định thành công, mục tương ứng trong Dược Điển sẽ sáng lên kèm hình minh họa Pixel Art.

### 4.2. Hệ thống Đan Phương (Pill Recipes) Mở khóa theo Cảnh giới
Hiện tại trong `game.js:1153`, hằng số `RECIPES` chứa 6 bài thuốc và 4 bài rèn khí hiển thị đồng loạt. Cần bổ sung thuộc tính `reqRealmIndex` và `unlocked`:

| Mã Đan Phương | Tên Đan Dược | Yêu Cầu Cảnh Giới | Nguyên Liệu Cần Thiết |
| :--- | :--- | :--- | :--- |
| `rec_hoixuan` | Hồi Xuân Đan | Luyện Khí 1 (`lk_1`) | 2 Linh Chi Thảo |
| `rec_tulinh` | Tụ Linh Đan | Luyện Khí 2 (`lk_2`) | 2 Thanh U Thảo |
| `rec_tukhi` | Tụ Khí Đan | Luyện Khí 3 (`lk_3`) | 2 Linh Chi, 1 Thanh U, 1 Huyền Thiết |
| `rec_trucco` | Trúc Cơ Đan | Luyện Khí Đỉnh Phong (`lk_10`) | 4 Thanh U, 2 Hỏa Viêm, 1 Tử Tinh Khoáng |
| `rec_kimdan` | Kim Đan Hóa Thần Hoàn | Trúc Cơ Đỉnh Phong (`tc_4`) | 3 Hỏa Viêm, 2 Bách Niên, 2 Tử Tinh |
| `rec_daotam` | Đạo Tâm Đan | Kim Đan Sơ Kỳ (`kd_1`) | 3 Bách Niên, 1 Long Huyết, 1 Thiên Ngoại |
| `rec_ngungan` *(Mới)* | Ngưng Anh Đan | Kim Đan Đỉnh Phong (`kd_4`) | 4 Long Huyết, 2 Cửu Chuyển, 2 Huyết Ma Thạch |
| `rec_hoathan` *(Mới)* | Hóa Thần Đan | Nguyên Anh Đỉnh Phong (`na_4`)| 4 Cửu Chuyển, 3 Thiên Kiếm Thảo, 2 Hỗn Độn |
| `rec_tho_nguyen` *(Mới)*| Cửu Chuyển Thọ Nguyên Đan | Nguyên Anh Kỳ (`na_1`) | 3 Cửu Chuyển, 2 Long Huyết, 3 Bách Niên |

- **Cơ chế thu nhận Đan Phương:** Ngoài việc tự động lĩnh ngộ khi đạt cảnh giới tương ứng, một số đan phương thất truyền cổ đại có thể đổi được từ **Tàng Kinh Các của Đan Đỉnh Thần Môn** hoặc nhặt được trong **Phòng Bảo Rương Bí Cảnh Roguelike**.

---

## 5. HỆ THỐNG TIẾN TRÌNH TÔNG MÔN, NHIỆM VỤ & TÀNG KINH CÁC (R3)

### 5.1. Khảo sát Hiện trạng Môn phái (`SECTS`)
- **Tập tin:** `game.js:1209 - 1267`.
- **Ba Tông Môn đại diện:**
  1. `sect_thanhvan`: Thanh Vân Kiếm Tông (Chính Đạo Kiếm Tu)
  2. `sect_dandinh`: Đan Đỉnh Thần Môn (Trung Lập Đan Tu)
  3. `sect_thienma`: Cửu U Ma Giáo (Ma Đạo Thao Thiên)
- **Hệ thống cấp bậc hiện hữu (6 bậc):**
  - Bậc 1: Tạp Dịch / Đồng Tử Thổi Lửa / Huyết Nô (0 Cống Hiến, Lương: 10 - 20)
  - Bậc 2: Ngoại Môn / Học Đồ / Hắc Y (100 Cống Hiến, Lương: 30 - 50)
  - Bậc 3: Nội Môn / Đan Sư / Ma Tướng (500 Cống Hiến, Lương: 80 - 120)
  - Bậc 4: Chân Truyền / Đại Đan Sư / Ma Tử (2000 Cống Hiến, Lương: 250 - 350)
  - Bậc 5: Hộ Pháp Trưởng Lão / Đan Các Trưởng Lão / U Minh Trưởng Lão (6000 Cống Hiến, Lương: 700 - 900)
  - Bậc 6: Chưởng Môn Chí Tôn / Môn Chủ Đan Thần / Giáo Chủ Ma Tôn (15000 Cống Hiến, Lương: 2000 - 3000)

### 5.2. Hạn chế Cần Nâng cấp theo Yêu cầu R3
1. **Phân tầng nhiệm vụ theo chức vị môn phái:**
   Hiện tại `SECT_QUESTS` (`game.js:1269`) chỉ có 4 nhiệm vụ tĩnh dùng chung cho mọi chức vị. Cần mở rộng danh sách nhiệm vụ đa dạng:
   - **Nhiệm vụ Tạp Dịch:** Quét dọn đan phòng, nhổ cỏ linh điền, nộp Linh Chi sơ cấp.
   - **Nhiệm vụ Ngoại Môn:** Khai thác mỏ Huyền Thiết, tuần tra sơn môn diệt Yêu Lang, quyên góp Linh Thạch.
   - **Nhiệm vụ Nội Môn:** Thu thập Hỏa Viêm Thảo, trảm sát Yêu Hổ / Yêu Hùng đầu mục, hộ tống đoàn đan dược.
   - **Nhiệm vụ Chân Truyền:** Thám hiểm Cổ Kiếm Bí Cảnh, tiễu trừ tà tu phản đồ, luyện chế Trúc Cơ Đan giao nộp kho phái.
   - **Nhiệm vụ Trưởng Lão:** Tọa trấn tông môn hộ đạo, săn lùng đại yêu vương Hóa Thần, khai phá linh mạch mới.
2. **Cơ chế Bổng lộc định kỳ:**
   - Hiện tại người chơi nhận lương mỗi năm 1 lần khi tuổi nhân vật tăng (`p.sectSalaryClaimedYear === p.age`, khoảng 60 giây chu kỳ).
   - Cơ chế này vận hành tốt, tuy nhiên cần bổ sung thông báo rõ ràng về số tháng còn lại đến kỳ phát lương kế tiếp, đồng thời tặng kèm đan dược tương ứng với cấp bậc (Trưởng Lão nhận thêm đan dược cao giai hàng năm).
3. **Mở rộng Tàng Kinh Các đổi Tuyệt Học Môn Phái:**
   - Hiện tại Tàng Kinh Các chỉ có 3 quyển bí tịch tăng chỉ số bị động (`manuals`).
   - Cần bổ sung các **Tuyệt kỹ võ học / Pháp thuật chủ động** theo môn phái:
     - Thanh Vân Kiếm Tông: *Vạn Kiếm Quy Tông* (Tuyệt kỹ diện rộng kiếm khí), *Kiếm Khí Hộ Thể* (Hộ thuẫn phản chấn).
     - Đan Đỉnh Thần Môn: *Tam Muội Chân Hỏa* (Kỹ năng thiêu đốt địch & tăng 25% tỷ lệ luyện đan), *Dược Thần Hồi Xuân* (Hồi phục đại lượng HP và thanh tẩy hiệu ứng xấu).
     - Cửu U Ma Giáo: *Huyết Ma Bạo Thể* (Tiêu hao 10% HP tăng 50% Công kích), *Thiên Ma Hút Hồn* (Hút máu và làm tê liệt đối thủ).

---

## 6. KHẢO SÁT GIAO DIỆN & TÍNH TƯƠNG THÍCH RESPONSIVE UI (R4)

### 6.1. Tỷ lệ Khung hình Canvas 16:9 & Bố cục Đa Màn hình
- **Độ phân giải nội bộ Canvas:** `canvas.width = 640`, `canvas.height = 360` (Chuẩn tỷ lệ 16:9 sắc nét).
- **Thiết lập CSS Desktop:**
  - `style.css:827`: `.canvas-viewport` có `aspect-ratio: 16 / 9`, `max-width: 540px`, `height: auto`.
  - Trên màn hình PC (1920x1080 và 1280x750), bố cục 3 cột hiển thị cân đối:
    - Cột Trái (`aside.left-panel`): Rộng 320px cố định, chứa ngọc bài avatar, thông tin đạo đồ, cảnh giới, thanh HP/MP/EXP và túi đồ rút gọn.
    - Cột Giữa (`main.center-panel`): Khung Canvas Pixel 16:9 phía trên, thanh điều hướng 4 trụ cột và khu vực nội dung tab bên dưới.
    - Cột Phải (`aside.right-panel`): Rộng 360px cố định, chứa nhật ký Thiên Cơ Lục sắc nét.
- **Phân tích giao diện Mobile (390x844 - iPhone 12/13/14 portrait):**
  - `style.css:2740`: Media query `@media (max-width: 768px)` chuyển toàn bộ sang bố cục 1 cột (single-column flex stack).
  - Cột Phải (Thiên Cơ Lục) được chuyển thành ngăn kéo trượt (Sliding Drawer) thông qua lớp `.drawer-open`, giải phóng toàn bộ không gian cho màn hình thao tác.
  - Cột Trái hiển thị thanh HUD mini gắn đỉnh (Mobile Avatar, thanh HP/MP, linh thạch).
  - **Điểm lưu ý tại `style.css:2864`:**
    ```css
    .canvas-viewport {
      height: auto !important;
      aspect-ratio: 16 / 9;
      max-height: 190px !important;
      margin-bottom: 4px;
    }
    ```
    Với chiều rộng màn hình 390px (trừ viền còn ~366px), tỷ lệ 16:9 tương ứng với chiều cao `366 * 9 / 16 = 205.8px`. Khi bị giới hạn bởi `max-height: 190px !important`, chiều rộng container sẽ tự co về `190 * 16 / 9 = 337.7px`. Do có `margin: 0 auto`, Canvas vẫn căn giữa hoàn hảo và giữ đúng tỷ lệ 16:9 mà không bị méo hình.

### 6.2. Hệ thống Hộp thoại Modals & Trạng thái Chuyển Tab
- **Danh sách 8 Hộp thoại Modal hiện có trong `index.html`:**
  1. `#creation-modal` (line 757): Khởi tạo nhân vật Thiên Mệnh Luân Hồi 3 bước.
  2. `#event-modal` (line 817): Lựa chọn kỳ ngộ ngẫu nhiên khi du ngoạn.
  3. `#mobile-menu-modal` (line 828): Quản lý lưu trữ/luân hồi trên mobile.
  4. `#json-modal` (line 845): Xuất/nhập dữ liệu cứu vãn LocalStorage.
  5. `#breakthrough-modal` (line 859): Trực quan hóa đột phá cảnh giới và dùng đan dược.
  6. `#item-detail-modal` (line 899): Giám định bảo vật, xem điển tích và chỉ số.
  7. `#custom-confirm-modal` (line 946): Cảnh báo thiên đạo tùy chỉnh thay thế `window.confirm`.
  8. `#custom-alert-modal` (line 965): Thông báo thiên thư thay thế `window.alert`.
- **Đánh giá chuyển đổi Tab (`switchTab` tại `game.js:5199`):**
  - Xử lý chuyển tab sạch sẽ giữa 4 Trụ Cột: `tab-nhanvat`, `tab-tiengioi`, `tab-bachbao`, `tab-cheat`.
  - Quản lý vòng đời Canvas thông minh: Canvas chỉ hiển thị khi ở `tab-nhanvat` hoặc khi bước vào chiến đấu (`body.combat-active-mode`), giúp tiết kiệm tài nguyên CPU/GPU tối đa khi người chơi thao tác ở các tab Bách Bảo hoặc Kim Thủ Chỉ.

### 6.3. Kiểm soát Vòng đời Bộ nhớ & Tránh Rò rỉ (Zero-Leak Integrity)
- Vòng lặp chính `requestAnimationFrame(this.loop)` được duy trì tập trung trong `PixelRenderer`.
- Cần chú ý: Mọi timer của mini-game Luyện Đan (như nhịp đếm nhiệt độ, phản ứng hỏa hầu) phải được dọn dẹp sạch sẽ (`clearInterval` / `clearTimeout`) khi người chơi đóng giao diện luyện đan, nổ lò, hoặc chuyển tab để tránh memory leak và race condition.

---

## 7. ĐỀ XUẤT KIẾN TRÚC & HƯỚNG DẪN TRIỂN KHAI CHO SUB-AGENT A & B

Dựa trên kết quả khảo sát toàn diện, phân hệ Explorer 3 đưa ra khuyến nghị kỹ thuật cụ thể:

### 7.1. Hướng đi cho Sub-Agent A (The Builder / Implementer)
1. **Module hóa Luyện Đan (`AlchemyManager` / `AlchemyGame`):**
   - Không nhồi nhét toàn bộ logic vào hàm `craftRecipe`. Tạo một lớp hoặc đối tượng điều phối riêng quản lý chu kỳ sống của mẻ đan (`startAlchemySession(recipeId)`, `tickTemperature()`, `setFireMode(mode)`, `finishAlchemySession()`).
   - Kết nối trực tiếp với `PixelRenderer` để vẽ đồng hồ nhiệt độ và hỏa diễm trên Canvas trong cảnh `SCENES.ALCHEMY`.
2. **Tích hợp Dược Điển & Đan Phương:**
   - Xây dựng modal hoặc sub-tab phụ "Dược Điển Bách Khoa" trong tab Nhân Vật/Động Phủ.
   - Thêm bộ lọc Đan Phương theo cảnh giới: bài thuốc nào chưa đủ cảnh giới sẽ hiển thị khóa kèm yêu cầu rõ ràng.
3. **Nâng cấp Hệ thống Tông Môn:**
   - Bổ sung trường `minRank` trong `SECT_QUESTS` để đệ tử các chức vị khác nhau nhận được nhiệm vụ tương xứng.
   - Bổ sung bí tịch võ học chủ động vào mảng `manuals` của từng tông môn, tích hợp vào danh sách kỹ năng nhân vật khi lĩnh ngộ.
4. **Bảo toàn Giao diện 16:9:**
   - Giữ nguyên các class `canvas-viewport` và cơ chế co giãn tự nhiên, không dùng kích thước cố định pixel tuyệt đối gây vỡ giao diện trên thiết bị di động.

### 7.2. Điểm Tấn công Trọng yếu cho Sub-Agent B (The Ruthless Critic / Red Team)
Sub-Agent B cần tập trung rà soát các lỗ hổng sau trong Vòng 1 Đối kháng:
1. **Race Condition khi Luyện Đan:** Nếu người chơi bấm nút đổi tab hoặc bấm liên tục nút "Khai Lò" trong lúc mini-game đang chạy, trạng thái nguyên liệu trong túi có bị trừ đúp không? Vòng lặp đếm nhiệt độ có bị chạy ngầm vô tận không?
2. **Tính Tương thích Save Game (Schema Migration):** Việc bổ sung phẩm cấp đan dược (`pill_hoixuan_cuc`, v.v.) và trạng thái Dược Điển có làm hỏng hàm `loadFromLocalStorage()` của các bản lưu cũ không?
3. **Nổ Lò Không Giới Hạn:** Nếu người chơi cố tình để nổ lò liên tục, hiệu ứng rung màn hình `triggerShake` và mảng hạt `particles` có bị tràn bộ nhớ (buffer overflow) hay lag giật Canvas không?
4. **Kiểm thử Co giãn Màn hình:** Kiểm tra hiển thị thực tế trên kích thước 390x844 (Mobile) và 1280x750 / 1920x1080 (PC), kiểm tra xem có modal nào bị tràn màn hình không cuộn được nội dung hay không.
