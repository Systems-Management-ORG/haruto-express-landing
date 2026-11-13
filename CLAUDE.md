# HARUTO EXPRESS landing — hướng dẫn cho Claude Code

Site marketing đa ngôn ngữ (VI · JA · EN) cho dịch vụ vận chuyển Việt ⇄ Nhật, chạy tại harutoexpress.com. Stack: Next.js 16 (App Router), next-intl 4, Tailwind v4, GSAP, TypeScript strict.

## Đọc trước khi làm
- **UI (trang, section, component, CSS):** dùng lại component và class đã có (`src/shared/ui/*`, `service/*`, `globals.css`). Không tự thêm token màu, bo góc hay bóng đổ mới; design system đang do người khác phụ trách.
- **SEO / URL / metadata:** `docs/SEO-ROADMAP.md`, registry `src/shared/seo/pages.ts`.
- **Prompt thực thi:** `docs/prompts/*.md`. Khi được yêu cầu "thực hiện prompt X", làm đúng thứ tự các bước trong file và báo cáo theo mục Bàn giao của nó.

## Bản đồ code
- `src/app/[locale]/page.tsx` → trang chủ; `src/app/[locale]/[...rest]/page.tsx` → mọi trang con (metadata, JSON-LD) → `SubPage`.
- Template: `modules/landing/components/service/*` (6 trang dịch vụ, config `service-pages.ts`, copy `service-copy.ts`); trang thông tin dùng `InfoPage` (config `info-pages.ts`).
- Primitives dùng chung: `src/shared/ui/*`. SEO: `src/shared/seo/*`. Giá: `src/modules/landing/pricing-data.ts`.
- Copy: `src/i18n/messages/{vi,ja,en}.json` (kiểu lấy theo `vi.json`).

## Luật cứng
1. **Không bịa dữ kiện kinh doanh** (giá, thời gian vận chuyển, số liệu, review, địa chỉ). Chưa có thì để `TODO` và không render.
2. **3 locale cùng tập key.** Thêm copy là thêm cho cả 3; copy JA/EN mới phải ghi vào báo cáo "chờ duyệt".
3. Icon, ảnh, tone gắn theo **id** của item, không theo chỉ số mảng.
4. Giá chỉ lấy từ `pricing-data.ts`; chuỗi giá còn lại trong messages phải được `pricing:check` kiểm.
5. 1 H1/trang có từ khóa chính; không nhảy bậc heading; `Service.name` = H1 hiển thị.
6. Giữ `data-reveal` / `data-reveal-group`, `data-track`, a11y, CSP (`next.config.ts`). Không thêm dependency mới khi chưa hỏi.
7. Git: commit **thẳng lên `main`**, mỗi bước một commit nhỏ, không tạo branch/PR. Chỉ push khi các bước kiểm tra đều pass.

## Kiểm tra (bắt buộc trước khi push)
```bash
npm run typecheck && npm run pricing:check && npm run build
npm run start & sleep 5 && npm run seo:check
```

## Môi trường của chủ repo
Máy Windows, PowerShell 5.1: khi đưa lệnh cho người dùng tự chạy, **không dùng `&&`**. Viết mỗi lệnh một dòng hoặc nối bằng `;`.
