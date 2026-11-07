# HARUTO EXPRESS — UI/UX & Technical Specification

> Version: 1.0 | Date: 2026-11-07 | Focus: **Mobile First**, premium Japanese minimalism, Vietnam ⇄ Japan air freight.  
> Stack: **Next.js + TypeScript + Tailwind CSS** (frontend), **NestJS + Prisma + PostgreSQL** (backend).

## 1. Tóm tắt yêu cầu đã chốt

| Hạng mục | Quyết định |
|---|---|
| Thương hiệu | HARUTO EXPRESS |
| Đối tượng | Khách lẻ và doanh nghiệp |
| Tuyến | Việt Nam → Nhật Bản; Nhật Bản → Việt Nam |
| Vận tải | Chỉ **đường hàng không** |
| Giá | **Công khai** bảng giá (chờ biểu phí chính thức) |
| Tracking | Chưa có; không hiển thị như tính năng đang hoạt động |
| Ngôn ngữ | Tiếng Việt `/vi`, tiếng Nhật `/ja`, tiếng Anh `/en` |
| CTA | Zalo, form website, hotline, Messenger |
| Lợi thế được xác nhận | Có kho riêng; có nhân viên tư vấn |
| Phong cách | Premium, Japanese minimalism |

**Thông điệp chủ đạo:** “Gửi trọn niềm tin. Kết nối hai quốc gia.”  
**Hero headline:** “Khoảng cách xa, kết nối gần.”

Tuyệt đối không tự ghi số ngày giao hàng, tỷ lệ giao đúng hẹn, số khách hàng, giá cước, địa chỉ kho, danh mục hàng nhận hoặc số điện thoại khi chưa có thông tin doanh nghiệp.

## 2. Design system

### 2.1 Màu sắc

| Token | HEX | Vai trò |
|---|---|---|
| `forest` | `#235923` | Màu thương hiệu: CTA, heading, header, link |
| `deep` | `#173C22` | Nền Hero/Footer, độ tương phản cao |
| `gold` | `#E2A240` | Nhấn CTA, icon, đường bay |
| `ivory` | `#FAF8EA` | Background chủ đạo |
| `sage` | `#EAF2E9` | Nền phụ cho section và card |
| `ink` | `#29352C` | Text chính |
| `white` | `#FFFFFF` | Card/form |

HEX được lấy gần đúng từ logo JPG do khách hàng cung cấp; xác minh lại khi có SVG/AI.

### 2.2 Typographic scale

- Tiếng Việt: Be Vietnam Pro; Nhật: Noto Sans JP; Anh: Inter / Be Vietnam Pro. **Starter hiện dùng system-font fallback**, cần tải font phù hợp bằng cách tối ưu hóa self-host hoặc `next/font` trước production.
- H1: mobile 36–40px, tablet 48px, desktop 60px.
- H2: mobile 30px, desktop 36px.
- Body: 16–18px, line-height 1.6–1.8.
- Content width: tối đa ~1280px, padding mobile 20px.
- Rounded cards: 20–32px. Buttons: chiều cao tối thiểu 44px.

### 2.3 Quy tắc trải nghiệm

1. Thiết kế **mobile trước**, sau đó mở rộng `sm`, `md`, `lg`.
2. Không dựa vào hover để truy cập chức năng quan trọng.
3. CTA hiện rõ ở Hero và Contact, không dùng nhiều floating widgets.
4. Hỗ trợ bàn phím, label trong form, trạng thái loading/error/success, `prefers-reduced-motion`.
5. Hình ảnh thực tế kho và đội ngũ ưu tiên hơn ảnh stock. Chỉ đưa ảnh minh họa khi được cấp quyền dùng.
6. Không ghi nhận/xác nhận đơn hàng chỉ bằng form; form này là **yêu cầu tư vấn**.

## 3. Sitemap

- `/vi`, `/ja`, `/en`: landing page ba ngôn ngữ.
- Các trang mở rộng giai đoạn 2: `/[locale]/services`, `/[locale]/pricing`, `/[locale]/shipping-guide`, `/[locale]/about`, `/[locale]/contact`, `/[locale]/privacy`, `/[locale]/terms`.
- Không triển khai `/tracking` ở MVP.

## 4. Nội dung và UI theo từng section

### 01. Header
- Mobile: logo, nút hamburger, menu xổ dọc gồm Dịch vụ / Bảng giá / Quy trình / Liên hệ, chuyển ngôn ngữ VI/JA/EN.
- Desktop: menu nằm ngang, CTA `Tư vấn ngay`.
- Sticky ở đầu trang, backdrop nhẹ; anchor có `scroll-margin-top` để không bị header che.

### 02. Hero
- Eyebrow: `VIETNAM ⇄ JAPAN / AIR FREIGHT`.
- H1: `Khoảng cách xa, kết nối gần.`
- Mô tả: `Vận chuyển hàng không hai chiều Việt Nam – Nhật Bản dành cho cá nhân và doanh nghiệp. Đội ngũ HARUTO đồng hành cùng bạn từ bước tư vấn.`
- CTA 1: `Xem bảng giá` → `#pricing`.
- CTA 2: `Liên hệ tư vấn` → `#contact`.
- Hình ảnh: ảnh vận tải hàng không thực tế; bản starter dùng illustration tuyến bay bằng CSS để tránh dùng ảnh chưa có bản quyền.
- Layout: mobile text rồi visual, desktop chia hai cột.

