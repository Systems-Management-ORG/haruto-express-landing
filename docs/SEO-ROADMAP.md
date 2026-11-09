# HARUTO EXPRESS — SEO Roadmap (multi-page)

Tài liệu tham chiếu cho các session Claude Code. Mỗi session đọc file này trước khi code.
Snapshot: commit `4e6b080` (2026-11-09). Site live tại https://harutoexpress.com (apex, đã bỏ noindex).

---

## 0. Nguyên tắc chung (áp dụng mọi session)

1. **Không bịa thông tin doanh nghiệp.** Số điện thoại, Zalo, địa chỉ VN, tên pháp lý, thời gian giao: nếu chưa có trong `src/i18n/messages/*.json` thì để `TODO` trong file cấu hình `src/shared/seo/business.ts` và **không render** ra UI/JSON-LD khi giá trị rỗng.
2. **Trang thiếu nội dung thì không index.** Mỗi trang có cờ `indexable` trong registry. `indexable: false` → `robots: noindex, follow` và không có trong sitemap.
3. **Không nhân bản nội dung giữa ngôn ngữ.** Một trang chỉ được generate cho locale đã có bản dịch thật. Locale thiếu bản dịch → 404, không fallback sang tiếng Việt. hreflang chỉ liệt kê các locale đang tồn tại.
4. **Một nguồn sự thật:** mọi URL, title, hreflang, sitemap, breadcrumb đều đi ra từ `src/shared/seo/pages.ts`. Không hard-code URL ở component.
5. Giữ nguyên style hiện có (Tailwind v4, class `wrap`, `heading-2`, `card`, `btn`…), GSAP reveal (`data-reveal`), a11y (skip link, aria), CSP trong `next.config.ts`.
6. Mỗi session: `git pull` main trước, làm trên branch riêng `seo/sNN-<tên>`, commit nhỏ theo bước. `npm run typecheck && npm run build` phải pass. Cuối session ghi tóm tắt vào mục **Changelog**, rồi báo kết quả và **hỏi trước khi merge vào main/push** (nếu main tự deploy lên harutoexpress.com thì merge = lên production).

---

## 1. Hiện trạng (audit)

### Đã làm tốt
- `lang` theo locale, metadata riêng VI/JA/EN, `metadataBase` + `og:image` đã hoạt động trên live.
- Ảnh WebP qua `next/image`, tên file ảnh có từ khóa, 404 trả `noindex`.
- Security headers + CSP đã mở cho GTM/GA4 (`GTM-PL7NKB8J`).
- Nội dung thật đã có: bảng giá VN→JP (hàng sạch / hỗn hợp), bảng giá JP→VN (`pricing.freight`), phụ phí, chính sách cân nặng, đền bù, mua hộ/đấu giá hộ/vận chuyển hộ, địa chỉ kho Nhật.

### Vấn đề — theo mức độ
| # | Mức | Vấn đề | Vị trí |
|---|---|---|---|
| 1 | 🔴 | Không có `sitemap.xml`; `robots.ts` không trỏ sitemap | `src/app/robots.ts` |
| 2 | 🔴 | Không có canonical, không có hreflang (`alternateLinks: false`) dù có 3 ngôn ngữ và `/` redirect theo trình duyệt | `src/i18n/routing.ts`, `layout.tsx` |
| 3 | 🔴 | Không có JSON-LD (Organization, Service, BreadcrumbList, FAQPage) | — |
| 4 | 🔴 | Site **đã index** nhưng FAQ vẫn ghi "Bảng giá chính thức đang chờ cập nhật" (mâu thuẫn bảng giá), kênh liên hệ "Chờ cập nhật", form ghi "chưa nhận yêu cầu" → tín hiệu tin cậy kém | `vi/ja/en.json` (`faq`, `contact`) |
| 5 | 🟠 | H1 = slogan "Khoảng cách xa, kết nối gần." không chứa từ khóa; slide 2–3 sinh thêm H2 | `hero.tsx` |
| 6 | 🟠 | Title đặt brand trước, dùng cụm "vận chuyển hàng không" thay vì cụm người dùng gõ ("gửi hàng đi Nhật", "ship hàng Nhật về VN") | `meta` trong messages |
| 7 | 🟠 | **Cả site chỉ 3 URL** (1 trang × 3 ngôn ngữ). Menu toàn anchor `#`. Một URL không thể xếp hạng cho bảng giá, hàng cấm, mua hộ, địa chỉ kho… cùng lúc | `site-header.tsx`, `landing-page.tsx` |
| 8 | 🟠 | Chưa có thời gian vận chuyển dự kiến cho cả hai chiều (khách hay hỏi, nên có trên trang dịch vụ) | — |
| 9 | 🟡 | 3 ảnh hero đều tải eager; ảnh kho `alt=""` | `hero.tsx`, `routes.tsx` |
| 10 | 🟡 | Language switcher link cứng `/${locale}` + hash → sẽ sai khi có trang con | `site-header.tsx` |
| 11 | 🟡 | Chưa có event đo chuyển đổi (click Zalo/hotline/messenger, submit form) | — |
| 12 | 🟡 | Chưa có `apple-icon`, `manifest` | `src/app` |

