# PROMPT — Đồng bộ trang Bảng giá & Hướng dẫn + triển khai Design System

> **Cách dùng (máy local):** ở thư mục gốc repo, chạy `claude` rồi gõ:
> `Đọc docs/prompts/2026-11-13-info-pages-design-system.md và thực hiện toàn bộ, theo đúng thứ tự B0 → B9.`
>
> Đọc kèm: `CLAUDE.md`, `docs/DESIGN-SYSTEM.md` (đích cần đạt; các mục đánh dấu **(B…)** là việc của prompt này). Snapshot khi viết: `main` @ `153b69d`, sau khi template 6 trang dịch vụ đã ship.

---

## 0. Mục tiêu & quyết định đã chốt

1. **Đồng bộ nhóm menu "Bảng giá"** (`pricing`, `goods`) và **"Hướng dẫn"** (`guides`, `policy`, `japanWarehouse`, `faq`). Đi kèm là `contact` vì cùng dùng `PageHero`. Sau khi xong, mọi trang con dùng chung **một khung hero** và **một bộ primitives**.
2. **Template `InfoPage`** cho các trang thông tin, cùng cấu trúc với `ServicePage`: hero → mục lục → nội dung → FAQ → CTA → liên quan.
3. **Design system thành code:** token đầy đủ trong `@theme`, gộp các class trùng nhau, primitives chuyển vào `src/shared/ui/`, thêm script `design:check` để lần sau không phải đoán.
4. Ràng buộc như `CLAUDE.md`: không bịa dữ kiện, đủ 3 locale, commit thẳng lên `main` theo từng bước, chỉ push khi B8 pass.

---

## 1. Hiện trạng (kết quả quét source @ `153b69d`)

| # | Vấn đề | Vị trí |
|---|---|---|
| 1 | **Hai hệ hero khác nhau trong cùng một nhóm menu.** `/bang-gia` dùng `PageHero` (nền sage, H1 serif `heading-1`, ảnh trong khung, không có CTA), còn `/hang-nhan-va-hang-cam` (cùng nhóm "Bảng giá") dùng `ServiceHero` (nền paper, H1 sans 800 hai màu, artwork, có CTA). Nhóm "Hướng dẫn" dùng `PageHero` cả 4 trang. | `shared/components/page-hero.tsx`, `service/service-hero.tsx` |
| 2 | **Nhảy bậc heading H1 → H3** ở `/chinh-sach-van-chuyen` và `/dia-chi-kho-nhat`: `Policy withHeader={false}` render khối bằng `<h3>` và thẻ bằng `<h4>`, không có H2 nào. | `policy.tsx` |
| 3 | **`/cau-hoi-thuong-gap` lặp tiêu đề:** H1 "Câu hỏi thường gặp" và ngay dưới là H2 "Câu hỏi thường gặp". Hiện 9 câu nằm trong một danh sách phẳng, chưa chia nhóm. | `faq.tsx` |
| 4 | **`/huong-dan` là trang rỗng:** chỉ có hero + "Trang liên quan", intro ghi "Nội dung đang được biên soạn". Hub "Hướng dẫn" cũng không có trong menu. Khối magazine `Guides` đang có nhưng chỉ dùng ở trang chủ. | `subpage.tsx` (không có case `guides`), `nav.ts` |
| 5 | **Trang thông tin không có CTA kết trang.** `/bang-gia` là trang mang lại tiền mà kết thúc ở FAQ → liên quan. | `subpage.tsx` |
| 6 | **Nhịp nền `/bang-gia` bị lặp:** VN→JP (ivory) → JP→VN (sage) → Phụ thu `plain` (ivory) → Cách tính cân (ivory): hai section ivory liền nhau. Dòng "áp dụng từ 01/10/2026" (tín hiệu độ mới) bị vùi dưới H2 đầu tiên. | `subpage.tsx`, `pricing.tsx` |
| 7 | **Tiêu đề section viết tay, căn trái/giữa lẫn lộn:** trang dịch vụ dùng `SectionHead` (căn giữa), trang thông tin viết `<h2 className="heading-2">` thủ công. | `pricing.tsx`, `policy.tsx`, `faq.tsx` |
| 8 | **Icon/tone ghép theo chỉ số mảng** (lỗi đã sửa ở trang dịch vụ nhưng còn ở đây): `FEATURE_TONES`, `SURCHARGE_ICONS`, `TIP_ICONS`. | `pricing.tsx`, `policy.tsx` |
| 9 | **Màu ngoài token:** TSX có `text-[#9f2f2d]`, `text-[#9a6514]`, `text-[#f59e0b]`, `bg-[#fbeeed]`, `border-[#e4b4b2]`, `text-[#7f2523]`; `globals.css` có **74** hex ngoài `@theme`. | nhiều file |
| 10 | **Class trùng chức năng:** `card` ≡ `info-card` (giống nhau từng dòng); `surcharge-card`, `stat-card`, `warehouse-card` là biến thể của thẻ; `svc-band` / `svc-cta` / `ffm`… là cùng một dải tối; 5 mức bo góc (0.375 / 0.75 / 1 / 1.25 / 1.5rem) và bóng đổ viết tay ở ≥ 10 chỗ. | `globals.css` |
| 11 | Primitives dùng chung (`SectionHead`, `ContactCta`, `CtaBand`, `ItemVisual`) đang nằm trong `modules/landing/components/service/` và có kiểu ràng buộc vào config dịch vụ, nên trang khác không dùng lại được. | `service/*` |
| 12 | Tài liệu design cũ (`HARUTO-EXPRESS-UIUX-TECHNICAL-SPEC.md` §2) ghi font Be Vietnam Pro / Inter, sai so với code (Newsreader + Hanken Grotesk, Noto cho JA). | docs |

