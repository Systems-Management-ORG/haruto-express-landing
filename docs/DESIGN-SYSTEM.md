# HARUTO EXPRESS — Design System

> **Nguồn sự thật duy nhất cho UI.** Mọi trang mới, section mới, component mới phải dùng đúng những gì có ở đây. Thiếu thứ gì thì **bổ sung vào file này trước**, sau đó mới code. Không tự đặt màu, cỡ chữ, bo góc hay bóng đổ mới ngay trong component.
>
> Phạm vi: `src/app/globals.css` (tokens + component classes), `src/shared/ui/*` (primitives), `src/modules/landing/components/**` (sections). File này thay thế §2 "Design system" của `HARUTO-EXPRESS-UIUX-TECHNICAL-SPEC.md` (tài liệu cũ, ghi sai font).
>
> Trạng thái: viết ngày 2026-11-13 cùng prompt `docs/prompts/2026-11-13-info-pages-design-system.md`. Các mục đánh dấu **(B…)** sẽ có trong code sau khi prompt đó chạy xong.

---

## 1. Nguyên tắc

1. **Một trang = một template.** Trang dịch vụ dùng `ServicePage`, trang thông tin (bảng giá, chính sách, kho Nhật, hỏi đáp, hướng dẫn, liên hệ) dùng `InfoPage`, trang chủ có bố cục riêng. Không ghép section tự do ngoài template.
2. **Copy nằm trong messages, cách trình bày nằm trong config, giá nằm trong `pricing-data.ts`.** Component không chứa chuỗi hiển thị, không chứa số tiền.
3. **Dữ liệu trình bày gắn theo id, không theo chỉ số mảng.** Icon, ảnh, tone của một item được tra bằng id của item (`items: { <id>: {...} }`). Mảng chỉ dùng cho danh sách thuần chữ, không đi kèm icon.
4. **Mobile trước.** Breakpoint: `sm` 40rem · `md` 48rem · `lg` 64rem. CTA chính phải nằm trong màn hình đầu ở viewport 375×667.
5. **Không bịa dữ kiện** (giá, thời gian, số liệu, review). Chưa có thì để `TODO` trong config và không render.

---

## 2. Tokens (`@theme` trong `globals.css`)

### 2.1 Màu

| Token | Giá trị | Dùng cho |
|---|---|---|
| `forest` | `#235923` | Màu thương hiệu: H1 phần A, H2, link, nút primary, icon |
| `deep` | `#173c22` | Nền dải tối (benefit band, CTA band, footer), card tối |
| `gold` | `#e2a240` | Nút gold trên nền tối, số thứ tự bước, focus ring, nhấn nhỏ |
| `sun` | `#ea580c` | Cam poster: H1 phần B, eyebrow, đường cong trang trí |
| `sun-deep` | `#c2410c` | Chữ cam cỡ nhỏ (đủ tương phản trên ivory) |
| `ivory` | `#faf8ea` | Nền trang mặc định |
| `sage` | `#eaf2e9` | Nền section xen kẽ, icon chip |
| `paper` | `#fdfaf3` | Nền hero và thẻ giá (ấm hơn ivory) **(B2)** |
| `ink` | `#29352c` | Chữ chính |
| `muted` | `#566359` | Chữ phụ |
| `line` | `#29352c33` | Viền, đường kẻ |
| `ok` | `= forest` | Trạng thái nhận / đạt **(B2)** |
| `warn` / `warn-soft` | `#b45309` / `#fef3c7` | Không đảm bảo, phụ thu, cảnh báo nhẹ **(B2)** |
| `danger` / `danger-deep` | `#b91c1c` / `#7f2523` | Hàng cấm, lỗi (`danger-deep` dùng cho chữ lỗi của form) **(B2)** |
| `danger-soft` / `danger-line` | `#fbeeed` / `#e4b4b2` | Nền và viền của khối lỗi **(B2)** |

