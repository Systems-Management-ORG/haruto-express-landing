# PROMPT — Đồng bộ layout 6 trang dịch vụ + nâng cấp UI chuẩn marketing & SEO

> **Cách dùng (máy local):** ở thư mục gốc repo, chạy `claude` rồi gõ:
> `Đọc docs/prompts/2026-11-13-service-pages-sync.md và thực hiện toàn bộ, theo đúng thứ tự các bước B0 → B10.`
>
> Tài liệu phân tích gốc: Project "Landing pages Haruto" → `SERVICE-PAGES-AUDIT-2026-11-13.md` (đọc kèm `REVIEW-2026-11-12.md`). Snapshot khi viết prompt: `main` @ `165abdc`.

---

## 0. Vai trò & mục tiêu

Bạn là kỹ sư front-end senior làm việc trên repo Next.js 16 + next-intl 4 + Tailwind v4 này. Nhiệm vụ: chuyển **6 trang dịch vụ** sang **một template `ServicePage` dùng chung**, được điều khiển bởi **một file cấu hình dữ liệu**. Mục tiêu đi kèm: tăng chuyển đổi (CTA ngay màn đầu, bố cục thuyết phục nhất quán) và chuẩn SEO on-page (H1 chứa từ khóa, không dính chữ, không trùng nội dung, schema khớp nội dung hiển thị).

| key (pages.ts) | URL VI | namespace messages | component hiện tại |
|---|---|---|---|
| `shipToJapan` | `/vi/gui-hang-di-nhat` | `shipJp` | `ship-japan.tsx` |
| `shipToVietnam` | `/vi/ship-hang-nhat-ve-viet-nam` | `shipVn` | `ship-vietnam.tsx` |
| `concierge` | `/vi/mua-ho-hang-nhat` | `concierge` | `concierge.tsx` |
| `auction` | `/vi/dau-gia-ho-hang-nhat` | `auction` | `auction.tsx` |
| `business` | `/vi/doanh-nghiep` | `fulfillment` | `fulfillment.tsx` |
| `goods` | `/vi/hang-nhan-va-hang-cam` | `customs` | `customs-check.tsx` |

Các trang `pricing`, `policy`, `japanWarehouse`, `faq`, `contact`, `guides` giữ `PageHero`. **Không đụng tới** trang chủ, ngoại trừ bộ lọc FAQ ở B5.4 và đường dẫn ảnh mua hộ ở B1.2.

### Quyết định đã chốt với chủ site (không hỏi lại)
1. **Hero:** dùng một template chung và **giữ artwork poster** của từng trang (ảnh nằm bên phải, viền trái làm mờ dần).
2. **Giá:** `/gui-hang-di-nhat` và `/ship-hang-nhat-ve-viet-nam` **không nhúng bảng giá hay chính sách đầy đủ** nữa. Thay bằng `PriceSummary`: vài dòng tóm tắt, kèm link sang `/bang-gia`. Phần đền bù và cách tính cân → để `RelatedLinks` dẫn sang `/chinh-sach-van-chuyen`.
3. **Ngôn ngữ:** làm **cả VI, JA, EN** trong cùng đợt. Ba file messages phải có cùng bộ key.
4. **Git:** commit **thẳng lên `main`**, mỗi bước một commit nhỏ, không tạo branch hay PR.

### Ràng buộc bắt buộc
- **Không bịa dữ kiện kinh doanh** (giá, thời gian vận chuyển, số liệu, review). Mọi copy mới chỉ được diễn đạt lại dữ kiện đã có trong messages; copy mới được cung cấp sẵn ở **Phụ lục A–C**, hãy dùng nguyên văn.
- Giữ nguyên: `data-reveal` / `data-reveal-group` (GSAP), các `data-track` (analytics), a11y (skip link, `aria-*`, focus), CSP trong `next.config.ts`.
- Thứ tự heading: mỗi trang 1 H1, các section dùng H2, thẻ con dùng H3, không nhảy bậc.
- Không thêm dependency mới.
- Ảnh: chỉ ảnh hero có `priority`. Bỏ `quality={90}` (để mặc định).

---

## B0. Chuẩn bị (không commit)

```bash
git checkout main && git pull
npm ci
npm run typecheck && npm run build && npm run pricing:check
npm run start & sleep 5 && npm run seo:check; kill %1
```
Ghi lại kết quả baseline. Nếu baseline đã lỗi, **dừng lại và báo cáo**, không sửa lan sang chỗ khác.

---

## B1. Assets

### B1.1 Logo sàn Nhật (chủ site đã đặt sẵn, không cần tạo)
`public/logo/yahoo-auction.svg`, `public/logo/mercari.svg`, `public/logo/rakuten.svg`, `public/logo/amazon-jp.svg` — SVG màu gốc, tỉ lệ ~vuông. Chỉ kiểm tra 4 file tồn tại; nếu thiếu file nào, lấy theo **Phụ lục D**.

### B1.2 Ảnh hero Mua hộ: thay 2 PNG (3,7 MB) bằng 1 WebP
Tạo `public/images/haruto/mua-ho/mua-ho-hang-nhat.webp` bằng cách cắt từ `muaho-mobile.png` (958×1642). Vùng cắt: `left 0, top 380, width 958, height 1262`. Giữ lại núi Phú Sĩ, điện thoại và thùng hàng, bỏ máy bay ở trên cùng. Resize về rộng 760 px, WebP quality 80.
```bash
node -e "require('sharp')('public/images/haruto/muaho-mobile.png').extract({left:0,top:380,width:958,height:1262}).resize({width:760}).webp({quality:80}).toFile('public/images/haruto/mua-ho/mua-ho-hang-nhat.webp').then(i=>console.log(i))"
```
(tạo thư mục `mua-ho/` trước). Ghi lại `width`/`height` kết quả để dùng ở config. Cập nhật mọi chỗ tham chiếu `muaho-mobile.png` / `muaho-desktop.png`: `home-data.ts` (SERVICE_CARDS), `page-media.ts` (concierge), và các chỗ khác nếu có (`grep -rn muaho- src scripts`). Sau đó **xóa 2 file PNG**, chạy `npm run og:build` nếu ảnh OG của concierge phụ thuộc vào chúng.

**Commit:** `assets: single WebP art for the buying-service hero` (logo trong `public/logo/` đi kèm commit này nếu chưa được commit)

---

## B2. Data layer — messages (vi, ja, en)