---

## B0. Baseline (không commit)
```bash
git checkout main
git pull
npm ci
npm run typecheck && npm run pricing:check && npm run build
npm run start & sleep 5 && npm run seo:check; kill %1
```
Baseline fail thì **dừng lại và báo cáo**. Ghi lại số hex ngoài `@theme` trong `globals.css` (dự kiến 74) làm mốc cho B6.

---

## B1. Tokens (`globals.css` → `@theme`)

Thêm (giữ nguyên các token đang có):
```css
--color-paper: #fdfaf3;
--color-warn: #b45309;      --color-warn-soft: #fef3c7;
--color-danger: #b91c1c;    --color-danger-deep: #7f2523;
--color-danger-soft: #fbeeed; --color-danger-line: #e4b4b2;
--color-ok: var(--color-forest);

--radius-control: 0.375rem;
--radius-card: 0.75rem;     /* đã có */
--radius-panel: 1.25rem;
--radius-band: 1.5rem;

--shadow-card: 0 6px 18px rgb(16 44 33 / 0.06);
--shadow-lift: 0 16px 32px rgb(16 44 33 / 0.12);
--shadow-frame: 0 0 0 6px #fff, 0 24px 48px rgb(16 44 33 / 0.16);
```
Tailwind v4 sẽ tự sinh utility tương ứng (`text-warn`, `bg-danger-soft`, `rounded-panel`, `shadow-lift`…). Thay **mọi** hex trong TSX:

| Chỗ | Cũ | Mới |
|---|---|---|
| `pricing.tsx` TONE_ICON.ban | `text-[#9f2f2d]` | `text-danger` |
| `pricing.tsx` ghi chú dòng giá | `text-[#9a6514]` | `text-warn` |
| `service-hero.tsx` icon alert | `text-[#f59e0b]` | `text-gold` |
| `contact-form.tsx` khối lỗi | `bg-[#fbeeed] border-[#e4b4b2] text-[#7f2523]` | `bg-danger-soft border-danger-line text-danger-deep` |

Trong `globals.css`: thay các hex trùng giá trị token bằng `var(--color-…)`. Hex `#d97706` (goods-list warn) đổi thành `var(--color-warn)`; `#b91c1c` thành `var(--color-danger)`; `#fdfaf3` thành `var(--color-paper)`. Các bo góc 1.25rem / 1.5rem / 0.375rem thay bằng `var(--radius-panel|band|control)`; bóng đổ trùng giá trị thay bằng `var(--shadow-…)`.

**Commit:** `style(tokens): semantic colours, radius & shadow scale; no raw hex in TSX`

---

## B2. Gộp class (CSS + chỗ dùng)

