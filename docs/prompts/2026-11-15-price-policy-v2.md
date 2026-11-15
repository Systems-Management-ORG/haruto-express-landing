# PROMPT — Chính sách giá, đợt 2: sửa sau review + các khối học từ Tiximax

> **Cách dùng (máy local):** ở thư mục gốc repo, chạy `claude` rồi gõ:
> `Đọc docs/prompts/2026-11-15-price-policy-v2.md và thực hiện toàn bộ, theo đúng thứ tự C0 → C8.`
>
> Đợt 1: `docs/prompts/2026-11-15-price-policy-pages.md`, đã chạy xong và push (`f9d681c..6ed41f6`). Prompt này **chỉ làm phần còn lại**. Snapshot khi viết: GitHub `main` @ `6ed41f6`. Chủ repo báo HEAD local là `9785c23`, commit này chưa có trên GitHub lúc viết prompt (xem C0).
> Design system: `../design-system` (cùng workspace "Haruto"). Đọc `CLAUDE.md` của repo này và làm theo mọi luật cứng trong đó.

---

## 0. Review báo cáo đợt 1

**Chấp nhận các chỗ làm khác prompt** (không sửa lại):
- Gộp bỏ `RoundingRules` và đổi `dimsHint` vào commit B3, để mọi commit đều build được.
- Vùng "có thể bị phụ thu" trong `bulkyFlag`: tổng 3 cạnh **bằng đúng** cận dưới của khoảng (ví dụ 140 cm ở mốc 10–20 kg) vẫn tính là đạt tiêu chuẩn. Cách đọc này sát PDF hơn prompt cũ.
- Link "Cách tính cân" của calculator trỏ vào phần quy định của đúng chiều đang chọn.
- 2 callout chiều Nhật → Việt được đặt lại nền.
- Meta description EN rút còn 155/157 ký tự (commit `9d47804`).

**Còn lỗi, xử lý trong đợt này:**
| # | Lỗi | Bước |
|---|---|---|
| 1 | FAQ "Giá cước được tính như thế nào?" (index 1) ghi mọi chiều đều tính cân thể tích ÷ 6.000, trong khi câu này đang hiện trên trang Việt → Nhật | C1 |
| 2 | Meta `/bang-gia` (vi/ja/en) vẫn quảng cáo "kèm phụ thu và cách tính cân", nhưng hub không còn 2 phần này | C1 |
| 3 | Đoạn giới thiệu bảng giá ở trang chủ (`pricing.teaser.intro`) ghi "đã bao gồm thuế và giao nội địa Nhật" như thể áp dụng cho **cả hai chiều**, và bảo xem "ở trang bảng giá" | C1 |
| 4 | Các khối học từ Tiximax chưa làm (đợt 1 chạy theo bản prompt cũ): `RouteSwitch`, `CostBreakdown` + yếu tố chi phí, calculator trong từng trang, ngưỡng và ví dụ hàng cồng kềnh JP→VN, ngày hiệu lực cạnh bảng | C2–C4 |
| 5 | `seo:check` cảnh báo meta description JA "ngắn" theo ngưỡng 140 ký tự của chữ Latin. Chữ Nhật là ký tự toàn khổ nên 70–90 ký tự đã là độ dài chuẩn | C5 |

**Quyết định của chủ site cho 3 câu hỏi còn mở.** Chủ site chưa trả lời, nên tạm giữ nguyên như hiện tại và vẫn để trong báo cáo:
- VAT chiều Việt → Nhật: **giữ nguyên** cách ghi hiện tại, chưa đổi.
- Làm tròn hàng hỗn hợp: **giữ mốc 0,5 kg** theo PDF.
- Phụ thu cồng kềnh 220.000 – 800.000: **giữ công bố** (con số này nằm trong infographic của chính PDF HARUTO).

---