### B2.1 Shape chuẩn cho cả 6 namespace
```ts
type Item = { title: string; body?: string };
type ServiceCopy = {
  hero: {
    eyebrow?: string;        // chữ nhỏ in hoa phía trên H1
    titleA: string;          // H1 phần 1 (màu forest)
    titleB: string;          // H1 phần 2 (màu sun, xuống dòng)
    ribbon?: string;         // ruy-băng xanh dưới H1 (yếu tố thương hiệu poster)
    hook?: string;           // 1 câu in đậm trước lead (pain point)
    lead: string;            // đoạn mô tả chính
    points?: string[];       // 3 proof bullet (Phụ lục A)
    marketplacesLabel?: string;
    badge?: string;          // con dấu tròn (trang đấu giá)
    imageAlt: string;
    artLabels?: { japan: string; vietnam: string }; // nhãn trên bản đồ (ship về VN)
    alert?: { title: string; body: string };        // cảnh báo (hàng cấm)
  };
  features?: { title: string; intro?: string; more?: string; items: Record<string, Item> };
  steps?:    { title: string; intro?: string; note?: string; items: Record<string, Item> };
  audience?: { title: string; items: Record<string, Item> };
  benefits?: { title: string; intro?: string; items: Record<string, Item> };
  terms?:    { title: string; body: string };
  cta: { title: string; body: string; note?: string; primary?: string }; // primary = nhãn nút chính riêng của trang
};
```
**Mọi `items` là object có id** (thứ tự key là thứ tự hiển thị). Đây là thay đổi cốt lõi: hiện tại icon và ảnh được ghép theo **chỉ số mảng**, nên chỉ cần thêm/bớt 1 dòng copy là lệch âm thầm. Sau khi đổi, icon và ảnh bám theo id.

### B2.2 Bảng chuyển đổi (áp dụng giống nhau cho vi/ja/en — giữ nguyên bản dịch cũ, chỉ đổi cấu trúc)
Viết một script tạm (`node`, **không commit**) để đọc 3 file messages, chuyển cấu trúc, rồi ghi lại với `JSON.stringify(obj, null, 2)` + xuống dòng cuối file. Copy mới lấy ở Phụ lục A–C.

| Namespace | Key mới | Nguồn |
|---|---|---|
| **shipJp** | `hero.titleA/titleB` | **Phụ lục A** (VI đổi; JA/EN giữ nguyên) |
| | `hero.ribbon` | `hero.ribbon` |
| | `hero.lead` | `hero.body` (bỏ `hero.promise`) |
| | `hero.points` | Phụ lục A |
| | `hero.imageAlt` | giữ |
| | `features` | `services` → `{title, more, items: {receive, gifts, rules, customs, tracking}}`, mỗi item `{title: <chuỗi cũ>}` |
| | `steps` | `process.title`, `process.notes.body`→`note`, `process.steps[i]` → `items: {contact, check, ship, deliver}` |
| | `audience` | `audience` → `items: {personal, exporters, sellers, regular}` |
| | `benefits` | `why` → `items: {ecosystem, support, flexible, market}` |
| | `cta` | `title` = Phụ lục B, `body` = `closing.body` (bỏ `closing.tagline`, `closing.cta`) |
| **shipVn** | `hero.titleA/titleB` | Phụ lục A (đổi cả 3 ngôn ngữ) |
| | `hero.ribbon` | `hero.ribbon` |
| | `hero.lead` | `hero.body` |
| | `hero.points`, `hero.marketplacesLabel` | Phụ lục A |
| | `hero.imageAlt` | `scene.alt` |
| | `hero.artLabels` | `{japan: scene.japan, vietnam: scene.vietnam}` |
| | `features` | `services` → `items: {buy, auction, consolidate, fast, trust}` (`{title, body}`) |
| | `steps` | copy từ `process` (giống shipJp) |
| | `benefits` | `why.title`, `why.body`→`intro`, `why.items[i]` → `items: {fast, check, tracking, support}` (`{title}`) |
| | `cta` | Phụ lục B (title + body) |
| | *(xóa)* | `stores` (→ namespace `marketplaces`, B2.3), `stats`, `scene` |
| **concierge** | `hero.eyebrow` | giữ |
| | `hero.titleA/titleB` | Phụ lục A |
| | `hero.hook` | `hero.title` (câu hỏi pain point cũ) |
| | `hero.lead` | `hero.body` |
| | `hero.points` | Phụ lục A |
| | `hero.marketplacesLabel` | `hero.platformsLabel` |
| | `hero.imageAlt` | giữ |
| | `steps` | `steps` → `items: {link, quote, pay, warehouse, ship}` |
| | `benefits` | `why` → `items: {card, rate, support, tracking}` |
| | `cta` | `cta.title`, `cta.body`, `primary` = `hero.ctaLink` |
| | *(xóa)* | `hero.platforms`, `hero.extra`, `hero.ctaContact`, `hero.ctaLink`, `hero.title`, `hero.body` |
| **auction** | `hero.eyebrow`, `hero.ribbon`, `hero.badge`, `hero.imageAlt` | giữ |
| | `hero.titleA/titleB` | Phụ lục A |
| | `hero.lead` | `hero.body` |
| | `hero.points` | Phụ lục A |
| | `hero.marketplacesLabel` | `hero.platformsLabel` |
| | `features` | `products` → `{title, intro, items: {electronics, collectibles, fashion, household, rare}}` |
| | `steps` | `steps` → `items: {link, quote, bid, ship}` |
| | `terms` | `{title: terms.title, body: policy.concierge.auction.body}` |
| | `benefits` | `title` = Phụ lục B, `intro` = `benefits.tagline`, items → `{fees, support, tracking, trust}` |
| | `cta` | `cta.title`, `cta.body`, `primary` = `hero.ctaLink` |
| **fulfillment** | `hero.eyebrow` | `"FFM JAPAN"` (giống nhau cả 3 ngôn ngữ) |
| | `hero.titleA/titleB` | Phụ lục A |
| | `hero.ribbon` | `hero.ribbon` |
| | `hero.lead` | `hero.body` |
| | `hero.points` | Phụ lục A |
| | `hero.imageAlt` | giữ (bỏ `srTitle`, `tagline`) |
| | `steps` | `steps.title`, `steps.extra`→`note`, items → `{receive, stock, pack, deliver, report}` |
| | `audience` | items → `{exporters, retailers, crossborder, brands}` |
| | `benefits` | `title` = Phụ lục B, items → `{cost, speed, safe, focus}` |
| | `cta` | `title` = Phụ lục B, `body` = `closing.body` (bỏ `closing`, `cta.contact`, `cta.zalo`) |
| **customs** | `hero.titleA/titleB` | Phụ lục A |
| | `hero.ribbon` | `hero.ribbon` |
| | `hero.lead` | `pages.goods.intro` (copy chuỗi sang) |
| | `hero.alert` | `{title: hero.alertTitle, body: hero.alertBody}` |
| | `hero.imageAlt` | giữ |
| | `groups`, `lists` | **giữ nguyên** (section riêng của trang) |
| | `cta` | `title` = `"HARUTO EXPRESS " + support.title` (**JA nối không có dấu cách**), `body` = `support.body`, `note` = `support.ask`, `primary` = `support.zalo` |
| | *(xóa)* | `support`, `services` |
| *(gốc)* | *(xóa)* `process` | đã chuyển vào `shipJp.steps`, `shipVn.steps` |

