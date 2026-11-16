# PROMPT — Gia cố DNS / Cloudflare / tài khoản cho harutoexpress.com

> **Cách dùng (máy local, agent Codex):** ở thư mục gốc repo, gõ:
> `Đọc docs/prompts/2026-11-16-cloudflare-hardening.md và thực hiện toàn bộ, theo đúng thứ tự P0 → H6.`
>
> Prompt này **chủ yếu đổi DNS trên Cloudflare**, không đổi code. Chỉ bước H5 (tùy chọn, cần chủ site đồng ý) sửa `next.config.ts`. Ngoài H5 ra **không commit gì**.
> Đọc `CLAUDE.md` của repo trước và làm theo mọi luật cứng trong đó (đặc biệt: lệnh đưa cho chủ site chạy trên PowerShell 5.1 **không dùng `&&`**).
> Snapshot khi viết: 2026-11-16, `main` @ `7d1054f`.

---

## 0. Hiện trạng (đo bằng DoH / RDAP / curl ngày 2026-11-16)

| Mục | Hiện trạng |
|---|---|
| Registrar | **Spaceship, Inc.** (IANA 3862). Đăng ký 2026-11-07, hết hạn **2027-11-07**. Trạng thái `client transfer prohibited` (đã khóa chuyển). |
| NS | `gerardo.ns.cloudflare.com`, `stephane.ns.cloudflare.com` |
| DNSSEC | **Chưa bật.** RDAP `delegationSigned: false`, không có DS ở `.com`, zone không có DNSKEY. |
| Bản ghi | 3 bản ghi: `@ CNAME 56b649b0d6888f78.vercel-dns-017.com` (DNS only, Cloudflare flatten thành A `64.29.17.65`, `216.198.79.65`), `www CNAME` cùng đích (DNS only), `@ TXT google-site-verification=NiOvA2…` (Search Console, **giữ**). Không có AAAA. |
| CAA | Apex: **không có**. `www` đi theo CNAME nên nhận CAA của đích Vercel: `letsencrypt.org`, `pki.goog`, `sectigo.com`, `globalsign.com`. |
| Mail | **Không có MX, không SPF, không DMARC**, không thấy DKIM ở các selector phổ biến (`google`, `default`, `selector1`, `k1`, `s1`). `BUSINESS.email` trong `src/shared/seo/business.ts` đang rỗng: domain **không dùng email**. |
| TLS | Cả apex và www: Let's Encrypt (CN `YR1`), do Vercel cấp qua HTTP-01. |
| HSTS | Apex: `max-age=31536000` (từ `next.config.ts`, không `includeSubDomains`). www (redirect 308 của Vercel): `max-age=63072000` do Vercel tự thêm. `http://` → 308 sang `https://harutoexpress.com/`. |
| App | CSP trong `next.config.ts` dùng `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com` (không nonce/hash). `/api/leads` giới hạn 5 request/10 phút **theo IP đầu tiên trong `x-forwarded-for`**. |

---

## 1. Quyết định: **giữ DNS only (mây xám), KHÔNG bật proxy Cloudflare**

**Khuyến nghị:** giữ nguyên 2 CNAME ở chế độ DNS only. Cloudflare chỉ làm DNS (+ DNSSEC).