## C0. Chuẩn bị (không commit)
```bash
git status
git checkout main && git pull
git log --oneline 6ed41f6..HEAD
```
- Working tree chỉ được còn `package-lock.json` thay đổi cục bộ (có từ trước, **không commit**). Có thay đổi nào khác chưa commit thì **dừng lại và báo**.
- Nếu HEAD local (`9785c23` hoặc mới hơn) có commit chưa push: xem `git show --stat` từng commit. Nếu đụng tới file mà prompt này sửa (`info-pages.ts`, `info-page.tsx`, `price-policy.tsx`, `shipping-calculator.tsx`, `src/i18n/messages/*.json`, `globals.css`, `scripts/seo-check.mjs`), đọc diff và **làm tiếp trên code đó**, không ghi đè. Báo lại trong mục Bàn giao.
- Nếu `npm run dev` đang chạy, tắt trước khi `npm ci`; báo người dùng chạy lại sau khi xong.
```bash
npm ci
npm run typecheck && npm run pricing:check && npm run build
npm run start & sleep 5 && npm run seo:check; kill %1
```
Ghi lại baseline. Baseline fail thì **dừng lại và báo**.

---

## C1. Sửa copy sai (vi, ja, en)
Dùng script node tạm (**không commit**), ghi lại bằng `JSON.stringify(obj, null, 2)` + xuống dòng cuối file. Copy ở **Phụ lục 1**.
1. `faq.items[1].answer`: tìm theo **câu hỏi** "Giá cước được tính như thế nào?" / "運賃はどのように計算されますか？" / "How are shipping rates calculated?", không tìm theo index. Thay answer bằng bản ở Phụ lục 1.1. Giữ nguyên `pages`.
2. `pages.pricing.metaDescription`: thay bằng Phụ lục 1.2.
3. `pricing.teaser.intro`: thay bằng Phụ lục 1.3.
4. Assert: 3 locale cùng tập key; các chuỗi mới có `155[.,]000` khi bản gốc có (`pricing:check` sẽ kiểm).

**Commit:** `i18n: per-direction pricing FAQ answer; hub and home teaser copy match the new pages`

---

## C2. Chọn tuyến, ngày hiệu lực cạnh bảng, calculator trong từng trang
1. **`src/shared/ui/route-switch.tsx`**, `RouteSwitch({ current }: { current: "vnJp" | "jpVn" })`, server component:
   ```tsx
   <nav aria-label={t("pricing.tabsLabel")} className="mt-6 grid grid-cols-2 gap-2 sm:inline-grid">
     {(["vnJp", "jpVn"] as const).map((dir) => (
       <Link key={dir} href={pagePath(locale, dir === "vnJp" ? "priceVnJp" : "priceJpVn")}
         aria-current={dir === current ? "page" : undefined}
         className={dir === current ? "btn btn-primary" : "btn btn-outline bg-white/70"}
         data-track={`route_switch_${dir}`}>
         {t(`pricing.teaser.${dir}.label`)}
       </Link>
     ))}
   </nav>
   ```
2. **`info-pages.ts`**: `InfoPageConfig` thêm `route?: "vnJp" | "jpVn"`. Đặt `priceVnJp.route = "vnJp"`, `priceJpVn.route = "jpVn"`.
3. **`info-page.tsx`**:
   - Có `config.route` thì slot `after` của `InfoHero` render `<RouteSwitch current={config.route} />` **trước** `TocChips`. Bọc cả hai trong một fragment.
   - `BODIES` đổi kiểu thành `(props: { route?: "vnJp" | "jpVn" }) => ReactNode` và gọi `<Body route={config.route} />`. `calculator: ({ route }) => <ShippingCalculator withTitle={false} route={route} lockRoute={!!route} />`.
   - `intros`: `ratesVnJp` (chỉ khi `page === "priceVnJp"`) và `freightJpVn` → `t("pricePolicy.effective")`.
4. **`INFO_PAGES`**: thêm `"calculator"` vào cả `sections` lẫn `toc`:
   - priceVnJp: **sau** `ratesVnJp`.
   - priceJpVn: **sau** `freightJpVn`.

   Thứ tự cuối cùng (sau khi thêm cả `cost*` ở C3):
   ```ts
   priceVnJp: { toc: ["ratesVnJp", "costVnJp", "calculator", "surcharges", "weightVnJp", "compensation"],
                sections: ["ratesVnJp", "costVnJp", "calculator", "surcharges", "weightVnJp", "compensation", "tipsVnJp"] }
   priceJpVn: { toc: ["buyRate", "freightJpVn", "costJpVn", "calculator", "surcharges", "weightJpVn", "compensation", "warehouse"],
                sections: ["buyRate", "freightJpVn", "costJpVn", "calculator", "surcharges", "weightJpVn", "compensation", "conciergeTerms", "warehouse", "tipsJpVn"] }
   ```