### B2.3 Namespace mới
- `service` (nhãn dùng chung) — Phụ lục C.
- `marketplaces` — `{ yahoo, mercari, rakuten, amazon }: {name, note}` + `more: {note}`. `note` lấy từ `shipVn.stores[i].note` cũ (thứ tự Yahoo, Mercari, Rakuten, Amazon, "…"); `name` theo Phụ lục C. **Một nguồn duy nhất** cho tên sàn, thay cho 3 danh sách viết khác nhau trước đây.

### B2.4 FAQ
- Thêm `"home"` vào `pages` của 3 câu hiện có.
- Thêm 6 câu mới ở **Phụ lục E**. Các câu này chỉ diễn đạt lại dữ kiện đã có, nhưng vẫn ghi vào báo cáo cuối: *"chủ site cần duyệt 6 câu FAQ mới"*.

### B2.5 Kiểm tra
Viết thêm một assert nhanh trong script tạm: 3 locale phải có **cùng tập key** (đệ quy), và mọi `items` của cùng một namespace phải có cùng tập id giữa các locale. Không được để sót key nào trong 3 locale.

**Commit:** `i18n: id-keyed service page copy, marketplaces + service namespaces, keyword H1s, 6 FAQ`
*(code chưa build được ở commit này cũng không sao, vì B3–B5 commit liền sau; nhưng đừng push trước khi B9 pass.)*

---

## B3. Types & config

### B3.1 `src/modules/landing/service-copy.ts`
Export type `ServiceCopy`, `Item` (B2.1), `ServiceKey`, `ServiceNs`, và:
```ts
export const SERVICE_NS = { shipToJapan: "shipJp", shipToVietnam: "shipVn", concierge: "concierge",
  auction: "auction", business: "fulfillment", goods: "customs" } as const satisfies Record<ServiceKey, ServiceNs>;
export function isServiceKey(key: PageKey): key is ServiceKey { return key in SERVICE_NS; }
```
Helper đọc copy (messages được type chặt theo `vi.json`, vì vậy chỉ ép kiểu ở **một chỗ duy nhất** này):
```ts
// server components (sync)
export function useServiceCopy(key: ServiceKey): ServiceCopy {
  const t = useTranslations();
  return t.raw(SERVICE_NS[key]) as ServiceCopy;
}
// route page (async)
export async function getServiceCopy(locale: Locale, key: ServiceKey): Promise<ServiceCopy> {
  const t = await getTranslations({ locale });
  return t.raw(SERVICE_NS[key]) as ServiceCopy;
}
```

### B3.2 `src/modules/landing/marketplaces.ts`
```ts
export type MarketplaceId = "yahoo" | "mercari" | "rakuten" | "amazon";
export const MARKETPLACE_LOGOS: Record<MarketplaceId, string> = {
  yahoo: "/logo/yahoo-auction.svg", mercari: "/logo/mercari.svg",
  rakuten: "/logo/rakuten.svg", amazon: "/logo/amazon-jp.svg",
};
```

### B3.3 `src/modules/landing/service-pages.ts` — cấu hình trình bày (không chứa copy)
```ts
type PhIcon = typeof Truck;
export type Visual = { Icon: PhIcon } | { src: string; width: number; height: number };
export type CtaAction = "zalo" | "contact" | "call" | "pricing";
export type Art = { src: string; width: number; height: number; sizes: string; variant?: "route" | "seal" };

export type ServicePageConfig = {
  hero: { art: Art; marketplaces?: MarketplaceId[]; withMore?: boolean; chips?: "customsGroups";
          primary: CtaAction; secondary?: CtaAction };
  features?: { visuals: Record<string, Visual>; links?: Partial<Record<string, PageKey>>; variant?: "tile" | "product" };
  custom?: "customs";                       // nhóm hàng + danh mục (component có sẵn)
  steps?: { visuals: Record<string, Visual> };
  price?: "vnJp" | "jpVn";
  audience?: { visuals: Record<string, Visual> };
  benefits?: { visuals: Record<string, Visual>; chips?: { item: string; pages: PageKey[] } };
  terms?: true;
  policy?: PolicyBlock[];                   // tái dùng <Policy show=… withHeader={false} />
  cta: { primary: CtaAction; secondary?: CtaAction };
};
export const SERVICE_PAGES: Record<ServiceKey, ServicePageConfig> = { … };
```
Giá trị cho từng trang (icon lấy từ `@phosphor-icons/react/dist/ssr`; ảnh lấy từ các thư mục đang có):

