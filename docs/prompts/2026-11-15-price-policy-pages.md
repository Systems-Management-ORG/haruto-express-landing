# PROMPT — 2 trang Chính sách giá (Việt → Nhật, Nhật → Việt) theo PDF 01/10/2026

> **Cách dùng (máy local):** ở thư mục gốc repo, chạy `claude` rồi gõ:
> `Đọc docs/prompts/2026-11-15-price-policy-pages.md và thực hiện toàn bộ, theo đúng thứ tự B0 → B12.`
>
> Nguồn dữ liệu: 2 file PDF của chủ site trong `C:\Users\ADMIN\Downloads` (Git Bash: `/c/Users/ADMIN/Downloads`):
> - `…261411HRT… Chính sách giá Việt Nhật….pdf`: **CHÍNH SÁCH GIÁ ĐƯỜNG AIR VN-JP**, 4 trang, có 1 infographic 1536×1024
> - `…261411HRT… Chính sách Nhật Việt….pdf`: **CHÍNH SÁCH GIÁ ĐƯỜNG AIR JAPAN-VN**, 3 trang, có 1 infographic 1536×1024
>
> Design system: repo `Systems-Management-ORG/design-system`, nằm cạnh repo này trong workspace "Haruto" (`../design-system`). Nếu không thấy thư mục đó, tìm repo `design-system` trong thư mục cha; vẫn không thấy thì hỏi đường dẫn, không tự clone. Snapshot khi viết prompt: landing `main` @ `f9d681c`, design-system @ `16067d3`.

---

## 0. Vai trò, mục tiêu, quyết định

Bạn là kỹ sư front-end senior trên repo Next.js 16 + next-intl 4 + Tailwind v4 này. Đọc `CLAUDE.md` và làm theo mọi luật cứng trong đó.

**Mục tiêu:** thêm 2 trang **Chính sách giá** mỗi chiều, dữ liệu **khớp từng con số** với 2 PDF. Cả 2 trang dựng bằng template `InfoPage` có sẵn, nên có cùng nhịp với mọi trang khác: hero → chip "Trên trang này" → các section xen kẽ nền ivory/sage → FAQ → CTA band → RelatedLinks. Cùng đợt này, sửa những chỗ trên site đang lệch so với PDF, và cho `/bang-gia` cùng `/chinh-sach-van-chuyen` trỏ về 2 trang mới.

| key mới | URL VI | URL JA/EN | parent |
|---|---|---|---|
| `priceVnJp` | `/vi/chinh-sach-gia-viet-nhat` | `/{ja,en}/pricing-vietnam-to-japan` | `pricing` |
| `priceJpVn` | `/vi/chinh-sach-gia-nhat-viet` | `/{ja,en}/pricing-japan-to-vietnam` | `pricing` |

Breadcrumb hiển thị: Trang chủ › Bảng giá › Chính sách giá Việt – Nhật.

### Quyết định đã chốt (không hỏi lại; muốn đổi thì sửa prompt trước khi chạy)
1. **Template:** dùng lại `InfoPage` + `info-pages.ts`, không tạo template thứ ba. Chỉ dùng class đã có trong `globals.css`, tức nhóm thành phần landing ở mục 12 của design system (bảng đối chiếu ở §2). **Không thêm token, màu, bóng đổ hay class trang trí mới.** Bố cục bổ sung chỉ dùng utility Tailwind.
2. **`/bang-gia` thành trang hub:** gồm 2 thẻ tuyến (giá tóm tắt lấy từ `pricing-data.ts`, link sang 2 trang mới) và công cụ **Tính cước nhanh**. Bảng giá đầy đủ, phụ thu và cách tính cân chuyển hẳn sang 2 trang chính sách giá, để không có 2 URL mang cùng một bảng. *Nếu muốn giữ bảng đầy đủ ở `/bang-gia`, bỏ bước B6.1.*
3. **`/chinh-sach-van-chuyen`:** phần "Cách tính khối lượng" tách theo 2 chiều (hai chiều có quy định khác nhau, xem §1.3). Phần đền bù giữ nguyên.
4. **Infographic trong PDF:** trích ra WebP và đặt trong section cách tính cân của từng chiều. Ảnh có chữ tiếng Việt nên **chỉ hiển thị ở locale `vi`**. Ở JA/EN, nội dung đã có đủ bằng HTML. Logo trong PDF trùng với `public/logo/haruto-lockup.webp`, **không** thêm lại.
5. **PDF là nguồn sự thật mới nhất** (cả 2 đều ghi "Áp dụng từ ngày 1/10/2026"). Chỗ nào site cũ khác PDF thì sửa theo PDF và ghi vào báo cáo (§1.4). Ngoại lệ: mốc **21 – 50 kg** của hàng sạch giữ nguyên (chủ site đã xác nhận ngày 2026-11-11, PDF ghi "20-50kg").
6. **Git:** commit thẳng lên `main`, mỗi bước một commit nhỏ. Chỉ push khi B11 pass.

### Ràng buộc
- Không bịa dữ kiện. Mọi copy đã cho sẵn ở **Phụ lục A–C**, dùng nguyên văn. Bản JA/EN là bản mới, ghi vào báo cáo "chờ duyệt".
- **Mọi con số kinh doanh** (giá, phụ thu, mốc cân, mốc kích thước, % bảo hiểm, trần đền bù) phải lấy từ `pricing-data.ts`, hoặc nằm trong chuỗi messages đã được `pricing:check` kiểm (B9).
- Mỗi trang 1 H1, H2 cho section, H3 cho thẻ con. Giữ `data-reveal`, `data-reveal-group`, `data-track`, a11y, CSP. Không thêm dependency.
- Không commit 2 file PDF vào repo.

---

## 1. Dữ liệu PDF (đã đối chiếu từng dòng)

### 1.1 PDF VN-JP (Việt → Nhật)
- **I. Mô tả về hàng.** Hàng sạch và hàng hỗn hợp: trùng 100% với `pricing.vnJp.clean.features` và `pricing.vnJp.mixed.features` hiện có. Giữ nguyên.
- **II. Cước.** Hàng sạch 1–5 kg 130.000 (phụ thu 200.000đ/kiện) · 6–9 kg 125.000 · 10–20 kg 105.000 · 20(21)–50 kg 95.000 · 50–100 kg 89.000 · 100–200 kg 88.000 · 200–500 kg 85.000 · trên 500 kg thương lượng. Hàng hỗn hợp 1 kg 390.000 · 2 kg 260.000 · 3 kg 215.000 · 4 kg 185.000 · 5 kg 170.000 · 6 kg 150.000 · 7–9 kg 140.000 · 10 kg 135.000 · 11–14 kg 125.000 · 15–20 kg 120.000 · 21–25 kg 108.000 · 26–30 kg 105.000. Cả hai bảng đều ghi "Giá bao gồm ship nội địa Nhật". **Khớp với `pricing-data.ts`.**
- **III. Phụ thu** (giống hệt ở 2 PDF): điện tử/đồ có pin (Starlink, laptop cũ, điện thoại cũ, máy ảnh…) 150.000 VNĐ/sản phẩm · nước hoa, đồ có cồn 350.000 VNĐ/sản phẩm · đóng lại kiện carton **25.000** VNĐ/kg · đóng gỗ 34.000 VNĐ/kg · đóng lại thùng xốp: 74×46×39 cm 3.563 yên/thùng, 46×33×34 cm 2.187 yên/thùng, kèm 50.000 VNĐ/thùng (áp dụng giao nội địa) · đóng hàng đặc biệt 85.000 VNĐ/kg · khác: liên hệ.
- **IV. Cách tính khối lượng: quy định hàng cồng kềnh** (áp dụng với hàng vượt tiêu chuẩn kích thước)
  1. Tổng 3 cạnh tối đa (D + R + C) theo cân nặng: dưới 10 kg 120 cm · 10–20 kg 140–150 cm · 20–30 kg 160–180 cm.
  2. Các trường hợp phụ thu: vượt tiêu chuẩn theo cân → phát sinh phụ thu cồng kềnh · có bất kỳ cạnh nào từ 100 cm trở lên → được xem xét tính phụ thu · tổng 3 cạnh trên 260 cm hoặc nặng trên 50 kg → liên hệ để kiểm tra cước phí phát sinh.
  3. Làm tròn theo mốc 0,5 kg: 3,2 kg → 3,5 kg; 3,6 kg → 4 kg.
  - **Mức phụ thu: 220.000đ – 800.000đ**, tùy thuộc vào kích thước và đặc điểm kiện hàng. *Con số này chỉ có trong infographic, phần chữ của PDF không có.*
  - Lưu ý: hàng vượt 260 cm hoặc trên 50 kg cần liên hệ để kiểm tra trước khi gửi.
- **V. Đền bù:** có mua bảo hiểm → đền 100% giá trị hàng khai báo · không mua → đền 100% giá trị vận chuyển, tối đa 3.000.000 VNĐ/đơn · giá trị bảo hiểm 8%.
- **Lưu ý khi gửi:** chụp ảnh kiện · khai báo đúng giá trị, số lượng · giữ hóa đơn siêu thị trong kiện · hàng gửi đến kho đủ tên, SĐT, địa chỉ người nhận · **đọc kỹ hướng dẫn gửi hàng, thỏa thuận và chính sách bảo hiểm; một số nhóm hàng có thể có rủi ro khi thông quan Nhật Bản và không được bảo hiểm thông quan** *(site chưa có dòng này)* · không bảo hành hàng có hạn bảo quản dưới 10 ngày · quay video liền mạch khi kiểm đếm · không có video thì không giải quyết khiếu nại, và chỉ giải quyết trong vòng 24 giờ · vắng nhà sẽ được hẹn lại · thời gian nhận có thể bị ảnh hưởng bởi thời tiết, thiên tai, thông quan.

