# Form tư vấn → Google Sheet

Luồng dữ liệu:

```
Khách điền form  →  POST /api/leads (Next.js: kiểm tra dữ liệu, chống spam)
                 →  Google Apps Script web app (kèm mã bí mật)
                 →  thêm 1 dòng vào tab "Leads" của Google Sheet
```

| Thành phần | Giá trị |
|---|---|
| Google Sheet | `1ynh4GCoWVoJkPZbtWJEMMHW8CujAvNr0d7kn81wdT-s` (tab `Leads`, tự tạo) |
| Apps Script (script ID) | `1SDxr-iDZ8ZPNfCWBhsptlDng9H9gwQM0Z0xlhJaEkUvRdT68U3VBXf7m` |
| Code script | `scripts/google-sheets/leads.gs` + `appsscript.json` (đẩy bằng clasp) |
| Web App đang dùng | deployment `AKfycbxdWhkL…` (phiên bản 1) |

## Hai biến môi trường của website

```
LEADS_WEBHOOK_URL=https://script.google.com/macros/s/<deploymentId>/exec
LEADS_WEBHOOK_SECRET=<chuỗi bí mật>
```

- `LEADS_WEBHOOK_URL`: URL của bản triển khai Web App (`clasp list-deployments` để xem deploymentId).
- `LEADS_WEBHOOK_SECRET`: chuỗi ngẫu nhiên do mình tự tạo, không phải key của Google. Script chỉ lưu
  **mã băm SHA-256** của chuỗi này (`SECRET_SHA256` trong `leads.gs`), nên xem code không suy ra được.

Trên máy local, hai biến nằm trong `.env.local` (git bỏ qua). Khi deploy website, khai báo hai biến
này ở nơi deploy. Khởi động lại server sau khi đổi.

## Lần đầu: cấp quyền cho script (bắt buộc, chỉ một lần)

Chưa cấp quyền thì Web App trả **403 "Truy cập bị từ chối"**.

1. Mở `https://script.google.com/d/1SDxr-iDZ8ZPNfCWBhsptlDng9H9gwQM0Z0xlhJaEkUvRdT68U3VBXf7m/edit`.
2. Trên thanh công cụ chọn hàm **`authorize`** → **Chạy**.
3. Google hỏi quyền → chọn tài khoản → **Nâng cao → Đi tới … (không an toàn)** → **Cho phép**.
   Cảnh báo "không an toàn" xuất hiện vì script do chính bạn viết, chưa qua Google xác minh.
4. Nhật ký thực thi hiện `OK — sheet 'Leads' is ready`, và Sheet có tab `Leads` với dòng tiêu đề.

## Sửa script và triển khai lại

```bash
cd scripts/google-sheets
clasp push --force                                   # đẩy code
clasp update-deployment <deploymentId> -d "mô tả"    # cập nhật Web App, giữ nguyên URL
```

Nếu chỉ `push` mà không `update-deployment`, URL cũ vẫn chạy code cũ.

**Đổi mã bí mật:**
1. Tạo chuỗi mới.
2. Thay `SECRET_SHA256` bằng mã băm của chuỗi mới.
3. `push` và `update-deployment`.
4. Cập nhật `LEADS_WEBHOOK_SECRET` của website.

## Khi form báo "Chưa gửi được yêu cầu"

- API trả `503 not_configured`: thiếu biến môi trường.
- API trả `502`: script từ chối hoặc lỗi. Xem log server (`[leads] forward failed`) và
  **Thực thi** trong trình chỉnh sửa Apps Script.

## Ghi chú

- **Chống spam:** có trường ẩn bẫy bot và giới hạn 5 yêu cầu / 10 phút cho mỗi IP.
- **Bảo mật Sheet:** Sheet chứa tên, số điện thoại, email của khách. Chỉ chia sẻ Sheet cho nhân viên phụ trách.