| Gộp | Thành | Ghi chú |
|---|---|---|
| `info-card` | `card` | Giống hệt nhau. Đổi ở `policy.tsx`, `pricing.tsx`, rồi xóa `.info-card` |
| `surcharge-card` + `surcharge-card__fee` | `card card--compact` + `card__tag` | `--compact`: padding 1rem, font 0.95rem, flex column |
| `stat-card` (+ `--featured`, `__value/__label/__body`) | `card card--stat` (+ `card--featured`) | Giữ tên phần con: `card__value`, `card__label`, `card__body` |
| `warehouse-card` | `card card--dark` | Nền deep, chữ ivory, `rounded-panel` |
| `svc-terms` | `panel-dashed` | |
| `svc-band`, `svc-cta` | `band-dark` + `band-dark--sweep` (benefit, đường cong cam) / `band-dark--glow` (CTA, quầng gold góc phải) | |
| `svc-title`, `svc-eyebrow`, `svc-lead`, `svc-hero`, `svc-hero__grid`, `svc-hero__actions` | `hero-title` (+`__a`/`__b`), `eyebrow`, `lead`, `hero-bg`, `hero-grid`, `hero-actions` | Dùng chung cho cả 2 biến thể hero |
| `page-hero`, `page-hero__frame` | `hero-bg` + `hero-frame` | `hero-frame`: `rounded-panel`, `shadow-frame`, `aspect-ratio: 16/10`, `overflow:hidden`, `position:relative` |
| `heading-1` | — | Xóa. `not-found-view.tsx` chuyển sang `hero-title` |
| `callout` | `callout` + `callout--warn` / `callout--danger` | Viền trái theo tone |

Thêm `.card--link` (hover: `translate: 0 -3px; box-shadow: var(--shadow-lift)`, bọc trong media hover). Dùng cho `RelatedLinks`, `guide-card`, `svc-feature--link`.

Chạy `grep -rn` theo từng tên class cũ để chắc chắn không còn chỗ nào dùng, rồi xóa định nghĩa cũ.

**Commit:** `style(ds): one card/band/hero class family; drop duplicates`

---

## B3. Primitives → `src/shared/ui/`

| File mới | Nguồn | Thay đổi |
|---|---|---|
| `section-head.tsx` | `service/section-head.tsx` | Thêm `tone?: "light"\|"dark"` (dark → `text-white`, intro `text-ivory/85`). Mặc định `align="center"` |
| `contact-cta.tsx` | `service/contact-cta.tsx` | `export type CtaAction` chuyển về đây (xóa khỏi `service-pages.ts`, đổi sang import) |
| `cta-band.tsx` | `service/cta-band.tsx` | Props phẳng: `{ title, body, note?, primary: CtaAction, secondary?: CtaAction, primaryLabel? }`. Không còn phụ thuộc `ServiceCopy` |
| `item-visual.tsx` | `service/visual.tsx` | Kiểu `Visual` chuyển về đây |
| `icon-chip.tsx` | mới | `<IconChip Icon size="md"\|"lg">` → `span.icon-chip` (+`--lg`), icon duotone 22 / 28 |
| `callout.tsx` | mới | `<Callout tone="info"\|"warn"\|"danger">`, icon `Info` / `Warning` / `Prohibit` fill |
| `toc-chips.tsx` | mới | `<nav aria-label={t("service.toc")}><ul class="toc-chips">` link `#id`, chip viền forest bo tròn, cuộn ngang trên mobile (`overflow-x-auto`, `scroll-snap`) |
| `hero-shell.tsx` | gộp `PageHero` + phần khung của `ServiceHero` | B3.1 |

### B3.1 `HeroShell`
```tsx
type Props = {
  page: Exclude<PageKey, "home">;            // breadcrumb
  variant: "poster" | "framed";
  eyebrow?: string;
  title: { a: string; b?: string };          // b có → H1 hai màu, có {" "} ở giữa
  lead: string;
  note?: ReactNode;                          // dòng ngày hiệu lực, v.v.
  children?: ReactNode;                      // ribbon / alert / hook / points / marketplaces (giữa lead và actions)
  actions?: ReactNode;
  media: ReactNode;                          // <Image priority …/> do trang truyền vào
  after?: ReactNode;                         // TocChips hoặc CustomsChips, nằm dưới lưới
};
```
- `<section class="hero-bg">` → `.wrap.hero-grid` → cột copy (Breadcrumbs, eyebrow, `h1.hero-title`, children, `p.lead`, note, `.hero-actions`) + cột media (`.hero-art` cho poster, `.hero-frame` cho framed) → `after`.
- `ServiceHero` viết lại dùng `HeroShell variant="poster"`, giữ nguyên toàn bộ output hiện tại (ribbon, alert, hook, points, marketplaces, route tags, seal).
- `InfoHero` (`src/shared/ui/info-hero.tsx`): `HeroShell variant="framed"`, `title.a = pages.<key>.title`, `lead = pages.<key>.intro`, `eyebrow = nav.groups.<group>` (group lấy từ `NAV` trong `nav.ts`; trang không thuộc nhóm nào thì không có eyebrow), ảnh lấy từ `PAGE_IMAGES`.
- Xóa `shared/components/page-hero.tsx`.

