/**
 * Google Apps Script Web App for Baradia Group Lead Capture
 * 
 * Target Google Sheet: https://docs.google.com/spreadsheets/d/1zA8npdzpSuxyIrD5HMRCn5LGrL4s0BTrwxA1pVv8plk/edit?gid=0#gid=0
 * 
 * Instructions:
 * 1. Open the spreadsheet above.
 * 2. In Google Sheets menu, click: Extensions -> Apps Script.
 * 3. Replace any existing code in Code.gs with this entire file.
 * 4. Click "Deploy" (top right) -> "New deployment".
 * 5. Select type: "Web app".
 * 6. Description: "Baradia Lead Sync"
 *    Execute as: "Me"
 *    Who has access: "Anyone" (crucial so the website can submit leads)
 * 7. Click "Deploy", authorize permissions when prompted.
 * 8. Copy the Web App URL (starts with https://script.google.com/macros/s/...)
 * 9. Paste that URL into assets/site.js under BARADIA_CONFIG.GOOGLE_SHEET.WEBAPP_URL: 'YOUR_URL_HERE'
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheetByName("Sheet1") || doc.getSheets()[0];
    
    var data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else {
      data = e.parameter || {};
    }
    
    // Exact mapping to the 21 columns in the sheet
    // Date, Source, Vertical, Lead Type, Name, Phone, Email, City, Current Situation, Goal/Expectation, Scale, Budget Range, Timeline, Details, Status, Priority, Message Sent, Last Contacted, Next Follow-up, Owner, Notes
    var row = [
      data.date || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      data.source || "Website",
      data.vertical || "",
      data.leadType || (data.consult === 'paid' ? 'Priority Consultation (₹999)' : 'Free Consultation'),
      data.name || "",
      data.phone || "",
      data.email || "",
      data.city || "",
      data.currentSituation || data.situation || "",
      data.goalExpectation || data.goal || "",
      data.scale || "",
      data.budgetRange || data.budget || "",
      data.timeline || data.start || "",
      data.details || data.notes || "",
      data.status || "New",
      data.priority || (data.leadType && data.leadType.indexOf("Priority") !== -1 ? "Priority (₹999)" : "Free"),
      data.messageSent || "Yes",
      data.lastContacted || "",
      data.nextFollowUp || "",
      data.owner || "Sumit Baradia",
      data.notes || ""
    ];
    
    sheet.appendRow(row);
    
    return ContentService
      .createTextOutput(JSON.stringify({ result: "success", row: sheet.getLastRow() }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "active", service: "Baradia Group Lead Hook" }))
    .setMimeType(ContentService.MimeType.JSON);
}