---

## 2. Kiến trúc đích

### 2.1 Sitemap & từ khóa (VI là ưu tiên)

> Từ khóa là ước đoán theo hành vi tìm kiếm phổ biến; kiểm tra volume bằng Keyword Planner / Ahrefs trước khi chốt copy.

| key | VI path | JA/EN path | Từ khóa chính (VI) | Nguồn nội dung | Trạng thái nội dung |
|---|---|---|---|---|---|
| `home` | `/vi` | `/ja`, `/en` | gửi hàng đi Nhật, chuyển phát Việt Nhật | hero, why, services, process (tóm tắt) + link sang trang con | Có |
| `shipToJapan` | `/vi/gui-hang-di-nhat` | `/shipping-vietnam-to-japan` | gửi hàng đi Nhật, ship hàng sang Nhật | services.personal, pricing.vnJp (tóm tắt), process | Có |
| `shipToVietnam` | `/vi/ship-hang-nhat-ve-viet-nam` | `/shipping-japan-to-vietnam` | ship hàng Nhật về Việt Nam, gửi hàng từ Nhật về VN | pricing.freight (155.000 ₫/kg, tỷ giá mua hộ), process, kho Nhật | Có |
| `pricing` | `/vi/bang-gia` | `/pricing` | giá gửi hàng đi Nhật 1kg, bảng giá ship Nhật | pricing.vnJp, pricing.freight (JP→VN), surcharge | Có (cả 2 chiều) |
| `goods` | `/vi/hang-nhan-va-hang-cam` | `/accepted-and-prohibited-items` | hàng cấm gửi đi Nhật, gửi thực phẩm đi Nhật | pricing.vnJp.clean/mixed desc, process.notes | Có (cần mở rộng) |
| `policy` | `/vi/chinh-sach-van-chuyen` | `/shipping-policy` | cách tính cân hàng cồng kềnh, đền bù thất lạc | policy.weight, policy.compensation | Có |
| `concierge` | `/vi/mua-ho-hang-nhat` | `/japan-buying-service` | mua hộ hàng Nhật, đấu giá hộ Nhật | policy.concierge | Có (mỏng) |
| `japanWarehouse` | `/vi/dia-chi-kho-nhat` | `/japan-warehouse` | địa chỉ kho Nhật, cách gửi hàng về kho | policy.warehouse, policy.tips | Có |
| `business` | `/vi/doanh-nghiep` | `/business` | vận chuyển hàng thương mại Việt Nhật | services.business | Mỏng → `indexable:false` tới khi bổ sung |
| `faq` | `/vi/cau-hoi-thuong-gap` | `/faq` | — (long-tail) | faq (mở rộng 8–12 câu) | Cần viết thêm |
| `contact` | `/vi/lien-he` | `/contact` | haruto express liên hệ | contact | **Thiếu NAP** → `indexable:false` |
| `guides` | `/vi/huong-dan` (+ `/[slug]`) | `/guides` | đóng gói, thuế, thông quan… | MDX/JSON mới | Session 6 |

JA ưu tiên khách Nhật/doanh nghiệp (ベトナム 発送, ベトナム 航空便). JA/EN chỉ bật cho trang đã dịch & review.

### 2.2 Cấu trúc code đích

