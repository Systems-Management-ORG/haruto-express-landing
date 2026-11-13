# PROMPT — Sàn TMĐT Nhật (dải logo tự chạy) + đối tác vận chuyển nội địa Nhật

> **Cách dùng (máy local):** ở thư mục gốc repo, chạy `claude` rồi gõ:
> `Đọc docs/prompts/2026-11-13-partners-marquee.md và thực hiện toàn bộ, theo đúng thứ tự B0 → B6.`
>
> Đọc kèm `CLAUDE.md`. Snapshot khi viết: `main` @ `d8d7846` (đã có template dịch vụ + InfoPage).

---

## 0. Mục tiêu

1. **Sàn TMĐT Nhật:** mở rộng danh sách sàn (hiện chỉ có 4 sàn, nằm tĩnh trong hero của trang Ship về VN / Mua hộ / Đấu giá) thành một **dải tự chạy ngang (marquee)** đặt trên trang chủ.
2. **Đối tác vận chuyển nội địa Nhật** của HARUTO: **Sagawa (佐川急便), Yamato (ヤマト運輸), Japan Post (日本郵便)**. Chủ site đã xác nhận đây là đối tác của công ty. Hiển thị trên trang chủ, `/gui-hang-di-nhat`, `/ship-hang-nhat-ve-viet-nam` và `/dia-chi-kho-nhat`.
3. Ràng buộc như `CLAUDE.md`: không bịa dữ kiện, đủ 3 locale, không thêm token / dependency, commit thẳng lên `main` theo bước, chỉ push khi B5 pass. Design system do người khác phụ trách: CSS mới chỉ thêm đúng phần marquee và thẻ đối tác, **dùng biến/màu có sẵn**.

### Về logo (đọc trước khi code)
- **Sàn có logo sẵn** trong `public/logo/`: `yahoo-auction.svg`, `mercari.svg`, `rakuten.svg`, `amazon-jp.svg`. **Sàn mới chưa có logo**: hiển thị dạng chip chữ.
- **Hãng vận chuyển chưa có logo.** Các file SVG tìm được trên mạng đều là **mẫu cũ** (ví dụ "日本郵政公社" của Japan Post, pháp nhân đã giải thể từ 2007), nên **không được dùng và không được tự vẽ logo**. Khi chủ site đặt file logo chính thức vào `public/logo/carriers/{sagawa,yamato,japan-post}.svg`, chỉ cần điền đường dẫn vào config (B2) là component tự đổi sang hiển thị logo. Trước đó, thẻ hiển thị tên Latin + tên tiếng Nhật.
- Logo là nhãn hiệu của bên thứ ba, chỉ dùng để gọi tên sàn/hãng. Không chỉnh sửa hình dạng, không đặt cạnh khiến người xem hiểu là logo của HARUTO.

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

## B1. Copy (vi / ja / en) — dùng nguyên văn Phụ lục A

1. `marketplaces`: thêm 6 sàn `yahooShopping`, `zozotown`, `rakuma`, `qoo10`, `surugaya`, `mandarake` (mỗi sàn có `name` + `note`). Giữ nguyên 4 sàn cũ và `more`.
2. Namespace mới `partners`: `title`, `intro`, `marketplaces.{title, cta}`, `carriers.{title, intro, items.{sagawa,yamato,japanPost}.{name, native}}`, `marquee.{pause, play}`.
3. Kiểm tra 3 locale có cùng tập key.

**Commit:** `i18n: marketplaces list + partners namespace (vi/ja/en)`

---

## B2. Dữ liệu — `src/modules/landing/marketplaces.ts` → đổi tên thành `partners.ts`

