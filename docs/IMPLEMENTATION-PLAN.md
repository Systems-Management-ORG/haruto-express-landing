# HARUTO EXPRESS — Implementation Plan (S8 → S13)

> Kế hoạch triển khai sau audit ngày 2026-11-11 (HEAD `1b70540`).
> Đọc kèm `docs/SEO-ROADMAP.md` (nguyên tắc chung §0 vẫn áp dụng).
> Mỗi task có: **file**, **việc cần làm**, **tiêu chí xong (DoD)**. Tick `[x]` khi hoàn thành.

---

## 0. Cách dùng file này

```bash
git checkout main && git pull origin main   # làm trực tiếp trên main, không tạo branch
npm ci
npm run dev
```

**Prompt mẫu cho Claude Code** (mỗi session):

```
Đọc docs/SEO-ROADMAP.md (§0) và docs/IMPLEMENTATION-PLAN.md.
Thực hiện Session S08 trực tiếp trên nhánh main (không tạo branch mới).
Làm lần lượt từng task, commit nhỏ theo task (message: "S08-T1: ..."), push origin main sau mỗi task đã pass typecheck.
Không bịa thông tin doanh nghiệp; giá trị chưa có → để rỗng trong business.ts và không render.
Kết thúc: npm run typecheck && npm run build && npm run seo:check phải sạch,
tick checkbox trong IMPLEMENTATION-PLAN.md và thêm 1 dòng Changelog vào SEO-ROADMAP.md.
```

**Kiểm tra bắt buộc cuối mỗi session**

```bash
npm run typecheck
npm run build
npm run seo:check         # SEO_CHECK_SKIP_BUILD=1 để chạy nhanh khi đã build
```

**Quy ước nhánh**: mọi session làm trực tiếp trên `main` (thay cho quy tắc branch `seo/sNN-*` ở SEO-ROADMAP §0.6). Vì main đi thẳng production, chỉ push khi `typecheck` + `build` pass; task lớn chia nhiều commit nhỏ để dễ `git revert`.

**Thứ tự đề xuất**: S08 → S09 → S10 → S11 → S06 → S12 → S13. S08 nên làm trước vì site đã live và đang được index.

---

## 1. Blocker — cần chủ site trả lời (không code thay được)

| ID | Câu hỏi | Chặn task |
|---|---|---|
| B1 | Bản dịch JA/EN đã được người biết tiếng review chưa? Nếu chưa → tạm noindex JA/EN | S08-T1 — ✅ đã review (2026-11-11) |
| B2 | ~~Bảng giá hàng sạch thiếu mốc 21–49 kg~~ ✅ 21–50 kg = 95.000 VNĐ/kg (2026-11-11). Còn lại: hàng hỗn hợp chỉ tới 30 kg — trên 30 kg tính thế nào? | S10 |
| B3 | Tên pháp lý + mã số thuế | S08-T4, S11 |
| B4 | VP 340/16 Quang Trung (HCM) và kho 60 Trương Công Giai (HN) có đón khách không? Giờ làm việc? | S08-T4 — ✅ HN + HCM đón khách, T2–T7 9:00–17:00 |
| B5 | Thời gian vận chuyển dự kiến mỗi chiều | S10, S11 |
| B6 | 10–12 câu hỏi thật khách hay hỏi qua Zalo/Messenger | S08-T7 |
| B7 | Kênh nhận thông báo lead (Telegram bot / email / Zalo OA) | S12-T2 |
| B8 | Nội dung chính sách bảo mật / điều khoản (hoặc đồng ý dùng bản khung để luật sư duyệt) | S11 |

Ghi câu trả lời vào `src/shared/seo/business.ts` hoặc `src/i18n/messages/*.json`, không ghi vào file này.

---

## S08 — Sửa data layer SEO

### [x] S08-T1 · Indexable theo từng locale
- **File**: `src/shared/seo/pages.ts`, `src/shared/seo/metadata.ts`, `src/app/sitemap.ts`, `src/app/[locale]/layout.tsx`
- **Việc**:
  - Thêm vào `PageDef`: `indexableLocales?: Locale[]` (mặc định = tất cả locale khi `indexable: true`).
  - Helper `isIndexable(key, locale): boolean` trong `pages.ts`.
  - `buildPageMetadata` dùng `isIndexable` thay vì `def.indexable`.
  - `sitemap.ts` chỉ phát URL có `isIndexable === true`; **hreflang trong sitemap và trong `<head>` chỉ liệt kê các locale indexable** (giữ cluster đối xứng).
  - Hằng `REVIEWED_LOCALES` (tạm `["vi"]` nếu B1 = chưa review) dùng làm mặc định.