```
src/
  app/
    [locale]/
      layout.tsx            # html/body + Header/Footer dùng chung + JSON-LD Organization/WebSite
      page.tsx              # home (hub)
      (pages)/              # thư mục theo pathname nội bộ; slug VI khai báo trong routing.pathnames
        ship-to-japan/page.tsx
        ship-to-vietnam/page.tsx
        pricing/page.tsx
        goods/page.tsx
        policy/page.tsx
        concierge/page.tsx
        japan-warehouse/page.tsx
        business/page.tsx
        faq/page.tsx
        contact/page.tsx
        guides/page.tsx
        guides/[slug]/page.tsx
      [...rest]/page.tsx
    sitemap.ts
    robots.ts
    manifest.ts
  i18n/
    routing.ts              # thêm `pathnames` map key nội bộ → slug theo locale
    navigation.ts           # createNavigation(routing): Link, getPathname, redirect
  shared/
    seo/
      pages.ts              # PAGE REGISTRY: key, pathname nội bộ, locales khả dụng, indexable, priority, changeFrequency, parent (breadcrumb)
      business.ts           # tên, logo, phone, zalo, messenger, address VN/JP, sameAs — giá trị rỗng = không render
      metadata.ts           # buildPageMetadata({ locale, key, namespace }) → title, description, canonical, alternates.languages (+x-default), openGraph, robots
      json-ld.tsx           # <JsonLd data={...} /> (script type application/ld+json, an toàn với CSP vì là data block)
      schema.ts             # organization(), website(), service(), breadcrumb(), faqPage(), article()
    components/
      page-hero.tsx         # hero tĩnh cho trang con: H1 + intro + breadcrumb
      breadcrumbs.tsx
      related-links.tsx     # internal linking cuối mỗi trang
  modules/landing/components/  # các section hiện có, tái sử dụng trong nhiều trang
```

Ghi chú next-intl: dùng `pathnames` + `localePrefix: "always"`; thư mục route theo **pathname nội bộ** (tiếng Anh), slug tiếng Việt khai báo trong `routing.pathnames`. Bật lại `alternateLinks` chỉ khi đã chắc chắn header Link khớp với hreflang trong `<head>`; nếu không thì để `false` và chỉ dùng `alternates` trong metadata (khuyên dùng cách này).

### 2.3 Quy tắc on-page cho mỗi trang
- 1 H1 duy nhất chứa từ khóa chính; H2 cho section; không nhảy bậc heading.
- Title ≤ 60 ký tự: `<Từ khóa chính> | HARUTO EXPRESS`. Description 140–160 ký tự, có lợi ích + CTA.
- Canonical tự trỏ chính nó (absolute, không query, không hash). hreflang đối xứng giữa các locale tồn tại + `x-default` → bản VI.
- Breadcrumb hiển thị + `BreadcrumbList` JSON-LD (trừ home).
- Tối thiểu ~300 từ nội dung hữu ích cho trang `indexable:true`; cuối trang có `RelatedLinks` (2–4 trang liên quan) + CTA liên hệ.
- Ảnh: `alt` mô tả thật; chỉ ảnh LCP dùng `priority`.

### 2.4 JSON-LD
- Layout: `Organization` (name, url, logo, `contactPoint` nếu có phone, `sameAs` nếu có) + `WebSite` (name, url, inLanguage).
- Trang dịch vụ: `Service` (serviceType, provider → Organization @id, areaServed: VN, JP). Bảng giá: có thể thêm `offers` với `PriceSpecification` từ dữ liệu bảng giá — chỉ khi số liệu lấy từ messages, không bịa.
- FAQ: `FAQPage` (Google hiện hầu như không còn hiển thị rich result FAQ cho site thương mại, nhưng vẫn hợp lệ, không hại).
- Guides: `Article` (headline, datePublished, dateModified, author/publisher).
- `LocalBusiness`: **chỉ** dùng khi xác nhận địa chỉ là nơi khách đến được. Địa chỉ kho Nhật hiện là điểm nhận hàng → mặc định đưa vào `Organization.address`/trang kho, không khai báo LocalBusiness cho tới khi chủ site xác nhận.

---

## 3. Nội dung cần chủ site cung cấp (blocker)

- [ ] Hotline, Zalo (số/OA link), Messenger link, email
- [ ] Địa chỉ VN (nếu có văn phòng/kho), giờ làm việc
- [ ] Tên pháp lý / mã số doanh nghiệp (cho footer + Organization)
- [ ] Thời gian vận chuyển dự kiến mỗi chiều
- [ ] 8–12 câu FAQ thật từ Zalo/Messenger
- [ ] Facebook Page / Zalo OA URL (`sameAs`)
- [ ] Review bản dịch JA/EN
- [ ] Xác nhận domain chính: apex `harutoexpress.com` (www → 301 về apex ở hosting/DNS)

