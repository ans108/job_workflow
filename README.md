# Job Search & Outreach Workflow Automation

Automated pipeline for job discovery, eligibility scoring, candidate-tailored email drafting, and recruitment inbox monitoring.

## 📌 Candidate Overview
- **Candidate:** Ans Shahid
- **Education:** Associate Degree in Computer Science (ADP CS, 14 years completed education, 2026) — Lahore Leads University
- **Core Experience:** 2.5+ years continuous operational experience as Data Operator at Impex (Jan 2024–Present)
- **Target Roles:** Corporate Data Entry Operator, Computer Operator, Office Documentation & Degree-Eligible Public Sector Positions (Lahore, Pakistan)

---

## 🚀 Key Features

1. **Firecrawl MCP Deep Sweep:**
   - Real-time web scraping and discovery of verified corporate and public sector openings across Lahore.
   - Automatic blacklisting of previously contacted companies to prevent duplicate outreach.

2. **Calibrated Accessibility Scoring:**
   - Filters out non-compliant listings (senior roles, 2–5+ yr enterprise dev requirements, commission schemes, female-only restricted posts).
   - Prioritizes roles matching operational data handling, high-accuracy alphanumeric entry (45+ WPM), and spreadsheet management.

3. **1-Click Draft Generation & IMAP Sync:**
   - Generates pre-filled, personalized email applications with direct 1-click Gmail web compose links.
   - Automatically injects drafted applications directly into `[Gmail]/Drafts` via IMAP.

4. **Live Recruitment Inbox Auditing:**
   - Tracks candidate responses, interview schedule links (Zoom / Google Meet / Onsite), and testing authority notifications.

---

## 🛠️ Usage

### 1. Environment Setup
Copy `.env.example` to `.env` and fill in your Gmail credentials (use an App Password if 2FA is active):

```bash
cp .env.example .env
```

`.env`:
```ini
GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_16_char_google_app_password
```

### 2. Generate Latest Report
Runs the discovery evaluation, updates filtering statistics, and generates `latest_report.md`:
```bash
node generate_report.js
```

### 3. Inject Drafts into Gmail
Connects to Gmail via IMAP and saves pre-written outreach emails into your `[Gmail]/Drafts` folder:
```bash
node create_nov6_drafts.js
```

---

## 📄 Repository Structure
- `generate_report.js`: Main workflow generator and 11-phase report builder.
- `latest_report.md`: Current live report with verified openings and recruitment alerts.
- `create_nov6_drafts.js`: Automated Gmail draft injection script.
- `stats.json`: Real-time funnel metrics and audit counts.