### 1.2 PDF JAPAN-VN (Nhật → Việt)
- **I. Tỷ giá mua hộ** = Giá trị đơn hàng × Tỷ giá quy đổi. Với mọi giá trị đơn hàng: VCB+5, không phụ thu.
- **II. Cước:** với mọi kg **155.000 VNĐ/kg**. **Nội địa VN:** khách tự chi trả · tự chọn đơn vị vận chuyển · tự đặt đơn hoặc nhờ nhân viên kho book · chi phí theo biểu phí của đơn vị khách chọn. **Giá dịch vụ chưa bao gồm VAT.**
- **III. Phụ thu:** giống VN-JP.
- **IV. Cách tính khối lượng:** hàng thường tính theo kg cân thực tế · hàng cồng kềnh khi kích thước > 60 + 40 + 40 cm (tổng vượt 140 cm; ví dụ xe đạp, vali, loa, thùng áo cưới, thùng áo vest) hoặc nặng > 30 kg · trọng lượng thể tích = D × R × C / 6.000 · cân thực tế lớn hơn thì tính theo cân thực tế, ngược lại tính theo thể tích · dưới 1 kg làm tròn thành 1 kg · trên 1 kg làm tròn 1 chữ số thập phân (3,04 → 3; 3,05 → 3,1). Infographic có thêm câu lưu ý: quy ước này giúp tính cước công bằng, thống nhất, nhất là với hàng to nhưng nhẹ. **Khớp với `policy.weight` hiện có.**
- **V. Đền bù:** giống VN-JP.
- **VI. Mua hộ / Đấu giá hộ / Vận chuyển hộ:** mua hộ thanh toán 100% · đấu giá cọc 50%; thắng thì trả phần còn lại; thua thì HARUTO hoàn 100% cọc · vận chuyển hộ: kho Nhật 〒133-0056, 東京都江戸川区南小岩8-5-4 グリームコーポ1階（102）, SĐT 070-3850-5733, tên người nhận "HRT- mã nhân viên - mã khách hàng (hoặc tên KH)". **Khớp với `policy.concierge` và `policy.warehouse`**, trừ phần "(hoặc tên KH)" còn thiếu.
- **Lưu ý khi gửi:** chỉ có 3 dòng: chụp ảnh, khai báo, giữ hóa đơn siêu thị.

### 1.3 Hai chiều có quy định cân khác nhau
| | Việt → Nhật | Nhật → Việt |
|---|---|---|
| Hàng cồng kềnh | Vượt tiêu chuẩn tổng 3 cạnh theo cân, hoặc có cạnh ≥ 100 cm → **phụ thu cố định 220k–800k** | Tổng 3 cạnh > 140 cm hoặc > 30 kg → **tính cân theo thể tích ÷ 6.000** |
| Làm tròn | Lên mốc **0,5 kg** | < 1 kg → 1 kg; > 1 kg → **0,1 kg** |
| Phải liên hệ trước | > 260 cm hoặc > 50 kg | — |

Hiện tại `/chinh-sach-van-chuyen` và công cụ tính cước đang áp quy định Nhật → Việt cho **cả hai chiều**. Bước B6.2 và B8 sửa lại.

### 1.4 Chỗ site đang lệch so với PDF (sửa trong đợt này, ghi vào báo cáo)
| # | Chỗ | Site hiện tại | PDF | Bước |
|---|---|---|---|---|
| 1 | `pricing.surcharge.items.carton.fee` (vi/ja/en) | 25.500 VNĐ/kg | **25.000** VNĐ/kg | B3 |
| 2 | `pricing.vnJp.roundingRules.mixed` | bỏ lẻ < 0,1 kg; từ 0,1 kg cộng tròn 1 kg (3,1 → 4) | Cả chiều VN→JP làm tròn theo mốc **0,5 kg**, không tách hàng sạch/hỗn hợp | B3, B8 |
| 3 | `shipping-quote.ts` | VN→JP cũng tính cân thể tích ÷ 6.000 | VN→JP không dùng thể tích, dùng phụ thu cồng kềnh | B8 |
| 4 | `policy.weight` trên `/chinh-sach-van-chuyen` | Ghi như quy định chung | Chỉ đúng cho Nhật → Việt | B6.2 |
| 5 | Quy định cồng kềnh VN→JP, mức 220k–800k, lưu ý rủi ro thông quan | Chưa có | Có | B3, B5 |
| 6 | `policy.warehouse.recipient.value` | thiếu "(hoặc tên khách hàng)" | có | B3 |