Quy tắc:
- **Cấm hex trong TSX** (`text-[#…]`, `bg-[#…]`, `style={{color:"#…"}}`). Dùng utility từ token: `text-forest`, `bg-sage`, `text-warn`…
- Trong CSS chỉ dùng hex khi định nghĩa token, hoặc trong gradient/bóng có alpha dạng `rgb(23 60 34 / 0.12)` (= `deep`) hay `rgb(16 44 33 / x)` (bóng). Màu mới thì thêm token, không viết thẳng hex.
- Tương phản: chữ thường trên ivory/sage dùng `ink`/`muted`/`forest`/`sun-deep`. Tuyệt đối không dùng `gold` hay `sun` cho chữ nhỏ hơn 18px trên nền sáng.

### 2.2 Chữ

| Vai trò | Class | Font | Cỡ (mobile → lg) | Ghi chú |
|---|---|---|---|---|
| H1 trang con | `.hero-title` (+ `__a` forest, `__b` sun, `display:block`) | `--font-sans` 800 | `clamp(2.25rem, 5vw, 4rem)`, lh 1.05, ls −0.02em | **Không** viết hoa toàn bộ. Có `{" "}` giữa `__a` và `__b`. JA: ls 0 |
| H1 trang chủ | `.hero-text` (riêng trang chủ) | display | — | Không dùng ở trang con |
| H2 section | `.heading-2` | `--font-display` 400 | 2rem → 3rem (md) | Màu forest; trên nền tối dùng `text-white` |
| H3 thẻ | `text-lg font-medium text-forest` (thẻ) / `text-xl` (khối) | sans 500 | 1.125 / 1.25rem | |
| Eyebrow | `.eyebrow` | sans 600, in hoa, ls 0.14em | 0.875rem | Màu `sun-deep` |
| Lead | `.lead` | sans | 1rem → 1.125rem (sm), lh 1.6, `max-w-[40rem]` | |
| Body | mặc định `body` | sans | 1rem, lh 1.7 | |
| Small / caption | `text-sm text-muted` | | 0.875rem | |

Font: VI/EN dùng Newsreader (display) + Hanken Grotesk (sans); JA dùng Noto Serif JP + Noto Sans JP (`src/shared/lib/fonts.ts`). Không thêm font khác.

### 2.3 Bo góc, bóng, khoảng cách **(B2)**

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--radius-control` | 0.375rem | Nút, ô nhập |
| `--radius-card` | 0.75rem | Thẻ thường, icon chip lớn, callout |
| `--radius-panel` | 1.25rem | Khung ảnh, thẻ nổi bật (stat, rate, feature), poster art |
| `--radius-band` | 1.5rem | Panel lớn trong section (terms, customs panel, step rail) |
| `--shadow-card` | `0 6px 18px rgb(16 44 33 / 0.06)` | Thẻ tĩnh |
| `--shadow-lift` | `0 16px 32px rgb(16 44 33 / 0.12)` | Hover của thẻ là link |
| `--shadow-frame` | `0 0 0 6px #fff, 0 24px 48px rgb(16 44 33 / 0.16)` | Khung ảnh hero thông tin |

Khoảng cách:
- Section: `.section` = 4.5rem / 7rem (lg) theo chiều dọc. Không tự đặt `py-*` cho section.
- Container: `.wrap` (max 80rem + gutter 1.25rem / 2rem).
- Đầu section → nội dung: `mt-8 lg:mt-10` (với `SectionHead` có intro thì `mt-10 lg:mt-12`).
- Khoảng cách giữa các thẻ trong lưới: `gap-4` (thẻ nhỏ) / `gap-5`–`gap-6` (thẻ lớn).

### 2.4 Chuyển động
- Reveal: thêm `data-reveal` cho tiêu đề/khối, `data-reveal-group` cho lưới (GSAP trong `motion-layer.tsx`). Không tự viết animation khi xuất hiện.
- Hover: chỉ dùng `translate` và `box-shadow`, thời lượng 220ms `var(--ease-ui)`, và luôn bọc trong `@media (hover: hover) and (pointer: fine)`.
- Mọi animation CSS phải bọc trong `@media (prefers-reduced-motion: no-preference)`.