| Trang | hero.art | hero | features | steps | khác | cta |
|---|---|---|---|---|---|---|
| shipToJapan | `ship-ve-vn/gui-hang-viet-nam-nhat-ban.webp` 1192×920 | primary `zalo`, secondary `pricing` | receive `Truck`, gifts `Gift`, rules `ClipboardText`→link `goods`, customs `Stamp`, tracking `MapPinLine` | contact `ChatCircleText`, check `ClipboardText`, ship `AirplaneTilt`, deliver `Truck` | price `vnJp`; audience personal `UsersThree`, exporters `Buildings`, sellers `Storefront`, regular `Repeat`; benefits ecosystem `GlobeHemisphereEast` (chips → shipToVietnam, concierge, business), support `Handshake`, flexible `Package`, market `RocketLaunch` | `zalo` + `call` |
| shipToVietnam | `ship-ve-vn/duong-bay-nhat-viet.webp` 1201×478, `variant:"route"` (nhãn Nhật Bản/Việt Nam đặt theo % như hiện tại) | marketplaces 4 + `withMore`; primary `zalo`, secondary `pricing` | ảnh `ship-ve-vn/icon-*.webp`: buy `icon-mua-ho` 122×104 →`concierge`, auction `icon-dau-gia` →`auction`, consolidate `icon-gom-hang` →`japanWarehouse`, fast `icon-ship-nhanh` 144×104, trust `icon-uy-tin` | như shipToJapan | price `jpVn`; benefits fast `AirplaneTilt`, check `MagnifyingGlass`, tracking `MapPinLine`, support `Headset` | `zalo` + `call` |
| concierge | `mua-ho/mua-ho-hang-nhat.webp` (kích thước từ B1.2) | marketplaces 4; primary `zalo`, secondary `contact` | — | link `LinkSimple`, quote `Calculator`, pay `CreditCard`, warehouse `Warehouse`, ship `AirplaneTilt` | benefits card `CreditCard`, rate `CurrencyJpy`, support `Handshake`, tracking `Path`; `policy: ["concierge"]` | `zalo` + `call` |
| auction | `dau-gia/dau-gia-hang-nhat-banner.webp` 937×600, `variant:"seal"` | marketplaces yahoo, rakuten, mercari; primary `zalo`, secondary `call` | `variant:"product"`, ảnh `dau-gia/*.webp` 188×134: electronics `may-anh`, collectibles `mo-hinh-figure`, fashion `tui-xach`, household `noi-com-dien`, rare `meo-than-tai` | link `LinkSimple`, quote `ClipboardText`, bid `Gavel`, ship `Truck` | `terms`; benefits fees `ShieldCheck`, support `Headset`, tracking `Package`, trust `SealCheck` | `zalo` + `call` |
| business | `ffm/kho-ffm-nhat-ban.webp` 512×552 | primary `contact`, secondary `zalo` | — | ảnh `ffm/buoc-*.webp` 136×136: receive `buoc-nhan-hang`, stock `buoc-ton-kho`, pack `buoc-dong-goi`, deliver `buoc-giao-hang`, report `buoc-bao-cao` | audience ảnh `ffm/dt-*` 100×84 (exporters `dt-doanh-nghiep`, retailers `dt-ban-le`, crossborder `dt-tmdt`, brands `dt-thuong-hieu`); benefits ảnh `ffm/lt-*` 78×78 (cost `lt-chi-phi`, speed `lt-xu-ly`, safe `lt-an-toan`, focus `lt-phat-trien`) | `contact` + `zalo` |
| goods | `hang-cam/canh-kiem-tra-hai-quan.webp` 694×466 | `chips:"customsGroups"`; primary `zalo`, secondary `contact` | — | — | `custom:"customs"` | `zalo` + `contact` |

`sizes` của art: `"(max-width: 1023px) 100vw, 50vw"`.

**Commit:** `feat(service): typed service copy + page config + marketplaces source`

---

## B4. Bộ component dùng chung — `src/modules/landing/components/service/`

Tất cả là **server component** (không `"use client"`). Copy truyền vào qua props (lấy từ `useServiceCopy`). Nhãn chung lấy từ `useTranslations("service")`.

| File | Export | Ghi chú |
|---|---|---|
| `contact-cta.tsx` | `ContactCta({ action, label?, variant?: "primary"\|"gold"\|"outline"\|"onDark" })` | **Thay 4 bản sao** (`SendLinkButton`, `ZaloButton`, `CallButton`, `ContactButtons`, nút inline ở customs). `zalo` → `<a href={zalo.href} target="_blank" rel="noopener noreferrer" data-track="click_zalo">` kèm `ChannelIcon` (không có Zalo thì rơi về `contact`). `contact` → `Link` tới `${pagePath(locale,"contact")}#contact`, `data-track="cta_contact"`. `call` → `primaryHotline(locale)`, `tel:`, `data-track={`click_hotline_${id}`}`, nhãn là số máy; không có hotline thì `null`. `pricing` → `Link` tới `pagePath(locale,"pricing")`, `data-track="cta_pricing"`. Nhãn mặc định: `service.cta.*`. |
| `service-hero.tsx` | `ServiceHero({ page, copy, config })` | Bố cục ở B4.1 |
| `section-head.tsx` | `SectionHead({ title, intro?, align? })` | **Một kiểu H2 duy nhất** `heading-2` (+ intro `max-w-[44rem] sm:text-lg`). Bỏ kiểu pill `ffm-section-title` và kiểu cam in hoa `shipvn-heading`. |
| `feature-grid.tsx` | `FeatureGrid` | Lưới 2 / 3 / 5 cột (4 cột nếu có 4 item). Mỗi thẻ: visual (icon trong badge tròn hoặc ảnh) + title + body; nếu có link thì cả thẻ là `Link` kèm dòng `copy.features.more` (mặc định `service.cta.more`) + `ArrowRight`. `variant:"product"` = ảnh trên, nhãn trên nền forest (từ `auction-product`). |
| `step-flow.tsx` | `StepFlow` | `<ol>`, số thứ tự trong badge vàng, đường nối nét đứt (từ `muaho-steps`); số cột = số bước (CSS var `--n`). `note` (nếu có) hiển thị dạng pill bên dưới (từ `ffm-flow__extra`). |
| `audience-row.tsx` | `AudienceRow` | Từ `ffm-audience`. |
| `benefit-band.tsx` | `BenefitBand` | Dải nền deep→forest, H2 màu trắng căn giữa + intro; item: visual + title + body; hỗ trợ `chips` (link `pages.<k>.nav`). **Thay 3 dải đang lặp nhau** `auction-benefits` / `ffm-benefits` / list sáng. |
| `price-summary.tsx` | `PriceSummary({ direction })` | B4.2 |
| `cta-band.tsx` | `CtaBand({ copy, config })` | Nền deep, H2 trắng, body, note; nút primary `gold` (nhãn `copy.cta.primary` nếu action là zalo), secondary `onDark`. Có logo `/logo/haruto-mark.png` nhỏ phía trên. |
| `marketplace-row.tsx` | `MarketplaceRow({ ids, withMore, label })` | `<ul aria-label={label}>`, mỗi sàn: `<img src=logo alt="" width=32 height=32>` + `marketplaces.<id>.name` (đậm) + `note` (nhỏ, muted). `withMore` thêm ô "…" + `marketplaces.more.note`. |
| `service-page.tsx` | `ServicePage({ page })` | B5.1 |