5. **`shipping-calculator.tsx`**: thêm prop `route?: Route` (giá trị khởi tạo của state) và `lockRoute?: boolean`.
   - `lockRoute`: không render fieldset chọn tuyến; thay bằng `<p className="text-sm font-medium text-forest">{t("routeFixed", { route: tTeaser(`${route}.label`) })}</p>`.
   - Với `jpVn` + `lockRoute`: ẩn luôn fieldset loại hàng.
   - Nút "Nhận báo giá" thêm `data-route={route}`. Giữ nguyên `data-track` hiện có.
   - `useId` đã có sẵn, nên 2 calculator trên 2 trang khác nhau không trùng id. Kiểm tra lại là không có `id` cứng.

**Commit:** `feat(pricing): route switch, effective date beside the rates, route-locked calculator on each policy page`

---

## C3. "Tổng chi phí gồm những gì?" + yếu tố chi phí
Thêm vào `price-policy.tsx`: `CostBreakdown({ route })`. Đăng ký section `costVnJp` / `costJpVn` trong `InfoSectionId`, `BODIES`, `titles` (`pricePolicy.sections.cost*`), `intros` (`pricePolicy.cost.intro`), và thứ tự ở C2.4.

**Bố cục** (chỉ dùng class đã có: `.info-card`, `.icon-chip`, `.stat-card--featured`, `.callout`, `.link-arrow`; **không thêm CSS** vào `globals.css`):
```
<ol data-reveal-group class="grid gap-4 sm:grid-cols-2 lg:grid-cols-[repeat(var(--n),minmax(0,1fr))]" style={{"--n": items.length}}>
  <li class="info-card relative">  icon-chip · H3 title · p.text-muted body
     (từ khối thứ 2: <span aria-hidden class="absolute -top-4 -left-3 font-display text-3xl text-gold">+</span>)
</ol>
<div class="stat-card stat-card--featured mt-4">  H3 cost.total.title · p.stat-card__body cost.total.body </div>
jpVn → <div class="callout mt-4"> Info icon · <strong>cost.outside.title</strong> · ul 2 dòng cost.outside.items.* </div>
<h3 class="mt-10 text-lg font-medium text-forest">cost.factors.title</h3>
<ul data-reveal-group class="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">  4 × <li><Link href="#anchor" class="info-card group flex h-full flex-col"> title · text · span.link-arrow </Link></li> </ul>
```
**Khối theo chiều** (thứ tự cố định; id → icon Phosphor; mọi số lấy từ `pricing-data.ts` và format bằng `formatVnd(amount, locale)` đã có trong `src/shared/lib/format.ts`. Thêm `formatNumber(n, locale)` cạnh nó cho số không phải tiền, ví dụ 6.000):
| route | id | icon | ICU params |
|---|---|---|---|
| vnJp | `freight` (text `.vnJp`) | `AirplaneTilt` | — |
| vnJp | `parcelFee` | `Package` | `kg` = `"{minKg} – {maxKg}"` và `fee` = `perParcelFee` của `VN_JP_CLEAN[0]` |
| vnJp | `category` | `BatteryCharging` | — |
| vnJp | `bulky` | `Cube` | `min`, `max` = `VN_JP_BULKY.surchargeVnd` |
| vnJp | `insurance` | `ShieldCheck` | `pct` = `COMPENSATION.insuranceRatePct` |
| jpVn | `goods` | `CurrencyJpy` | — |
| jpVn | `freight` (text `.jpVn`) | `AirplaneTilt` | `price` = `JP_VN[0].vndPerKg` |
| jpVn | `category` | `BatteryCharging` | — |
| jpVn | `insurance` | `ShieldCheck` | `pct` |

**4 thẻ yếu tố** (anchor dùng `anchorOf()`; text = `cost.factors.<id>.<route>`, nếu không có thì dùng `.body`):
- vnJp: `goodsType` → `#rates-vn-jp`, `size` → `#weight-vn-jp`, `rounding` → `#weight-vn-jp`, `packing` → `#surcharges`.
- jpVn: `buyRate` → `#buy-rate`, `size` → `#weight-jp-vn`, `rounding` → `#weight-jp-vn`, `packing` → `#surcharges`.