### 03. Vì sao chọn HARUTO?
- Heading: `Vì sao chọn HARUTO?`
- 3 cards: `Kho hàng riêng`, `Nhân viên tư vấn`, `Vận chuyển hai chiều`.
- Không tự công bố KPI chưa được xác nhận.

### 04. Dịch vụ
- Heading: `Một hành trình, hai giải pháp`.
- Card cá nhân: `Gửi bưu kiện, quà tặng và đồ dùng cá nhân đủ điều kiện vận chuyển giữa Việt Nam và Nhật Bản.`
- Card B2B: `Tiếp nhận nhu cầu vận chuyển hàng thương mại bằng đường hàng không và tư vấn theo từng lô hàng.`
- CTA mỗi card: `Yêu cầu tư vấn` → `#contact`.

### 05. Tuyến vận chuyển
- Hai card: `Việt Nam → Nhật Bản` và `Nhật Bản → Việt Nam`.
- Không gán thời gian giao khi chưa có SLA thực tế.

### 06. Bảng giá
- Hai tab VN → JP / JP → VN.
- Bảng: khối lượng / đơn giá / trạng thái.
- **MVP chỉ hiện dấu `—` và `Chờ cập nhật` cho đến khi có bảng giá do doanh nghiệp phê duyệt.**
- Các mốc cân minh họa không phải biểu phí; phải thay lại trước công bố.
- Khi có dữ liệu thật, bổ sung: tiền tệ, đơn vị kg, cân nặng tính cước, trọng lượng quy đổi, phí phát sinh, thuế, hiệu lực, quy định loại hàng và vùng giao nhận.
- Tách bảng giá B2B nếu áp dụng giá theo hợp đồng.

### 07. Quy trình 4 bước
1. Liên hệ tư vấn.
2. Kiểm tra hàng và xác nhận cước.
3. Tiếp nhận và vận chuyển.
4. Giao hàng theo thỏa thuận.

Dùng layout xếp dọc mobile / 4 cột desktop; không tạo timeline animation cản trở đọc.

### 08. Lưu ý hàng hóa
- Nội dung: `Danh mục hàng nhận vận chuyển phụ thuộc quy định của từng quốc gia. Nhân viên sẽ kiểm tra loại hàng và chứng từ trước khi xác nhận tiếp nhận.`
- Khi phát triển hướng dẫn riêng: nhóm hàng nhận, hạn chế/cấm, đóng gói, hồ sơ, trách nhiệm người gửi. Phải xác minh pháp lý ở Việt Nam và Nhật Bản.

### 09. Về HARUTO
- Heading: `Cầu nối vận chuyển giữa Việt Nam và Nhật Bản`.
- Nội dung đã chốt: tập trung hàng không hai chiều, kho riêng, đội ngũ tư vấn.
- Sẽ bổ sung địa chỉ kho, hình ảnh và đăng ký pháp lý sau khi doanh nghiệp gửi thông tin.

### 10. FAQ
- `HARUTO nhận những loại hàng nào?`
- `Giá cước được tính như thế nào?`
- `Tôi có thể theo dõi vận đơn trực tuyến không?`
- Câu trả lời tracking: `Tính năng tra cứu trực tuyến đang được lên kế hoạch. Hiện hãy liên hệ nhân viên hỗ trợ để hỏi tình trạng kiện hàng.`

### 11. Form tư vấn
- Toggle cá nhân / doanh nghiệp.
- Fields: họ tên (required), công ty (required cho B2B), số điện thoại (required), email (optional), tuyến, cân nặng (optional), mô tả hàng (optional), checkbox đồng ý xử lý dữ liệu (required).
- Loading → success / error; một request tạo một `Lead`.
- Chống abuse (rate-limit, CAPTCHA nếu cần), chống spam, thông báo tới đội ngũ, consent policy và retention: **todo trước production**.
- CTA Zalo, hotline và Messenger chỉ hiển thị nhãn ở bản demo, chưa liên kết vì chưa được cung cấp tài khoản/URL/số thật.

### 12. Footer
- HARUTO EXPRESS, định vị air freight hai chiều, năm hiện tại.
- Bổ sung địa chỉ, MST, links chính sách, thông tin hotline/Zalo khi có thông tin xác thực.

## 5. Responsive / Mobile First

| Viewport | Layout |
|---|---|
| `<640px` | Padding 20px, 1 cột, drawer menu, CTA full-width, form 1 cột |
| `640–767px` | Button nằm ngang, form có nhóm trường 2 cột khi đủ chỗ |
| `768–1023px` | Services 2 cột, process 4 cột, header vẫn gọn |
| `≥1024px` | Hero 2 cột, nav desktop, form contact 2 cột |

Nội dung `#pricing` cho cuộn ngang có kiểm soát trên màn hình nhỏ. Giữ hiệu năng tốt và dùng media queries tôn trọng reduced motion.