- **DoD**: với `REVIEWED_LOCALES=["vi"]`: sitemap còn 11 URL, `/ja/*` có `noindex, follow`, hreflang của `/vi/*` không trỏ sang JA/EN. Đổi lại `["vi","ja","en"]` → 33 URL như hiện tại.

### [x] S08-T2 · `lastModified` thật trong sitemap
- **File**: `pages.ts`, `sitemap.ts`
- **Việc**: thêm `updatedAt: "YYYY-MM-DD"` cho mỗi `PageDef` (lấy ngày commit gần nhất chạm nội dung trang đó: `git log -1 --format=%cs -- <file>`). Sitemap dùng `new Date(def.updatedAt)`. Ghi chú trong `pages.ts`: "đổi nội dung → cập nhật updatedAt".
- **DoD**: `/sitemap.xml` có lastmod khác nhau giữa các trang, không còn đổi theo mỗi lần build.

### [x] S08-T3 · Home dùng chung `buildPageMetadata`
- **File**: `src/app/[locale]/page.tsx`, `src/app/[locale]/layout.tsx`, `src/i18n/messages/*.json`
- **Việc**:
  - Chuyển `meta.title` / `meta.description` sang `pages.home.metaTitle` / `pages.home.metaDescription` (3 locale), xóa namespace `meta` nếu không còn ai dùng.
  - `page.tsx` export `generateMetadata` → `buildPageMetadata(locale, "home")`.
  - `layout.tsx` chỉ giữ `metadataBase`, `viewport`, icons; bỏ `languageAlternates` hard-code, bỏ canonical/robots/OG ở layout.
- **DoD**: view-source `/vi`, `/vi/bang-gia` cho canonical + hreflang + robots sinh từ cùng một hàm; `seo:check` sạch.

### [x] S08-T4 · Organization đầy đủ + LocalBusiness có điều kiện
- **File**: `src/shared/seo/business.ts`, `src/shared/seo/json-ld.tsx`
- **Việc**:
  - `LOCATIONS[]` thêm trường có cấu trúc: `streetAddress`, `addressLocality`, `addressRegion`, `postalCode`, `addressCountry` (`"VN"`/`"JP"`), `geo?`, `publicVisit: boolean` (mặc định `false` — chờ B4), `openingHours?: string[]`.
  - `organization()` thêm `address` (mảng `PostalAddress` từ `LOCATIONS`), `legalName` khi có (B3).
  - Hàm mới `localBusiness(location)` → chỉ render cho location có `publicVisit: true`, `@type: ["LocalBusiness","MovingCompany"]` hoặc `"LocalBusiness"`, `parentOrganization: { "@id": ORG_ID }`.
- **DoD**: Rich Results Test / validator.schema.org không lỗi; khi `publicVisit` đều `false` thì không có node LocalBusiness.

### [x] S08-T5 · Mở index trang Liên hệ + `ContactPage`
- **File**: `pages.ts`, `src/app/[locale]/[...rest]/page.tsx`, `src/shared/seo/schema.ts`
- **Việc**: `contact.indexable = true`; thêm `contactPage()` trong `schema.ts` (`@type: ContactPage`, `mainEntity: { "@id": ORG_ID }`); render khi `key === "contact"`. Kiểm tra trang có ≥300 từ (thêm đoạn giới thiệu kênh liên hệ / giờ làm nếu thiếu).
- **DoD**: `/vi/lien-he` vào sitemap, có JSON-LD ContactPage + BreadcrumbList.

### [x] S08-T6 · Service có `offers` từ dữ liệu thật
- **File**: `src/shared/seo/schema.ts`, `[...rest]/page.tsx`, `src/i18n/messages/*.json`
- **Việc**:
  - Tách số liệu giá khỏi chuỗi hiển thị: thêm `src/modules/landing/pricing-data.ts` (dùng chung với S10) xuất `VN_JP_CLEAN`, `VN_JP_MIXED`, `JP_VN` dạng `{ minKg, maxKg, vndPerKg | null }`. Chuỗi trong messages giữ nguyên để hiển thị; thêm test nhỏ (script) so khớp số trong chuỗi với `pricing-data.ts`.
  - `service()` nhận `offers?` → `Offer` + `UnitPriceSpecification` (`priceCurrency: "VND"`, `price`, `unitCode: "KGM"`, `referenceQuantity`). Chỉ gắn cho `shipToJapan` (giá thấp nhất hàng sạch), `shipToVietnam` (155.000), `pricing` (cả hai).
  - `serviceType` dùng giá trị cố định tiếng Anh theo key (vd `"Air freight Vietnam to Japan"`) thay vì lấy title.