### B4.1 `ServiceHero` (bố cục thống nhất)
```
<section class="svc-hero">                         // nền chung cho cả 6 trang
  <div class="wrap svc-hero__grid">                // 1 cột mobile; lg: minmax(0,1fr) minmax(0,1.05fr)
    <div class="svc-hero__copy">
      <Breadcrumbs page />
      {eyebrow && <p class="svc-eyebrow">}
      <h1 class="svc-title"><span class="svc-title__a">{titleA}</span>{" "}<span class="svc-title__b">{titleB}</span></h1>
      {ribbon && <p class="svc-ribbon">}
      {alert && <div class="customs-alert">…}       // trang hàng cấm
      {hook && <p class="font-semibold text-forest sm:text-lg">}
      <p class="svc-lead">{lead}</p>
      {points && <ul class="svc-points">  ✓ … </ul>}
      <div class="svc-hero__actions"><ContactCta primary variant="primary"/><ContactCta secondary variant="outline"/></div>
      {marketplaces && <MarketplaceRow … />}
    </div>
    <div class="svc-art [svc-art--route|--seal]">  <Image priority …/>  + nhãn bản đồ hoặc seal </div>
  </div>
  {chips==="customsGroups" && <ul class="customs-chips">…</ul>}   // giữ markup cũ của customs-check
</section>
```
- **`{" "}` giữa 2 span là bắt buộc**: đây là lỗi H1 dính chữ ở 4 trang hiện tại. `.svc-title__b { display:block }` để vẫn xuống dòng về mặt thị giác.
- CTA phải nằm trong màn hình đầu (≤ ~600px chiều cao trên mobile 375px), vì vậy `points` tối đa 3 dòng.

### B4.2 `PriceSummary`
- **Số tiền tính từ `pricing-data.ts`**, không đọc chuỗi giá trong messages. Định dạng số: `new Intl.NumberFormat({vi:"vi-VN",ja:"ja-JP",en:"en-US"}[locale])`, đơn vị lấy từ `service.price.unit`.
- `vnJp`: 2 thẻ.
  - `pricing.vnJp.clean.title`: `{min} – {max} {unit}` (min/max = các `vndPerKg` khác null của `VN_JP_CLEAN`); dòng phụ `{rows[0].weight}: {rows[0].note}` (= "1 – 5 kg: Phụ thu 200.000 VNĐ/kiện"); caption `pricing.vnJp.clean.note`.
  - `pricing.vnJp.mixed.title`: tương tự với `VN_JP_MIXED`, caption `pricing.vnJp.mixed.note`.
  - **Không** hiện kiểu neo giá "Từ 85.000" (Review §2.3).
- `jpVn`: 1 thẻ `pricing.teaser.jpVn.label`, giá = `JP_VN[0]` đã format, caption `pricing.freight.weight`; danh sách `pricing.freight.buyRate`, `pricing.freight.domestic`, `pricing.freight.vat` (icon `Info`).
- Chân section: `pricing.teaser.note` (chỉ hiện với vnJp) + `ContactCta action="pricing" variant="outline"`.
- H2: `service.price.title`.

**Commit:** `feat(service): shared section kit (hero, CTA, features, steps, benefits, price summary, CTA band)`

---

## B5. Ghép trang

### B5.1 `ServicePage({ page })` — thứ tự cố định, section không có dữ liệu thì không render
```
<ServiceHero/>
features   → <section class="section bg-sage"><SectionHead/><FeatureGrid/></section>
custom     → customs: section "groups" (giữ markup GroupCard + 2 panel của customs-check) + section lists (<Goods/> trong bg-sage, kèm H2 lists.title + intro)
steps      → <section class="section"><SectionHead/><StepFlow/></section>
price      → <PriceSummary/>                      (section, nền trắng)
audience   → <section class="section bg-sage">…</section>
benefits   → <BenefitBand/>
terms      → khung viền nét đứt (từ auction-terms) trong section
policy     → <Policy show={…} withHeader={false}/>
<Faq page={page}/>
<CtaBand/>
<RelatedLinks page={page}/>
```
Tất cả H2 trong các section phải dùng `data-reveal`, các lưới dùng `data-reveal-group`.

### B5.2 `subpage.tsx`
`if (isServiceKey(page)) return <main id="main"><ServicePage page={page}/></main>;` Bỏ các nhánh hero/body cũ của 6 key. Các key còn lại giữ nguyên logic.

### B5.3 `[...rest]/page.tsx` — schema khớp nội dung hiển thị
Với `isServiceKey(key)`: `service({ name: `${copy.hero.titleA} ${copy.hero.titleB}`, description: copy.hero.lead, … })` (dùng `getServiceCopy`). Các trang khác giữ nguyên `tp("title")` / `tp("intro")`.

### B5.4 `faq.tsx`
- Trang chủ (`!page || page === "home"`): chỉ hiện câu có `pages` chứa `"home"`.
- `/cau-hoi-thuong-gap`: hiện tất cả.
- Các trang khác: lọc theo tag như hiện tại.

### B5.5 Xóa code cũ
Xóa `ship-japan.tsx`, `ship-vietnam.tsx`, `concierge.tsx`, `auction.tsx`, `fulfillment.tsx`, `customs-check.tsx`. Các phần còn giá trị (GroupCard, chips) chuyển vào `service/customs-sections.tsx`. Chạy `grep -rn` để chắc chắn không còn import cũ nào.

### B5.6 `pages.ts`
Cập nhật `updatedAt` của 6 key thành ngày commit (`YYYY-MM-DD`).

**Commit:** `feat(service): render the 6 service pages from one template; schema name = visible H1`

---

## B6. CSS (`src/app/globals.css`)