Thẻ là link cùng trang nên **không** cần `data-track`. Dấu `+` trên màn 1–2 cột vẫn hiện, không ảnh hưởng đọc màn hình vì đã có `aria-hidden`.

**Commit:** `feat(pricing): cost breakdown and cost factors on both price-policy pages`

---

## C4. Chiều Nhật → Việt: ngưỡng hàng cồng kềnh + ví dụ
Trong `WeightJpVn` (`price-policy.tsx`), theo thứ tự:
1. **Đầu khối:** `<ul data-reveal-group class="grid gap-4 sm:grid-cols-3">` gồm 3 `.stat-card`:
   - `.stat-card__value` lần lượt: `"> {JP_VN_BULKY.sumCm} cm"`, `"> {JP_VN_BULKY.weightKg} kg"`, `"÷ {formatNumber(JP_VN_BULKY.volumetricDivisor)}"`.
   - `.stat-card__label` = `pricePolicy.jpVnWeight.thresholds.sum|weight|divisor`.
   - Tiếp theo là phần `WeightRules` đang có.
2. Sau `WeightRules`: H3 `jpVnWeight.examples.title` + `<ul class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">`. Mỗi `li` là `.info-card flex flex-col items-center text-center` gồm `.icon-chip icon-chip--lg` và tên. Thêm `JP_VN_BULKY_EXAMPLE_ICONS` vào `info-pages.ts`:
   `{ bicycle: Bicycle, suitcase: Suitcase, speaker: SpeakerHifi, weddingDress: Dress, suit: CoatHanger }`.
   Dưới lưới là `<p class="mt-3 text-sm text-muted">{examples.note}</p>`. **Đúng 5 mục theo PDF, không thêm mục nào.**
3. Callout `jpVnWeight.note` và `PolicyFigure` giữ nguyên vị trí hiện tại (sau lưới ví dụ).

Icon nào không có trong bản `@phosphor-icons/react` đang cài thì đổi sang icon gần nghĩa nhất và ghi vào báo cáo.

**Commit:** `feat(pricing): JP→VN bulky thresholds and the PDF's bulky examples`

---

## C5. `seo:check`: ngưỡng meta description theo ngôn ngữ
`scripts/seo-check.mjs`: `DESC_IDEAL_MIN` đổi thành theo locale, lấy locale từ segment đầu của `pathname`:
```js
// Japanese is full-width: ~50–120 characters fill a search snippet; Latin scripts need ~140–160.
const DESC_IDEAL_MIN = { ja: 50, default: 140 };
const idealMin = DESC_IDEAL_MIN[pathname.split("/")[1]] ?? DESC_IDEAL_MIN.default;
```
Giữ nguyên `DESC_MIN` = 50 và `DESC_MAX` = 160 cho mọi locale. Ghi số cảnh báo trước và sau khi đổi vào báo cáo (trước: 13 cảnh báo JA).

**Commit:** `chore(seo-check): locale-aware ideal description length (ja full-width)`

---

## C6. `pricing:check` bổ sung
- `faq.items` có câu hỏi về cách tính cước (C1.1): answer phải chứa `155[.,]000` **và** `0[.,]5 kg`. Đây là dấu hiệu câu trả lời đã tách theo chiều.
- `pages.pricing.metaDescription` **không** chứa `cách tính cân` / `容積重量` / `weight rules` (hub không còn phần này).

**Commit:** `chore(checks): pricing FAQ answer split by direction; hub meta matches the hub`

---