Cập nhật toàn bộ import trong `service/*` sang `@/shared/ui/*`, rồi xóa các file đã chuyển đi.

**Commit:** `refactor(ui): shared primitives + HeroShell for poster and framed heroes`

---

## B4. Template `InfoPage`

### B4.1 Config `src/modules/landing/info-pages.ts`
```ts
export type InfoKey = "pricing" | "policy" | "japanWarehouse" | "faq" | "guides" | "contact";
export type InfoSectionId =
  | "ratesVnJp" | "ratesJpVn" | "surcharges" | "weight" | "compensation"
  | "warehouse" | "warehouseTips" | "faqGroups" | "guideGrid" | "contact";
export type InfoPageConfig = {
  heroActions?: { primary: CtaAction; secondary?: CtaAction };
  heroNote?: "effectiveDate";                 // pricing: hiển thị pricing.intro thành pill có icon CalendarCheck
  toc?: InfoSectionId[];                      // các section có mặt trong mục lục
  sections: InfoSectionId[];                  // thứ tự render; nền xen kẽ ivory/sage tự động theo vị trí
  faq: boolean;                               // FAQ theo tag (trang faq dùng section faqGroups)
  cta?: { primary: CtaAction; secondary?: CtaAction };  // không có → không render CtaBand
};
```
| key | heroActions | heroNote | toc | sections | faq | cta |
|---|---|---|---|---|---|---|
| pricing | contact + call | effectiveDate | ratesVnJp, ratesJpVn, surcharges, weight | ratesVnJp, ratesJpVn, surcharges, weight | ✓ | zalo + call |
| policy | contact | — | weight, compensation | weight, compensation | ✓ | zalo + contact |
| japanWarehouse | — | — | — | warehouse, warehouseTips | ✓ | zalo + call |
| faq | contact | — | (các nhóm FAQ) | faqGroups | — | zalo + contact |
| guides | — | — | — | guideGrid | — | zalo + contact |
| contact | — | — | — | contact | — | — |

### B4.2 `InfoPage({ page })` (`src/modules/landing/components/info/info-page.tsx`)
`InfoHero (+ TocChips trong after)` → `sections.map((id, i) => <Section id bg={i % 2 ? "sage" : "ivory"} />)` → `{faq && <Faq page/>}` → `{cta && <CtaBand title={service.ctaDefault.title} body={service.ctaDefault.body} …/>}` → `<RelatedLinks/>`.

Mỗi section là một component riêng trong `components/info/`, bọc `<section id=… className="section [bg-sage]"><div className="wrap"><SectionHead align="start" …/>…`:

| id | Component | Nội dung | Thay đổi so với hiện tại |
|---|---|---|---|
| `ratesVnJp` | `RatesVnJp` | callout `vnJp.intro` + 2 `GoodsRates` + `RoundingRules` | H2 = `teaser.vnJp.label`. **Bỏ** đoạn `pricing.intro` ở đây (đã chuyển lên hero note) |
| `ratesJpVn` | `RatesJpVn` | thẻ `rate-card` JP→VN | H2 = `teaser.jpVn.label` |
| `surcharges` | `Surcharges` | lưới phụ thu | Bỏ prop `plain` (nền do InfoPage quyết định) |
| `weight` | `WeightRules` | standard / rounding / bulky + `VolumetricDiagram` | H2 = `policy.weight.title`, thẻ dùng H3 |
| `compensation` | `Compensation` | 2 thẻ `card--stat` | H2 = `policy.compensation.title`, H3 |
| `warehouse` | `WarehouseInfo` | `card--dark` địa chỉ + `MapEmbed` | H2 = `policy.warehouse.title`. Bố cục 2 cột: địa chỉ bên trái, bản đồ bên phải |
| `warehouseTips` | `WarehouseTips` | danh sách lưu ý | H2 = `policy.tips.title` |
| `faqGroups` | `FaqGroups` | B4.4 | |
| `guideGrid` | `GuideGrid` | magazine (từ `guides.tsx`) | B4.5 |
| `contact` | `<Contact withMap/><ContactGuide/>` | giữ nguyên | |