---

## 3. Bố cục trang

### 3.1 Nhịp nền section
`ivory` ↔ `sage` xen kẽ. Dải tối (`.band-dark`: benefit band, CTA band) **tối đa 2 dải mỗi trang và không được đứng liền nhau**. Khối cuối trước footer luôn là `RelatedLinks` (sage). Khi buộc phải đặt hai section cùng nền liền nhau, thêm `border-t border-line` vào section sau.

### 3.2 Căn tiêu đề
- Trang dịch vụ / marketing: `SectionHead align="center"`.
- Trang thông tin / tra cứu: `SectionHead align="start"` (người đọc dò theo lề trái).
- Mỗi section đúng một H2, đặt qua `SectionHead`. Không viết H2 thủ công.

### 3.3 Template `ServicePage` (6 trang dịch vụ)
`ServiceHero → features → [custom] → steps → PriceSummary → audience → BenefitBand → terms → policy → FAQ → CtaBand → RelatedLinks`. Cấu hình ở `service-pages.ts`, copy ở `<ns>.*` (shape `ServiceCopy`, file `service-copy.ts`).

### 3.4 Template `InfoPage` **(B4)**
`InfoHero → [TocChips] → các section nội dung (xen kẽ nền) → FAQ (theo tag) → CtaBand → RelatedLinks`. Cấu hình ở `info-pages.ts`.

| Trang | Section nội dung (thứ tự) | Hero CTA |
|---|---|---|
| `pricing` | VN→JP (2 bảng + quy tắc làm tròn) · JP→VN · Phụ thu · Cách tính cân | contact + call |
| `policy` | Cách tính cân · Đền bù | contact |
| `japanWarehouse` | Địa chỉ kho + bản đồ · Lưu ý gửi hàng | — |
| `faq` | Hỏi đáp theo nhóm (vận chuyển · mua hộ & đấu giá · kho Nhật · doanh nghiệp) | contact |
| `guides` | Lưới bài hướng dẫn (magazine) | — |
| `contact` | Form + kênh liên hệ + bản đồ (giữ nguyên) | — (không có CtaBand) |

### 3.5 Hero
Cùng một khung `HeroShell` cho cả 2 template: lưới `minmax(0,1fr) minmax(0,1.05fr)` ở `lg`; cột trái gồm Breadcrumbs → eyebrow → H1 `.hero-title` → (ribbon/alert) → lead → (points) → actions; cột phải là ảnh. Nền chung `.hero-bg` (paper + quầng cam góc phải + vệt cong góc trái).
- `variant="poster"` (dịch vụ): artwork viền trái mờ dần, H1 hai màu.
- `variant="framed"` (thông tin): ảnh thật đặt trong `--radius-panel` + `--shadow-frame`, H1 một màu (forest); eyebrow = nhãn nhóm menu (`nav.groups.*`); có thể thêm dòng ngày hiệu lực.
- Chỉ ảnh hero có `priority`. `sizes="(max-width: 1023px) 100vw, 50vw"`.

---

## 4. Primitives (`src/shared/ui/`) **(B3)**

| Component | Props chính | Quy tắc |
|---|---|---|
| `SectionHead` | `title, intro?, align?: "center"\|"start", tone?: "light"\|"dark"` | H2 duy nhất của section |
| `ContactCta` | `action: "zalo"\|"contact"\|"call"\|"pricing", label?, variant: "primary"\|"gold"\|"outline"\|"onDark"` | Nút liên hệ duy nhất. Tự gắn `data-track`. Không viết `<a href=zalo>` thủ công |
| `CtaBand` | `title, body, note?, primary, secondary?, primaryLabel?` | Kết trang; trang thông tin dùng copy `cta.default` |
| `ItemVisual` | `visual: {Icon} \| {src,width,height}` | Icon trong badge tròn hoặc ảnh nhỏ; luôn `alt=""` |
| `IconChip` | `Icon, size?: "md"\|"lg"` | Ô vuông bo góc nền sage chứa icon duotone |
| `Callout` | `tone: "info"\|"warn"\|"danger", children` | Ghi chú nổi bật có viền trái màu tone |
| `TocChips` | `items: {id, label}[]` | Mục lục neo `#id` ngay dưới hero của trang dài |
| `HeroShell` | `breadcrumbPage, eyebrow?, title, lead, actions?, media, variant` | Xem §3.5 |