- **DoD**: validator không lỗi; không có con số nào không xuất hiện trong bảng giá hiển thị.

### [ ] S08-T7 · FAQ mở rộng + FAQ theo trang — hạ tầng xong (`pages` + `Faq page`), chờ B6 để đủ ≥10 câu
- **File**: `src/i18n/messages/*.json` (`faq.items`), `src/modules/landing/components/faq.tsx`, `pages.ts`
- **Việc**:
  - `faq.items` thêm trường `pages: PageKey[]` (câu hỏi thuộc trang nào). Mở rộng lên 10–12 câu từ B6 (**không tự viết câu trả lời về giá/thời gian chưa có nguồn**).
  - `Faq` nhận prop `page?: PageKey` → lọc câu hỏi; trang dịch vụ hiển thị 3–4 câu liên quan, `/cau-hoi-thuong-gap` hiển thị tất cả.
  - FAQPage JSON-LD chỉ phát ở `/cau-hoi-thuong-gap` (tránh trùng lặp).
- **DoD**: trang FAQ ≥10 câu; mỗi trang dịch vụ có block FAQ riêng.

### [x] S08-T8 · OG image theo trang + robots
- **File**: `metadata.ts`, `src/shared/seo/page-media.ts`, `src/app/robots.ts`
- **Việc**: `openGraph.images` lấy từ `PAGE_IMAGES[key]` (fallback `/og/haruto-og.png`); tạo bản 1200×630 nếu ảnh gốc khác tỉ lệ (có thể dùng `opengraph-image.tsx` của Next hoặc xuất sẵn bằng `sharp` vào `public/og/<key>.webp`). `robots.ts` thêm `disallow: ["/api/"]`.
- **DoD**: Facebook Sharing Debugger hiển thị ảnh khác nhau cho từng trang; `/robots.txt` có `Disallow: /api/`.

---

## S09 — Analytics v2 + Consent

### [ ] S09-T1 · Chuẩn hóa schema event
- **File**: `src/shared/analytics/analytics-events.tsx`, mọi component có `data-track`
- **Việc**:
  - Thay tên event động bằng event cố định + tham số qua data-attribute:
    ```html
    <a data-track="contact_click" data-channel="zalo|facebook|hotline|form"
       data-detail="vietnam|japan" data-location="header|fab|hero|section|footer|form_success">
    ```
  - Listener đọc `dataset` → `dataLayer.push({ event, contact_channel, contact_detail, cta_location, page_key, page_locale })`.
  - Giữ `cta_contact` cho nút dẫn sang trang liên hệ (thêm `cta_location`).
  - Viết bảng event vào `docs/ANALYTICS.md` (tên, tham số, nơi bắn).
- **DoD**: không còn `click_hotline_<id>`; grep `data-track=` đều có `data-location`.

### [ ] S09-T2 · Ngữ cảnh trang trong dataLayer
- **File**: `src/app/[locale]/layout.tsx`, `[...rest]/page.tsx`, component mới `src/shared/analytics/page-context.tsx`
- **Việc**: render `<PageContext pageKey locale pageType />` đẩy `{ event: "page_context", page_key, page_locale, page_type: "home|service|info|contact" }` trước `gtm.js` (hoặc qua `window.__pageContext`). Thêm `pageType` vào `PageDef`.
- **DoD**: GTM Preview thấy biến `page_key` trên mọi trang.

### [ ] S09-T3 · Funnel form
- **File**: `src/modules/landing/components/contact-form.tsx`
- **Việc**: `form_start` (lần focus đầu), `form_submit`, `form_error` (`error_reason: invalid|rate_limited|upstream|not_configured|network`), `generate_lead` kèm `lead_kind`, `route`, `weight_bucket` (`<5|5-20|20-100|>100`). **Không đẩy tên/điện thoại/email.**
- **DoD**: 4 event xuất hiện đúng thứ tự trong GTM Preview.