`Policy` cũ: tách hết thành các section trên. Trang dịch vụ `concierge` đang dùng `Policy show={["concierge"]}` → đổi thành section `ConciergeTerms` (H2 `policy.concierge.title`, thẻ H3) dùng trong `ServicePage` (đổi `config.policy` thành `config.conciergeTerms: true`). Sau đó xóa `policy.tsx` và type `PolicyBlock`.

### B4.3 Dữ liệu theo id (messages vi/ja/en + config)
Chuyển 4 mảng sau sang object có id. **Giữ nguyên thứ tự và bản dịch**; đặt id theo nội dung thật của từng dòng (đọc bản VI). Ví dụ gợi ý:
- `pricing.vnJp.clean.features` → `{ goods, guarantee, taxIncluded, freePacking, wholesale }`; `pricing.vnJp.mixed.features` → `{ taxIncluded, accepted, notGuaranteed, prohibited }`. Tone đặt trong config (`PRICING_FEATURE_TONES`) theo id.
- `pricing.surcharge.rows[]` → `pricing.surcharge.items: { <id>: { item, fee } }` (7 id theo nội dung). Icon trong config theo id.
- `policy.tips.items[]` → object 7 id; icon trong config theo id.
- Chạy lại `pricing:check` để chắc chắn script vẫn đọc đúng; nếu script đọc các key này thì sửa script theo cấu trúc mới.

### B4.4 FAQ theo nhóm (`/cau-hoi-thuong-gap`)
- Config `FAQ_GROUPS = [{ id: "shipping", tags: ["shipToJapan","shipToVietnam","pricing","policy","goods"] }, { id: "buying", tags: ["concierge","auction"] }, { id: "warehouse", tags: ["japanWarehouse"] }, { id: "business", tags: ["business"] }]`.
- Một câu thuộc nhóm của **tag đầu tiên** trong `pages` của câu đó (bỏ qua tag `home`); câu không khớp nhóm nào thì vào `shipping`. Nhóm không có câu nào thì không render.
- Mỗi nhóm là một section (xen kẽ nền) gồm `SectionHead align="start" title={faq.groups.<id>}` và danh sách `details.faq-item` như hiện tại. TocChips liệt kê các nhóm có câu hỏi.
- `Faq` (dùng ở trang khác) giữ H2 `faq.title`. Trên `/cau-hoi-thuong-gap` **không** render `Faq`, nên không còn H2 trùng với H1.
- JSON-LD `FAQPage` giữ nguyên (tất cả câu hỏi).

### B4.5 Hub `/huong-dan`
- `GuideGrid` = khối magazine của `guides.tsx`, nhận props `{ title, intro?, headingLevel }`. Trang chủ vẫn dùng `home.guides.title` làm H2. Trên `/huong-dan`, `SectionHead` dùng `home.guides.title` và các thẻ dùng H3.
- `pages.guides.intro` (3 locale) ← sao chép `home.guides.intro` của đúng locale đó (bỏ câu "Nội dung đang được biên soạn").
- `nav.ts`: nhóm `guides` → `["guides", "policy", "japanWarehouse", "faq"]` (hub nằm đầu dropdown).
- **Giữ `indexable: false`** cho `guides` (chưa có bài viết riêng; trang chỉ là hub link). Ghi việc này vào báo cáo.

### B4.6 Ghép
- `subpage.tsx`: `isServiceKey` → `ServicePage`; `isInfoKey` → `InfoPage`; ngoài hai nhóm này thì `notFound`. Xóa hàm `body()`.
- `pages.ts`: cập nhật `updatedAt` của `pricing`, `policy`, `japanWarehouse`, `faq`, `guides`, `contact`.