Icon: chỉ dùng `@phosphor-icons/react/dist/ssr`, `weight="duotone"` trong chip/badge, `weight="fill"` cho dấu check, cảnh báo, cấm trong danh sách. Cỡ icon: 20 (trong dòng), 22 (chip), 28–30 (badge).

## 5. Component classes (CSS)

| Nhóm | Class | Khi nào dùng |
|---|---|---|
| Nút | `btn` + `btn-primary` / `btn-gold` / `btn-outline` / `btn-onDark` | Chỉ thông qua `ContactCta` hoặc nút trong form |
| Thẻ | `card` (base) · `card--link` (hover lift) · `card--stat` (+ `--featured`) · `card--dark` | `info-card` và `surcharge-card` gộp vào `card` **(B2)** |
| Panel | `callout` (+ `--warn`, `--danger`) · `panel-dashed` (= `svc-terms`) | |
| Dải | `band-dark` (= `svc-band` / `svc-cta`) | Benefit band, CTA band |
| Domain | `rate-card`, `rate-table`, `svc-price`, `goods-list`, `customs-*`, `guide-card`, `svc-feature`, `svc-step`, `svc-market` | Chỉ dùng trong component của domain đó |

Thêm class mới: đặt trong `@layer components`, đặt tên theo `khối__phần--biến-thể`, chỉ dùng token, và ghi một dòng vào bảng trên.

---

## 6. Nội dung & SEO (bắt buộc với mọi trang)
- 1 H1/trang, chứa từ khóa chính của trang; các section dùng H2, thẻ dùng H3; **không nhảy bậc** (H1 → H3).
- Title ≤ 60 ký tự `<Từ khóa> | HARUTO EXPRESS`; description 140–160 ký tự (registry `pages.ts` + `metadata.ts`).
- JSON-LD khớp với nội dung hiển thị (`Service.name` = H1).
- Dữ liệu đầy đủ chỉ nằm ở **một** trang; trang khác chỉ tóm tắt và đặt link (giá → `/bang-gia`, đền bù → `/chinh-sach-van-chuyen`).
- Mỗi trang indexable có ≥ 2 link nội bộ trỏ vào, và có `RelatedLinks` ở cuối trang.
- Ảnh: `alt` mô tả với ảnh mang thông tin, `alt=""` với ảnh trang trí.
- 3 locale có cùng tập key; copy JA/EN mới phải được ghi vào danh sách "chờ duyệt".

## 7. Accessibility
Nút và link có chiều cao tối thiểu 44px (`btn`, `link-arrow`). Focus dùng `:focus-visible` viền gold (đã có sẵn ở base). Bảng giá bọc trong `rate-table-wrap` (`tabIndex=0`, `role="group"`, `aria-label`). `details/summary` cho FAQ. Danh sách logo, chip phải có `aria-label`.

## 8. Kiểm tra trước khi commit
```bash
npm run typecheck && npm run design:check && npm run pricing:check && npm run build
npm run start & sleep 5 && npm run seo:check
```
`design:check` **(B6)** fail khi: TSX có hex thô; `globals.css` có thêm hex ngoài `@theme` so với baseline; trang có section render H2 ngoài `SectionHead`; class đã bỏ (`info-card`, `surcharge-card`, `heading-1`, `page-hero`…) còn xuất hiện; khai báo mảng `*_ICONS` / `*_TONES` / `*_IMAGES` ghép theo chỉ số. Ngoại lệ phải ghi vào `ALLOWLIST_*` trong script, kèm lý do.

## 9. Changelog
- 2026-11-13 — Khởi tạo. Tổng hợp từ template dịch vụ (đã ship) và kế hoạch đồng bộ trang thông tin.