```ts
export type MarketplaceId =
  | "yahoo" | "mercari" | "rakuten" | "amazon"
  | "yahooShopping" | "zozotown" | "rakuma" | "qoo10" | "surugaya" | "mandarake";

// Logo của sàn (chỉ những sàn đã có file trong public/logo). Sàn không có logo → chip chữ.
export const MARKETPLACE_LOGOS: Partial<Record<MarketplaceId, string>> = {
  yahoo: "/logo/yahoo-auction.svg", mercari: "/logo/mercari.svg",
  rakuten: "/logo/rakuten.svg", amazon: "/logo/amazon-jp.svg",
};

// Thứ tự hiển thị trong marquee (danh sách id, chính nó quyết định thứ tự).
export const MARQUEE_MARKETPLACES: MarketplaceId[] = [
  "yahoo", "mercari", "rakuten", "amazon", "yahooShopping", "zozotown", "rakuma", "qoo10", "surugaya", "mandarake",
];

export type CarrierId = "sagawa" | "yamato" | "japanPost";
export const CARRIERS: Record<CarrierId, { logo?: string }> = {
  sagawa: {},      // TODO: logo chính thức → "/logo/carriers/sagawa.svg"
  yamato: {},      // TODO: logo chính thức → "/logo/carriers/yamato.svg"
  japanPost: {},   // TODO: logo chính thức → "/logo/carriers/japan-post.svg"
};
export const CARRIER_ORDER: CarrierId[] = ["sagawa", "yamato", "japanPost"];
```
- Cập nhật import ở `service/marketplace-row.tsx`, `service-pages.ts`, `service-hero.tsx` (và mọi chỗ khác tìm được bằng `grep -rn "marketplaces\"" src`).
- `MarketplaceRow` (hero) đổi sang dùng `MARKETPLACE_LOGOS[id]` có thể `undefined`. Hero hiện chỉ truyền 4 sàn có logo, nên output không đổi. Thêm nhánh fallback: không có logo thì hiển thị ô chữ cái đầu trong `svc-market__logo`.

**Commit:** `refactor(partners): one data source for marketplaces and carriers`

---

## B3. Component — `src/modules/landing/components/partners/`

### B3.1 `MarketplaceMarquee` (`marketplace-marquee.tsx`)
Dải ngang tự chạy, lặp vô hạn.

```tsx
<div className="marquee" data-marquee style={{ "--marquee-duration": `${ids.length * 4}s` } as CSSProperties}>
  <MarqueeToggle />                                   {/* client component, B3.2 */}
  <div className="marquee__viewport">
    <ul className="marquee__track" aria-label={label}>
      {ids.map(renderItem)}                            {/* bản 1: đọc được */}
      {ids.map((id) => renderItem(id, { hidden: true }))}  {/* bản 2: aria-hidden, chỉ để nối vòng */}
    </ul>
  </div>
</div>
```
- Mỗi item là một `li.marquee__item`, dạng chip: logo `img` (`height=28`, `width` auto, `alt=""`) nếu có, cộng tên sàn `marketplaces.<id>.name`. Item thuộc bản 2 có `aria-hidden="true"`. Item **không** phải link (không dẫn ra ngoài).
- CSS (thêm vào `globals.css`, nhóm `/* ---- Marquee ---- */`):
  - `.marquee__viewport { overflow: hidden; mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent); }` (chỉ dùng `transparent` / `#000` trong mask, không phải màu hiển thị).
  - `.marquee__track { display: flex; gap: 0.75rem; width: max-content; }`
  - `.marquee__item`: chip nền trắng, viền `var(--color-line)`, `border-radius: 999px`, `padding: 0.5rem 1rem`, `min-height: 44px`, chữ `var(--color-forest)` 600, `white-space: nowrap`, `display: inline-flex; align-items: center; gap: 0.5rem`.
  - Animation **chỉ trong** `@media (prefers-reduced-motion: no-preference)`: `.marquee__track { animation: marquee-scroll var(--marquee-duration) linear infinite; }` với `@keyframes marquee-scroll { to { transform: translateX(calc(-50% - 0.375rem)); } }` (nửa track + nửa gap để vòng lặp liền mạch).
  - Tạm dừng: `.marquee:hover .marquee__track, .marquee:focus-within .marquee__track, .marquee[data-paused="true"] .marquee__track { animation-play-state: paused; }`.
  - `@media (prefers-reduced-motion: reduce)`: không animation; `.marquee__track { flex-wrap: wrap; justify-content: center; width: auto; }`; ẩn bản 2: `.marquee__item[aria-hidden="true"] { display: none; }`; ẩn nút toggle; bỏ `mask-image`.
- Chuyển động liên tục kéo dài quá 5 giây cần có nút dừng (WCAG 2.2.2), nên bắt buộc có B3.2.

### B3.2 `MarqueeToggle` (`marquee-toggle.tsx`, `"use client"`)
- Nút tròn nhỏ (icon `Pause` / `Play` của phosphor, `size={16}`) đặt góc phải trên của `.marquee`, `aria-pressed`, `aria-label` = `partners.marquee.pause` / `partners.marquee.play`.
- Bấm nút thì set `data-paused` trên phần tử cha gần nhất có `[data-marquee]` (dùng `ref` + `closest`). State giữ trong `useState`, không lưu localStorage.
- Kích thước vùng bấm ≥ 44×44px.

