# PROMPT — Đồng bộ layout trang Bảng giá & Hướng dẫn

> **Cách dùng (máy local):** ở thư mục gốc repo, chạy `claude` rồi gõ:
> `Đọc docs/prompts/2026-11-13-info-pages-sync.md và thực hiện toàn bộ, theo đúng thứ tự B0 → B7.`
>
> Đọc kèm `CLAUDE.md`. Snapshot khi viết: `main` @ `153b69d`, sau khi template 6 trang dịch vụ đã ship.

---

## 0. Mục tiêu & phạm vi

1. **Đồng bộ nhóm menu "Bảng giá"** (`pricing`, `goods`) và **"Hướng dẫn"** (`guides`, `policy`, `japanWarehouse`, `faq`), cùng với `contact` vì trang này cũng dùng `PageHero`. Sau khi xong, mọi trang con dùng chung **một khung hero** và cùng cấu trúc trang.
2. **Template `InfoPage`** cho các trang thông tin, cùng nhịp với `ServicePage`: hero → mục lục → nội dung → FAQ → CTA → liên quan.
3. **Ngoài phạm vi: design system.** Không thêm token màu/bo góc/bóng đổ mới, không đổi tên hay gộp các class CSS đang có (`card`/`info-card`, `stat-card`, `svc-*`, `page-hero__frame`…), không thay hex trong CSS, không tạo script kiểm tra design. Phần này do người khác phụ trách. CSS mới chỉ được thêm khi bắt buộc (mục lục, pill ngày hiệu lực), viết ngắn gọn, **chỉ dùng biến và class đã có**.
4. Ràng buộc như `CLAUDE.md`: không bịa dữ kiện, đủ 3 locale, commit thẳng lên `main` theo từng bước, chỉ push khi B6 pass.

---

## 1. Hiện trạng (kết quả quét source @ `153b69d`)

| # | Vấn đề | Vị trí |
|---|---|---|
| 1 | **Hai kiểu hero khác nhau trong cùng một nhóm menu.** `/bang-gia` dùng `PageHero` (nền sage, H1 serif `heading-1`, ảnh trong khung, không có CTA), còn `/hang-nhan-va-hang-cam` (cùng nhóm "Bảng giá") dùng `ServiceHero` (nền paper, H1 sans 800 hai màu, artwork, có CTA). Nhóm "Hướng dẫn" dùng `PageHero` cả 4 trang. | `shared/components/page-hero.tsx`, `service/service-hero.tsx` |
| 2 | **Nhảy bậc heading H1 → H3** ở `/chinh-sach-van-chuyen` và `/dia-chi-kho-nhat`: `Policy withHeader={false}` render khối bằng `<h3>`, thẻ bằng `<h4>`, không có H2 nào. | `policy.tsx` |
| 3 | **`/cau-hoi-thuong-gap` lặp tiêu đề:** H1 "Câu hỏi thường gặp" và ngay dưới là H2 "Câu hỏi thường gặp"; 9 câu nằm trong một danh sách phẳng, chưa chia nhóm. | `faq.tsx` |
| 4 | **`/huong-dan` là trang rỗng:** chỉ có hero + "Trang liên quan", intro ghi "Nội dung đang được biên soạn"; hub cũng không có trong menu "Hướng dẫn". Khối magazine `Guides` đang có nhưng chỉ dùng ở trang chủ. | `subpage.tsx` (không có case `guides`), `nav.ts` |
| 5 | **Trang thông tin không có CTA kết trang.** `/bang-gia` là trang mang lại tiền mà kết thúc ở FAQ → liên quan. | `subpage.tsx` |
| 6 | **Nhịp nền `/bang-gia` bị lặp:** VN→JP (ivory) → JP→VN (sage) → Phụ thu `plain` (ivory) → Cách tính cân (ivory): hai section ivory liền nhau. Dòng "áp dụng từ 01/10/2026" (tín hiệu độ mới) bị vùi dưới H2 đầu tiên. | `subpage.tsx`, `pricing.tsx` |
| 7 | **Tiêu đề section viết tay, căn lẫn lộn:** trang dịch vụ dùng `SectionHead` (căn giữa), trang thông tin viết `<h2 className="heading-2">` thủ công. | `pricing.tsx`, `policy.tsx`, `faq.tsx`, `related-links.tsx`, `benefit-band.tsx` |
| 8 | **Icon/tone/ảnh ghép theo chỉ số mảng** (lỗi đã sửa ở trang dịch vụ nhưng vẫn còn ở đây): `FEATURE_TONES`, `SURCHARGE_ICONS`, `TIP_ICONS`, `GROUP_IMAGES`. | `pricing.tsx`, `policy.tsx`, `customs-sections.tsx` |
| 9 | `SectionHead`, `ContactCta`, `CtaBand`, `ItemVisual` nằm trong `modules/landing/components/service/` và có kiểu ràng buộc vào config dịch vụ, nên trang thông tin không dùng lại được. | `service/*` |