## C7. Kiểm tra (bắt buộc pass trước khi push)
```bash
npm run typecheck
npm run pricing:check
npm run build
npm run start & sleep 5 && npm run seo:check; kill %1
```
Fetch HTML trên `localhost` (2 trang chính sách giá × 3 locale, cộng `/bang-gia`, `/chinh-sach-van-chuyen`, trang chủ):
- [ ] `RouteSwitch` có ở cả 2 trang; trang hiện tại có `aria-current="page"`; link sang trang kia đúng locale (ví dụ `/ja/pricing-japan-to-vietnam`).
- [ ] Section "Áp dụng từ ngày 01/10/2026" xuất hiện ngay dưới H2 bảng cước của 2 trang.
- [ ] `CostBreakdown`: VN→JP có 5 khối + tổng, hiển thị đúng `200.000` (1 – 5 kg), `220.000 – 800.000`, `8%`. JP→VN có 4 khối + tổng + "Không nằm trong tổng" (nội địa VN, VAT), hiển thị đúng `155.000`.
- [ ] 4 thẻ yếu tố cuộn tới đúng anchor.
- [ ] Calculator: trên 2 trang mới bị khóa tuyến (không có radio chọn tuyến; JP→VN không có radio loại hàng). Trên `/bang-gia` vẫn chọn được. 4 phép thử ở prompt đợt 1 (B8.6) vẫn đúng.
- [ ] JP→VN: 3 ô `> 140 cm`, `> 30 kg`, `÷ 6.000` (ja/en: `6,000`) và đúng 5 ví dụ.
- [ ] FAQ "Giá cước được tính như thế nào?" trên `/vi/chinh-sach-gia-viet-nhat` nói rõ VN→JP không dùng thể tích (làm tròn 0,5 kg + phụ thu cồng kềnh).
- [ ] `/vi/bang-gia` meta description không còn nhắc "cách tính cân".
- [ ] Trang chủ: đoạn intro bảng giá chỉ gắn "đã gồm thuế và giao nội địa Nhật" với chiều Việt → Nhật.
- [ ] Mỗi trang vẫn đúng 1 H1, 1 ảnh `priority`. Không có `MISSING_MESSAGE`. Không tràn ngang ở 375 / 768 / 1280. Không có hex viết cứng trong file mới.
- [ ] Lighthouse a11y (hoặc axe) trên `/vi/chinh-sach-gia-viet-nhat`: không phát sinh lỗi mới so với baseline.

Fail bước nào thì sửa, rồi chạy lại toàn bộ C7.

---

## C8. Bàn giao
1. `git push origin main`.
2. Changelog cuối `docs/SEO-ROADMAP.md`: `2026-11-15 — price policy v2 — route switch, cost breakdown, route-locked calculator, JP→VN bulky examples; FAQ cước tách theo chiều; seo-check ngưỡng JA`.
3. Báo cáo gồm:
   - Commit SHA.
   - Kết quả C7, kèm số cảnh báo `seo:check` trước và sau.
   - Commit local nào (`9785c23`…) đã gặp ở C0 và đã xử lý ra sao.
   - Danh sách **chờ chủ site**:
     - Duyệt copy JA/EN mới: Phụ lục 1 và 2 của prompt này, cùng Phụ lục A, B, C, E của đợt 1.
     - VAT chiều Việt → Nhật.
     - Quy tắc làm tròn hàng hỗn hợp.
     - Mức 220k–800k.

---

# Phụ lục 1 — Sửa copy (C1)

### 1.1 `faq.items[<câu cách tính cước>].answer`
- **vi:** Hai chiều tính khác nhau. Chiều Việt Nam → Nhật Bản tính theo mốc cân, có bảng riêng cho hàng sạch và hàng hỗn hợp (đã gồm thuế và ship nội địa Nhật); cân được làm tròn lên mốc 0,5 kg, kiện vượt tiêu chuẩn kích thước tính thêm phụ thu cồng kềnh. Chiều Nhật Bản → Việt Nam là 155.000 VNĐ/kg cho mọi cân nặng; hàng cồng kềnh tính theo số lớn hơn giữa cân thực tế và cân thể tích (Dài × Rộng × Cao ÷ 6.000). Xem chính sách giá của từng chiều để biết chi tiết và phụ thu.
- **ja:** 方向によって計算方法が異なります。ベトナム→日本は重量帯ごとの料金で、クリーン貨物と混載貨物に別々の表があります（税金・日本国内配送込み）。重量は0.5 kg単位で切り上げ、サイズ基準を超える荷物には大型貨物の追加料金がかかります。日本→ベトナムは全重量一律155,000 VND/kgで、大型貨物は実重量と容積重量（縦×横×高さ÷6,000）の大きいほうで計算します。詳細と追加料金は各方向の料金規定をご覧ください。
- **en:** It depends on the direction. Vietnam → Japan is priced by weight band, with separate tables for clean and mixed goods (tax and Japan domestic delivery included); weight is rounded up to the next 0.5 kg and parcels over the size standard add a bulky-goods surcharge. Japan → Vietnam is 155,000 VND/kg for any weight; bulky goods use the greater of actual and volumetric weight (Length × Width × Height ÷ 6,000). See each direction's rate policy for details and surcharges.