---

## 4. Kế hoạch session

| Session | Mục tiêu | Phụ thuộc |
|---|---|---|
| S1 | SEO kỹ thuật cho trang hiện tại (hotfix, vì đã index) | — |
| S2 | Hạ tầng đa trang: registry, pathnames, layout chung, metadata helper, breadcrumb, nav, language switcher | S1 |
| S3 | Trang dịch vụ: ship-to-japan, ship-to-vietnam, business | S2 |
| S4 | Trang thông tin: pricing, goods, policy, japan-warehouse | S2 |
| S5 | concierge, faq, contact + home thành hub + internal linking | S3, S4 |
| S6 | Hướng dẫn/blog (guides) + Article schema | S2 |
| S7 | QA, đo lường (dataLayer events), hiệu năng, checklist launch | S5 |

Chi tiết tiêu chí hoàn thành:

### S1 — Hotfix SEO trang hiện tại
- `src/app/sitemap.ts` (3 URL locale, `alternates.languages` + x-default), `robots.ts` thêm `sitemap` + `host`. Đọc `SITE_URL`, fallback `https://harutoexpress.com`.
- `generateMetadata`: canonical `/${locale}`, `alternates.languages` {vi, ja, en, x-default:/vi}.
- `src/shared/seo/business.ts` + JSON-LD `Organization` + `WebSite` trong layout.
- Hero: tách H1 tĩnh chứa từ khóa (ví dụ VI: "Gửi hàng Việt Nam – Nhật Bản bằng đường hàng không"), slogan → `<p>`; các slide dùng `<p>`, không còn H2 trong carousel. Chỉ ảnh 1 `priority`, ảnh 2–3 lazy.
- Title/description mới cho vi/ja/en theo 2.3.
- Sửa FAQ "Giá cước được tính như thế nào?" khớp bảng giá + chính sách cân; ẩn kênh liên hệ có giá trị rỗng thay vì "Chờ cập nhật".
- `alt` có nghĩa cho ảnh kho (thêm key `routes.photoAlts`).
- Done khi: view-source `/vi` có canonical, 4 hreflang, 2 JSON-LD hợp lệ; `/sitemap.xml` trả 3 URL; build pass.

### S2 — Hạ tầng đa trang
- `routing.ts` thêm `pathnames` theo bảng 2.1; `src/i18n/navigation.ts`.
- `pages.ts` registry + `metadata.ts` + `schema.ts` + `json-ld.tsx`; sitemap đọc từ registry (bỏ trang `indexable:false`, bỏ locale chưa có).
- Chuyển Header/Footer vào layout dùng chung; nav dùng `Link` tới route thật (không còn `#`), giữ CTA → contact.
- Language switcher dùng `getPathname` để sang đúng trang tương ứng; locale không có trang đó → về home locale đó.
- `PageHero`, `Breadcrumbs`, `RelatedLinks`.
- Tạo route skeleton cho mọi key (nội dung tạm = section hiện có), tất cả `indexable:false` trừ home.
- `generateStaticParams` cho mỗi trang chỉ trả locale có trong registry.
- Done khi: mọi route build tĩnh, switcher đúng, sitemap chỉ có home ×3, 404 vẫn đúng.

### S3 — Trang dịch vụ
- Viết nội dung VI cho `shipToJapan`, `shipToVietnam`, `business` vào namespace riêng trong `vi.json`; dùng dữ liệu đã có, phần thiếu để TODO và giữ `indexable:false`.
- `Service` JSON-LD, breadcrumb, related links, CTA.
- Bật `indexable:true` cho trang đủ nội dung (≥300 từ, không TODO hiển thị).

### S4 — Trang thông tin
- `pricing`: toàn bộ bảng giá + phụ phí + freight, ví dụ tính cước (từ quy tắc làm tròn & cân thể tích), link sang policy/goods.
- `goods`: tách danh sách hàng nhận/không đảm bảo/cấm từ `pricing.vnJp.*.desc` thành list có cấu trúc.
- `policy`: weight + compensation.
- `japanWarehouse`: địa chỉ, cách ghi tên người nhận, tips đóng gói.
- Home: section pricing/policy rút gọn + nút "Xem bảng giá đầy đủ".

