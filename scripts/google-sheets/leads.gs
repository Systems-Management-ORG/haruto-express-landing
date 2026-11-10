/**
 * HARUTO EXPRESS — consultation requests → Google Sheet.
 *
 * The website's POST /api/leads forwards each form submission here; this script appends one row
 * to the "Leads" tab. Deployed with clasp from this folder; see docs/LEADS-GOOGLE-SHEET.md.
 *
 * Only the SHA-256 of the shared secret lives here; the secret itself is LEADS_WEBHOOK_SECRET in
 * the website's environment. To rotate it: generate a new secret, put its hash below, push and
 * redeploy, then update the website's environment.
 */

var SPREADSHEET_ID = "1ynh4GCoWVoJkPZbtWJEMMHW8CujAvNr0d7kn81wdT-s";
var SECRET_SHA256 = "c994944aaf73b4cb65092e1063bdc8d8e3d7ce040b782d667fb05ba86d2bea02";
var SHEET_NAME = "Leads";
var HEADERS = [
  "Thời gian",
  "Loại khách",
  "Họ tên",
  "Công ty",
  "Số điện thoại",
  "Email",
  "Tuyến",
  "Cân nặng (kg)",
  "Mô tả hàng",
  "Ngôn ngữ",
  "Trang gửi",
  "Trạng thái xử lý",
];

function doPost(e) {
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    if (typeof body.secret !== "string" || sha256(body.secret) !== SECRET_SHA256) {
      return json({ ok: false, error: "unauthorized" });
    }

    var lead = body.lead || {};
    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      getSheet().appendRow([
        new Date(),
        lead.kind === "BUSINESS" ? "Doanh nghiệp" : "Cá nhân",
        text(lead.fullName),
        text(lead.company),
        // Leading apostrophe keeps phone numbers as text (no lost leading zero).
        "'" + text(lead.phone),
        text(lead.email),
        lead.direction === "JP_VN" ? "Nhật Bản → Việt Nam" : "Việt Nam → Nhật Bản",
        lead.weightKg === null || lead.weightKg === undefined ? "" : lead.weightKg,
        text(lead.description),
        text(lead.locale),
        text(lead.page),
        "Mới",
      ]);
    } finally {
      lock.releaseLock();
    }
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

/**
 * Run once from the Apps Script editor (Run → authorize) to grant the spreadsheet permission the
 * web app needs. It also creates the "Leads" tab with its header row.
 */
function authorize() {
  var sheet = getSheet();
  Logger.log("OK — sheet '%s' is ready (%s rows).", sheet.getName(), sheet.getLastRow());
}

function getSheet() {
  var book = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = book.getSheetByName(SHEET_NAME) || book.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
  }
  return sheet;
}

function sha256(value) {
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value, Utilities.Charset.UTF_8);
  return bytes
    .map(function (b) {
      var v = (b < 0 ? b + 256 : b).toString(16);
      return v.length === 1 ? "0" + v : v;
    })
    .join("");
}

// Neutralises spreadsheet formulas: a value starting with = + - @ would otherwise be executed.
function text(value) {
  var s = value === null || value === undefined ? "" : String(value);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