### 1.2 `pages.pricing.metaDescription` (đã đếm: vi 152, ja 93, en 156 ký tự)
- **vi:** Bảng giá hàng không hai chiều Việt – Nhật từ 01/10/2026: hàng sạch, hỗn hợp theo mốc cân; chiều Nhật về 155.000 VNĐ/kg. Chọn tuyến hoặc tính cước nhanh.
- **ja:** 2026年10月1日適用のベトナム・日本間の双方向航空便料金。クリーン貨物と混載貨物は重量帯で算出、日本からベトナムは155,000 VND/kg。路線別の料金規定と運賃の試算はこちら。
- **en:** Two-way Vietnam – Japan freight from 1 Oct 2026: clean and mixed goods by weight band, Japan to Vietnam at 155,000 VND/kg. Pick a route or estimate freight.

### 1.3 `pricing.teaser.intro` (trang chủ)
- **vi:** Cước tính theo trọng lượng và loại hàng. Chiều Việt → Nhật đã gồm thuế và giao nội địa Nhật. Xem đầy đủ mốc cân, phụ thu và cách tính cân ở trang chính sách giá của từng chiều.
- **ja:** 運賃は重量と貨物の種類で決まります。ベトナム→日本は税金と日本国内配送込みです。重量帯、追加料金、重量の計算方法は各方向の料金規定ページでご確認ください。
- **en:** Rates depend on weight and goods type; Vietnam → Japan includes tax and Japan domestic delivery. See each direction's rate policy for the full weight bands, surcharges and weight rules.

# Phụ lục 2 — Key mới cho C2–C4
Gộp vào namespace `pricePolicy` đã có (không ghi đè key cũ) và `pricing.calculator`. Câu chữ viết từ dữ liệu PDF của HARUTO, không lấy từ Tiximax.