---

## B0. Baseline (không commit)
```bash
git checkout main
git pull
npm ci
npm run typecheck && npm run pricing:check && npm run build
npm run start & sleep 5 && npm run seo:check; kill %1
```
Baseline fail thì **dừng lại và báo cáo**.

---

## B1. Chuyển component dùng chung sang `src/shared/ui/`

| File mới | Nguồn | Thay đổi |
|---|---|---|
| `section-head.tsx` | `service/section-head.tsx` | Thêm `tone?: "light"\|"dark"` (dark → H2 `text-white`, intro `text-ivory/85`). Mặc định giữ `align="center"` |
| `contact-cta.tsx` | `service/contact-cta.tsx` | `export type CtaAction` chuyển về đây (xóa khỏi `service-pages.ts`, đổi sang import) |
| `cta-band.tsx` | `service/cta-band.tsx` | Props phẳng: `{ title, body, note?, primary: CtaAction, secondary?: CtaAction, primaryLabel? }`, bỏ phụ thuộc vào `ServiceCopy` |
| `item-visual.tsx` | `service/visual.tsx` | Kiểu `Visual` chuyển về đây |
| `toc-chips.tsx` | mới | `<nav aria-label={t("service.toc")}><ul>` gồm các link `#id`. Mỗi chip dùng `btn btn-outline` cỡ nhỏ (`min-h-9 px-3 py-1 text-sm`). Trên mobile cuộn ngang (`flex gap-2 overflow-x-auto`). Không thêm class CSS mới nếu Tailwind utility đã đủ |
| `hero-shell.tsx` | gộp phần khung của `PageHero` + `ServiceHero` | B1.1 |

Sửa thêm: `service/benefit-band.tsx` và `shared/components/related-links.tsx` dùng `SectionHead` thay cho `<h2>` viết tay (`BenefitBand` dùng `tone="dark"`, `RelatedLinks` dùng `align="start"`).

### B1.1 `HeroShell`
```tsx
type Props = {
  page: Exclude<PageKey, "home">;            // dùng cho breadcrumb
  variant: "poster" | "framed";
  eyebrow?: string;
  title: { a: string; b?: string };          // có b → H1 hai màu, có {" "} ở giữa
  lead: string;
  note?: ReactNode;                          // dòng ngày hiệu lực, v.v.
  children?: ReactNode;                      // ribbon / alert / hook / points / marketplaces (nằm giữa H1 và lead/actions như hiện tại)
  actions?: ReactNode;
  media: ReactNode;                          // <Image priority …/> do trang truyền vào
  after?: ReactNode;                         // TocChips hoặc CustomsChips, nằm dưới lưới
};
```
- **Dùng lại nguyên các class hero hiện có của trang dịch vụ** (`svc-hero`, `svc-hero__grid`, `svc-hero__copy`, `svc-eyebrow`, `svc-title` + `__a`/`__b`, `svc-lead`, `svc-hero__actions`, `svc-art`). Biến thể `framed` bọc ảnh bằng `page-hero__frame` đang có. Không đổi tên class.
- `variant="framed"` có H1 một màu: chỉ render `svc-title__a`.
- `ServiceHero` viết lại dùng `HeroShell variant="poster"`, **output HTML của 6 trang dịch vụ phải giữ nguyên** (ribbon, alert, hook, points, marketplaces, route tags, seal).
- `InfoHero` (`src/shared/ui/info-hero.tsx`) = `HeroShell variant="framed"`: `title.a = pages.<key>.title`, `lead = pages.<key>.intro`, `eyebrow = nav.groups.<group>` (group tra từ `NAV` trong `nav.ts`; trang không thuộc nhóm nào thì không có eyebrow), ảnh lấy từ `PAGE_IMAGES` (`fill`, `priority`, `sizes="(max-width: 1023px) 100vw, 50vw"`, `alt=""`).
- Xóa `shared/components/page-hero.tsx` khi không còn chỗ nào dùng. `.page-hero` (nền sage) không còn dùng, nhưng **không xóa CSS** (thuộc phạm vi design system), chỉ ghi vào báo cáo.