### B3.3 `CarrierList` (`carrier-list.tsx`)
- `<ul>` 3 thẻ (lưới 1 cột mobile, 3 cột từ `sm`), mỗi thẻ là `card`. Bên trong: nếu `CARRIERS[id].logo` có thì `img` (`height=40`, `alt=""`), nếu không thì icon `Truck` duotone trong `icon-chip`; tiếp theo là `h3` = `partners.carriers.items.<id>.name` và dòng phụ `native` (chữ nhật, `text-muted`). Trên locale `ja`, `name` và `native` trùng nhau thì không render dòng phụ.
- Không có link ra ngoài.

### B3.4 `PartnersSection` (`partners-section.tsx`)
Props: `{ show: ("marketplaces" | "carriers")[]; headingLevel?: 2 | 3; bg?: "ivory" | "sage" }`.
- `show` có cả hai: `SectionHead` (H2 `partners.title`, intro `partners.intro`), sau đó khối Sàn (H3 `partners.marketplaces.title` + `MarketplaceMarquee` + link `link-arrow` tới `pagePath(locale, "concierge")` với nhãn `partners.marketplaces.cta`) và khối Hãng vận chuyển (H3 `partners.carriers.title`, đoạn `partners.carriers.intro`, `CarrierList`).
- `show = ["carriers"]`: `SectionHead` H2 = `partners.carriers.title`, intro = `partners.carriers.intro`, rồi `CarrierList`.
- Dùng `data-reveal` cho tiêu đề và `data-reveal-group` cho lưới thẻ.

**Commit:** `feat(partners): marketplace marquee + carrier list components`

---

## B4. Đặt lên trang

| Trang | Vị trí | `show` | Ghi chú |
|---|---|---|---|
| Trang chủ (`landing-page.tsx`) | Sau `<SkyTow />`, trước `<ServiceCards />` | marketplaces + carriers | Padding gọn `py-12 lg:py-16` (dải logo, không phải section nội dung dài). Nền khác với `ServiceCards` |
| `shipToJapan` | Trong `ServicePage`, ngay sau section `steps` | carriers | Thêm `partners?: ("marketplaces" \| "carriers")[]` vào `ServicePageConfig`, renderer đặt sau `steps` |
| `shipToVietnam` | Như trên | carriers | Hero đã có hàng logo sàn, nên **không** lặp marquee ở đây |
| `japanWarehouse` | `InfoPage`, sau section `warehouse` | carriers | Thêm id section `carriers` vào `InfoSectionId` và vào `sections` của `japanWarehouse` (sau `warehouse`, trước `warehouseTips`) |

- Nền section phải xen kẽ đúng theo template (InfoPage tự tính theo vị trí; ServicePage chọn nền khác với section liền trước và liền sau).
- `pages.ts`: cập nhật `updatedAt` của `home`, `shipToJapan`, `shipToVietnam`, `japanWarehouse`.

**Commit:** `feat(partners): show Japanese stores and carriers on home, ship pages and warehouse`

---

## B5. Kiểm tra (bắt buộc pass trước khi push)
```bash
npm run typecheck && npm run pricing:check && npm run build
npm run start & sleep 5 && npm run seo:check; kill %1
```
Kiểm tra trên localhost (3 locale):
- [ ] Trang chủ: marquee chạy liên tục, vòng lặp không bị giật hay trống ở điểm nối; dừng khi hover, khi focus bằng bàn phím (Tab vào nút toggle) và khi bấm nút tạm dừng; bấm lại thì chạy tiếp.
- [ ] Giả lập `prefers-reduced-motion: reduce` (DevTools → Rendering): marquee đứng yên, các chip xuống dòng căn giữa, không lặp bản 2, không hiện nút toggle.
- [ ] Screen reader đọc danh sách sàn **một lần** (bản 2 là `aria-hidden`).
- [ ] 4 sàn có logo hiển thị logo + tên; 6 sàn mới hiển thị chip chữ; không có ảnh lỗi (404) trong tab Network.
- [ ] Thẻ hãng vận chuyển: icon `Truck` + tên + tên tiếng Nhật (VI/EN); trên JA không lặp tên.
- [ ] Heading không nhảy bậc ở cả 4 trang (luật trong `seo:check`).
- [ ] Viewport 375 / 768 / 1280: marquee không làm tràn ngang trang (`document.documentElement.scrollWidth === innerWidth`).
- [ ] Hero các trang dịch vụ (hàng logo 4 sàn) không đổi so với trước.