**Commit:** `feat(info): InfoPage template for pricing, policy, warehouse, FAQ, guides, contact`

---

## B5. Nhóm "Bảng giá" nhất quán
Sau B3–B4, `/bang-gia` (framed) và `/hang-nhan-va-hang-cam` (poster) dùng chung `HeroShell`: cùng nền, cùng lưới, cùng font và cỡ H1, cùng vị trí CTA. Kiểm tra thêm:
- Eyebrow của `goods`: đặt `eyebrow = nav.groups.pricing` qua `ServiceHero` khi copy không có eyebrow riêng (thêm field `config.hero.eyebrowFromNav?: "pricing"`). Như vậy cả nhóm đều hiện "BẢNG GIÁ" phía trên H1.
- `RelatedLinks` của `pricing` ↔ `goods` trỏ lẫn nhau (đã có trong registry, chỉ cần xác nhận).

**Commit (nếu có thay đổi):** `feat(pricing-group): shared eyebrow across the Bảng giá menu group`

---

## B6. `design:check`
Tạo `scripts/design-check.mjs` + script `"design:check": "node scripts/design-check.mjs"` trong `package.json`. Script fail (exit 1, in file:dòng) khi:
1. File `src/**/*.tsx` chứa `\[#[0-9a-fA-F]{3,8}\]` hoặc `#[0-9a-fA-F]{6}` bên trong `style={{…}}`.
2. Số hex trong `globals.css` **nằm ngoài khối `@theme`** vượt `BASELINE_HEX` (hằng số trong script = số đếm được sau B1–B2; ghi chú: chỉ được giảm, không được tăng).
3. File trong `src/modules/landing/components/{service,info}/**` hoặc `src/shared/ui/**` có `<h2` mà không nằm trong `section-head.tsx`, `cta-band.tsx`, `hero-shell.tsx`.
4. Còn xuất hiện class đã bỏ: `info-card`, `surcharge-card`, `stat-card`, `warehouse-card`, `heading-1`, `page-hero`, `svc-band`, `svc-cta`, `svc-terms`, `svc-title`.
5. `src/**/*.ts(x)` khai báo mảng `*_ICONS`/`*_TONES`/`*_IMAGES` là **mảng** (bám theo chỉ số) thay vì object theo id. Regex gợi ý: `const [A-Z_]+_(ICONS|TONES|IMAGES)\s*=\s*\[`.

### B6.1 Sửa các vi phạm đang có trước khi bật check (quét @ `153b69d`)
| Luật | Chỗ vi phạm | Sửa |
|---|---|---|
| 3 | `service/benefit-band.tsx` (`<h2 className="heading-2 text-white">`) | Dùng `<SectionHead tone="dark" …/>` |
| 3 | `shared/components/related-links.tsx` | Dùng `<SectionHead align="start" …/>` (luật 3 mở rộng ra cả `src/shared/components/**`) |
| 3 | `service/service-page.tsx` (H2 của khối terms) và `service/customs-sections.tsx` (2 H2 `customs-panel__title` kiểu poster) | Đưa vào `ALLOWLIST_H2` trong script, kèm comment lý do: "tiêu đề panel kiểu poster / panel điều khoản, vẫn là H2 hợp lệ" |
| 5 | `service/customs-sections.tsx` `GROUP_IMAGES = [...]` | Đổi thành object theo id nhóm của `customs.groups` |
| 5 | `home-data.ts` `GOODS_TILE_ICONS` | Đây là danh sách id (chính nó quyết định thứ tự), không phải dữ liệu ghép theo chỉ số → đưa vào `ALLOWLIST_ARRAYS` |
| 5 | `pricing.tsx` `SURCHARGE_ICONS`, `policy.tsx` `TIP_ICONS` | Đã được xử lý ở B4.3 |

Thêm luật vào `seo-check.mjs`: **heading không nhảy bậc** (gặp H3 mà trước đó chưa có H2 trong `main` thì báo lỗi; tương tự với H4).

**Commit:** `chore(checks): design:check (tokens, headings, retired classes, index-keyed visuals) + heading-order rule`

---