### S5 — concierge, faq, contact, home hub
- `concierge` (mua hộ / đấu giá hộ / vận chuyển hộ), `faq` (FAQPage, gom câu hỏi từ mọi trang), `contact` (NAP từ `business.ts`, ContactPage).
- Home viết lại thành hub: mỗi section tóm tắt 2–3 câu + link trang chi tiết, tránh lặp nguyên văn nội dung trang con.
- Kiểm tra internal linking: mọi trang indexable có ≥2 link vào.

### S6 — Guides
- Nội dung bài viết dạng file (`src/content/guides/vi/*.mdx` hoặc JSON) — không thêm CMS. Nếu dùng MDX cần cài package: hỏi trước (mạng có thể bị chặn); phương án không cần package: JSON/TS + renderer đơn giản.
- `/huong-dan` listing + `/huong-dan/[slug]`, `Article` JSON-LD, đưa vào sitemap với `lastModified` thật.
- 3 bài khung (đóng gói hàng gửi đi Nhật, cách tính cân cồng kềnh, hàng cấm gửi đi Nhật) — nội dung để chủ site duyệt, `indexable:false` tới khi duyệt.

### S7 — QA & launch
- Script `scripts/seo-check.mjs`: build rồi crawl `.next` output/`next start` local, kiểm tra mỗi URL trong sitemap: 200, 1 H1, title/description độ dài, canonical tự trỏ, hreflang đối xứng, JSON-LD parse được, không link nội bộ 404.
- `dataLayer.push` cho `click_zalo`, `click_hotline`, `click_messenger`, `cta_contact`, `generate_lead` (khi form có backend).
- `manifest.ts`, `apple-icon`. Lighthouse mobile ≥90 SEO/Best Practices.
- Checklist ngoài code: Search Console (DNS verify), submit sitemap, URL Inspection các trang chính, Google Business Profile (nếu có địa điểm đủ điều kiện), NAP thống nhất trên Zalo OA/Facebook.

---