1. Thêm token trong `@theme`: `--color-sun: #ea580c;` (cam nhấn đang được dùng rải rác ở dạng hex). Thay các hex `#ea580c`, `#c2410c`, `#f28c13`, `#f97316` trong phần dịch vụ bằng `var(--color-sun)`; nếu cần sắc đậm thì thêm `--color-sun-deep: #c2410c`.
2. Thêm khối `/* ---- Service page template ---- */`: `.svc-hero` (nền chung = `radial-gradient(46rem 26rem at 85% 0%, rgb(255 237 213 / 0.6), transparent 65%), linear-gradient(180deg,#fdfaf3,#f8f3e7)`, kèm vệt cong góc trái trên lấy từ `.vnjp-hero::before`), `.svc-hero__grid`, `.svc-eyebrow`, `.svc-title` (`font-family: var(--font-sans)`, `font-weight: 800`, `font-size: clamp(2.25rem, 5vw, 4rem)`, `line-height: 1.05`, `letter-spacing: -0.02em`, **không** `uppercase`, vì chữ Việt có dấu viết hoa toàn bộ rất khó đọc), `.svc-title__a { color: var(--color-forest) }`, `.svc-title__b { display:block; color: var(--color-sun) }`, `:lang(ja) .svc-title { letter-spacing: 0 }`, `.svc-ribbon` (= `.auction-ribbon` cũ), `.svc-lead`, `.svc-points`, `.svc-hero__actions`, `.svc-art` (mask mờ trái + animation `auction-art-in`; đổi tên keyframe thành `svc-art-in`), `.svc-art--route` (+ `.shipvn-scene`/`.shipvn-tag*` đổi tên thành `.svc-route-tag*`), `.svc-art--seal` (+ `.auction-seal` → `.svc-seal`), `.svc-market*`, `.svc-feature*` (gộp `shipvn-service` + `vnjp-badge` + `auction-product`), `.svc-steps`/`.svc-step*` (gộp `muaho-steps` + `ffm-flow`, số cột `repeat(var(--n), minmax(0,1fr))` ở `min-width: 64rem`), `.svc-audience*`, `.svc-band`/`.svc-benefit*`, `.svc-price*`, `.svc-terms`, `.svc-cta`, `.btn-onDark` (viền `ivory/50`, chữ ivory, hover `bg-white/10`).
3. **Xóa** các khối không còn dùng (khoảng dòng 1096–2254 trong snapshot): `ffm-*`, `muaho-*`, `auction-*` (trừ những gì đã đổi tên ở trên), `shipvn-*`, `vnjp-*`, `customs-hero`, `customs-title*`, `customs-scene`, `customs-support*`, `customs-services`, `customs-service-link`. **Giữ** `customs-alert`, `customs-chips/chip*`, `customs-panel*`, `customs-card*`, `goods-list*`. Sau khi xóa, chạy `grep -oE 'class(Name)?="[^"]*"' -r src | …` (hoặc tự kiểm tra) để chắc chắn mọi class `svc-*`/`customs-*` còn được tham chiếu đều có định nghĩa, và không còn định nghĩa nào bị bỏ rơi.
4. Nhịp nền section: hero (ivory) → features (sage) → steps (ivory) → price (ivory/trắng) → audience (sage) → band (tối) → FAQ (ivory) → CTA (tối) → related (sage). Không để hai section cùng nền đứng liền nhau trừ khi bắt buộc; nếu có, thêm `border-t border-line`.

**Commit:** `style(service): one svc-* system and --color-sun token; drop per-poster CSS`

---

## B7. Chống tái phát

1. `scripts/check-pricing-data.mjs`: kiểm tra thêm `pricing.freight.price`, `pages.shipToVietnam.{intro,metaTitle,metaDescription}`, `pages.pricing.{intro,metaDescription}` và câu FAQ về cước: số tiền trong các chuỗi này phải bằng `JP_VN[0].vndPerKg`. Dùng regex lấy số dạng `155[.,]000`.
2. `scripts/seo-check.mjs`: thêm luật **H1 dính chữ**: textContent của H1 không được khớp `/[a-zà-ỹ][A-ZÀ-Ỹ]/u`, và H1 phải chứa ít nhất một khoảng trắng giữa các phần tử con; báo lỗi theo URL.

**Commit:** `chore(checks): pricing strings + glued-H1 rule`

---

## B8. Hiệu năng
- Đếm ảnh có `priority` trên mỗi trang dịch vụ: phải đúng **1**.
- Không còn PNG nào lớn hơn 300 KB trong đường dẫn render (`find public -name '*.png' -size +300k`, kiểm tra ảnh nào còn được tham chiếu).
- Ảnh trong FeatureGrid/StepFlow/AudienceRow: đặt `sizes` phù hợp, không `priority`.

---

## B9. Kiểm tra (bắt buộc pass trước khi push)

```bash
npm run typecheck
npm run pricing:check
npm run build
npm run start & sleep 5 && npm run seo:check; kill %1
```
Kiểm tra tay hoặc bằng script fetch HTML trên `localhost` cho 6 trang × 3 locale (18 URL):
- [ ] Có đúng 1 `<h1>`, text có khoảng trắng giữa titleA và titleB; H1 VI chứa từ khóa: *gửi hàng đi Nhật*, *ship hàng Nhật về Việt Nam*, *mua hộ hàng Nhật*, *đấu giá hộ*, *fulfillment*, *hàng cấm*.
- [ ] Nút CTA chính có mặt trong `<section class="svc-hero">`.
- [ ] JSON-LD `Service.name` = text H1 (bỏ khoảng trắng thừa).
- [ ] `/vi/gui-hang-di-nhat` **không** còn `<table class="rate-table">`; có link tới `/vi/bang-gia`.
- [ ] Logo 4 sàn hiển thị ở trang Ship về VN và Mua hộ; 3 sàn ở trang Đấu giá.
- [ ] Trang Mua hộ, Đấu giá, FFM có khối FAQ (≥ 2 câu).
- [ ] Trang chủ chỉ hiện 3 câu FAQ gắn tag `home`.
- [ ] Không có key messages nào bị thiếu (next-intl không log `MISSING_MESSAGE` khi build hoặc start).
- [ ] Viewport 375 / 768 / 1280: hero không tràn ngang, nhãn bản đồ ở trang Ship về VN nằm đúng vị trí trên artwork, seal ở trang đấu giá không che chữ.
- [ ] `prefers-reduced-motion`: không còn animation nào chạy.

Nếu bước nào fail: sửa, rồi chạy lại toàn bộ B9.

---

## B10. Bàn giao
1. `git push origin main`.
2. Thêm 1 dòng vào **Changelog** cuối `docs/SEO-ROADMAP.md`: `2026-11-13 — service template — 6 trang dịch vụ dùng ServicePage; H1 từ khóa; FAQ +6 (chờ duyệt)`.
3. Báo cáo cuối gồm: các commit SHA, kết quả B9, ảnh chụp màn hình hero của 6 trang (nếu có công cụ), danh sách **việc chờ chủ site**: duyệt 6 FAQ mới, duyệt bản JA/EN của copy mới (Phụ lục A–C), và các mục còn mở ở Review §6 (thời gian vận chuyển, nơi nhận hàng VN→JP, số liệu tin cậy).

---

# Phụ lục A — Hero (H1, points, nhãn)