Cập nhật toàn bộ import trong `service/*` sang `@/shared/ui/*`, rồi xóa các file đã chuyển đi.

**Commit:** `refactor(ui): shared section/CTA/hero components for service and info pages`

---

## B2. Template `InfoPage`

### B2.1 Config `src/modules/landing/info-pages.ts`
```ts
export type InfoKey = "pricing" | "policy" | "japanWarehouse" | "faq" | "guides" | "contact";
export type InfoSectionId =
  | "ratesVnJp" | "ratesJpVn" | "surcharges" | "weight" | "compensation"
  | "warehouse" | "warehouseTips" | "faqGroups" | "guideGrid" | "contact";
export type InfoPageConfig = {
  heroActions?: { primary: CtaAction; secondary?: CtaAction };
  heroNote?: "effectiveDate";                 // pricing: pricing.intro hiển thị thành pill có icon CalendarCheck
  toc?: InfoSectionId[];
  sections: InfoSectionId[];                  // thứ tự render; nền xen kẽ ivory/sage tự động theo vị trí
  faq: boolean;                               // FAQ theo tag (trang faq dùng section faqGroups)
  cta?: { primary: CtaAction; secondary?: CtaAction };  // không có → không render CtaBand
};
export function isInfoKey(key: PageKey): key is InfoKey { … }
```
| key | heroActions | heroNote | toc | sections | faq | cta |
|---|---|---|---|---|---|---|
| pricing | contact + call | effectiveDate | ratesVnJp, ratesJpVn, surcharges, weight | ratesVnJp, ratesJpVn, surcharges, weight | ✓ | zalo + call |
| policy | contact | — | weight, compensation | weight, compensation | ✓ | zalo + contact |
| japanWarehouse | — | — | — | warehouse, warehouseTips | ✓ | zalo + call |
| faq | contact | — | (các nhóm FAQ) | faqGroups | — | zalo + contact |
| guides | — | — | — | guideGrid | — | zalo + contact |
| contact | — | — | — | contact | — | — |

Pill ngày hiệu lực: `inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-sm text-muted` + icon `CalendarCheck` 18 `text-forest`, dùng utility, không thêm class.

### B2.2 `InfoPage({ page })` — `src/modules/landing/components/info/info-page.tsx`
`InfoHero (TocChips trong after)` → `sections.map((id, i) => <section id=… className={i % 2 ? "section bg-sage" : "section"}>…)` → `{faq && <Faq page/>}` → `{cta && <CtaBand title={service.ctaDefault.title} body={service.ctaDefault.body} …/>}` → `<RelatedLinks/>`.

Nếu section cuối và `Faq` cùng nền thì thêm `border-t border-line` cho `Faq` (truyền prop `className`).

Mỗi section là một component riêng trong `components/info/`, có cùng khung: `<div className="wrap"><SectionHead align="start" …/><div className="mt-8 lg:mt-10">…</div></div>`.