## Changelog
<!-- Mỗi session thêm 1 dòng: ngày — session — tóm tắt — trang nào đã indexable -->
- 2026-11-09 — S7 + một phần S1 (sitemap, robots, canonical/hreflang, JSON-LD Organization/WebSite, business.ts, manifest, tracking, seo:check). Còn lại của S1: H1, meta, FAQ giá, kênh liên hệ, alt ảnh kho, hero priority.
- 2026-11-09 — S1 (on-page còn lại): Hero H1 tĩnh chứa từ khóa (chỉ slide 0 là `<h1>`, slide 1–2 `<p>` cùng nội dung; slogan + mô tả thành `<p>`, hết `<h2>` trong carousel; ảnh 1 `priority`, ảnh 2–3 `lazy`). Viết lại meta title/description vi/ja/en theo 2.3 (từ khóa trước brand, title ≤60, desc 140–160). Sửa FAQ "Giá cước tính thế nào" khớp bảng giá VN→JP/JP→VN + cân thể tích. Ẩn hẳn kênh liên hệ chưa có URL trong `business.ts` (bỏ "Chờ cập nhật", xóa key `channelPending`). `alt` thật cho 8 ảnh kho (`routes.photoAlts`, 3 ngôn ngữ). `seo:check` sạch (0 warning). Indexable: chưa đổi — vẫn `noindex` trừ khi `ALLOW_INDEXING=true`.
- 2026-11-09 — Google Maps: thêm định vị kho Nhật (iframe nhúng keyless `output=embed` + nút "Mở Google Maps") vào block kho trong `Policy`; footer liệt kê 3 địa điểm (kho Nhật 133-0056, kho VN 60 Trương Công Giai – Cầu Giấy – Hà Nội, văn phòng 340/16 Quang Trung – Gò Vấp – HCM) mỗi dòng link tới Google Maps. `business.ts` tái cấu trúc thành `LOCATIONS[]` + helper `mapsUrl`/`mapsEmbed` (một nguồn sự thật). CSP `frame-src` nới cho `google.com`, `maps.google.com`. Component dùng chung `MapEmbed`. i18n vi/en/ja (`policy.warehouse.mapTitle/mapOpen`, `footer.addressTitle/mapHint/locations`). `typecheck` + `seo:check` sạch.
- 2026-11-09 — Home thành hub + bản đồ tuyến gốc: trang chủ bỏ bảng giá/chính sách đầy đủ (gây scroll dài), thay bằng `PricingTeaser` (2 thẻ tóm tắt: VN→JP từ 85.000₫/kg, JP→VN 155.000₫/kg + CTA sang `/bang-gia`); nội dung đầy đủ ở các trang riêng (pricing/policy/goods/concierge/japan-warehouse). `Pricing` nhận prop `withHeader` (ẩn tiêu đề trùng trên trang con vì đã có PageHero). Section Tuyến vận chuyển: bố cục 2 cột (text + tuyến link bên trái, bản đồ lớn bên phải), bản đồ phóng to lấp đầy cột, thêm **mũi tên hướng** trên mỗi vector đường bay (tính theo tiếp tuyến bezier). Bản đồ `dong-a-vn-nhat.svg` dựng từ Natural Earth (public-domain, thay file copy Tiximax): halftone Đông Á + tô lãnh thổ VN/Nhật theo quốc kỳ + chấm Hoàng Sa/Trường Sa; animation chuyến bay tự chạy bằng CSS (offset-path + dash streak + ping), tôn trọng `prefers-reduced-motion`. `typecheck` + `seo:check` sạch.
- 2026-11-09 — Tham khảo Tiximax (tiximax.net) → áp dụng 2 điều chỉnh cấu trúc/data layer: (1) **slug tiếng Việt địa phương hóa** per-locale trong registry (`/vi/bang-gia`, `/vi/gui-hang-di-nhat`, `/vi/chinh-sach-van-chuyen`… JA/EN giữ slug tiếng Anh) — `PageDef.slugs: Record<Locale,string>`, resolve qua `pageByLocaleSlug`; language switcher map đúng slug của locale đích qua registry. (2) **Mega-nav dropdown phân nhóm** (`nav.ts`: Dịch vụ / Bảng giá / Hướng dẫn là dropdown, Liên hệ là link trực tiếp) thay nav phẳng, kèm panel CSS + accordion mobile + i18n `nav.groups`. (Chưa áp dụng: sitemap index phân mảnh, widget liên hệ nổi, About/Blog — Haruto 1 thị trường nên không tách theo quốc gia như Tiximax.) `seo:check` sạch (0 lỗi).
- 2026-11-09 — S2–S5 (hạ tầng đa trang + data layer SEO) + UI polish: thêm `shared/seo/pages.ts` (registry: key, slug, indexable, priority, parent, related — một nguồn sự thật), `metadata.ts` (buildPageMetadata: canonical + hreflang + OG + robots từ registry), `schema.ts` (service, breadcrumb, faqPage). Route động `[locale]/[...rest]` render subpage theo slug (404 cho slug lạ), tái dụng các section hiện có qua `SubPage`; `Policy` nhận prop `show` để tách block; thêm component `Goods`. Shared components `PageHero`, `Breadcrumbs`, `RelatedLinks`. `sitemap.ts` sinh từ registry (9 trang × 3 locale = 27 URL). Nav + footer trỏ route thật; language switcher giữ nguyên path khi đổi ngôn ngữ. i18n namespace `pages` đầy đủ vi/en/ja (nav, breadcrumb, H1, intro, metaTitle ≤60, metaDescription). JSON-LD breadcrumb mọi trang + Service (trang dịch vụ) + FAQPage. UI polish (gộp từ `ui/premium-polish`): film grain, CTA button-in-chip, card hover — theo skill `minimalist-ui` + `high-end-visual-design`. **Deviation**: dùng slug chung mỗi locale (vd `/vi/pricing`) thay vì slug tiếng Việt địa phương hóa (2.1) để giảm rủi ro next-intl — ghi nhận là follow-up. `seo:check` sạch (0 lỗi; 8 warning là description tiếng Nhật ngắn — đúng đặc thù JA). **Indexable**: home, shipToJapan, shipToVietnam, pricing, goods, policy, concierge, japanWarehouse, faq = true (khi `ALLOW_INDEXING=true`). business, contact (thiếu NAP), guides = noindex (scaffold, chờ nội dung). **Còn lại S6 + nội dung mở rộng**: guides/business/contact cần nội dung thật + review JA/EN; cân nhắc chuyển home thành hub để tránh trùng nội dung với trang con.