| ns | locale | titleA | titleB |
|---|---|---|---|
| shipJp | vi | Gửi hàng đi Nhật Bản | từ Việt Nam |
| | ja | *(giữ)* ベトナムから | *(giữ)* 日本へ発送 |
| | en | *(giữ)* Ship from Vietnam | *(giữ)* to Japan |
| shipVn | vi | Ship hàng Nhật | về Việt Nam |
| | ja | 日本から | ベトナムへ発送 |
| | en | Ship from Japan | to Vietnam |
| concierge | vi | Mua hộ hàng Nhật | không cần thẻ quốc tế |
| | ja | 日本の代理購入 | 国際カード不要 |
| | en | Japan buying service | no international card needed |
| auction | vi | Đấu giá hộ | hàng Nhật Bản |
| | ja | 日本オークション | 代理入札 |
| | en | Japan auction | bidding service |
| fulfillment | vi | Fulfillment (FFM) | tại Nhật Bản |
| | ja | 日本での | フルフィルメント（FFM） |
| | en | Fulfillment (FFM) | in Japan |
| customs | vi | Hàng nhận & hàng cấm | gửi đi Nhật Bản |
| | ja | 日本向けの | 取扱品目と禁制品 |
| | en | Accepted & prohibited items | for shipping to Japan |

**`hero.points`**

- **shipJp**
  - vi: `Đã bao gồm thuế và ship nội địa Nhật` · `Hàng sạch: miễn phí gom đơn, đóng hàng` · `Hỗ trợ thủ tục thông quan`
  - ja: `税金と日本国内配送を含む` · `クリーン貨物はまとめ・梱包無料` · `通関手続きをサポート`
  - en: `Tax and Japan domestic delivery included` · `Clean goods: free consolidation and packing` · `Customs clearance support`
- **shipVn**
  - vi: `Tỷ giá mua hộ VCB + 5, không phụ thu` · `Miễn phí gom hàng tại kho Nhật` · `Mua hộ trên mọi website nội địa Nhật`
  - ja: `代理購入レート VCB + 5、追加料金なし` · `日本倉庫でのまとめは無料` · `日本国内のあらゆるサイトで代理購入`
  - en: `Buy-for-you rate VCB + 5, no surcharge` · `Free consolidation at our Japan warehouse` · `We buy from any Japanese online store`
- **concierge**
  - vi: `Tỷ giá VCB + 5, không phụ thu` · `Nhận hàng tại kho Tokyo` · `Hỗ trợ cả mua hộ và đấu giá hộ`
  - ja: `レート VCB + 5、追加料金なし` · `東京倉庫で受け取り` · `代理購入・代理入札に対応`
  - en: `Rate VCB + 5, no surcharge` · `Received at our Tokyo warehouse` · `Buying and auction bidding`
- **auction**
  - vi: `Đặt cọc 50%, không thắng hoàn 100% cọc` · `Phí minh bạch, không chi phí ẩn` · `Hàng về kho Nhật, ship về Việt Nam`
  - ja: `保証金50%、落札できなければ全額返金` · `明朗な手数料、隠れた費用なし` · `日本倉庫からベトナムへ発送`
  - en: `50% deposit, fully refunded if you don't win` · `Transparent fees, no hidden costs` · `Received in Japan, shipped to Vietnam`
- **fulfillment**
  - vi: `Nhận hàng, lưu kho và quản lý tồn kho tại Nhật` · `Soạn, đóng gói và giao hàng toàn nước Nhật` · `Báo cáo đơn hàng định kỳ`
  - ja: `日本での入荷・保管・在庫管理` · `ピッキング・梱包・日本全国への配送` · `定期的な受注レポート`
  - en: `Receiving, storage and inventory in Japan` · `Picking, packing and delivery across Japan` · `Regular order reports`

**`shipVn.hero.marketplacesLabel`** — vi `Mua hàng từ các sàn Nhật` · ja `対応サイト` · en `Buy from Japanese stores`

# Phụ lục B — Tiêu đề section & CTA mới

| key | vi | ja | en |
|---|---|---|---|
| `shipJp.cta.title` | Nhận tư vấn và báo giá gửi hàng đi Nhật | 日本への発送のご相談・お見積もり | Get advice and a quote for shipping to Japan |
| `shipVn.cta.title` | Cần mua hàng Nhật hoặc ship hàng về Việt Nam? | 日本で買い物、またはベトナムへの発送をお考えですか？ | Buying in Japan or shipping home to Vietnam? |
| `shipVn.cta.body` | Gửi link sản phẩm hoặc thông tin kiện hàng qua Zalo, HARUTO báo giá và hướng dẫn gửi hàng về kho Nhật. | Zaloで商品リンクや荷物の情報を送るだけで、HARUTOがお見積もりと日本倉庫への発送方法をご案内します。 | Send a product link or your parcel details on Zalo; HARUTO quotes and explains how to send goods to our Japan warehouse. |
| `auction.benefits.title` | Vì sao đấu giá hộ cùng HARUTO? | HARUTOの代理入札が選ばれる理由 | Why bid with HARUTO? |
| `fulfillment.benefits.title` | Lợi ích khi dùng FFM của HARUTO | HARUTOのFFMのメリット | Why use HARUTO fulfillment? |
| `fulfillment.cta.title` | Tư vấn giải pháp FFM cho doanh nghiệp | 企業向けFFMのご相談 | Talk to us about fulfillment in Japan |

# Phụ lục C — Namespace `service` & `marketplaces`

```jsonc
// vi
"service": {
  "cta": { "zalo": "Chat Zalo với HARUTO", "contact": "Gửi yêu cầu tư vấn", "pricing": "Xem bảng giá đầy đủ", "more": "Xem chi tiết" },
  "price": { "title": "Cước vận chuyển", "unit": "VNĐ/kg" }
},
"marketplaces": {
  "yahoo": { "name": "Yahoo! Auction", "note": "<shipVn.stores[0].note>" },
  "mercari": { "name": "Mercari", "note": "<…[1]>" },
  "rakuten": { "name": "Rakuten", "note": "<…[2]>" },
  "amazon": { "name": "Amazon Nhật", "note": "<…[3]>" },
  "more": { "note": "<…[4]>" }
}
// ja: cta {"zalo":"Zaloで相談する","contact":"相談を申し込む","pricing":"料金表の詳細を見る","more":"詳しく見る"}, price {"title":"運賃","unit":"VND/kg"}
//     names: "ヤフオク!", "メルカリ", "楽天市場", "Amazon.co.jp"
// en: cta {"zalo":"Chat with HARUTO on Zalo","contact":"Request advice","pricing":"See full pricing","more":"Learn more"}, price {"title":"Shipping rates","unit":"VND/kg"}
//     names: "Yahoo! Auction", "Mercari", "Rakuten", "Amazon Japan"
```