## 6. Ba ngôn ngữ

Dùng dictionary tại `apps/web/lib/content.ts` cho VI/JA/EN, chuyển ngôn ngữ qua URL. Trước khi phát hành cần review bản dịch Nhật và Anh, bổ sung canonical URL, OpenGraph, `hreflang`, sitemap, robots, structured data sau khi xác minh tên pháp lý và liên hệ.

## 7. Kiến trúc kỹ thuật

```text
Browser / Mobile
      │
      ▼
Next.js App Router + Tailwind CSS  (port 3000)
      │ POST /api/leads
      ▼
NestJS REST API                  (port 4000)
      │ DTO + ValidationPipe
      ▼
Leads Service → Prisma
      │
      ▼
PostgreSQL 17                   (port 5432 loopback)
```

### API

`POST /api/leads`

Request:

```json
{
  "kind": "PERSONAL",
  "locale": "vi",
  "fullName": "Nguyen Van A",
  "phone": "0900000000",
  "email": "a@example.com",
  "direction": "VN_JP",
  "weightKg": 5,
  "description": "Kien hang mau",
  "privacyConsent": true
}
```

Response `201`:

```json
{"id":"<generated-id>","createdAt":"<ISO-timestamp>","message":"Lead received"}
```

Model `Lead`: id, kind, locale, fullName, phone, email, company, direction, weightKg, description, privacyConsent, status, createdAt, updatedAt.

**Security trước khi production:** server-side validation hiện có; cần bổ sung rate-limit, anti-bot, privacy policy thực tế, chính sách thời gian lưu và xóa dữ liệu, cơ chế phân quyền cho người xem lead, bảo mật secrets, logging tránh lộ PII, thông báo nội bộ và giới hạn CORS theo domain thật. Không mở CRUD lead công khai.

## 8. Chạy local

**Yêu cầu:** Node.js 20+, npm, Docker Desktop.

Từ thư mục `haruto-express`:

```bash
# 1. Chuẩn bị env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local

# 2. PostgreSQL
docker compose up -d postgres

# 3. API
cd apps/api
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev

# 4. Terminal thứ hai — frontend
cd apps/web
npm install
npm run dev
```

Mở `http://localhost:3000/vi`, `http://localhost:3000/ja` hoặc `http://localhost:3000/en`. API endpoint: `http://localhost:4000/api/leads`.

Trong sản phẩm thật, thay password PostgreSQL ở compose + `DATABASE_URL` bằng mật khẩu riêng; không đưa `.env` vào Git. Nên thay `prisma migrate dev` bằng `prisma migrate deploy` ở CI/CD sau khi migration được review và commit.

## 9. Phạm vi MVP / chưa triển khai

**Đã có source mẫu:** landing page VI/JA/EN, responsive, UI section, tabs bảng giá, accordion FAQ, form tư vấn, API NestJS + Prisma schema + PostgreSQL local compose, logo khách hàng.

**Chưa có:** thông tin cước thật, hotline/Zalo/Messenger, ảnh kho và người thật, hệ thống tracking, danh mục hàng hóa chuẩn, admin quản lý lead, gửi email/notification, chính sách bảo mật/điều khoản đã duyệt, rate limit chống spam, unit/E2E tests, cấu hình deploy production, review bản dịch bởi người bản ngữ.

## 10. Reference websites để tham khảo bố cục (không sao chép)

- DHL Express: https://www.dhl.com/jp-en/home.html — đặt CTA shipping/quotes gần đầu trang.
- Japan Express: https://japanexpress.online/ — tổ chức thông tin tuyến Việt–Nhật.
- TIXIMAX Japan: https://tiximax.jp/en — phân nhóm dịch vụ cross-border.
- GHDNN Express: https://guihangdinuocngoai.vn/dich-vu/gui-hang-di-nhat-ban/ — giải thích cước vận chuyển và FAQ.

## 11. Checklist cần HARUTO cung cấp

- [ ] Biểu phí 2 chiều, đơn vị tiền, từng mốc cân, chính sách tính trọng lượng, phụ phí, thuế và ngày hiệu lực.
- [ ] Danh mục hàng nhận / hạn chế / cấm, yêu cầu đóng gói và giấy tờ.
- [ ] Tên pháp nhân, MST, địa chỉ và phạm vi hoạt động.
- [ ] Hotline, Zalo, Messenger, email, giờ làm việc.
- [ ] Địa chỉ kho và ảnh kho/nhân viên được phép sử dụng.
- [ ] Thời gian vận chuyển dự kiến theo tuyến/khu vực (nếu công bố).
- [ ] Nội dung chính sách bảo mật, điều khoản, xử lý khiếu nại, bồi thường.
- [ ] Quy trình xử lý lead: ai nhận thông báo, bao lâu phản hồi, xử lý dữ liệu thế nào.

---

**Ghi chú quan trọng:** Đây là source starter và bản đặc tả; trước khi chạy production cần hoàn thiện các mục đánh dấu chưa có, rà soát bảo mật, kiểm thử chức năng và kiểm thử đa thiết bị.
