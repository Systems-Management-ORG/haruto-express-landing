# PROMPT — Lấy logo chính thức (hãng vận chuyển + sàn TMĐT Nhật)

> **Cách dùng:** ở thư mục gốc repo, chạy `claude` rồi gõ:
> `Đọc docs/prompts/2026-11-13-fetch-logos.md và thực hiện.`

## Mục tiêu
Tải logo **hiện hành, chính thức** của 9 thương hiệu dưới đây vào repo. Sau đó nối vào config `src/modules/landing/partners.ts` (tạo ở prompt `2026-11-13-partners-marquee.md`).

| id | Thương hiệu | Trang chính thức (lấy logo từ đây) | File đích |
|---|---|---|---|
| `sagawa` | Sagawa Express 佐川急便 | https://www.sagawa-exp.co.jp/ | `public/logo/carriers/sagawa.svg` |
| `yamato` | Yamato Transport ヤマト運輸 | https://www.kuronekoyamato.co.jp/ | `public/logo/carriers/yamato.svg` |
| `japanPost` | Japan Post 日本郵便 | https://www.post.japanpost.jp/ | `public/logo/carriers/japan-post.svg` |
| `yahooShopping` | Yahoo!ショッピング | https://shopping.yahoo.co.jp/ | `public/logo/yahoo-shopping.svg` |
| `zozotown` | ZOZOTOWN | https://zozo.jp/ | `public/logo/zozotown.svg` |
| `rakuma` | ラクマ (Rakuma) | https://fril.jp/ | `public/logo/rakuma.svg` |
| `qoo10` | Qoo10 | https://www.qoo10.jp/ | `public/logo/qoo10.svg` |
| `surugaya` | 駿河屋 (Suruga-ya) | https://www.suruga-ya.jp/ | `public/logo/surugaya.svg` |
| `mandarake` | まんだらけ (Mandarake) | https://www.mandarake.co.jp/ | `public/logo/mandarake.svg` |

## Cách lấy (theo thứ tự ưu tiên)
1. Mở trang chính thức, tìm logo ở **header** của trang: SVG inline (copy nguyên phần tử `<svg>`) hoặc `<img src="…logo….svg">` (tải file đó về).
2. Nếu header chỉ có PNG/WebP: tải bản có độ phân giải lớn nhất, lưu đuôi `.png` (cao ≥ 128px, nền trong suốt nếu có). Đổi đuôi file đích cho đúng và ghi chú vào báo cáo.
3. Nếu trang có mục brand / press kit / ロゴ使用ガイドライン thì ưu tiên file ở đó, và ghi lại điều kiện sử dụng.
4. **Không** lấy từ các repo icon tổng hợp (svg-logos, Arcticons…), Wikipedia hay ảnh tìm kiếm, vì hay là mẫu cũ. **Không** tự vẽ lại logo.

## Kiểm tra từng file
- Logo phải **giống logo đang hiển thị trên header trang chính thức hôm nay**. Các mẫu cũ đã biết, không được dùng:
  - Japan Post: chữ "日本郵政公社" (pháp nhân đã giải thể từ 2007).
  - Sagawa: mẫu chữ "TRANSPORT! COMMUNICATION".
  - Yamato: mẫu mèo đen cũ trước lần đổi nhận diện năm 2021. Hãy so với logo trên header của kuronekoyamato.co.jp.
- Làm sạch SVG: bỏ `<script>`, bỏ thẻ `<text>` thừa, bỏ `width`/`height` cố định nhưng **giữ `viewBox`**, thêm `<title>` = tên thương hiệu.
- Render thử từng file ở chiều cao 40px trên nền trắng (ví dụ `npx --yes svgexport` hoặc mở bằng trình duyệt), kiểm tra không vỡ hình, không bị cắt mép.
- Kích thước file ≤ 50 KB. Nếu SVG lớn hơn, tối ưu bằng `npx --yes svgo`.

## Nối vào code
Nếu `src/modules/landing/partners.ts` đã tồn tại:
- `CARRIERS.<id>.logo = "/logo/carriers/<file>"` cho 3 hãng vận chuyển.
- `MARKETPLACE_LOGOS.<id> = "/logo/<file>"` cho 6 sàn.

Nếu file chưa tồn tại (prompt partners chưa chạy) thì chỉ lưu file, không sửa code, và ghi rõ trong báo cáo.

Sau đó chạy:
```bash
npm run typecheck && npm run build
```
Mở trang chủ trên localhost, kiểm tra marquee và thẻ hãng vận chuyển hiển thị đúng logo, không có ảnh lỗi 404.

## Commit
Commit thẳng lên `main`: `assets: official logos for Japanese carriers and marketplaces`, rồi `git push origin main`.

## Báo cáo
Lập bảng gồm: id, URL nguồn chính xác của từng logo, định dạng (svg/png), dung lượng file, điều kiện sử dụng (nếu tìm thấy). Liệt kê riêng những logo **không lấy được** kèm lý do, để chủ site liên hệ hãng xin file.