| id | Component | Nội dung | Thay đổi so với hiện tại |
|---|---|---|---|
| `ratesVnJp` | `RatesVnJp` | callout `vnJp.intro` + 2 `GoodsRates` + `RoundingRules` | H2 = `teaser.vnJp.label`. **Bỏ** đoạn `pricing.intro` ở đây vì đã chuyển lên hero note |
| `ratesJpVn` | `RatesJpVn` | thẻ `rate-card` JP→VN | H2 = `teaser.jpVn.label` |
| `surcharges` | `Surcharges` | lưới phụ thu | Bỏ prop `plain` (nền do InfoPage quyết định) |
| `weight` | `WeightRules` | standard / rounding / bulky + `VolumetricDiagram` | H2 = `policy.weight.title`; tiêu đề thẻ chuyển từ `h4` sang `h3` |
| `compensation` | `Compensation` | 2 thẻ `stat-card` | H2 = `policy.compensation.title`; `h4` → `h3` |
| `warehouse` | `WarehouseInfo` | `warehouse-card` + `MapEmbed` | H2 = `policy.warehouse.title`; 2 cột ở `lg`: địa chỉ bên trái, bản đồ bên phải |
| `warehouseTips` | `WarehouseTips` | danh sách lưu ý | H2 = `policy.tips.title` |
| `faqGroups` | `FaqGroups` | B2.4 | |
| `guideGrid` | `GuideGrid` | magazine (từ `guides.tsx`) | B2.5 |
| `contact` | `<Contact withMap/><ContactGuide/>` | giữ nguyên | |

`Policy` cũ: tách hết thành các section trên. Trang dịch vụ `concierge` đang dùng `Policy show={["concierge"]}` → đổi thành section `ConciergeTerms` (H2 `policy.concierge.title`, thẻ H3) dùng trong `ServicePage` (đổi `config.policy` thành `config.conciergeTerms: true`). Sau đó xóa `policy.tsx` và type `PolicyBlock`.

### B2.3 Dữ liệu theo id (messages vi/ja/en + config)
Chuyển các mảng sau sang object có id. **Giữ nguyên thứ tự và bản dịch**; đặt id theo nội dung thật của từng dòng (đọc bản VI). Gợi ý:
- `pricing.vnJp.clean.features` → `{ goods, guarantee, taxIncluded, freePacking, wholesale }`; `pricing.vnJp.mixed.features` → `{ taxIncluded, accepted, notGuaranteed, prohibited }`. Tone đặt trong config theo id (`PRICING_FEATURE_TONES`).
- `pricing.surcharge.rows[]` → `pricing.surcharge.items: { <id>: { item, fee } }` (7 id); icon trong config theo id.
- `policy.tips.items[]` → object 7 id; icon trong config theo id.
- `service/customs-sections.tsx` `GROUP_IMAGES = [...]` → object theo id nhóm của `customs.groups`.
- Chạy lại `pricing:check`. Nếu script có đọc các key trên thì sửa script theo cấu trúc mới.

### B2.4 FAQ theo nhóm (`/cau-hoi-thuong-gap`)
- Config `FAQ_GROUPS = [{ id: "shipping", tags: ["shipToJapan","shipToVietnam","pricing","policy","goods"] }, { id: "buying", tags: ["concierge","auction"] }, { id: "warehouse", tags: ["japanWarehouse"] }, { id: "business", tags: ["business"] }]`.
- Một câu thuộc nhóm của **tag đầu tiên** trong `pages` (bỏ qua tag `home`); câu không khớp nhóm nào thì vào `shipping`. Nhóm không có câu nào thì không render.
- Mỗi nhóm là một section (nền xen kẽ) gồm `SectionHead align="start" title={faq.groups.<id>}` và danh sách `details.faq-item` như hiện tại. TocChips liệt kê các nhóm có câu.
- `Faq` (dùng ở trang khác) giữ H2 `faq.title`. Trên `/cau-hoi-thuong-gap` **không** render `Faq`, nên không còn H2 trùng H1.
- JSON-LD `FAQPage` giữ nguyên (tất cả câu).

### B2.5 Hub `/huong-dan`
- `GuideGrid` = khối magazine trong `guides.tsx`, nhận props `{ title, intro?, headingLevel }`. Trang chủ vẫn dùng H2 `home.guides.title`. Trên `/huong-dan`: `SectionHead` dùng `home.guides.title`, thẻ dùng H3.
- `pages.guides.intro` (3 locale) ← sao chép `home.guides.intro` của đúng locale đó (bỏ câu "Nội dung đang được biên soạn").
- `nav.ts`: nhóm `guides` → `["guides", "policy", "japanWarehouse", "faq"]` (hub nằm đầu dropdown).
- **Giữ `indexable: false`** cho `guides` vì chưa có bài viết riêng. Ghi vào báo cáo.

