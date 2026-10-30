# Google Sheet & Consultation Setup Guide

## Spreadsheet Link
**Google Sheet**: [https://docs.google.com/spreadsheets/d/1zA8npdzpSuxyIrD5HMRCn5LGrL4s0BTrwxA1pVv8plk/edit?gid=0#gid=0](https://docs.google.com/spreadsheets/d/1zA8npdzpSuxyIrD5HMRCn5LGrL4s0BTrwxA1pVv8plk/edit?gid=0#gid=0)

---

## 1. Quick 1-Minute Activation via Google Apps Script

To receive leads automatically in real-time in your Google Sheet, follow these simple steps:

1. Open your Google Sheet: [Open Sheet](https://docs.google.com/spreadsheets/d/1zA8npdzpSuxyIrD5HMRCn5LGrL4s0BTrwxA1pVv8plk/edit?gid=0#gid=0).
2. In the top menu, go to **Extensions** → **Apps Script**.
3. Delete any boilerplate text and paste the entire code from [`google-apps-script.js`](file:///Users/vanabhapatra/Downloads/baradia2-main/google-apps-script.js).
4. Click the blue **Deploy** button (top right) → **New deployment**.
5. Click the gear icon next to "Select type" and select **Web app**.
6. Set the settings:
   - **Description**: `Baradia Lead Sync`
   - **Execute as**: `Me (your email)`
   - **Who has access**: `Anyone` *(crucial so your website visitors can submit)*
7. Click **Deploy** and click **Authorize access** (choose your Google Account).
8. Copy the generated **Web app URL** (starts with `https://script.google.com/macros/s/...`).
9. Open [`assets/site.js`](file:///Users/vanabhapatra/Downloads/baradia2-main/assets/site.js) and paste the URL:
   ```javascript
   GOOGLE_SHEET: {
     ENABLED: true,
     SPREADSHEET_URL: 'https://docs.google.com/spreadsheets/d/1zA8npdzpSuxyIrD5HMRCn5LGrL4s0BTrwxA1pVv8plk/edit?gid=0#gid=0',
     WEBAPP_URL: 'PASTE_YOUR_COPIED_URL_HERE'
   }
   ```

---

## 2. 21-Column Spreadsheet Schema

The integration automatically maps each form submission to your sheet's exact column headers:

| Col # | Header Name | Source Data |
|---|---|---|
| 1 | **Date** | Date & Time of submission (e.g. `2026-10-30 13:45`) |
| 2 | **Source** | `Website` |
| 3 | **Vertical** | Selected Vertical (e.g. `The InDesign`, `AI Ventures`, etc.) |
| 4 | **Lead Type** | `Free Consultation (limited)` or `Priority Consultation (₹999)` |
| 5 | **Name** | Visitor Name |
| 6 | **Phone** | WhatsApp Number |
| 7 | **Email** | Visitor Email |
| 8 | **City** | City / Location |
| 9 | **Current Situation** | Question 1 answer |
| 10 | **Goal/Expectation** | Question 2 answer |
| 11 | **Scale** | Question 3 answer |
| 12 | **Budget Range** | Question 4 answer |
| 13 | **Timeline** | Question 5 answer |
| 14 | **Details** | Question 6 answer |
| 15 | **Status** | `New` |
| 16 | **Priority** | `Free` or `Priority (₹999)` |
| 17 | **Message Sent** | `Yes` |
| 18 | **Last Contacted** | Empty (ready for team) |
| 19 | **Next Follow-up** | Empty (ready for team) |
| 20 | **Owner** | `Sumit Baradia` |
| 21 | **Notes** | Submitted details / notes |

---

## 3. Consultation Redirection & Payment Details

- **Redirect URL**: `/start/consultation.html`
- **Options**:
  1. **Free consultation (limited)**: Pre-fills WhatsApp message requesting the 10-minute discovery call and logs selection.
  2. **Priority consultation (paid, faster + detailed) (₹999)**:
     - **UPI ID**: `sumitbaradia1@icici` (with one-click Copy button)
     - **Direct Mobile Pay link**: `upi://pay?pa=sumitbaradia1@icici&pn=Baradia%20Group&am=999&cu=INR&tn=Priority%20Consultation%20Fee`
     - **QR Code**: Auto-generated dynamic UPI QR for desktop visitors to scan
     - **WhatsApp Submission**: Direct button to open WhatsApp pre-filled with priority booking notice and prompt to attach payment screenshot.