Lý do:
1. **Vercel khuyến nghị kết nối trực tiếp.** KB "Using Cloudflare with Vercel" (https://vercel.com/kb/guide/cloudflare-with-vercel): *"We recommend connecting directly where possible"*, vì *"Vercel already provides a CDN and security controls"*. Các hệ quả được liệt kê: Vercel mất thông tin kết nối thật (firewall/DDoS mitigation kém chính xác, chặn nhầm cả IP egress dùng chung), **Bot Protection managed ruleset không chạy sau reverse proxy**, thêm độ trễ, thêm một điểm hỏng, cache ngoài có thể trả HTML cũ với asset của deploy mới, app thấy IP/geo của proxy. Trang troubleshooting (https://vercel.com/docs/domains/troubleshooting) cũng nói với Cloudflare thì dùng **DNS only** để cấp/gia hạn chứng chỉ thuận lợi.
2. **Rate limit của form sẽ hỏng.** `src/app/api/leads/route.ts` đếm theo `x-forwarded-for`. Sau proxy, Vercel thấy IP của edge Cloudflare, nên nhiều khách thật dùng chung một IP và bị `429` sau 5 lead/10 phút. Muốn sửa phải tin `cf-connecting-ip`, nhưng header này giả mạo được khi gọi thẳng vào Vercel (`haruto-express-landing.vercel.app` vẫn trả 200), tức là phải sửa code và khóa origin.
3. **CSP sẽ chặn script Cloudflare chèn vào.** Rocket Loader (`ajax.cloudflare.com`), Web Analytics beacon (`static.cloudflareinsights.com`), Zaraz, Bot Fight Mode/JS challenge đều chèn script ngoài `script-src` hiện tại → lỗi console hoặc vỡ trang.
4. Trang tĩnh đã được CDN của Vercel phục vụ (`X-Vercel-Cache: HIT`), proxy không mang thêm lợi ích hiệu năng đáng kể.

**Phương án thay thế (chỉ khi chủ site yêu cầu rõ, KHÔNG làm trong prompt này).** Nếu sau này bắt buộc bật mây cam, cấu hình tối thiểu an toàn:
- SSL/TLS → Overview: **Full (strict)**. Không dùng Flexible (gây vòng lặp redirect, Vercel ghi rõ). Edge Certificates: Minimum TLS 1.2.
- Caching → Cache Rules: rule cho hostname `harutoexpress.com` và `www.harutoexpress.com` → **Bypass cache** (bắt đầu với cache ngoài tắt, theo Vercel). Tuyệt đối không cache `/.well-known/vercel/*`, `/api/*`.
- Cho `/.well-known/acme-challenge/*` đi qua HTTP port 80 tới Vercel: không redirect, không challenge, không cache (Configuration Rule / WAF skip cho path này; tắt "Always Use HTTPS" nếu nó chặn path này).
- Speed → Optimization: **tắt Rocket Loader**, tắt Auto Minify (nếu còn hiển thị), tắt Email Address Obfuscation, tắt Speed Brain/Early Hints nếu gây lỗi. Không bật Web Analytics "automatic setup", không bật Zaraz.
- Security: **tắt Bot Fight Mode** (chèn JS challenge); WAF managed rules ở chế độ log trước.
- Sửa `/api/leads` đọc IP từ header của proxy chỉ khi đã khóa origin, rồi kiểm tra form gửi lead thật thành công.
- So sánh `curl -sI` trực tiếp và qua proxy: CSP, HSTS, `X-Vercel-Cache` giống nhau; Search Console không báo lỗi.

---

## 2. Biến môi trường và quy tắc an toàn khi gọi API

Chủ site cung cấp (Codex **không tự tạo, không in ra, không ghi vào file trong repo**):
- `CF_API_TOKEN`: API Token **có phạm vi**: *Zone → DNS → Edit* + *Zone → Zone → Read*, **Zone Resources: Include → Specific zone → harutoexpress.com**, có hạn dùng ngắn (ví dụ 2 ngày), tùy chọn lọc IP máy chạy. **Không dùng Global API Key.**
- `CF_ZONE_ID`: `<ZONE_ID — chủ site lấy ở Cloudflare → harutoexpress.com → Overview → cột phải "API / Zone ID">`.

Quy tắc:
- Chạy trong Git Bash/bash. Không `set -x`, không `echo $CF_API_TOKEN`, không dán token vào lệnh (luôn dùng `"Authorization: Bearer $CF_API_TOKEN"`), không lưu log có header.
- Trước mọi bước: `export CF=https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID`.
- Mọi file tạm (snapshot, id bản ghi) để **ngoài repo**, ví dụ `$HOME/haruto-dns-backup/`.
- Ghi lại `id` của từng bản ghi **do prompt này tạo** (để rollback). Không bao giờ sửa/xóa bản ghi có sẵn.
- Hàm DoH để kiểm tra (dùng trong các bước):
  ```bash
  doh() { curl -s "https://cloudflare-dns.com/dns-query?name=$1&type=$2" -H "accept: application/dns-json"; echo; }
  ```
- API trả `403`/`10000 Authentication error` ở bước nào → **dừng bước đó**, chuyển sang cách làm bằng dashboard ghi trong bước, báo lại.

---

## P0. Điều kiện trước (chủ site tự làm, Codex chỉ hỏi và ghi nhận)
- [ ] Bật **2FA** cho Cloudflare, Vercel và Spaceship (xem H4). Ít nhất Cloudflare phải xong trước khi tạo token.
- [ ] Tạo `CF_API_TOKEN` như mục 2 và đưa `CF_ZONE_ID`.
- [ ] Xác nhận: **domain không dùng và chưa định dùng email** `@harutoexpress.com` (Google Workspace, Zoho, gửi mail từ form…). Nếu **có** → bỏ H1, dừng và báo (phải cấu hình SPF/DKIM/DMARC theo nhà cung cấp mail, không dùng null MX).
- [ ] Có quyền đăng nhập Spaceship để thêm DS record (bước H3).

Thiếu mục nào thì làm các bước không phụ thuộc và báo lại phần còn thiếu.

---

## H0. Kiểm tra token, chụp lại zone (không đổi gì)
```bash
curl -s -H "Authorization: Bearer $CF_API_TOKEN" https://api.cloudflare.com/client/v4/user/tokens/verify | jq '.success, .result.status'
mkdir -p "$HOME/haruto-dns-backup"
curl -s -H "Authorization: Bearer $CF_API_TOKEN" "$CF/dns_records?per_page=100" > "$HOME/haruto-dns-backup/records-before.json"
jq -r '.result[] | [.id,.type,.name,.content,.proxied,.ttl] | @tsv' "$HOME/haruto-dns-backup/records-before.json"
curl -s -H "Authorization: Bearer $CF_API_TOKEN" "$CF/dnssec" | jq '.result.status'
```
Kỳ vọng: token `active`; đúng **3 bản ghi** như mục 0 (2 CNAME `proxied: false`, 1 TXT google-site-verification); DNSSEC `disabled`.
**Khác kỳ vọng** (có bản ghi lạ, CNAME đang `proxied: true`, đã có MX/SPF/CAA, DNSSEC đã bật) → **dừng và báo**, không tự "sửa cho đúng".

Đo baseline:
```bash
for t in A CAA MX TXT DS; do doh harutoexpress.com $t; done
doh _dmarc.harutoexpress.com TXT
curl -sI https://harutoexpress.com/vi | grep -iE "^HTTP|strict|server"
curl -sI https://www.harutoexpress.com/ | grep -iE "^HTTP|location"
```

---

## H1. Chống giả mạo email cho domain **không gửi/nhận mail**
Chỉ làm khi P0 xác nhận không dùng email. Tạo 4 bản ghi (TTL 3600, không proxy):

| Type | Name | Nội dung | Ý nghĩa |
|---|---|---|---|
| MX | `harutoexpress.com` | `.` priority `0` | Null MX (RFC 7505): domain không nhận mail |
| TXT | `harutoexpress.com` | `v=spf1 -all` | Không máy chủ nào được gửi mail thay domain |
| TXT | `_dmarc.harutoexpress.com` | `v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s` | Từ chối mail giả mạo, cả subdomain |
| TXT | `*._domainkey.harutoexpress.com` | `v=DKIM1; p=` | Thu hồi mọi khóa DKIM (khuyến nghị M3AAWG cho domain không gửi mail) |

```bash
add() { curl -s -X POST "$CF/dns_records" -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" --data "$1" | tee -a "$HOME/haruto-dns-backup/created.jsonl" | jq -c '{ok: .success, id: .result.id, type: .result.type, name: .result.name, err: .errors}'; }
add '{"type":"MX","name":"harutoexpress.com","content":".","priority":0,"ttl":3600,"comment":"null MX - domain does not receive mail"}'
add '{"type":"TXT","name":"harutoexpress.com","content":"\"v=spf1 -all\"","ttl":3600,"comment":"SPF - domain sends no mail"}'
add '{"type":"TXT","name":"_dmarc.harutoexpress.com","content":"\"v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s\"","ttl":3600}'
add '{"type":"TXT","name":"*._domainkey.harutoexpress.com","content":"\"v=DKIM1; p=\"","ttl":3600}'
```
- Không có `rua=`: domain không có hộp thư nhận báo cáo. Nếu chủ site muốn báo cáo DMARC, thêm sau `rua=mailto:<ĐỊA CHỈ CHỦ SITE CUNG CẤP>` (hoặc dùng Cloudflare → Email → DMARC Management). Không tự bịa địa chỉ.
- Cloudflare từ chối null MX `.` qua API → chủ site thêm bằng dashboard (DNS → Records → Add record → MX, Mail server `.`, Priority `0`). Dashboard cũng không cho → bỏ null MX, giữ 3 bản ghi còn lại, báo lại.
- **Chỉ được có 1 bản ghi SPF** ở apex. TXT google-site-verification là bản ghi riêng, giữ nguyên.

**Kiểm tra:**
```bash
doh harutoexpress.com MX            # data: "0 ."
doh harutoexpress.com TXT           # có CẢ google-site-verification=NiOvA2… VÀ v=spf1 -all
doh _dmarc.harutoexpress.com TXT    # v=DMARC1; p=reject; ...
doh x._domainkey.harutoexpress.com TXT   # v=DKIM1; p=
```
Thêm (thủ công, ghi kết quả): https://www.learndmarc.com hoặc MXToolbox "SPF/DMARC lookup" cho `harutoexpress.com` không báo lỗi cú pháp.
**Rollback:** `curl -s -X DELETE "$CF/dns_records/<ID>" -H "Authorization: Bearer $CF_API_TOKEN"` cho từng `id` trong `created.jsonl`.

---

## H2. CAA ở apex
CAA ở apex áp cho `harutoexpress.com` và mọi subdomain tương lai **không** phải CNAME. `www` là CNAME nên vẫn theo CAA của đích Vercel (không đổi được, và không được thêm CAA ở `www` vì xung đột CNAME).

Danh sách CA: Vercel docs chỉ yêu cầu tối thiểu `0 issue "letsencrypt.org"` (chứng chỉ hiện tại đều là Let's Encrypt). Tuy vậy đích CNAME của Vercel đang công bố thêm `pki.goog`, `sectigo.com`, `globalsign.com`, có thể để Vercel dự phòng khi gia hạn. **Khuyến nghị: lấy đúng danh sách `issue` mà đích Vercel đang công bố lúc chạy**, để không chặn đường gia hạn dự phòng của Vercel:
```bash
doh 56b649b0d6888f78.vercel-dns-017.com CAA | jq -r '.Answer[]?.data'
```
Với mỗi dòng `0 issue "<ca>"` ở trên, tạo một bản ghi. Thêm 1 bản ghi `issuewild ";"` (site không dùng wildcard):
```bash
for ca in $(doh 56b649b0d6888f78.vercel-dns-017.com CAA | jq -r '.Answer[]?.data' | sed -n 's/^0 issue "\(.*\)"$/\1/p'); do
  add "{\"type\":\"CAA\",\"name\":\"harutoexpress.com\",\"data\":{\"flags\":0,\"tag\":\"issue\",\"value\":\"$ca\"},\"ttl\":3600}"
done
add '{"type":"CAA","name":"harutoexpress.com","data":{"flags":0,"tag":"issuewild","value":";"},"ttl":3600}'
```
- Danh sách lấy về **không chứa `letsencrypt.org`** hoặc rỗng → **dừng**, không tạo CAA, báo lại.
- Không thêm `iodef` (không có hộp thư).
- Cloudflare có thể tự thêm (ẩn) CAA cho các CA của Universal SSL khi zone có CAA. Thấy thêm CA lạ trong kết quả DoH → ghi vào báo cáo, **không xóa**.

**Kiểm tra:**
```bash
doh harutoexpress.com CAA         # có letsencrypt.org (+ các CA của Vercel) và issuewild ";"
doh www.harutoexpress.com CAA     # vẫn là CAA của đích Vercel, không đổi
curl -sI https://harutoexpress.com/vi | head -1   # vẫn 307 → /vi, TLS OK
```
Ghi chú để theo dõi: chứng chỉ apex hiện hết hạn **2027-02-05**; Vercel gia hạn trước đó khoảng 30 ngày. Ngày ~2027-01-10 kiểm tra lại Vercel → Settings → Domains không báo lỗi chứng chỉ.
**Rollback:** xóa các bản ghi CAA theo `id` trong `created.jsonl`. (Lỗi cấp chứng chỉ trên Vercel do CAA → rollback ngay.)

---

## H3. DNSSEC (Cloudflare ký zone + DS ở Spaceship)
Thứ tự **bắt buộc**: bật ở Cloudflare → lấy DS → thêm DS ở registrar. Gỡ thì làm ngược lại.

1. **Bật ở Cloudflare (Codex):**
   ```bash
   curl -s -X PATCH "$CF/dnssec" -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" --data '{"status":"active"}' | jq '.success, .result.status'
   curl -s -H "Authorization: Bearer $CF_API_TOKEN" "$CF/dnssec" | jq '.result | {status, key_tag, algorithm, digest_type, digest, ds}' | tee "$HOME/haruto-dns-backup/dnssec-ds.json"
   ```
   Kỳ vọng `status: "pending"`, `algorithm: "13"`, `digest_type: "2"`. API trả 403 → chủ site làm: Cloudflare → harutoexpress.com → **DNS → Settings → DNSSEC → Enable DNSSEC**, rồi copy bảng DS.
   Kiểm tra zone đã ký: `doh harutoexpress.com DNSKEY` có Answer.
2. **Thêm DS ở Spaceship (chủ site làm tay):** Spaceship → Domain Manager → `harutoexpress.com` → mục DNSSEC (nằm trong phần cài đặt nâng cao của domain; tên mục có thể khác) → Add DS record:
   - Key Tag = `key_tag`, Algorithm = `13` (ECDSAP256SHA256), Digest Type = `2` (SHA-256), Digest = `digest` (lấy từ file `dnssec-ds.json`, Codex đọc to cho chủ site, **không** tự đoán).
   - Không thấy mục DNSSEC → hỏi hỗ trợ Spaceship, báo lại; không đổi nameserver để "lách".
3. **Chờ** (thường vài phút tới vài giờ, Cloudflare có thể mất tới 24 giờ để chuyển `active`).

**Kiểm tra:**
```bash
doh harutoexpress.com DS                     # Answer có DS khớp key_tag/digest
curl -s -H "Authorization: Bearer $CF_API_TOKEN" "$CF/dnssec" | jq '.result.status'   # "active"
curl -s "https://dns.google/resolve?name=harutoexpress.com&type=A" | jq '.AD, .Status'  # true, 0
curl -s "https://cloudflare-dns.com/dns-query?name=www.harutoexpress.com&type=A" -H "accept: application/dns-json" | jq '.AD, .Status'  # true, 0
curl -s https://rdap.org/domain/harutoexpress.com -L | jq '.secureDNS.delegationSigned'   # true
curl -sI https://harutoexpress.com/vi | head -1
```
Thêm (thủ công): https://dnsviz.net/d/harutoexpress.com/dnssec/ không có lỗi đỏ. Ghi kết quả.

Lệnh cho chủ site tự kiểm trên PowerShell 5.1 (mỗi lệnh một dòng):
```powershell
Resolve-DnsName harutoexpress.com -Type DS -Server 1.1.1.1
Resolve-DnsName harutoexpress.com -Type A -DnssecOk -Server 1.1.1.1
curl.exe -sI https://harutoexpress.com/vi
```

**Rollback (đúng thứ tự, sai thứ tự là sập phân giải toàn domain):**
1. Xóa DS ở Spaceship.
2. Chờ DS hết hạn trong cache: `doh harutoexpress.com DS` không còn Answer, rồi chờ thêm **ít nhất 24 giờ** (TTL DS của `.com` là 86400 s).
3. Sau đó mới tắt ở Cloudflare: `PATCH $CF/dnssec {"status":"disabled"}`.
Nếu đã có `SERVFAIL` ngay sau khi thêm DS (DS sai) → xóa DS ở Spaceship ngay, **không** tắt DNSSEC ở Cloudflare.

---

## H4. Bảo mật tài khoản (chủ site làm tay; Codex đưa checklist và ghi kết quả có/không)
**Cloudflare**
- [ ] My Profile → Authentication: bật 2FA (ưu tiên security key/passkey, kèm TOTP), lưu backup codes ngoài máy.
- [ ] Manage Account → Members: chỉ người cần thiết; xóa thành viên lạ.
- [ ] My Profile → API Tokens: **xóa `CF_API_TOKEN` sau khi xong prompt này** (hoặc để tự hết hạn). Không có Global API Key nào đang được dùng ở đâu; nếu từng lộ thì "Change" để xoay khóa.
- [ ] Manage Account → Audit Log: xem có thay đổi lạ trong 30 ngày qua không.
- [ ] Notifications: bật thông báo cho các sự kiện bảo mật/tài khoản có sẵn (không bắt buộc).

**Vercel**
- [ ] Account Settings → Authentication: bật 2FA (passkey hoặc TOTP), lưu recovery codes.
- [ ] Team/Project → Members: rà quyền.
- [ ] Account Settings → Tokens: xóa token cũ không dùng.
- [ ] Project → Settings → Environment Variables: `LEADS_WEBHOOK_URL`, `LEADS_WEBHOOK_SECRET` đánh dấu **Sensitive**; không có bản sao ở Preview nếu không cần.
- [ ] Project → Settings → Domains: `harutoexpress.com` (primary) và `www` (redirect 308) đều "Valid Configuration".
- [ ] Project → Settings → Deployment Protection: chủ site xem preview deployments có đang được bảo vệ không; ghi lại cấu hình hiện có, **không đổi trong prompt này**.

**Spaceship (registrar)**
- [ ] Bật 2FA cho tài khoản.
- [ ] Registrar lock / Transfer lock: **đang bật** (`client transfer prohibited` theo RDAP), xác nhận vẫn bật.
- [ ] **Auto-renew bật**, phương thức thanh toán còn hạn (hết hạn 2027-11-07).
- [ ] Email liên hệ của domain là hộp thư chủ site còn dùng được; WHOIS privacy bật.

---

## H5. (Tùy chọn, cần chủ site đồng ý) HSTS `includeSubDomains`; preload để sau
Đây là header của app, sửa ở `next.config.ts`, **không** làm ở Cloudflare.

- Hiện tại chỉ có 2 hostname, cả hai chạy HTTPS (apex, www). Thêm `includeSubDomains` an toàn **nếu chủ site xác nhận không có và không định có subdomain nào chỉ chạy HTTP** (ví dụ thiết bị, panel nội bộ, mail webmail cũ).
- Nếu được đồng ý: trong `next.config.ts`, đổi value `Strict-Transport-Security` thành `max-age=31536000; includeSubDomains`. Không thêm `preload`.
- Chạy đủ phần Kiểm tra trong `CLAUDE.md`:
  ```bash
  npm run typecheck && npm run pricing:check && npm run build
  npm run start & sleep 5 && npm run seo:check; kill %1
  ```
  Pass thì commit thẳng lên `main`: `chore(security): HSTS includeSubDomains`, rồi push. Sau khi Vercel deploy: `curl -sI https://harutoexpress.com/vi | grep -i strict` có `includeSubDomains`.
- **Preload (`hstspreload.org`) không làm trong prompt này.** Rất khó gỡ (gỡ khỏi danh sách trình duyệt mất nhiều tháng) và khóa HTTPS cho mọi subdomain về sau. Chỉ cân nhắc khi: site đã ổn định (đã bỏ noindex, chạy vài tháng), `includeSubDomains` chạy ít nhất vài tuần không vấn đề, max-age ≥ 31536000, và chủ site đồng ý bằng văn bản. Lưu ý redirect www của Vercel tự gửi HSTS riêng (`max-age=63072000`), không do app quyết định.
- **Rollback:** revert commit, push. (Trình duyệt đã nhận header vẫn nhớ tới hết max-age; với `includeSubDomains` không preload thì chỉ ảnh hưởng subdomain chạy HTTP, hiện không có.)

---

## H6. Kiểm tra tổng (sau khi DNSSEC đã `active`)
```bash
curl -s -H "Authorization: Bearer $CF_API_TOKEN" "$CF/dns_records?per_page=100" > "$HOME/haruto-dns-backup/records-after.json"
jq -r '.result[] | [.type,.name,.content,.proxied] | @tsv' "$HOME/haruto-dns-backup/records-after.json"
for t in A CAA MX TXT DS; do doh harutoexpress.com $t; done
doh _dmarc.harutoexpress.com TXT
curl -sI https://harutoexpress.com/vi | grep -iE "^HTTP|strict|content-security|server"
curl -sI https://www.harutoexpress.com/ | grep -iE "^HTTP|location"
curl -sI http://harutoexpress.com/ | grep -iE "^HTTP|location"
curl -s -o /dev/null -w "%{http_code}\n" -X OPTIONS https://harutoexpress.com/api/leads
```
- [ ] 2 CNAME **y nguyên** (cùng đích, `proxied: false`), TXT google-site-verification còn nguyên.
- [ ] Bản ghi mới đúng như H1, H2; không có bản ghi nào khác bị đổi/xóa (so `records-before.json` với `records-after.json`).
- [ ] DS ở `.com`, `AD: true`, DNSSEC `active`.
- [ ] Apex `307 → /vi`, có CSP và HSTS như trước (hoặc như H5); www `308 → https://harutoexpress.com/`; http `308 → https`.
- [ ] `/api/leads` vẫn phản hồi (không 5xx do DNS/TLS). Không gửi lead thật để thử.
- [ ] Search Console (chủ site xem): Domain property vẫn "Verified".
- [ ] Token `CF_API_TOKEN` đã bị xóa/thu hồi (chủ site xác nhận).

---

## Thứ tự thực hiện
P0 → H0 → H1 → H2 → H3 (bật Cloudflare → DS ở Spaceship → chờ → kiểm tra) → H4 → H5 (chỉ khi được đồng ý) → H6 → Bàn giao.
H1 và H2 độc lập với nhau; H3 có thể bắt đầu song song nhưng chỉ kiểm tra cuối cùng sau khi DS đã lên.

## KHÔNG được làm
- **Không xóa/sửa TXT `google-site-verification=NiOvA2…`** (mất xác minh Search Console).
- **Không đổi đích, TTL hay trạng thái proxy của 2 CNAME** `@` và `www` → `56b649b0d6888f78.vercel-dns-017.com`. Không đổi apex sang A record.
- **Không bật proxy (mây cam)**, không đổi SSL/TLS mode, Cache Rules, Rocket Loader, Bot Fight Mode, Page/Transform Rules hay zone setting nào khác.
- Không đổi nameserver, không chuyển registrar, không đụng cài đặt domain trên Vercel.
- Không thêm CAA ở `www` (xung đột CNAME). Không tạo CAA nếu danh sách CA của Vercel không có `letsencrypt.org`.
- Không tắt DNSSEC ở Cloudflare khi DS còn ở registrar.
- Không dùng Global API Key; không in, ghi file hay commit token/zone id; không để file backup trong repo.
- Không thêm `preload` vào HSTS, không nộp hstspreload.org.
- Không bịa giá trị (địa chỉ `rua`, DS digest, zone id…): thiếu thì để placeholder và hỏi chủ site.
- Không commit gì ngoài H5 (nếu được đồng ý). Không tạo branch/PR.
- Không sửa `robots.ts` (dòng `Host:`) hay cache `/_next/image` trong prompt này: thuộc việc SEO/hiệu năng riêng.

---

## Bàn giao
Báo cáo gồm:
1. Kết quả H0: danh sách bản ghi trước khi đổi (type, name, content, proxied; **không** kèm token), có khác mục 0 không.
2. Bảng bản ghi đã tạo: type, name, content, `id`, bước. Bước nào phải làm qua dashboard, bước nào bị bỏ (kèm lý do, ví dụ null MX bị từ chối).
3. Danh sách CA đã đưa vào CAA (lấy từ đích Vercel lúc chạy) và CA nào Cloudflare tự thêm (nếu thấy).
4. DNSSEC: `key_tag`, algorithm, digest type (không cần dán digest), thời điểm thêm DS ở Spaceship, thời điểm `active`, kết quả `AD`, RDAP `delegationSigned`, DNSViz.
5. Kết quả H6 (từng ô tick) và output `curl -sI` của apex/www/http.
6. Checklist H4: mục nào chủ site xác nhận đã làm, mục nào còn thiếu.
7. H5: có làm không; nếu có thì commit SHA, kết quả typecheck/pricing:check/build/seo:check và header HSTS sau deploy.
8. Lệnh rollback đã sẵn (các `id`), và lời nhắc: xóa `CF_API_TOKEN`; kiểm tra gia hạn chứng chỉ trên Vercel quanh **2027-01-10**; auto-renew domain trước **2027-11-07**.
9. **Chờ chủ site quyết định:**
   - Có dùng email `@harutoexpress.com` trong tương lai không (nếu có thì phải gỡ null MX/SPF `-all` và cấu hình theo nhà cung cấp mail).
   - Địa chỉ nhận báo cáo DMARC (`rua`) nếu muốn.
   - HSTS `includeSubDomains` (nếu chưa làm ở H5) và thời điểm cân nhắc preload.
   - Proxy Cloudflare: giữ DNS only (mục 1); chỉ xem lại nếu có nhu cầu cụ thể (ví dụ bị tấn công DDoS mà Vercel Firewall không đủ).