### [ ] S09-T4 · Event tương tác nội dung
- **Việc**: `faq_expand` (câu hỏi index), `open_map` (location id), `view_pricing` (IntersectionObserver khi bảng giá vào 50% viewport, 1 lần/trang), `select_route` (khi đổi chiều trong máy tính cước S10).
- **DoD**: event bắn 1 lần/hành động, không bắn khi hydrate.

### [ ] S09-T5 · Consent Mode v2 + banner
- **File**: `src/shared/analytics/google-tag-manager.tsx`, component mới `src/shared/analytics/consent-banner.tsx`, messages `consent.*` (3 locale)
- **Việc**:
  - Trước snippet GTM: `gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500})`.
  - Banner 2 nút ngang hàng (Đồng ý / Từ chối) + link chính sách bảo mật (S11); lưu lựa chọn `localStorage` (bọc try/catch) → `gtag('consent','update',…)`.
  - Nút "Cài đặt cookie" ở footer để đổi lựa chọn.
  - Không chặn tương tác trang, a11y: `role="dialog"`, focus không bị bẫy.
- **DoD**: trước khi đồng ý, GA4 chỉ gửi ping không cookie (kiểm tra tab Network: `gcs=G100`); sau đồng ý `gcs=G111`.

### [ ] S09-T6 · Cấu hình GTM/GA4 (ngoài code)
- **Việc**: export container GTM sau khi sửa → lưu `docs/gtm-container.json`. Trong GA4: đánh dấu `generate_lead`, `contact_click` là Key events; custom dimensions `page_key`, `cta_location`, `contact_channel`; liên kết Search Console.
- **DoD**: checklist trong `docs/ANALYTICS.md` được tick.

---

## S10 — Máy tính cước

> Chặn bởi **B2** (mốc giá thiếu). Có thể code trước với mốc thiếu hiển thị "Liên hệ báo giá".

### [ ] S10-T1 · Dữ liệu giá có cấu trúc
- **File**: `src/modules/landing/pricing-data.ts` (tạo ở S08-T6 nếu chưa có)
- **Việc**: kiểu `Tier = { minKg: number; maxKg: number | null; vndPerKg: number | null; perParcelFee?: number }`; `null` = thương lượng. Hằng `VOLUMETRIC_DIVISOR = 6000`, `BULKY_SUM_CM = 140`, `BULKY_KG = 30`.
- **DoD**: dữ liệu khớp 100% bảng hiển thị (script kiểm tra ở S08-T6 pass).

### [ ] S10-T2 · Hàm tính thuần (pure)
- **File**: `src/modules/landing/calc/shipping.ts` + `scripts/test-shipping.mjs` (chạy bằng `node`, không cần thêm package)
- **Việc**:
  - `roundWeight(kg)`: <1 → 1; còn lại làm tròn 1 chữ số thập phân theo quy ước (3,04 → 3; 3,05 → 3,1).
  - `volumetricKg(l,w,h) = l*w*h/6000`.
  - `chargeableKg = max(actual, volumetric)` khi kiện cồng kềnh (tổng 3 chiều >140 cm hoặc >30 kg) — **xác nhận với chủ site**: có áp cân thể tích cho mọi kiện hay chỉ kiện cồng kềnh? Code theo nội dung `policy.weight.bulky` hiện tại.
  - `quote({ route, goodsType, weightKg, dims? }) → { chargeableKg, tier, unitPrice, subtotal, surcharges[], total | null, needsQuote: boolean }`.
- **DoD**: `node scripts/test-shipping.mjs` pass với ≥12 ca (biên mốc, <1 kg, cồng kềnh, >500 kg, mốc thiếu → `needsQuote`).

### [ ] S10-T3 · Component UI
- **File**: `src/modules/landing/components/shipping-calculator.tsx` (client), messages `calculator.*` 3 locale
- **Việc**: chọn tuyến (VN→JP / JP→VN) → loại hàng (sạch/hỗn hợp, chỉ VN→JP) → cân nặng → tùy chọn kích thước D×R×C. Kết quả: cân tính cước, đơn giá, phụ thu, tổng tạm tính, dòng "Giá tham khảo, nhân viên xác nhận khi nhận hàng". Nút: **"Gửi yêu cầu với thông tin này"** (điền sẵn form liên hệ qua query `?route=&kg=` — đọc trong `ContactForm`) và **"Hỏi qua Zalo"**.
- Style dùng class hiện có (`card`, `field`, `btn`), `aria-live="polite"` cho kết quả, input `inputMode="decimal"`.
- **DoD**: dùng được bằng bàn phím; mobile 360px không tràn ngang.