### B2.6 Ghép
- `subpage.tsx`: `isServiceKey` → `ServicePage`; `isInfoKey` → `InfoPage`; key không thuộc hai nhóm này → `notFound()`. Xóa hàm `body()`.
- `pages.ts`: cập nhật `updatedAt` của `pricing`, `policy`, `japanWarehouse`, `faq`, `guides`, `contact`.

**Commit:** `feat(info): InfoPage template for pricing, policy, warehouse, FAQ, guides, contact`

---

## B3. Nhóm "Bảng giá" nhất quán
Sau B1–B2, `/bang-gia` (framed) và `/hang-nhan-va-hang-cam` (poster) dùng chung `HeroShell`: cùng nền, cùng lưới, cùng font và cỡ H1, cùng vị trí CTA. Thêm:
- Eyebrow của `goods`: thêm `config.hero.eyebrowFromNav?: "pricing"` vào `ServicePageConfig`. Khi copy không có eyebrow riêng, `ServiceHero` dùng `nav.groups.pricing`, nên cả nhóm đều hiện "BẢNG GIÁ" phía trên H1.
- Xác nhận `RelatedLinks` của `pricing` và `goods` trỏ lẫn nhau (registry đã có sẵn).

**Commit (nếu có thay đổi):** `feat(pricing-group): shared eyebrow across the Bảng giá menu group`

---

## B4. Luật SEO chống tái phát
Thêm vào `scripts/seo-check.mjs`: **heading không nhảy bậc**. Trong `main`, gặp H3 mà trước đó chưa có H2 thì báo lỗi; tương tự gặp H4 mà chưa có H3. Báo lỗi kèm URL.

**Commit:** `chore(seo-check): heading-order rule`

---

## B5. Tài liệu
`docs/SEO-ROADMAP.md`, mục Changelog: `2026-11-13 — info template — pricing/policy/warehouse/faq/guides/contact dùng InfoPage; FAQ chia nhóm; hết nhảy bậc heading; hub /huong-dan trong menu (noindex)`.

**Commit:** `docs: changelog for the info page template`

---

## B6. Kiểm tra (bắt buộc pass trước khi push)
```bash
npm run typecheck && npm run pricing:check && npm run build
npm run start & sleep 5 && npm run seo:check; kill %1
```
Kiểm tra HTML trên `localhost` cho 12 trang con × 3 locale:
- [ ] Mọi trang con có `section.svc-hero` và đúng 1 `h1.svc-title`; không còn trang nào render `PageHero`.
- [ ] Không có H3 nào đứng trước H2 đầu tiên trong `main` (đặc biệt `/chinh-sach-van-chuyen`, `/dia-chi-kho-nhat`).
- [ ] `/bang-gia`: hero có pill ngày hiệu lực; TocChips có 4 link neo hoạt động; nền section xen kẽ (không có hai section cùng nền liền nhau); cuối trang có CtaBand.
- [ ] `/cau-hoi-thuong-gap`: không còn H2 trùng H1; câu hỏi chia theo nhóm; JSON-LD FAQPage vẫn đủ số câu.
- [ ] `/huong-dan`: có lưới bài; dropdown "Hướng dẫn" có hub ở đầu; trang vẫn `noindex`.
- [ ] `/lien-he`: hero mới, không có CtaBand, form vẫn hoạt động.
- [ ] 6 trang dịch vụ hiển thị **không đổi** so với trước B1 (so sánh snapshot HTML phần hero).
- [ ] Viewport 375 / 768 / 1280: TocChips cuộn ngang được trên mobile, không làm tràn trang.
- [ ] `prefers-reduced-motion`: không còn animation nào chạy.

---

## B7. Bàn giao
1. `git push origin main`.
2. Báo cáo cuối gồm:
   - danh sách commit SHA và kết quả B6;
   - **copy mới chờ duyệt** (Phụ lục A);
   - các điểm còn mở: `guides` vẫn noindex tới khi có bài viết riêng; dòng "Đảm bảo hàng hóa 100%" trong `pricing.vnJp.clean.features` chờ chủ site quyết (Review §1.3);
   - **ghi chú cho người làm design system:** những class CSS không còn dùng (`.page-hero`, `.heading-1` nếu không còn chỗ nào dùng) và những class mới phát sinh trong đợt này.

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