# Phụ lục E — 6 câu FAQ mới (thêm vào cuối `faq.items`)

| # | pages | vi Q / A |
|---|---|---|
| 1 | concierge | **Mua hộ hàng Nhật có cần thẻ Visa/MasterCard không?** — Không. Bạn chỉ cần gửi link sản phẩm, HARUTO báo giá theo tỷ giá VCB + 5 (không phụ thu) và thanh toán hộ cho shop Nhật. Với đơn mua hộ, bạn thanh toán 100% giá trị sản phẩm. |
| 2 | auction, concierge | **Đấu giá hộ cần đặt cọc bao nhiêu?** — Đặt cọc 50% giá trị trước khi đấu giá. Đấu thành công, bạn thanh toán phần còn lại để HARUTO chi trả; đấu không thành công, HARUTO hoàn 100% tiền cọc. |
| 3 | concierge, auction, shipToVietnam | **HARUTO mua hộ trên những website nào?** — Yahoo! Auction, Mercari, Rakuten, Amazon Nhật và các website nội địa Nhật khác. Gửi link sản phẩm để HARUTO kiểm tra và báo giá. |
| 4 | concierge, shipToVietnam, japanWarehouse | **Tự mua hàng rồi gửi về kho Nhật của HARUTO được không?** — Được. Với dịch vụ vận chuyển hộ, bạn tự mua và gửi hàng về kho Nhật của HARUTO theo địa chỉ kho; HARUTO gom hàng miễn phí và vận chuyển về Việt Nam. |
| 5 | business | **Dịch vụ FFM của HARUTO gồm những gì?** — Nhận hàng và lưu kho tại Nhật, quản lý tồn kho, soạn và đóng gói đơn theo yêu cầu, giao hàng nội địa trên toàn nước Nhật và báo cáo đơn hàng định kỳ. HARUTO cũng hỗ trợ vận chuyển hàng Nhật ⇄ Việt. |
| 6 | business | **FFM tại Nhật phù hợp với doanh nghiệp nào?** — Doanh nghiệp Việt xuất khẩu sang Nhật, nhà bán lẻ bán trên các sàn thương mại điện tử Nhật, doanh nghiệp thương mại điện tử xuyên biên giới cần kho trung chuyển và thương hiệu Việt mở rộng kinh doanh tại Nhật. |

**ja**
1. 代理購入にVisa/MasterCardは必要ですか？ — 不要です。商品リンクを送るだけで、HARUTOがVCB + 5のレート（追加料金なし）でお見積もりし、日本のショップへ代理で支払います。代理購入では商品代金の100%をお支払いいただきます。
2. 代理入札の保証金はいくらですか？ — 入札前に商品価格の50%をお預かりします。落札できた場合は残額をお支払いいただき、HARUTOが決済します。落札できなかった場合は保証金を全額返金します。
3. どのサイトで代理購入できますか？ — ヤフオク!、メルカリ、楽天市場、Amazon.co.jpをはじめ、日本国内のさまざまなサイトに対応しています。商品リンクを送っていただければ、確認してお見積もりします。
4. 自分で購入して、HARUTOの日本倉庫に送ることはできますか？ — 可能です。輸送代行サービスでは、お客様ご自身で購入した商品をHARUTOの日本倉庫宛てに送っていただき、HARUTOが無料でまとめてベトナムへ輸送します。
5. HARUTOのFFMには何が含まれますか？ — 日本での入荷・保管、在庫管理、ご要望に応じたピッキングと梱包、日本全国への配送、定期的な受注レポートです。日本 ⇄ ベトナム間の輸送にも対応しています。
6. 日本でのFFMはどのような企業に向いていますか？ — 日本へ輸出するベトナム企業、日本のECモールで販売する小売事業者、中継倉庫が必要な越境EC事業者、日本で事業を広げたいベトナムブランドに向いています。

**en**
1. Do I need a Visa or MasterCard to buy from Japan? — No. Just send the product link: HARUTO quotes at the VCB + 5 rate (no surcharge) and pays the Japanese shop for you. For buying orders you pay 100% of the item price.
2. How much deposit does auction bidding need? — A 50% deposit before bidding. If you win, you pay the rest and HARUTO settles the purchase; if you don't, HARUTO refunds 100% of the deposit.
3. Which websites can HARUTO buy from? — Yahoo! Auction, Mercari, Rakuten, Amazon Japan and other Japanese online stores. Send the product link and HARUTO will check it and quote.
4. Can I buy myself and send the goods to HARUTO's Japan warehouse? — Yes. With our shipping-only service you buy the goods yourself and send them to HARUTO's Japan warehouse address; HARUTO consolidates them free of charge and ships them to Vietnam.
5. What does HARUTO's fulfillment service include? — Receiving and storage in Japan, inventory management, picking and packing to your requirements, delivery across Japan and regular order reports. HARUTO also handles Japan ⇄ Vietnam shipping.
6. Which businesses is fulfillment in Japan for? — Vietnamese exporters to Japan, retailers selling on Japanese marketplaces, cross-border e-commerce businesses needing a transit warehouse, and Vietnamese brands growing in Japan.

# Phụ lục D — Logo sàn (nếu thiếu file ở B1.1)
Nguồn: Simple Icons (Rakuten, tô màu `#BF0000`) và 2factorauth/twofactorauth (Mercari, Yahoo! JAPAN, Amazon) trên GitHub. Lấy lại bằng:
```bash
curl -sL https://raw.githubusercontent.com/2factorauth/twofactorauth/master/img/j/jp.mercari.com.svg -o public/logo/mercari.svg
curl -sL https://raw.githubusercontent.com/2factorauth/twofactorauth/master/img/y/yahoo.co.jp.svg   -o public/logo/yahoo-auction.svg
curl -sL https://raw.githubusercontent.com/2factorauth/twofactorauth/master/img/a/amazon.com.svg    -o public/logo/amazon-jp.svg
curl -sL https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/rakuten.svg      -o public/logo/rakuten.svg
# rồi thêm fill="#BF0000" vào <path> của rakuten.svg
```
Logo là nhãn hiệu của bên thứ ba, chỉ dùng để chỉ tên sàn (nominative use). Không chỉnh sửa hình dạng, không dùng làm logo của HARUTO.