### [ ] S10-T4 · Gắn vào trang + đo lường
- **Việc**: đặt ở `/bang-gia` (đầu trang, dưới PageHero), rút gọn trên home trong `PricingTeaser` (link "Tính cước ngay"), trên 2 trang tuyến. Event `calculator_use` (`route`, `goods_type`, `weight_bucket`, `needs_quote`) và `calculator_to_lead`.
- Cập nhật `pages.pricing.metaDescription` nhắc "tính cước online".
- **DoD**: `seo:check` sạch; LCP `/bang-gia` không xấu đi (component client nằm dưới fold hoặc nhẹ <15 KB).

---

## S11 — Trang tin cậy (E-E-A-T + pháp lý)

### [ ] S11-T1 · Thêm key mới vào registry
- `about` → `/vi/gioi-thieu` · `/about`
- `privacy` → `/vi/chinh-sach-bao-mat` · `/privacy-policy` (indexable, priority 0.3)
- `terms` → `/vi/dieu-khoan-dich-vu` · `/terms-of-service` (priority 0.3)
- Thêm vào footer (cột "Về HARUTO"), không vào mega-nav trừ `about`.

### [ ] S11-T2 · Trang Giới thiệu
- **Nội dung** (chỉ từ dữ liệu có thật): câu chuyện/thời gian hoạt động, 3 địa điểm + ảnh kho thật đã có, quy trình, kênh liên hệ, tên pháp lý/MST (B3) khi có. Schema `AboutPage`.

### [ ] S11-T3 · Chính sách bảo mật + Điều khoản
- Khung nội dung theo Nghị định 13/2023/NĐ-CP (VN) và APPI (JP): dữ liệu thu thập qua form (họ tên, SĐT, email, mô tả hàng), mục đích, lưu ở Google Sheet, thời gian lưu, quyền của chủ thể dữ liệu, cookie/GA4 (liên kết S09-T5), liên hệ.
- Đánh dấu rõ "Bản khung — cần pháp chế duyệt" bằng `indexable: false` tới khi B8 xong.
- Checkbox đồng ý trong `ContactForm` link tới trang này (mở tab mới).

### [ ] S11-T4 · Testimonial (khi có dữ liệu)
- Component `testimonials.tsx` đọc từ messages; **chỉ render khi mảng không rỗng**. Không dùng `AggregateRating`/`Review` schema cho đánh giá tự đăng (Google không chấp nhận self-serving review).

---

## S06 — Guides / Blog

### [ ] S06-T1 · Route 2 cấp
- **File**: `src/app/[locale]/[...rest]/page.tsx` hoặc route riêng `src/app/[locale]/[guides]/[slug]/page.tsx`
- **Việc**: hỗ trợ `rest.length === 2` khi `rest[0] === PAGES.guides.slugs[locale]`; `generateStaticParams` sinh thêm `[guidesSlug, articleSlug]`.
- **DoD**: `/vi/huong-dan/<slug>` build tĩnh, slug lạ → 404.

### [ ] S06-T2 · Kho nội dung không cần package
- **File**: `src/content/guides/<locale>/<slug>.ts` xuất `{ slug, title, metaTitle, metaDescription, datePublished, dateModified, cover, blocks: Block[] }`, `Block` = `h2 | p | ul | ol | table | image | callout | cta`.
- Renderer `src/modules/guides/article-body.tsx` (an toàn, không `dangerouslySetInnerHTML`).
- Registry bài viết `src/content/guides/index.ts` có cờ `indexable`.

### [ ] S06-T3 · Listing + Article schema + sitemap
- `/vi/huong-dan`: danh sách bài (indexable khi có ≥3 bài đã duyệt).
- `article()` trong `schema.ts`: `headline`, `datePublished`, `dateModified`, `image`, `author`/`publisher` → Organization.
- Sitemap thêm bài viết với `lastModified = dateModified`; breadcrumb Home › Hướng dẫn › Bài.

### [ ] S06-T4 · 3 bài khung (indexable:false tới khi chủ site duyệt)
1. Cách đóng gói hàng gửi đi Nhật (dùng `policy.tips`, phí thùng xốp)
2. Cách tính cân hàng cồng kềnh (dùng `policy.weight` + link máy tính cước S10)
3. Hàng cấm và hàng không đảm bảo khi gửi đi Nhật (dùng `customs.*`)
- Mỗi bài link ≥2 trang dịch vụ, mỗi trang dịch vụ liên quan link ngược lại.