```json
// vi
"pricePolicy": {
  "sections": {
    "costVnJp": "Tổng chi phí gửi hàng đi Nhật gồm những gì?",
    "costJpVn": "Tổng chi phí ship hàng Nhật về gồm những gì?"
  },
  "cost": {
    "intro": "Các khoản cộng lại thành tổng chi phí một đơn hàng. Khoản nào chỉ áp dụng khi có thì được ghi rõ.",
    "items": {
      "freight": { "title": "Cước vận chuyển", "vnJp": "Đơn giá theo mốc cân × số kg tính cước. Đã gồm thuế và ship nội địa Nhật.", "jpVn": "{price} VNĐ/kg × số kg tính cước, cho mọi cân nặng." },
      "parcelFee": { "title": "Phụ thu kiện", "body": "Hàng sạch từ {kg} kg: {fee} VNĐ/kiện." },
      "goods": { "title": "Tiền hàng (khi mua hộ)", "body": "Giá trị đơn hàng × tỷ giá VCB + 5, không phụ thu." },
      "category": { "title": "Phụ thu danh mục và đóng gói", "body": "Đồ điện tử, đồ có pin, nước hoa, đồ có cồn; đóng gỗ, đóng lại kiện, đóng hàng đặc biệt… nếu có." },
      "bulky": { "title": "Phụ thu cồng kềnh", "body": "{min} – {max} VNĐ nếu kiện vượt tiêu chuẩn kích thước." },
      "insurance": { "title": "Bảo hiểm hàng hóa (tùy chọn)", "body": "{pct}% giá trị khai báo; đền bù 100% giá trị hàng khai báo nếu thất lạc." }
    },
    "total": { "title": "= Tổng chi phí", "body": "Tổng thực tế tùy cân nặng tính cước và các phụ thu áp dụng cho kiện hàng." },
    "outside": {
      "title": "Không nằm trong tổng",
      "items": {
        "domestic": "Cước giao nội địa Việt Nam: khách trả theo biểu phí của đơn vị vận chuyển mình chọn.",
        "vat": "Giá dịch vụ chưa bao gồm VAT."
      }
    },
    "factors": {
      "title": "Yếu tố làm thay đổi chi phí",
      "goodsType": { "title": "Loại hàng", "body": "Hàng sạch và hàng hỗn hợp có bảng giá riêng." },
      "buyRate": { "title": "Tỷ giá mua hộ", "body": "VCB + 5 cho mọi giá trị đơn hàng." },
      "size": { "title": "Kích thước kiện", "vnJp": "Vượt tiêu chuẩn tổng 3 cạnh theo cân nặng thì phát sinh phụ thu cồng kềnh.", "jpVn": "Hàng cồng kềnh tính theo trọng lượng thể tích nếu lớn hơn cân thực tế." },
      "rounding": { "title": "Làm tròn cân", "vnJp": "Làm tròn lên mốc 0,5 kg.", "jpVn": "Dưới 1 kg tính 1 kg; trên 1 kg làm tròn đến 0,1 kg." },
      "packing": { "title": "Danh mục và đóng gói", "body": "Đồ điện tử, nước hoa, đóng gỗ, đóng lại kiện… tính phụ thu riêng." }
    }
  },
  "jpVnWeight": {
    "thresholds": { "sum": "Tổng 3 cạnh (ví dụ 60 + 40 + 40 cm)", "weight": "Trọng lượng kiện", "divisor": "Trọng lượng thể tích = D × R × C (cm)" },
    "examples": {
      "title": "Ví dụ hàng thường bị tính cồng kềnh",
      "items": { "bicycle": "Xe đạp", "suitcase": "Vali", "speaker": "Loa", "weddingDress": "Thùng áo cưới", "suit": "Thùng áo vest" },
      "note": "Các ví dụ nêu trong chính sách giá tuyến Nhật – Việt."
    }
  }
}
// pricing.calculator
"routeFixed": "Tuyến: {route}"
```
```json
// ja
"pricePolicy": {
  "sections": { "costVnJp": "日本への発送費用の内訳", "costJpVn": "日本からの発送費用の内訳" },
  "cost": {
    "intro": "1件の注文の合計費用を構成する項目です。該当する場合のみかかる項目はその旨を記載しています。",
    "items": {
      "freight": { "title": "運賃", "vnJp": "重量帯の単価 × 課金重量。税金と日本国内配送を含みます。", "jpVn": "{price} VND/kg × 課金重量（全重量一律）。" },
      "parcelFee": { "title": "荷物ごとの追加料金", "body": "クリーン貨物 {kg} kg：{fee} VND/個。" },
      "goods": { "title": "商品代金（代理購入の場合）", "body": "注文金額 × VCB + 5 のレート、追加料金なし。" },
      "category": { "title": "品目・梱包の追加料金", "body": "電子機器、電池入り製品、香水、アルコール類、木枠梱包、再梱包、特殊梱包など（該当する場合）。" },
      "bulky": { "title": "大型貨物の追加料金", "body": "サイズ基準を超える場合 {min} – {max} VND。" },
      "insurance": { "title": "貨物保険（任意）", "body": "申告価格の{pct}%。紛失時は申告価格の100%を補償。" }
    },
    "total": { "title": "＝ 合計費用", "body": "実際の合計は、課金重量と荷物に適用される追加料金によって決まります。" },
    "outside": {
      "title": "合計に含まれないもの",
      "items": { "domestic": "ベトナム国内の配送料：お選びの配送業者の料金表に従いお客様が直接お支払いください。", "vat": "サービス料金はVAT別です。" }
    },
    "factors": {
      "title": "費用が変わる要因",
      "goodsType": { "title": "貨物の種類", "body": "クリーン貨物と混載貨物で料金表が異なります。" },
      "buyRate": { "title": "代理購入レート", "body": "すべての注文金額に VCB + 5。" },
      "size": { "title": "荷物のサイズ", "vnJp": "重量に対する3辺合計の基準を超えると大型貨物の追加料金がかかります。", "jpVn": "大型貨物は、実重量より大きい場合に容積重量で計算します。" },
      "rounding": { "title": "重量の丸め", "vnJp": "0.5 kg単位で切り上げ。", "jpVn": "1 kg未満は1 kg、1 kg超は0.1 kg単位。" },
      "packing": { "title": "品目と梱包", "body": "電子機器、香水、木枠梱包、再梱包などは別途追加料金。" }
    }
  },
  "jpVnWeight": {
    "thresholds": { "sum": "3辺合計（例：60 + 40 + 40 cm）", "weight": "荷物の重量", "divisor": "容積重量 = 縦 × 横 × 高さ（cm）" },
    "examples": {
      "title": "大型貨物として扱われやすい例",
      "items": { "bicycle": "自転車", "suitcase": "スーツケース", "speaker": "スピーカー", "weddingDress": "ウェディングドレスの箱", "suit": "スーツの箱" },
      "note": "日本→ベトナム便の料金規定に記載の例です。"
    }
  }
}
"routeFixed": "路線：{route}"
```
```json
// en
"pricePolicy": {
  "sections": { "costVnJp": "What does shipping to Japan cost in total?", "costJpVn": "What does shipping from Japan cost in total?" },
  "cost": {
    "intro": "The items that add up to an order's total. Items that only apply in some cases say so.",
    "items": {
      "freight": { "title": "Freight", "vnJp": "Weight-band rate × chargeable weight. Tax and Japan domestic delivery included.", "jpVn": "{price} VND/kg × chargeable weight, for any weight." },
      "parcelFee": { "title": "Per-parcel fee", "body": "Clean goods of {kg} kg: {fee} VND per parcel." },
      "goods": { "title": "Goods (when we buy for you)", "body": "Order value × VCB + 5 rate, no surcharge." },
      "category": { "title": "Category and packing surcharges", "body": "Electronics, battery items, perfume, alcohol; wooden crating, repacking, special packing… where they apply." },
      "bulky": { "title": "Bulky-goods surcharge", "body": "{min} – {max} VND when a parcel is over the size standard." },
      "insurance": { "title": "Cargo insurance (optional)", "body": "{pct}% of the declared value; 100% of the declared value refunded if lost." }
    },
    "total": { "title": "= Total cost", "body": "The actual total depends on the chargeable weight and the surcharges that apply to the parcel." },
    "outside": {
      "title": "Not in the total",
      "items": { "domestic": "Delivery within Vietnam: paid by you at the rates of the delivery company you choose.", "vat": "Service prices exclude VAT." }
    },
    "factors": {
      "title": "What changes the cost",
      "goodsType": { "title": "Goods type", "body": "Clean and mixed goods have separate rate tables." },
      "buyRate": { "title": "Buy-for-you rate", "body": "VCB + 5 for every order value." },
      "size": { "title": "Parcel size", "vnJp": "Over the size standard for its weight adds a bulky-goods surcharge.", "jpVn": "Bulky goods are charged on volumetric weight when it is higher than the actual weight." },
      "rounding": { "title": "Weight rounding", "vnJp": "Rounded up to the next 0.5 kg.", "jpVn": "Under 1 kg counts as 1 kg; above, rounded to 0.1 kg." },
      "packing": { "title": "Category and packing", "body": "Electronics, perfume, wooden crating, repacking… are charged separately." }
    }
  },
  "jpVnWeight": {
    "thresholds": { "sum": "Length + width + height (e.g. 60 + 40 + 40 cm)", "weight": "Parcel weight", "divisor": "Volumetric weight = L × W × H (cm)" },
    "examples": {
      "title": "Items often charged as bulky",
      "items": { "bicycle": "Bicycle", "suitcase": "Suitcase", "speaker": "Speaker", "weddingDress": "Wedding-dress box", "suit": "Suit box" },
      "note": "Examples given in the Japan → Vietnam rate policy."
    }
  }
}
"routeFixed": "Route: {route}"
```
Khi gộp: `pricePolicy.jpVnWeight.note` (đợt 1) giữ nguyên, chỉ thêm `thresholds` và `examples` vào cạnh nó. Câu "Giá dịch vụ chưa bao gồm VAT." ở `cost.outside.items.vat` trùng ý với PDF Nhật → Việt; câu này chỉ hiện trên trang Nhật → Việt.