## B7. Tài liệu
1. `docs/DESIGN-SYSTEM.md`: xóa các nhãn **(B…)** của những mục đã làm xong; cập nhật §5 nếu tên class thực tế khác với bảng; ghi `BASELINE_HEX` vào §8; thêm một dòng Changelog.
2. `docs/HARUTO-EXPRESS-UIUX-TECHNICAL-SPEC.md` §2: thay toàn bộ nội dung bằng một dòng: `> Đã chuyển sang docs/DESIGN-SYSTEM.md (nguồn sự thật duy nhất).`
3. `docs/SEO-ROADMAP.md` Changelog: `2026-11-13 — info template — pricing/policy/warehouse/faq/guides/contact dùng InfoPage; FAQ chia nhóm; hết nhảy bậc heading`.
4. `CLAUDE.md`: bỏ dòng chú thích "(design:check có sau khi…)".

**Commit:** `docs: design system is live; retire old spec §2`

---

## B8. Kiểm tra (bắt buộc pass trước khi push)
```bash
npm run typecheck && npm run design:check && npm run pricing:check && npm run build
npm run start & sleep 5 && npm run seo:check; kill %1
```
Kiểm tra trên HTML `localhost` cho 12 trang con × 3 locale:
- [ ] Mọi trang con có `section.hero-bg`, đúng 1 `h1.hero-title`, không trang nào còn class `page-hero`.
- [ ] Không có H3 nào đứng trước H2 đầu tiên trong `main` (`/chinh-sach-van-chuyen`, `/dia-chi-kho-nhat` nói riêng).
- [ ] `/bang-gia`: hero có pill ngày hiệu lực; có TocChips với 4 link neo hoạt động; nền section xen kẽ (không có hai section cùng nền liền nhau); cuối trang có CtaBand.
- [ ] `/cau-hoi-thuong-gap`: không còn H2 trùng H1; câu hỏi chia theo nhóm; JSON-LD FAQPage vẫn đủ số câu.
- [ ] `/huong-dan`: có lưới bài; dropdown "Hướng dẫn" có hub ở đầu; trang vẫn `noindex`.
- [ ] `/lien-he`: hero mới, không có CtaBand, form vẫn gửi được (thử trên local với honeypot rỗng nếu có env; nếu không có env thì kiểm tra request được tạo).
- [ ] 6 trang dịch vụ hiển thị **không đổi** so với trước B3 (so sánh bằng mắt hoặc snapshot HTML phần hero).
- [ ] Viewport 375 / 768 / 1280: TocChips cuộn ngang được trên mobile, không tràn trang.
- [ ] `prefers-reduced-motion`: không còn animation nào chạy.

---

## B9. Bàn giao
1. `git push origin main`.
2. Báo cáo cuối gồm: danh sách commit SHA; kết quả B8; giá trị `BASELINE_HEX` trước và sau; **copy mới chờ duyệt** (Phụ lục A); các điểm còn mở: `guides` vẫn noindex tới khi có bài viết riêng; dòng "Đảm bảo hàng hóa 100%" trong `pricing.vnJp.clean.features` vẫn đang chờ chủ site quyết (Review §1.3).

---

# Phụ lục A — Copy mới (thêm vào cả 3 locale)

| key | vi | ja | en |
|---|---|---|---|
| `service.ctaDefault.title` | Cần báo giá cho kiện hàng của bạn? | お荷物のお見積もりが必要ですか？ | Need a quote for your shipment? |
| `service.ctaDefault.body` | Gửi tuyến, loại hàng và cân nặng dự kiến, HARUTO tư vấn và báo cước qua Zalo hoặc hotline. | ルート、品目、おおよその重量をお送りいただければ、HARUTOがZaloまたはホットラインでご案内とお見積もりをいたします。 | Send the route, goods type and estimated weight, and HARUTO will advise and quote on Zalo or by phone. |
| `service.toc` | Mục lục trang | このページの内容 | On this page |
| `faq.groups.shipping` | Vận chuyển & cước | 配送と運賃 | Shipping & rates |
| `faq.groups.buying` | Mua hộ & đấu giá hộ | 代理購入・代理入札 | Buying & auction bidding |
| `faq.groups.warehouse` | Kho Nhật | 日本倉庫 | Japan warehouse |
| `faq.groups.business` | Doanh nghiệp & FFM | 企業向け・FFM | Business & fulfillment |
| `pages.guides.intro` | ← `home.guides.intro` (vi) | ← `home.guides.intro` (ja) | ← `home.guides.intro` (en) |