---

## S12 — Lead ops & hạ tầng

### [ ] S12-T1 · Rate-limit bền vững
- **File**: `src/app/api/leads/route.ts`
- **Việc**: map in-memory chỉ đúng trên 1 instance. Phương án không thêm hạ tầng: chuyển kiểm tra trùng/flood sang Apps Script (`leads.gs` dùng `CacheService` theo hash IP/SĐT, 5 lần/10 phút). Giữ lớp in-memory làm lớp ngoài.
- **DoD**: gửi 6 lần liên tiếp → lần 6 trả `429` kể cả khi deploy nhiều instance.

### [ ] S12-T2 · Thông báo lead tức thì (theo B7)
- Gửi từ `leads.gs` sau khi ghi Sheet (Telegram Bot API / MailApp / Zalo OA). Token để trong Script Properties, không commit.
- **DoD**: sale nhận thông báo <1 phút sau khi gửi form.

### [ ] S12-T3 · Prefill form từ query
- `ContactForm` đọc `?route=VN_JP|JP_VN&kg=&type=` (từ S10) → điền sẵn; lưu `page` + `cta_location` nguồn vào lead để biết trang nào ra đơn.

### [ ] S12-T4 · CI
- **File**: `.github/workflows/ci.yml`
- **Việc**: trên PR: `npm ci` → `typecheck` → `build` → `seo:check` (SEO_CHECK_SKIP_BUILD=1). Fail nếu `seo:check` có error.
- **DoD**: PR mới hiện check xanh/đỏ.

---

## S13 — Hiệu năng & QA launch

### [ ] S13-T1 · Ảnh LCP
- `concierge.tsx`: hiện cả ảnh desktop lẫn mobile đều `priority` → dùng `getImageProps` + `<picture>` (art direction) để chỉ 1 ảnh được preload.
- Chuyển `public/images/haruto/muaho-desktop.png` (1.5 MB) và `muaho-mobile.png` (2.2 MB) sang WebP bằng `sharp` (đã có trong devDependencies); cập nhật `page-media.ts`.
- Rà mọi `priority`: mỗi trang đúng 1 ảnh LCP + logo header.

### [ ] S13-T2 · Link nội bộ dùng `next/link`
- Header, footer, `RelatedLinks`, service cards, breadcrumbs: `<a href={pagePath(...)}>` → `<Link>` (giữ `data-track`).

### [ ] S13-T3 · Đo & ngân sách
- Lighthouse mobile cho `/vi`, `/vi/bang-gia`, `/vi/mua-ho-hang-nhat`, `/vi/gui-hang-di-nhat`: SEO ≥95, Best Practices ≥90, Performance ≥80, CLS <0.1. Ghi kết quả vào Changelog.
- GSAP/film grain: kiểm tra `prefers-reduced-motion` và INP <200 ms.

### [ ] S13-T4 · Checklist ngoài code
- [ ] `www.harutoexpress.com` → 301 → `https://harutoexpress.com` (kiểm: `curl -I https://www.harutoexpress.com/vi`)
- [ ] Search Console: verify domain (DNS), submit sitemap, URL Inspection 5 trang chính
- [ ] Google Business Profile cho địa điểm đón khách (nếu B4 = có)
- [ ] NAP thống nhất trên Zalo OA, Facebook Page, GBP, footer
- [ ] Theo dõi 4 tuần: Coverage, truy vấn chính (gửi hàng đi Nhật, ship hàng Nhật về VN, mua hộ hàng Nhật, đấu giá hộ Nhật)

---

## Tổng quan tiến độ

| Session | Phụ thuộc | Trạng thái |
|---|---|---|
| S08 Data layer SEO | B1, B3, B4, B6 (một phần) | 🟡 7/8 xong; T7 chờ B6 (câu hỏi), T4 chờ B3/B4 (dữ liệu) |
| S09 Analytics + consent | S11-T3 (link chính sách) | ⬜ |
| S10 Máy tính cước | B2, S08-T6 | ⬜ |
| S11 Trang tin cậy | B3, B8 | ⬜ |
| S06 Guides | S10 (link) | ⬜ |
| S12 Lead ops + CI | B7 | ⬜ |
| S13 Hiệu năng + launch | tất cả | ⬜ |