---

## B6. Bàn giao
1. `git push origin main`.
2. Báo cáo cuối gồm:
   - danh sách commit SHA và kết quả B5;
   - **copy mới chờ duyệt** (Phụ lục A, đặc biệt câu `partners.intro` và `partners.carriers.intro`);
   - **việc chờ chủ site**: (1) gửi file logo chính thức của Sagawa, Yamato, Japan Post (SVG, lấy từ trang thương hiệu / press kit của từng hãng) để đặt vào `public/logo/carriers/`; (2) xác nhận danh sách 10 sàn có đúng là các sàn HARUTO mua hộ; (3) xác nhận việc dùng logo đối tác trên website đã được các hãng đồng ý nếu hợp đồng có yêu cầu.

---

# Phụ lục A — Copy mới

### `marketplaces` (thêm 6 sàn)
| id | vi name / note | ja name / note | en name / note |
|---|---|---|---|
| `yahooShopping` | Yahoo! Shopping / Mua sắm tổng hợp | Yahoo!ショッピング / 総合ショッピング | Yahoo! Shopping / General shopping |
| `zozotown` | ZOZOTOWN / Thời trang Nhật | ZOZOTOWN / ファッション通販 | ZOZOTOWN / Japanese fashion |
| `rakuma` | Rakuma / Chợ đồ cũ của Rakuten | ラクマ / 楽天のフリマアプリ | Rakuma / Rakuten's flea market |
| `qoo10` | Qoo10 / Mỹ phẩm, đồ gia dụng | Qoo10 / コスメ・日用品 | Qoo10 / Beauty & daily goods |
| `surugaya` | Suruga-ya / Game, anime, đồ sưu tầm | 駿河屋 / ゲーム・ホビー・中古品 | Suruga-ya / Games, anime & collectibles |
| `mandarake` | Mandarake / Manga, figure, đồ sưu tầm | まんだらけ / 漫画・フィギュア・コレクターズアイテム | Mandarake / Manga, figures & collectibles |

### `partners`
| key | vi | ja | en |
|---|---|---|---|
| `title` | Sàn mua sắm & đối tác vận chuyển Nhật Bản | 対応ECサイトと日本の配送パートナー | Japanese stores & delivery partners |
| `intro` | HARUTO mua hộ trên các sàn thương mại điện tử Nhật và giao nhận hàng trong Nhật cùng các hãng chuyển phát lớn. | HARUTOは日本の主要ECサイトで代理購入し、日本国内の配送は大手宅配会社と連携しています。 | HARUTO buys from Japan's major online stores and works with leading Japanese carriers for domestic delivery. |
| `marketplaces.title` | Sàn thương mại điện tử Nhật | 対応ECサイト | Japanese online stores |
| `marketplaces.cta` | Xem dịch vụ mua hộ | 代理購入サービスを見る | See the buying service |
| `carriers.title` | Đối tác vận chuyển nội địa Nhật | 日本国内の配送パートナー | Domestic carriers in Japan |
| `carriers.intro` | Hàng gửi về kho Nhật và hàng giao tới người nhận tại Nhật được vận chuyển cùng các hãng chuyển phát lớn của Nhật Bản. | 日本倉庫への入荷や日本国内のお届けは、日本の大手宅配会社と連携して行っています。 | Parcels to our Japan warehouse and deliveries within Japan travel with Japan's leading carriers. |
| `carriers.items.sagawa.name` / `.native` | Sagawa Express / 佐川急便 | 佐川急便 / 佐川急便 | Sagawa Express / 佐川急便 |
| `carriers.items.yamato.name` / `.native` | Yamato Transport / ヤマト運輸 | ヤマト運輸 / ヤマト運輸 | Yamato Transport / ヤマト運輸 |
| `carriers.items.japanPost.name` / `.native` | Japan Post / 日本郵便 | 日本郵便 / 日本郵便 | Japan Post / 日本郵便 |
| `marquee.pause` | Tạm dừng dải logo | 一時停止 | Pause |
| `marquee.play` | Tiếp tục chạy | 再生 | Play |