**Chỉ báo cáo, không sửa** (cần chủ site trả lời):
- PDF VN-JP không nhắc tới VAT, nhưng `pricing.teaser.note` và `pricing.calculator.note` ghi "chưa gồm VAT" cho cả hai chiều.
- Quy tắc làm tròn hàng hỗn hợp cũ (#2) đã bị thay theo PDF. Nếu quy tắc cũ vẫn còn hiệu lực, chủ site cần báo lại.
- Mức 220k–800k chỉ có trong infographic.

---

## 2. Thiết kế 2 trang

### 2.1 `/vi/chinh-sach-gia-viet-nhat` (priceVnJp)
```
HERO (HeroShell)  eyebrow "Bảng giá" · H1 · lead · pill 📅 "Áp dụng từ ngày 01/10/2026"
                  [Chat Zalo] [Gọi hotline] · ảnh PAGE_IMAGES.priceVnJp
                  chips: Loại hàng & cước · Phụ thu · Cách tính khối lượng · Đền bù · Lưu ý
§1 ivory  H2 Loại hàng và cước vận chuyển     → <RatesVnJp/> (callout + 2 rate-card hàng sạch/hỗn hợp; bỏ RoundingRules)
§2 sage   H2 Phụ thu                            → <Surcharges/>
§3 ivory  H2 Cách tính khối lượng chiều Việt → Nhật → <WeightVnJp/>
           ┌ H3 Tiêu chuẩn kích thước theo cân nặng ┐  ┌ stat-card--featured ──────────┐
           │ .rate-table 3 dòng                      │  │ Mức phụ thu hàng cồng kềnh     │
           │ H3 Các trường hợp phụ thu (3 dòng icon) │  │ 220.000 – 800.000 VNĐ          │
           └─────────────────────────────────────────┘  │ tùy kích thước & đặc điểm kiện │
           info-card "Làm tròn theo mốc 0,5 kg" + 2 chip  └────────────────────────────────┘
           callout ⚠ "Hàng vượt 260 cm hoặc trên 50 kg cần liên hệ…"
           <PolicyFigure id="vnJp"/>  (chỉ vi)
§4 sage   H2 Chính sách đền bù…                 → <Compensation/>
§5 ivory  H2 Lưu ý quan trọng khi gửi hàng      → <WarehouseTips ids=TIPS.vnJp/>  (8 dòng)
FAQ (tag priceVnJp) · CtaBand (zalo + call) · RelatedLinks
```

### 2.2 `/vi/chinh-sach-gia-nhat-viet` (priceJpVn)
```
HERO  H1 · lead · pill ngày áp dụng · [Chat Zalo] [Gọi hotline] · chips
§1 ivory  H2 Tỷ giá mua hộ               → <BuyRate/>: info-card công thức (font-display) + .rate-table 1 dòng 3 cột
§2 sage   H2 Cước vận chuyển Nhật → Việt → <RatesJpVn variant="policy"/>: 155.000 VNĐ/kg + 4 dòng nội địa VN + callout VAT
§3 ivory  H2 Phụ thu                      → <Surcharges/>
§4 sage   H2 Cách tính khối lượng chiều Nhật → Việt → <WeightRules/> + <PolicyFigure id="jpVn"/> (chỉ vi)
§5 ivory  H2 Chính sách đền bù…          → <Compensation/>
§6 sage   H2 Mua hộ · Đấu giá hộ · Vận chuyển hộ → <ConciergeTerms/>
§7 ivory  H2 Thông tin gửi hàng kho Nhật  → <WarehouseInfo/> (địa chỉ + bản đồ)
§8 sage   H2 Lưu ý quan trọng khi gửi hàng → <WarehouseTips ids=TIPS.jpVn/>  (3 dòng)
FAQ (tag priceJpVn) · CtaBand · RelatedLinks
```

### 2.3 Đối chiếu design system → landing (chỉ dùng những gì đã có)
| Khối | Design system (`../design-system/index.html`) | Landing (`globals.css` / component) |
|---|---|---|
| Hero trang con | "Page hero (banner đầu trang con)" | `HeroShell` / `InfoHero` (`.page-hero`) |
| Mục lục | chip | `TocChips` |
| Thẻ loại hàng + bảng cân | "Teaser card & rate card", "Bảng giá theo cân nặng" | `.rate-card`, `.rate-table-wrap > .rate-table`, `tr[data-best]`, `.rate-badge`, `.rate-weight` |
| Bảng tiêu chuẩn kích thước, bảng tỷ giá | "Bảng giá theo cân nặng" | `.rate-table` (không có `.rate-bar`) |
| Mức phụ thu cồng kềnh | "Stat card (--featured)" | `.stat-card.stat-card--featured` |
| Phụ thu | "Info, surcharge…" | `.surcharge-card` |
| Ví dụ làm tròn | `.gold-tag` | `.rounding-example` (cùng một thành phần, khác tên) |
| Cảnh báo 260 cm / 50 kg, VAT | "Callout" | `.callout` + icon `Warning` (`text-gold-deep`) |
| Công thức thể tích | volumetric | `VolumetricDiagram` (`.volumetric`) |
| Infographic | Article/card + `<figure>` | `.info-card` bọc `<figure>` |
| Đền bù | stat-card | `Compensation` |
| Kho Nhật | warehouse-card | `WarehouseInfo` |
| CTA cuối trang | — | `CtaBand` |

Màu chữ: chữ cam cỡ nào cũng dùng `text-orange-deep`, không dùng `text-orange`. Icon cảnh báo dùng `text-gold-deep`. Không còn hex nào viết cứng trong file mới.

---

## B0. Chuẩn bị (không commit)
Repo này có thể đang được một phiên Claude khác sửa trên `main` (ví dụ việc banner/`globals.css`). Trước khi bắt đầu, `git status` phải sạch và `git pull` phải về được commit mới nhất. Có thay đổi chưa commit, hoặc pull bị conflict: **dừng lại và báo**, không stash, không reset.
```bash
git status
git checkout main && git pull
npm ci
npm run typecheck && npm run pricing:check && npm run build
npm run start & sleep 5 && npm run seo:check; kill %1
```
Ghi lại kết quả baseline. Nếu baseline đã fail, **dừng lại và báo cáo**.

---

## B1. Assets: lấy infographic từ 2 PDF

1. Tìm và xác nhận 2 file:
   ```bash
   ls -la /c/Users/ADMIN/Downloads/*261411HRT*.pdf
   ```
   Có thể tên file khác chút ít. Hãy mở bằng tool Read để xác định file nào có tiêu đề **"ĐƯỜNG AIR VN-JP"** và file nào có **"ĐƯỜNG AIR JAPAN-VN"**. Copy ra **ngoài repo**:
   ```bash
   mkdir -p ../haruto-price-pdf
   cp "<file VN-JP>" ../haruto-price-pdf/vn-jp.pdf
   cp "<file JAPAN-VN>" ../haruto-price-pdf/jp-vn.pdf
   ```
   Không tìm thấy PDF thì **dừng lại và hỏi**.
2. Tạo `scripts/extract-pdf-images.mjs` với nội dung ở **Phụ lục D** (script này đã được chạy thử trên chính 2 PDF này; chỉ dùng `zlib` và `sharp` có sẵn). Chạy:
   ```bash
   node scripts/extract-pdf-images.mjs ../haruto-price-pdf/vn-jp.pdf ../haruto-price-pdf/out
   node scripts/extract-pdf-images.mjs ../haruto-price-pdf/jp-vn.pdf ../haruto-price-pdf/out
   ```
   Kết quả mong đợi: mỗi PDF ra đúng 1 ảnh `…-obj29-1536x1024.webp` (VN-JP) và `…-obj24-1536x1024.webp` (JP-VN). Logo 500×500 bị bỏ qua có chủ đích (`minWidth=1000`).
3. Đặt tên theo nội dung và chuyển vào repo:
   ```bash
   mkdir -p public/images/haruto/chinh-sach-gia
   cp ../haruto-price-pdf/out/vn-jp-obj*-1536x1024.webp public/images/haruto/chinh-sach-gia/quy-dinh-hang-cong-kenh-viet-nhat.webp
   cp ../haruto-price-pdf/out/jp-vn-obj*-1536x1024.webp public/images/haruto/chinh-sach-gia/quy-uoc-tinh-trong-luong-nhat-viet.webp
   ```
   Mở cả 2 ảnh bằng tool Read để kiểm tra: ảnh VN-JP có tiêu đề "QUY ĐỊNH HÀNG CỒNG KỀNH", ảnh JP-VN có tiêu đề "QUY ƯỚC TÍNH TRỌNG LƯỢNG". Ghi lại dung lượng. Nếu ảnh nào trên 400 KB, encode lại với `quality: 75`.

**Commit:** `assets: price-policy infographics from the 2026-10-01 PDFs + extractor script`

---

## B2. `pricing-data.ts`: thêm số liệu chính sách

Thêm vào cuối file (giữ quy ước của file: không alias, không TS khó strip):
```ts
// Effective date of both price-policy PDFs (VN-JP and JAPAN-VN).
export const PRICE_POLICY_EFFECTIVE = "2026-10-01";

// Surcharges, identical on both routes (PDF §III). `vnd` null = on request.
export type Surcharge = { vnd: number | null; per: "item" | "kg" | "box" | "quote"; yenPerBox?: { large: number; small: number } };
export const SURCHARGES: Record<"electronics" | "perfume" | "carton" | "wooden" | "foam" | "special" | "other", Surcharge> = {
  electronics: { vnd: 150_000, per: "item" },
  perfume: { vnd: 350_000, per: "item" },
  carton: { vnd: 25_000, per: "kg" },
  wooden: { vnd: 34_000, per: "kg" },
  foam: { vnd: 50_000, per: "box", yenPerBox: { large: 3_563, small: 2_187 } }, // 74×46×39 cm / 46×33×34 cm
  special: { vnd: 85_000, per: "kg" },
  other: { vnd: null, per: "quote" },
};

// Vietnam → Japan bulky goods (PDF VN-JP §IV + infographic). maxSumCm: [low, high] of L + W + H.
export type SizeStandard = { minKg: number; maxKg: number; maxSumCm: [number, number] };
export const VN_JP_SIZE_STANDARD: SizeStandard[] = [
  { minKg: 0, maxKg: 10, maxSumCm: [120, 120] }, // "Dưới 10 kg"
  { minKg: 10, maxKg: 20, maxSumCm: [140, 150] },
  { minKg: 20, maxKg: 30, maxSumCm: [160, 180] },
];
export const VN_JP_BULKY = {
  anySideCm: 100, // any side from 100 cm → may be charged as bulky
  contactSumCm: 260, // over 260 cm L + W + H → contact before sending
  contactKg: 50, // over 50 kg → contact before sending
  surchargeVnd: [220_000, 800_000] as [number, number], // by size and parcel (infographic only)
  roundingStepKg: 0.5,
};

// Japan → Vietnam bulky goods (PDF JAPAN-VN §IV).
export const JP_VN_BULKY = { sumCm: 140, weightKg: 30, volumetricDivisor: 6000 };

// Compensation for lost goods (both routes, §V).
export const COMPENSATION = { insuranceRatePct: 8, uninsuredCapVnd: 3_000_000 };
```
Trong `shipping-quote.ts`, xóa 3 hằng `VOLUMETRIC_DIVISOR`, `BULKY_DIMENSION_SUM_CM`, `BULKY_WEIGHT_KG`; thay bằng `JP_VN_BULKY` (sửa luôn mọi chỗ import 3 hằng đó, `grep -rn` để tìm).

**Commit:** `pricing-data: surcharges, VN→JP bulky rules, compensation as numbers`

---

## B3. Messages (vi, ja, en)

Dùng một script node tạm (**không commit**) để sửa 3 file, ghi lại bằng `JSON.stringify(obj, null, 2)` + xuống dòng cuối file.

1. **Thêm** `pages.priceVnJp`, `pages.priceJpVn` (Phụ lục A). **Đặt 2 key này ngay sau `pages.pricing`.**
2. **Sửa** `pages.pricing.intro` (Phụ lục A).
3. **Thêm** namespace `pricePolicy` (Phụ lục B), đặt ngay sau `pricing`.
4. **Sửa:**
   - `pricing.surcharge.items.carton.fee`: vi `25.000 VNĐ/kg` · ja `25,000 VND/kg` · en `25,000 VND/kg`.
   - **Xóa** `pricing.vnJp.roundingRules` (quy tắc làm tròn chuyển sang `pricePolicy.vnJpWeight`).
   - `pricing.teaser.cardCta`: vi `Xem chính sách giá` · ja `料金規定を見る` · en `See the rate policy`.
   - `pricing.calculator.dimsHint`: đổi từ chuỗi thành object `{ vnJp, jpVn }`, và thêm `pricing.calculator.bulky` (Phụ lục C). Chuỗi cũ chuyển thành `dimsHint.jpVn`.
   - `service.price.detail` (thêm): vi `Xem chính sách giá chi tiết` · ja `料金規定の詳細を見る` · en `See the full rate policy`.
   - `service.price.unitVnd` (thêm): vi `VNĐ` · ja `VND` · en `VND`.
   - Mục `fee` của `pricing.surcharge.items.*` sẽ bị xóa ở B5.3.6 (trừ `other`). **Chưa xóa ở bước này.**
   - `policy.tips.items.customsRisk` (thêm, đặt **sau** `recipient`): Phụ lục C.
   - `policy.warehouse.recipient.value`: Phụ lục C.
5. **FAQ:** thêm `"priceVnJp"` và `"priceJpVn"` vào `pages` của câu "Giá cước được tính như thế nào?" (index 1). Thêm 3 câu mới ở **Phụ lục E** vào cuối `faq.items`.
6. **Assert trong script tạm:** 3 locale có **cùng tập key** (đệ quy); không còn chuỗi `25.500` / `25,500` ở đâu trong messages.

**Commit:** `i18n: price-policy pages copy, carton fee 25,000, VN→JP 0.5 kg rounding, 3 FAQ`

---

## B4. Registry, SEO, điều hướng

1. `src/shared/seo/pages.ts`
   - `PageKey` thêm `"priceVnJp" | "priceJpVn"`.
   - ```ts
     priceVnJp: { key: "priceVnJp", slugs: s("chinh-sach-gia-viet-nhat", "pricing-vietnam-to-japan"), indexable: true, updatedAt: "<ngày commit>", priority: 0.8, changeFrequency: "monthly", parent: "pricing", related: ["shipToJapan", "goods", "policy", "priceJpVn"] },
     priceJpVn: { key: "priceJpVn", slugs: s("chinh-sach-gia-nhat-viet", "pricing-japan-to-vietnam"), indexable: true, updatedAt: "<ngày commit>", priority: 0.8, changeFrequency: "monthly", parent: "pricing", related: ["shipToVietnam", "concierge", "japanWarehouse", "priceVnJp"] },
     ```
   - `pricing.related` → `["priceVnJp", "priceJpVn", "goods", "policy"]`. `shipToJapan.related` → `["priceVnJp", "policy", "goods", "japanWarehouse"]`. `shipToVietnam.related` → `["priceJpVn", "concierge", "japanWarehouse", "policy"]`.
   - Bump `updatedAt` của `pricing`, `policy`, `shipToJapan`, `shipToVietnam`, `japanWarehouse`, `home`.
2. `src/shared/seo/nav.ts`: nhóm `pricing` → `children: ["pricing", "priceVnJp", "priceJpVn", "goods"]`.
3. `src/shared/seo/page-media.ts`:
   ```ts
   priceVnJp: { src: `${HERO}/may-bay-tuyen-viet-nam-nhat-ban.webp`, position: "72% 50%" },
   priceJpVn: { src: `${HERO}/thung-hang-va-hang-nhat-nui-phu-si.webp`, position: "78% 50%" },
   ```
   Thêm `POLICY_FIGURES`:
   ```ts
   // Infographics from the price-policy PDFs: Vietnamese text baked in, so shown in `vi` only.
   export const POLICY_FIGURES = {
     vnJp: { src: "/images/haruto/chinh-sach-gia/quy-dinh-hang-cong-kenh-viet-nhat.webp", width: 1536, height: 1024 },
     jpVn: { src: "/images/haruto/chinh-sach-gia/quy-uoc-tinh-trong-luong-nhat-viet.webp", width: 1536, height: 1024 },
   } as const;
   ```
4. `src/app/[locale]/[...rest]/page.tsx`: `SERVICE_TYPES` thêm `priceVnJp: "Air freight Vietnam to Japan"`, `priceJpVn: "Air freight Japan to Vietnam"`. `OFFERS` thêm `priceVnJp: [OFFER_VN_JP]`, `priceJpVn: [OFFER_JP_VN]`. Schema `name` = `tp("title")` = H1, giữ như các trang info khác.
5. `info-pages.ts` → `FAQ_GROUPS`: nhóm `shipping` thêm tag `"priceVnJp"`, `"priceJpVn"`.

**Commit:** `seo: register priceVnJp / priceJpVn (slugs, nav, breadcrumb under pricing, schema, media)`

---

## B5. Config + component cho section

### B5.1 `info-pages.ts`
- `InfoKey` thêm `"priceVnJp" | "priceJpVn"`.
- `InfoSectionId` thêm `"routes" | "calculator" | "weightVnJp" | "weightJpVn" | "buyRate" | "freightJpVn" | "conciergeTerms" | "tipsVnJp" | "tipsJpVn"`. **Xóa** `"weight"` (thay bằng 2 id theo chiều).
- `heroNote` đổi kiểu thành `"effectiveDate" | "effectiveRoute"`. `effectiveRoute` hiển thị `pricePolicy.effective` trong đúng pill hiện có (icon `CalendarCheck`).
- Thêm:
  ```ts
  export const TIPS: Record<"vnJp" | "jpVn" | "warehouse", string[]> = {
    vnJp: ["photo", "declare", "receipt", "recipient", "customsRisk", "shelfLife", "video", "redelivery"],
    jpVn: ["photo", "declare", "receipt"],
    warehouse: ["photo", "declare", "receipt", "recipient", "video", "shelfLife", "redelivery"], // as before
  };
  ```
- `INFO_PAGES`:
  ```ts
  pricing: {
    heroActions: { primary: "contact", secondary: "call" },
    heroNote: "effectiveDate",
    toc: ["routes", "calculator"],
    sections: ["routes", "calculator"],
    faq: true,
    cta: { primary: "zalo", secondary: "call" },
  },
  priceVnJp: {
    heroActions: { primary: "zalo", secondary: "call" },
    heroNote: "effectiveRoute",
    toc: ["ratesVnJp", "surcharges", "weightVnJp", "compensation", "tipsVnJp"],
    sections: ["ratesVnJp", "surcharges", "weightVnJp", "compensation", "tipsVnJp"],
    faq: true,
    cta: { primary: "zalo", secondary: "call" },
  },
  priceJpVn: {
    heroActions: { primary: "zalo", secondary: "call" },
    heroNote: "effectiveRoute",
    toc: ["buyRate", "freightJpVn", "surcharges", "weightJpVn", "compensation", "conciergeTerms", "warehouse"],
    sections: ["buyRate", "freightJpVn", "surcharges", "weightJpVn", "compensation", "conciergeTerms", "warehouse", "tipsJpVn"],
    faq: true,
    cta: { primary: "zalo", secondary: "call" },
  },
  policy: {
    heroActions: { primary: "contact" },
    toc: ["weightVnJp", "weightJpVn", "compensation"],
    sections: ["weightVnJp", "weightJpVn", "compensation"],
    faq: true,
    cta: { primary: "zalo", secondary: "contact" },
  },
  ```
  `japanWarehouse` giữ nguyên; section `warehouseTips` render `WarehouseTips ids={TIPS.warehouse}`.
- Thêm icon cho các trường hợp phụ thu VN→JP:
  ```ts
  export const VN_JP_BULKY_CASES: Record<"oversize" | "longSide" | "contact", { Icon: typeof Package; tone: Tone }> = {
    oversize: { Icon: Ruler, tone: "warn" }, longSide: { Icon: ArrowsOutLineHorizontal, tone: "warn" }, contact: { Icon: Phone, tone: "info" },
  };
  ```

### B5.2 `info-page.tsx`
- `BODIES` thêm: `routes: RouteCards`, `calculator: () => <ShippingCalculator />`, `weightVnJp: WeightVnJp`, `weightJpVn: WeightJpVn`, `buyRate: BuyRate`, `freightJpVn: () => <RatesJpVn variant="policy" />`, `conciergeTerms: ConciergeTerms`, `tipsVnJp: () => <WarehouseTips ids={TIPS.vnJp} />`, `tipsJpVn: () => <WarehouseTips ids={TIPS.jpVn} />`. Bỏ `weight`.
- `titles` thêm: `routes` → `pricePolicy.sections.routes`; `calculator` → `pricing.calculator.title`; `ratesVnJp` → **trang priceVnJp** dùng `pricePolicy.sections.goodsRates` (trang khác giữ `pricing.teaser.vnJp.label`); `weightVnJp` / `weightJpVn` / `buyRate` / `freightJpVn` → `pricePolicy.sections.*`; `conciergeTerms` → `policy.concierge.title`; `tipsVnJp` / `tipsJpVn` → `policy.tips.title`.
- `intros` thêm: `weightVnJp` → `pricePolicy.vnJpWeight.intro`.
- Calculator: nếu `ShippingCalculator` tự in H2 hoặc tiêu đề riêng, thêm prop `withTitle={false}` để trong InfoSection không bị 2 tiêu đề.

### B5.3 Component mới `src/modules/landing/components/info/price-policy.tsx` (server component)
Số liệu lấy từ `pricing-data.ts`, định dạng bằng `Intl.NumberFormat({vi:"vi-VN",ja:"ja-JP",en:"en-US"}[locale])`. **Gom helper `NUMBER_LOCALE` / `formatVnd` vào `src/shared/lib/format.ts`** và cho `price-summary.tsx` dùng chung.

1. **`WeightVnJp()`**: bố cục `grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]`, có `data-reveal-group`.
   - Cột trái, một `.info-card`:
     - H3 `vnJpWeight.sizeTitle`, rồi `.rate-table-wrap > table.rate-table` (`role="group"`, `tabIndex=0`, `aria-label` = sizeTitle). `thead`: `columns.weight` | `columns.maxSum`. `tbody`: mỗi dòng của `VN_JP_SIZE_STANDARD`; dòng `minKg === 0` hiện `t("under", { kg: 10 })`, các dòng khác hiện `"{min} – {max} kg"`. Cột 2 hiện `"120 cm"` hoặc `"140 – 150 cm"`. Không có `.rate-bar`, không có `data-best`.
     - H3 `vnJpWeight.casesTitle` + `<ul>` 3 dòng `cases.oversize|longSide|contact`. ICU params: `{ cm: VN_JP_BULKY.anySideCm }` cho longSide; `{ cm: contactSumCm, kg: contactKg }` cho contact. Icon theo `VN_JP_BULKY_CASES`; tone `warn` → `text-gold-deep`, `info` → `text-forest`.
   - Cột phải, xếp dọc:
     - `.stat-card.stat-card--featured`: icon `Coins`, H3 `surchargeLabel`, `.stat-card__value` = `"{formatVnd(min)} – {formatVnd(max)}"`, `.stat-card__label` = `service.price.unitVnd` (B3 thêm key này: vi `VNĐ`, ja `VND`, en `VND`), `.stat-card__body` = `surchargeNote`.
     - `.info-card`: icon `ArrowsDownUp` trong `.icon-chip`, H3 `roundingTitle`, `<p class="text-muted">` `roundingBody`, `<ul>` các `.rounding-example` lấy từ `roundingExamples` (icon `Scales`).
   - Bên dưới (full width): `<p class="callout mt-6">` + icon `Warning` (`text-gold-deep`, `weight="fill"`) + `t("warning", { cm, kg })`.
   - Cuối cùng là `<PolicyFigure id="vnJp" />`.
2. **`WeightJpVn()`** = `<WeightRules />` hiện có + `<PolicyFigure id="jpVn" />`. Đổi tên `WeightRules` thành `WeightJpVn`, giữ nguyên markup. Thêm `<p class="callout mt-6">` (icon `Lightbulb`) với `pricePolicy.jpVnWeight.note`.
3. **`PolicyFigure({ id })`**: `useLocale() !== "vi"` thì trả `null`. Ngược lại:
   ```tsx
   <figure data-reveal className="info-card mt-8 overflow-hidden p-0">
     <Image src={src} width={1536} height={1024} alt={t(`figure.${id}.alt`)} sizes="(max-width: 1023px) 100vw, 64rem" className="h-auto w-full" />
     <figcaption className="flex flex-wrap items-center justify-between gap-3 border-t border-line p-4 text-sm text-muted">
       <span>{t(`figure.${id}.caption`)}</span>
       <a href={src} target="_blank" rel="noopener" className="link-arrow text-forest">{t("figure.open")}</a>
     </figcaption>
   </figure>
   ```
   Không `priority`.
4. **`BuyRate()`**: `.info-card` gồm `<p className="font-display font-(--weight-display) text-2xl text-forest sm:text-3xl">{buyRate.formula}</p>`, bên dưới là `.rate-table` 3 cột (`columns.value | rate | surcharge`) với đúng 1 dòng `row.*`. Ô `rate` in đậm `text-forest`; ô `surcharge` dùng icon `CheckCircle` + chữ.
5. **`RouteCards()`** (hub `/bang-gia`): lưới 2 cột `sm:grid-cols-2`. Mỗi thẻ dùng **đúng markup `.teaser-card`** của `pricing-teaser.tsx` (ảnh `PRICING_IMAGES.vnJp|jpVn` + `.teaser-card__label` = `pricing.teaser.<dir>.label`), link tới `pagePath(locale, "priceVnJp"|"priceJpVn")`, `data-track="cta_price_policy_<dir>"`. Phần thân:
   - vnJp: 2 dòng `"{clean.title}: {min} – {max} VNĐ/kg"` và `"{mixed.title}: …"`, dùng lại hàm `range()` (chuyển từ `price-summary.tsx` vào `pricing-data.ts`, đặt tên `priceRange(tiers)`).
   - jpVn: giá `JP_VN[0]` bằng `font-display text-3xl`.
   - Tiếp theo là `<ul>` 3 `routes.<dir>.points` (icon `CheckCircle`), rồi `.link-arrow` `routes.<dir>.cta`.
6. **`Surcharges()`**: giữ markup. Đơn vị và số tiền **không còn đọc từ chuỗi** mà tính từ `SURCHARGES[id]`: `fee` = `formatVnd(vnd)` + `pricePolicy.surchargeUnit.<per>`. `other` hiện `pricing.surcharge.items.other.fee`. Riêng `foam`: `item` giữ chuỗi messages (đã có số yên; B9 sẽ kiểm). Sau đó **xóa** các field `fee` trong messages, trừ `other`, để không còn 2 nguồn giá.
7. **`RatesJpVn({ variant = "teaser" })`** (`rates.tsx`): với `variant="policy"`, bỏ dòng `buyRate` (đã có section riêng), thay dòng `domestic` bằng `<ul>` 4 dòng `pricePolicy.domestic.items.*` (icon `Truck`, `Storefront`, `ClipboardText`, `Receipt`) dưới H3 `pricePolicy.domestic.title`, và đưa `vat` ra một `.callout` riêng.
8. **`RatesVnJp()`**: bỏ `<RoundingRules />` và xóa luôn hàm `RoundingRules`.
9. **`WarehouseTips({ ids })`** (`policy-sections.tsx`): render theo đúng thứ tự `ids`, lấy text `policy.tips.items.<id>`. `TIP_ICONS` thêm `customsRisk: ShieldWarning`.

**Commit:** `feat(pricing): price-policy pages VN→JP and JP→VN on the InfoPage template`

---

## B6. `/bang-gia` hub và `/chinh-sach-van-chuyen`

1. `/bang-gia` hiển thị `routes` + `calculator` (đã cấu hình ở B5.1). Kiểm tra: không còn `<table class="rate-table">` nào trên `/vi/bang-gia`; có 2 link tới `/vi/chinh-sach-gia-viet-nhat` và `/vi/chinh-sach-gia-nhat-viet`.
2. `/chinh-sach-van-chuyen`: section `weightVnJp` + `weightJpVn` + `compensation` (đã cấu hình). H2 phải ghi rõ chiều.

**Commit:** `feat(pricing): /bang-gia becomes the route hub; policy weight rules split by direction`

---

## B7. Link từ trang chủ và trang dịch vụ
1. `pricing-teaser.tsx`: `CARDS` → `vnJp` trỏ tới `priceVnJp`, `jpVn` trỏ tới `priceJpVn` (sửa cả comment).
2. `service/price-summary.tsx`: nút cuối section đổi thành `Link` tới `priceVnJp` / `priceJpVn` theo `direction`, nhãn `service.price.detail`, `className="btn btn-outline bg-white/70"` (đúng class mà `ContactCta variant="outline"` đang dùng), `data-track="cta_price_policy_<direction>"`. Sửa comment đầu file: bảng chi tiết nằm ở trang chính sách giá của từng chiều.

**Commit:** `feat(links): home teaser and service price summaries point to the price-policy pages`

---

## B8. Công cụ tính cước theo đúng quy định từng chiều (`shipping-quote.ts` + `shipping-calculator.tsx`)
1. `roundWeight`: `vnJp` → `Math.ceil(kg / VN_JP_BULKY.roundingStepKg - EPS) * step` cho **cả hàng sạch và hàng hỗn hợp**. `jpVn` giữ nguyên. Vẫn giữ `Math.max(1, …)`, vì bảng giá bắt đầu từ 1 kg.
2. `chargedWeight`: chỉ tính thể tích khi `route === "jpVn"` (dùng `JP_VN_BULKY`).
3. Thêm vào `Quote` field `bulky?: "oversize" | "review" | "contact"`, chỉ có với `vnJp`. Thứ tự ưu tiên:
   - `contact`: tổng 3 cạnh > `contactSumCm` hoặc kg > `contactKg`.
   - `oversize`: kg ≤ 30, có kích thước, và tổng 3 cạnh > cận **trên** `maxSumCm[1]` của mốc cân tương ứng (mốc: `kg < 10` → dòng 1; `10 ≤ kg ≤ 20` → dòng 2; `20 < kg ≤ 30` → dòng 3).
   - `review`: có cạnh ≥ `anySideCm`, **hoặc** tổng 3 cạnh nằm trong khoảng `[maxSumCm[0], maxSumCm[1]]` của mốc đó (đây là vùng PDF ghi theo khoảng, nên chưa chắc có phụ thu).
   - Phụ thu cồng kềnh **không cộng vào `total`** (PDF chỉ cho một khoảng giá).
4. UI: `dimsHint` hiện theo route (`dimsHint.vnJp` / `dimsHint.jpVn`). Khi `result.bulky` có giá trị, hiện thêm dòng `pricing.calculator.bulky.<flag>` dưới tổng, với icon `Warning`, `text-gold-deep`, `role="status"`. ICU params lấy từ `VN_JP_BULKY` (`min`, `max` qua `formatVnd`; `cm`, `kg`). Dòng "theo cân thể tích" chỉ hiện với `jpVn`.
5. Cập nhật comment đầu `shipping-quote.ts` theo quy định mới (dẫn tới `pricePolicy.vnJpWeight` và `policy.weight`).
6. Kiểm tay bằng `node -e` (import qua type stripping, hoặc viết test tạm rồi xóa):
   - VN→JP hàng hỗn hợp 3,1 kg → `billableKg` 3,5, giá dòng "4 kg" 185.000 (mốc giữa 2 dòng thì lấy dòng trên, theo luật pickTier hiện có).
   - VN→JP hàng sạch 3,2 kg → 3,5 kg; 3,6 kg → 4 kg.
   - VN→JP 8 kg, kích thước 50×40×40 → `oversize`; 8 kg, 105×10×5 → `review`; 55 kg → `contact`.
   - JP→VN 5 kg, 60×40×40 (tổng 140, không vượt) → không tính thể tích; 5 kg, 70×50×40 → thể tích 23,3 kg.

**Commit:** `fix(calculator): VN→JP uses 0.5 kg rounding + bulky surcharge flags, volumetric only JP→VN`

---

## B9. Chống tái phát (`scripts/check-pricing-data.mjs`)
Thêm vào vòng lặp locale:
1. `pricing.surcharge.items.foam.item` phải chứa `3[.,]563` và `2[.,]187`.
2. `policy.compensation.insured.body` chứa `COMPENSATION.insuranceRatePct + "%"`; `policy.compensation.uninsured.{body,statLabel}` chứa `3[.,]000[.,]000`.
3. Các chuỗi văn xuôi có số tiền: thêm `pages.priceJpVn.{intro,metaDescription}` vào nhóm kiểm `155[.,]000` (giống `pages.shipToVietnam`). Câu FAQ có tag `priceVnJp` và nhắc tới phụ thu cồng kềnh phải chứa đúng `220[.,]000` và `800[.,]000`.
4. Cả repo `src/i18n/messages/*.json` **không** còn `25[.,]500`.
5. Mọi `pricing.surcharge.items.<id>` (trừ `other`) **không còn** field `fee` (B5.3.6), và tập id của `pricing.surcharge.items` phải trùng với key của `SURCHARGES`.

**Commit:** `chore(checks): surcharge, compensation and bulky-range strings checked against pricing-data`

---

## B10. OG + sitemap
```bash
npm run og:build
```
Phải sinh ra `public/og/priceVnJp.jpg` và `public/og/priceJpVn.jpg`. Kiểm tra `sitemap.xml` có 6 URL mới (2 trang × 3 locale), có hreflang vi/ja/en và x-default.

**Commit:** `og: share images for the price-policy pages`

---

## B11. Kiểm tra (bắt buộc pass trước khi push)
```bash
npm run typecheck
npm run pricing:check
npm run build
npm run start & sleep 5 && npm run seo:check; kill %1
```
Kiểm tra bằng script fetch HTML trên `localhost` (hoặc trình duyệt) với 2 trang × 3 locale, cộng `/bang-gia` và `/chinh-sach-van-chuyen`:
- [ ] Đúng 1 `<h1>`; H1 VI chứa *chính sách giá gửi hàng đi Nhật* / *ship hàng Nhật về Việt Nam*.
- [ ] Breadcrumb hiện 3 cấp, JSON-LD `BreadcrumbList` có 3 item.
- [ ] Mọi con số trên 2 trang khớp §1.1, §1.2: 20 mốc giá, 7 phụ thu, 3 mốc kích thước, 220.000 – 800.000, 0,5 kg, 155.000, VCB + 5, 8%, 3.000.000, 6.000, 140 cm, 30 kg, địa chỉ kho, 070-3850-5733.
- [ ] `/vi/chinh-sach-gia-viet-nhat` có ảnh infographic; `/ja/…` và `/en/…` **không** có.
- [ ] Đúng 1 ảnh `priority` mỗi trang (ảnh hero).
- [ ] Chip mục lục cuộn tới đúng `id` (`#weight-vn-jp`, `#buy-rate`, …).
- [ ] `/vi/bang-gia`: không còn `.rate-table`; có 2 thẻ tuyến + công cụ tính cước.
- [ ] Menu "Bảng giá" có 4 mục.
- [ ] Công cụ tính cước cho đúng 4 kết quả ở B8.6.
- [ ] Không có `MISSING_MESSAGE` khi build/start.
- [ ] Viewport 375 / 768 / 1280: không tràn ngang; bảng kích thước cuộn ngang được trên 375.
- [ ] `grep -rnE "#[0-9a-fA-F]{6}" src/modules/landing/components/info/price-policy.tsx` không có kết quả.

Fail bước nào thì sửa, rồi chạy lại toàn bộ B11.

---

## B12. Bàn giao
1. `git push origin main`.
2. Thêm 1 dòng vào Changelog cuối `docs/SEO-ROADMAP.md`: `2026-11-15 — price policy — 2 trang chính sách giá VN→JP / JP→VN theo PDF 01/10/2026; /bang-gia thành hub; sửa phụ thu carton, làm tròn VN→JP, calculator`.
3. Báo cáo gồm: các commit SHA, kết quả B11, dung lượng 2 ảnh infographic, bảng "đã sửa so với site cũ" (§1.4), và danh sách **việc chờ chủ site**:
   - Duyệt copy JA/EN mới (Phụ lục A–C, E).
   - Xác nhận VAT cho chiều VN→JP.
   - Xác nhận bỏ quy tắc làm tròn hàng hỗn hợp cũ.
   - Xác nhận mức 220k–800k (chỉ có trong infographic).
4. Xóa thư mục `../haruto-price-pdf`.

---

# Phụ lục A — `pages.*`

```jsonc
// vi
"priceVnJp": {
  "nav": "Chính sách giá Việt – Nhật",
  "breadcrumb": "Chính sách giá Việt – Nhật",
  "title": "Chính sách giá gửi hàng đi Nhật đường hàng không",
  "intro": "Chính sách giá tuyến Việt Nam → Nhật Bản: cước hàng sạch và hàng hỗn hợp theo mốc cân (đã gồm thuế và ship nội địa Nhật), phụ thu, quy định hàng cồng kềnh và chính sách đền bù.",
  "metaTitle": "Chính sách giá gửi hàng đi Nhật (Air VN–JP) | HARUTO",
  "metaDescription": "Giá gửi hàng Việt – Nhật đường Air từ 01/10/2026: hàng sạch, hàng hỗn hợp theo mốc cân, đã gồm thuế và ship nội địa Nhật. Kèm phụ thu, hàng cồng kềnh, đền bù."
},
"priceJpVn": {
  "nav": "Chính sách giá Nhật – Việt",
  "breadcrumb": "Chính sách giá Nhật – Việt",
  "title": "Chính sách giá ship hàng Nhật về Việt Nam",
  "intro": "Chính sách giá tuyến Nhật Bản → Việt Nam đường hàng không: tỷ giá mua hộ VCB + 5 không phụ thu, cước 155.000 VNĐ/kg cho mọi cân nặng, phụ thu, cách tính cân, đền bù và chính sách mua hộ, đấu giá hộ, vận chuyển hộ.",
  "metaTitle": "Chính sách giá ship hàng Nhật về Việt Nam | HARUTO",
  "metaDescription": "Ship hàng Nhật về Việt Nam đường Air 155.000 VNĐ/kg mọi cân nặng, tỷ giá mua hộ VCB + 5 không phụ thu. Xem phụ thu, cách tính cân, đền bù và địa chỉ kho Nhật."
},
// pages.pricing.intro (sửa)
"intro": "Bảng giá vận chuyển hàng không hai chiều, áp dụng từ 01/10/2026: chiều Việt Nam → Nhật Bản tính theo mốc cân cho hàng sạch và hàng hỗn hợp; chiều Nhật Bản → Việt Nam 155.000 VNĐ/kg. Chọn tuyến để xem chính sách giá đầy đủ hoặc tính cước nhanh."

// ja
"priceVnJp": {
  "nav": "料金規定：ベトナム→日本",
  "breadcrumb": "料金規定：ベトナム→日本",
  "title": "ベトナムから日本への航空便 料金規定",
  "intro": "ベトナム→日本航空便の料金規定です。クリーン貨物・混載貨物の重量帯別運賃（税金・日本国内配送込み）、追加料金、大型貨物の規定、補償ポリシーをまとめています。",
  "metaTitle": "ベトナム→日本 航空便の料金規定 | HARUTO",
  "metaDescription": "2026年10月1日適用のベトナム→日本航空便の料金規定。クリーン貨物・混載貨物の重量帯別運賃は税金と日本国内配送込み。追加料金、大型貨物、補償も掲載。"
},
"priceJpVn": {
  "nav": "料金規定：日本→ベトナム",
  "breadcrumb": "料金規定：日本→ベトナム",
  "title": "日本からベトナムへの航空便 料金規定",
  "intro": "日本→ベトナム航空便の料金規定です。代理購入レートVCB + 5（追加料金なし）、全重量一律155,000 VND/kgの運賃、追加料金、重量計算、補償、代理購入・代理入札・代理発送のルールをまとめています。",
  "metaTitle": "日本→ベトナム 航空便の料金規定 | HARUTO",
  "metaDescription": "日本からベトナムへの航空便は全重量一律155,000 VND/kg、代理購入レートはVCB + 5で追加料金なし。追加料金、重量計算、補償、日本倉庫の住所も掲載。"
},
"intro": "2026年10月1日から適用する双方向の航空便料金です。ベトナム→日本はクリーン貨物・混載貨物を重量帯で算出、日本→ベトナムは155,000 VND/kg。路線を選んで料金規定の詳細を確認するか、運賃を試算できます。"

// en
"priceVnJp": {
  "nav": "Rate policy: Vietnam → Japan",
  "breadcrumb": "Rate policy: Vietnam → Japan",
  "title": "Vietnam to Japan air freight rate policy",
  "intro": "Rate policy for air freight from Vietnam to Japan: clean and mixed goods priced by weight band (tax and Japan domestic delivery included), surcharges, bulky-goods rules and compensation.",
  "metaTitle": "Vietnam → Japan air freight rate policy | HARUTO",
  "metaDescription": "Vietnam to Japan air freight rates from 1 Oct 2026: clean and mixed goods by weight band, tax and Japan domestic delivery included, plus surcharges, bulky goods and compensation."
},
"priceJpVn": {
  "nav": "Rate policy: Japan → Vietnam",
  "breadcrumb": "Rate policy: Japan → Vietnam",
  "title": "Japan to Vietnam air freight rate policy",
  "intro": "Rate policy for air freight from Japan to Vietnam: buy-for-you rate VCB + 5 with no surcharge, 155,000 VND/kg for any weight, surcharges, weight rules, compensation and our buying, bidding and ship-for-you terms.",
  "metaTitle": "Japan → Vietnam air freight rate policy | HARUTO",
  "metaDescription": "Ship from Japan to Vietnam by air at 155,000 VND/kg for any weight; buy-for-you rate VCB + 5, no surcharge. Surcharges, weight rules, compensation and our Japan warehouse address."
},
"intro": "Two-way air-freight rates from 1 October 2026: Vietnam → Japan is priced by weight band for clean and mixed goods; Japan → Vietnam is 155,000 VND/kg. Pick a route for its full rate policy, or estimate your freight."
```

# Phụ lục B — namespace `pricePolicy`

```json
// vi
"pricePolicy": {
  "effective": "Áp dụng từ ngày 01/10/2026",
  "sections": {
    "routes": "Chọn tuyến để xem chính sách giá",
    "goodsRates": "Loại hàng và cước vận chuyển",
    "weightVnJp": "Cách tính khối lượng chiều Việt → Nhật",
    "weightJpVn": "Cách tính khối lượng chiều Nhật → Việt",
    "buyRate": "Tỷ giá mua hộ",
    "freightJpVn": "Cước vận chuyển Nhật → Việt"
  },
  "routes": {
    "vnJp": {
      "points": { "tax": "Đã gồm thuế và ship nội địa Nhật", "goods": "Hàng sạch và hàng hỗn hợp, giá theo mốc cân", "packing": "Hàng sạch: miễn phí gom đơn, đóng hàng" },
      "cta": "Xem chính sách giá Việt – Nhật"
    },
    "jpVn": {
      "points": { "flat": "Một giá cho mọi cân nặng", "buyRate": "Tỷ giá mua hộ VCB + 5, không phụ thu", "vat": "Giá dịch vụ chưa bao gồm VAT" },
      "cta": "Xem chính sách giá Nhật – Việt"
    }
  },
  "surchargeUnit": { "item": "VNĐ/sản phẩm", "kg": "VNĐ/kg", "box": "VNĐ/thùng (giao nội địa)", "quote": "" },
  "vnJpWeight": {
    "intro": "Quy định hàng cồng kềnh, áp dụng với hàng hóa vượt tiêu chuẩn kích thước.",
    "sizeTitle": "Tiêu chuẩn kích thước theo cân nặng",
    "columns": { "weight": "Cân nặng", "maxSum": "Tổng 3 cạnh tối đa (Dài + Rộng + Cao)" },
    "under": "Dưới {kg} kg",
    "casesTitle": "Các trường hợp phụ thu",
    "cases": {
      "oversize": "Kiện hàng vượt kích thước tiêu chuẩn theo mức cân nặng: phát sinh phụ thu hàng cồng kềnh.",
      "longSide": "Kiện hàng có bất kỳ một cạnh nào từ {cm} cm trở lên: được xem xét tính phụ thu cồng kềnh.",
      "contact": "Kiện hàng có tổng 3 cạnh trên {cm} cm hoặc nặng trên {kg} kg: vui lòng liên hệ để kiểm tra cước phí phát sinh."
    },
    "surchargeLabel": "Mức phụ thu hàng cồng kềnh",
    "surchargeNote": "Tùy thuộc vào kích thước và đặc điểm kiện hàng.",
    "roundingTitle": "Làm tròn trọng lượng theo mốc 0,5 kg",
    "roundingBody": "Cân nặng thực tế được làm tròn lên mốc 0,5 kg để tính cước.",
    "roundingExamples": ["3,2 kg → tính 3,5 kg", "3,6 kg → tính 4 kg"],
    "warning": "Hàng vượt {cm} cm hoặc trên {kg} kg cần liên hệ để kiểm tra trước khi gửi."
  },
  "jpVnWeight": {
    "note": "Quy ước này giúp tính cước công bằng và thống nhất, nhất là với các mặt hàng có kích thước lớn nhưng trọng lượng nhẹ."
  },
  "buyRate": {
    "formula": "Giá mua hộ = Giá trị đơn hàng × Tỷ giá quy đổi",
    "columns": { "value": "Giá trị đơn hàng", "rate": "Tỷ giá quy đổi", "surcharge": "Phụ thu" },
    "row": { "value": "Với mọi giá trị đơn hàng", "rate": "VCB + 5", "surcharge": "Không phụ thu" }
  },
  "domestic": {
    "title": "Cước vận chuyển nội địa Việt Nam",
    "items": {
      "payer": "Cước vận chuyển nội địa Việt Nam do khách hàng tự chi trả.",
      "choose": "Khách hàng được tự do lựa chọn đơn vị vận chuyển theo nhu cầu.",
      "booking": "Khách hàng có thể tự đặt đơn giao hàng hoặc nhờ nhân viên kho hỗ trợ book đơn.",
      "cost": "Chi phí thực tế áp dụng theo biểu phí của đơn vị vận chuyển mà khách hàng lựa chọn."
    }
  },
  "figure": {
    "open": "Xem ảnh khổ lớn",
    "vnJp": {
      "alt": "Infographic quy định hàng cồng kềnh chiều Việt – Nhật: tổng 3 cạnh tối đa theo cân nặng (dưới 10 kg 120 cm; 10–20 kg 140–150 cm; 20–30 kg 160–180 cm), các trường hợp phụ thu, làm tròn theo mốc 0,5 kg và mức phụ thu 220.000 – 800.000đ.",
      "caption": "Quy định hàng cồng kềnh tuyến Việt – Nhật (infographic)"
    },
    "jpVn": {
      "alt": "Infographic quy ước tính trọng lượng chiều Nhật – Việt: hàng thường tính theo cân thực tế, hàng cồng kềnh tính trọng lượng thể tích (Dài × Rộng × Cao ÷ 6.000), làm tròn dưới 1 kg thành 1 kg và trên 1 kg đến một chữ số thập phân.",
      "caption": "Quy ước tính trọng lượng tuyến Nhật – Việt (infographic)"
    }
  }
}
```
```json
// ja
"pricePolicy": {
  "effective": "2026年10月1日から適用",
  "sections": {
    "routes": "路線を選んで料金規定を見る",
    "goodsRates": "貨物の種類と運賃",
    "weightVnJp": "重量の計算方法（ベトナム→日本）",
    "weightJpVn": "重量の計算方法（日本→ベトナム）",
    "buyRate": "代理購入レート",
    "freightJpVn": "日本→ベトナムの運賃"
  },
  "routes": {
    "vnJp": {
      "points": { "tax": "税金と日本国内配送を含む", "goods": "クリーン貨物・混載貨物を重量帯で算出", "packing": "クリーン貨物はまとめ・梱包無料" },
      "cta": "ベトナム→日本の料金規定を見る"
    },
    "jpVn": {
      "points": { "flat": "全重量一律料金", "buyRate": "代理購入レート VCB + 5、追加料金なし", "vat": "サービス料金はVAT別" },
      "cta": "日本→ベトナムの料金規定を見る"
    }
  },
  "surchargeUnit": { "item": "VND/点", "kg": "VND/kg", "box": "VND/箱（国内配送）", "quote": "" },
  "vnJpWeight": {
    "intro": "大型貨物の規定です。サイズ基準を超える貨物に適用します。",
    "sizeTitle": "重量別のサイズ基準",
    "columns": { "weight": "重量", "maxSum": "3辺合計の上限（縦＋横＋高さ）" },
    "under": "{kg} kg未満",
    "casesTitle": "追加料金がかかる場合",
    "cases": {
      "oversize": "重量に対するサイズ基準を超える荷物：大型貨物の追加料金がかかります。",
      "longSide": "いずれかの辺が{cm} cm以上の荷物：大型貨物の追加料金の対象となる場合があります。",
      "contact": "3辺合計が{cm} cmを超える、または重量が{kg} kgを超える荷物：追加費用の確認のため事前にご連絡ください。"
    },
    "surchargeLabel": "大型貨物の追加料金",
    "surchargeNote": "荷物のサイズと特性により異なります。",
    "roundingTitle": "重量は0.5 kg単位で計算",
    "roundingBody": "実重量を0.5 kg単位に切り上げて運賃を計算します。",
    "roundingExamples": ["3.2 kg → 3.5 kgで計算", "3.6 kg → 4 kgで計算"],
    "warning": "{cm} cmを超える、または{kg} kgを超える荷物は、発送前にご連絡のうえ確認してください。"
  },
  "jpVnWeight": {
    "note": "この計算方法により、特にサイズが大きく軽い荷物でも、公平で統一的な運賃計算ができます。"
  },
  "buyRate": {
    "formula": "代理購入額 ＝ 注文金額 × 換算レート",
    "columns": { "value": "注文金額", "rate": "換算レート", "surcharge": "追加料金" },
    "row": { "value": "すべての注文金額", "rate": "VCB + 5", "surcharge": "なし" }
  },
  "domestic": {
    "title": "ベトナム国内の配送料",
    "items": {
      "payer": "ベトナム国内の配送料はお客様のご負担です。",
      "choose": "配送業者はご希望に合わせて自由にお選びいただけます。",
      "booking": "配送の手配はお客様ご自身で行うか、倉庫スタッフに依頼できます。",
      "cost": "実際の費用は、お選びいただいた配送業者の料金表に従います。"
    }
  },
  "figure": {
    "open": "大きな画像を見る",
    "vnJp": { "alt": "ベトナム→日本の大型貨物規定のインフォグラフィック", "caption": "ベトナム→日本の大型貨物規定（インフォグラフィック）" },
    "jpVn": { "alt": "日本→ベトナムの重量計算方法のインフォグラフィック", "caption": "日本→ベトナムの重量計算方法（インフォグラフィック）" }
  }
}
```
```json
// en
"pricePolicy": {
  "effective": "Effective from 1 October 2026",
  "sections": {
    "routes": "Pick a route to see its rate policy",
    "goodsRates": "Goods types and freight rates",
    "weightVnJp": "How weight is charged: Vietnam → Japan",
    "weightJpVn": "How weight is charged: Japan → Vietnam",
    "buyRate": "Buy-for-you exchange rate",
    "freightJpVn": "Japan → Vietnam freight"
  },
  "routes": {
    "vnJp": {
      "points": { "tax": "Tax and Japan domestic delivery included", "goods": "Clean and mixed goods, priced by weight band", "packing": "Clean goods: free consolidation and packing" },
      "cta": "See the Vietnam → Japan rate policy"
    },
    "jpVn": {
      "points": { "flat": "One rate for every weight", "buyRate": "Buy-for-you rate VCB + 5, no surcharge", "vat": "Service prices exclude VAT" },
      "cta": "See the Japan → Vietnam rate policy"
    }
  },
  "surchargeUnit": { "item": "VND/item", "kg": "VND/kg", "box": "VND/box (domestic delivery)", "quote": "" },
  "vnJpWeight": {
    "intro": "Bulky-goods rules, for parcels over the standard size.",
    "sizeTitle": "Size standard by weight",
    "columns": { "weight": "Weight", "maxSum": "Max. length + width + height" },
    "under": "Under {kg} kg",
    "casesTitle": "When a surcharge applies",
    "cases": {
      "oversize": "Parcels over the size standard for their weight: a bulky-goods surcharge applies.",
      "longSide": "Parcels with any side of {cm} cm or more: may be charged the bulky-goods surcharge.",
      "contact": "Parcels over {cm} cm in total or over {kg} kg: please contact us to check the extra charge."
    },
    "surchargeLabel": "Bulky-goods surcharge",
    "surchargeNote": "Depends on the parcel's size and characteristics.",
    "roundingTitle": "Weight rounded to 0.5 kg",
    "roundingBody": "The actual weight is rounded up to the next 0.5 kg for charging.",
    "roundingExamples": ["3.2 kg → charged 3.5 kg", "3.6 kg → charged 4 kg"],
    "warning": "Parcels over {cm} cm or over {kg} kg must be checked with us before sending."
  },
  "jpVnWeight": {
    "note": "These rules keep charging fair and consistent, especially for large but light items."
  },
  "buyRate": {
    "formula": "Purchase price = Order value × Exchange rate",
    "columns": { "value": "Order value", "rate": "Exchange rate", "surcharge": "Surcharge" },
    "row": { "value": "Any order value", "rate": "VCB + 5", "surcharge": "No surcharge" }
  },
  "domestic": {
    "title": "Domestic delivery in Vietnam",
    "items": {
      "payer": "Domestic delivery within Vietnam is paid by the customer.",
      "choose": "You are free to choose any delivery company.",
      "booking": "Book the delivery yourself or ask our warehouse staff to book it for you.",
      "cost": "The actual cost follows the rate card of the delivery company you choose."
    }
  },
  "figure": {
    "open": "View full size",
    "vnJp": { "alt": "Infographic of the Vietnam → Japan bulky-goods rules", "caption": "Vietnam → Japan bulky-goods rules (infographic)" },
    "jpVn": { "alt": "Infographic of how weight is charged from Japan to Vietnam", "caption": "Japan → Vietnam weight rules (infographic)" }
  }
}
```

# Phụ lục C — sửa trong `pricing.calculator`, `policy`

```jsonc
// pricing.calculator.dimsHint → object
// vi
"dimsHint": {
  "vnJp": "Chiều Việt → Nhật: kiện vượt tiêu chuẩn tổng 3 cạnh theo cân nặng, hoặc có cạnh từ 100 cm trở lên, có thể bị phụ thu cồng kềnh (không cộng vào ước tính).",
  "jpVn": "<chuỗi dimsHint cũ, giữ nguyên>"
},
"bulky": {
  "oversize": "Kiện vượt tiêu chuẩn kích thước theo cân nặng: phát sinh phụ thu cồng kềnh {min} – {max} VNĐ tùy kích thước và đặc điểm kiện, chưa cộng vào tổng.",
  "review": "Kiện có thể bị tính phụ thu cồng kềnh {min} – {max} VNĐ (cạnh từ {cm} cm trở lên hoặc sát mốc kích thước), chưa cộng vào tổng.",
  "contact": "Kiện trên {cm} cm tổng 3 cạnh hoặc trên {kg} kg: vui lòng liên hệ để kiểm tra cước trước khi gửi."
}
// ja
"dimsHint": { "vnJp": "ベトナム→日本：重量に対する3辺合計の基準を超える荷物、またはいずれかの辺が100 cm以上の荷物は、大型貨物の追加料金がかかる場合があります（試算には含みません）。", "jpVn": "<旧dimsHint>" },
"bulky": {
  "oversize": "重量に対するサイズ基準を超えています：大型貨物の追加料金 {min} – {max} VND（サイズと特性により異なる）がかかります。合計には含みません。",
  "review": "大型貨物の追加料金 {min} – {max} VND の対象となる場合があります（{cm} cm以上の辺、または基準に近いサイズ）。合計には含みません。",
  "contact": "3辺合計{cm} cm超、または{kg} kg超の荷物です。発送前にご連絡のうえ運賃をご確認ください。"
}
// en
"dimsHint": { "vnJp": "Vietnam → Japan: parcels over the size standard for their weight, or with any side of 100 cm or more, may be charged a bulky-goods surcharge (not included in the estimate).", "jpVn": "<old dimsHint>" },
"bulky": {
  "oversize": "Over the size standard for its weight: a bulky-goods surcharge of {min} – {max} VND applies, depending on size and parcel; not included in the total.",
  "review": "May be charged a bulky-goods surcharge of {min} – {max} VND (a side of {cm} cm or more, or near the size limit); not included in the total.",
  "contact": "Over {cm} cm in total or over {kg} kg: please contact us to check the freight before sending."
}

// policy.tips.items.customsRisk
// vi: "Đọc kỹ hướng dẫn gửi hàng, thỏa thuận và chính sách bảo hiểm hàng hóa do nhân viên tư vấn gửi: một số nhóm hàng có thể gặp rủi ro khi thông quan Nhật Bản và không được bảo hiểm thông quan."
// ja: "スタッフがご案内する発送ガイド、契約内容、貨物保険のポリシーを必ずお読みください。一部の品目は日本の通関でリスクがあり、通関に関する保険の対象外となります。"
// en: "Read the shipping guide, agreement and cargo-insurance policy our staff send you carefully: some goods may face risks in Japanese customs and are not insured for customs clearance."

// policy.warehouse.recipient.value
// vi: "HRT - mã nhân viên - mã khách hàng hoặc tên khách hàng (ví dụ: HRT-T09-Nguyễn Văn A)"
// ja: "HRT - スタッフコード - 顧客コードまたは顧客名（例：HRT-T09-Nguyen Van A）"
// en: "HRT - staff code - customer code or customer name (e.g. HRT-T09-Nguyen Van A)"
```

# Phụ lục D — `scripts/extract-pdf-images.mjs`

```js
// Extracts the large embedded images (FlateDecode, 8-bit RGB/Gray, optional SMask) from a PDF
// exported by Google Sheets and writes them as WebP. No new dependency: zlib + sharp (already in
// the project). Used for the price-policy infographics; re-run when the business sends a new PDF.
//
// Usage: node scripts/extract-pdf-images.mjs <file.pdf> <outDir> [minWidth=1000]
// Output: <outDir>/<pdf-name>-obj<id>-<w>x<h>.webp, plus a log line per image.

import { readFileSync, mkdirSync } from "node:fs";
import { basename, join } from "node:path";
import { inflateSync } from "node:zlib";

const [pdfPath, outDir, minWidthArg] = process.argv.slice(2);
if (!pdfPath || !outDir) {
  console.error("Usage: node scripts/extract-pdf-images.mjs <file.pdf> <outDir> [minWidth=1000]");
  process.exit(1);
}
const minWidth = Number(minWidthArg ?? 1000);
const buf = readFileSync(pdfPath);
const text = buf.toString("latin1"); // 1 char = 1 byte, so string indexes are byte offsets

// Every "N 0 obj << … >> stream … endstream" whose dictionary is an image.
function readObjects() {
  const objects = new Map();
  const re = /(\d+)\s+0\s+obj\s*<<((?:(?!endobj)[\s\S])*?)>>\s*stream\r?\n/g;
  let m;
  while ((m = re.exec(text))) {
    const dict = m[2];
    const start = m.index + m[0].length;
    let end = text.indexOf("endstream", start);
    if (end < 0) continue;
    if (text[end - 1] === "\n") end -= 1;
    if (text[end - 1] === "\r") end -= 1;
    objects.set(Number(m[1]), { dict, start, end });
    re.lastIndex = end;
  }
  return objects;
}

function key(dict, name) {
  const tokens = dict.split(/[\s]+|(?=\/)/).filter(Boolean);
  const i = tokens.indexOf(`/${name}`);
  return i < 0 ? undefined : tokens.slice(i + 1, i + 4);
}

function decode(obj) {
  const raw = buf.subarray(obj.start, obj.end);
  const filter = key(obj.dict, "Filter")?.[0];
  if (filter && filter !== "/FlateDecode") throw new Error(`unsupported filter ${filter}`);
  if (key(obj.dict, "DecodeParms")) throw new Error("predictors are not supported");
  return filter ? inflateSync(raw, { finishFlush: 2 /* Z_SYNC_FLUSH: tolerate trailing bytes */ }) : raw;
}

const objects = readObjects();
const { default: sharp } = await import("sharp");
mkdirSync(outDir, { recursive: true });

// Alpha masks are merged into their image, never written on their own.
const masks = new Set(
  [...objects.values()].map((obj) => key(obj.dict, "SMask")).filter(Boolean).map((ref) => Number(ref[0])),
);

for (const [id, obj] of objects) {
  if (!/\/Subtype\s*\/Image/.test(obj.dict) || masks.has(id)) continue;
  const width = Number(key(obj.dict, "Width")[0]);
  const height = Number(key(obj.dict, "Height")[0]);
  if (width < minWidth) continue;
  if (key(obj.dict, "BitsPerComponent")[0] !== "8") throw new Error(`obj ${id}: only 8-bit images`);
  const space = key(obj.dict, "ColorSpace")[0];
  const channels = space === "/DeviceRGB" ? 3 : space === "/DeviceGray" ? 1 : 0;
  if (!channels) throw new Error(`obj ${id}: unsupported colour space ${space}`);

  let pixels = decode(obj);
  let outChannels = channels;
  const smask = key(obj.dict, "SMask");
  if (smask) {
    const alpha = decode(objects.get(Number(smask[0])));
    const rgba = Buffer.alloc(width * height * 4);
    for (let p = 0; p < width * height; p++) {
      rgba[p * 4] = pixels[p * channels];
      rgba[p * 4 + 1] = pixels[p * channels + (channels === 3 ? 1 : 0)];
      rgba[p * 4 + 2] = pixels[p * channels + (channels === 3 ? 2 : 0)];
      rgba[p * 4 + 3] = alpha[p];
    }
    pixels = rgba;
    outChannels = 4;
  }
  if (pixels.length < width * height * outChannels) throw new Error(`obj ${id}: short image data`);

  const file = join(outDir, `${basename(pdfPath, ".pdf")}-obj${id}-${width}x${height}.webp`);
  const info = await sharp(pixels.subarray(0, width * height * outChannels), { raw: { width, height, channels: outChannels } })
    .webp({ quality: 82 })
    .toFile(file);
  console.log(`${file}  ${info.width}×${info.height}  ${Math.round(info.size / 1024)} KB`);
}
```

# Phụ lục E — 3 câu FAQ mới (thêm vào cuối `faq.items`)

| # | pages | vi Q / A |
|---|---|---|
| 1 | priceVnJp, shipToJapan, policy | **Gửi hàng cồng kềnh đi Nhật bị tính phụ thu thế nào?** — Chiều Việt → Nhật, tổng 3 cạnh tối đa theo cân nặng là 120 cm (dưới 10 kg), 140 – 150 cm (10 – 20 kg) và 160 – 180 cm (20 – 30 kg). Kiện vượt tiêu chuẩn, hoặc có một cạnh từ 100 cm trở lên, sẽ được xem xét phụ thu cồng kềnh, mức 220.000 – 800.000 VNĐ tùy kích thước và đặc điểm kiện. Kiện trên 260 cm hoặc trên 50 kg cần liên hệ kiểm tra trước khi gửi. |
| 2 | priceJpVn, shipToVietnam | **Phí giao hàng nội địa Việt Nam do ai trả?** — Khách hàng tự chi trả cước nội địa Việt Nam và được tự chọn đơn vị vận chuyển. Bạn có thể tự đặt đơn giao hàng hoặc nhờ nhân viên kho HARUTO book đơn; chi phí theo biểu phí của đơn vị vận chuyển bạn chọn. |
| 3 | priceJpVn, concierge, auction | **Tỷ giá mua hộ hàng Nhật tính như thế nào?** — Giá mua hộ = giá trị đơn hàng × tỷ giá quy đổi. HARUTO áp dụng tỷ giá VCB + 5 cho mọi giá trị đơn hàng, không phụ thu. |

**ja**
1. ベトナムから日本へ大型の荷物を送る場合、追加料金はどうなりますか？ — ベトナム→日本便の3辺合計の上限は、10 kg未満で120 cm、10～20 kgで140～150 cm、20～30 kgで160～180 cmです。基準を超える荷物、またはいずれかの辺が100 cm以上の荷物は大型貨物の追加料金の対象となり、サイズと特性により220,000～800,000 VNDです。3辺合計260 cm超または50 kg超の荷物は、発送前にご連絡ください。
2. ベトナム国内の配送料は誰が負担しますか？ — ベトナム国内の配送料はお客様のご負担で、配送業者は自由にお選びいただけます。配送の手配はご自身で行うか、HARUTOの倉庫スタッフに依頼できます。費用はお選びいただいた配送業者の料金表に従います。
3. 日本の代理購入のレートはどのように計算しますか？ — 代理購入額＝注文金額×換算レートです。HARUTOはすべての注文金額にVCB + 5のレートを適用し、追加料金はかかりません。

**en**
1. How are bulky parcels to Japan surcharged? — From Vietnam to Japan, the maximum length + width + height is 120 cm under 10 kg, 140–150 cm for 10–20 kg and 160–180 cm for 20–30 kg. Parcels over the standard, or with any side of 100 cm or more, may be charged a bulky-goods surcharge of 220,000–800,000 VND depending on size and parcel. Parcels over 260 cm or over 50 kg must be checked with us before sending.
2. Who pays for delivery within Vietnam? — The customer pays for domestic delivery in Vietnam and can choose any delivery company. Book it yourself or ask HARUTO's warehouse staff to book it; the cost follows the chosen company's rate card.
3. How is the buy-for-you exchange rate calculated? — Purchase price = order value × exchange rate. HARUTO applies VCB + 5 to every order value, with no surcharge.
