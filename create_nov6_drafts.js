const fs = require('fs');
const path = require('path');
const tls = require('tls');

// Load local environment variables from .env if present
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split(/\r?\n/).forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  });
}

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const USER = process.env.GMAIL_USER || 'anssheikh43@gmail.com';
const PASS = process.env.GMAIL_PASS || process.env.GMAIL_APP_PASSWORD || '';

const drafts = [
  {
    to: 'hr@regbits.com',
    subject: 'Data Entry Operator Application – Ans Shahid (2.5+ Years Operational Experience)',
    body: `Dear Hiring Team at Regbits Private Limited,

I am writing to apply for the Data Entry Operator position currently open at Regbits in Lahore (Onsite, DHA Phase 3).

I hold an Associate Degree in Computer Science (ADP CS, 14 years completed education) from Lahore Leads University (2026) and bring over 2.5 years of continuous operational data experience as a Data Operator at Impex (January 2024 – Present).

Why I am an immediate, high-accuracy fit for Regbits:
- Database Updates & System Records: Daily experience entering and verifying complex datasets, updating internal records, cross-referencing ledger entries, and maintaining digital spreadsheets in MS Excel with zero error margins.
- High Alphanumeric Speed: 45+ WPM typing speed with meticulous attention to detail and data validation rules.
- Confidentiality & Integrity: Proven track record handling sensitive company records and production dispatches with strict confidentiality.
- Fast Commute & Availability: Lahore resident, ready for immediate on-site engagement.

Portfolio: https://ans108.github.io/ansshahid_portfolio/
GitHub: https://github.com/ans108

My resume is attached for your review. I look forward to an opportunity to interview with your recruitment team.

Warm regards,

Ans Shahid
Lahore, Pakistan
Phone: 03144251026
Email: anssheikh43@gmail.com`
  },
  {
    to: 'careers@instacare.pk',
    subject: 'Data Entry Assistant Application – Ans Shahid (2.5+ Years Data Ops Exp)',
    body: `Dear Hiring Team at InstaCare Technologies Inc,

I am writing to express my strong interest in the Data Entry Assistant position at InstaCare Technologies in Lahore.

I hold an Associate Degree in Computer Science (ADP CS) from Lahore Leads University and bring over 2.5 years of continuous workplace experience as a Data Operator at Impex (January 2024 – Present).

Key Strengths Aligned with InstaCare:
- Systematic Record Entry: Daily hands-on experience logging service records, managing transactional logs, verifying data integrity, and preparing operational reports in MS Excel.
- Technical & Computer Fluency: Solid Computer Science background enabling quick adoption of health-tech portal systems and administrative databases.
- Speed & Accuracy: Proven 45+ WPM typing speed with rigorous verification protocols to eliminate duplicate and erroneous data entries.
- Immediate Deployment: Based in Lahore with full availability for immediate full-time employment.

Portfolio: https://ans108.github.io/ansshahid_portfolio/
GitHub: https://github.com/ans108

My CV is attached for your consideration. I welcome the opportunity to discuss my qualifications in an interview.

Warm regards,

Ans Shahid
Lahore, Pakistan
Phone: 03144251026
Email: anssheikh43@gmail.com`
  },
  {
    to: 'info@maxobiz.com',
    subject: 'Admin & Data Entry Assistant Application – Ans Shahid (ADP CS & 2.5+ Years Exp)',
    body: `Dear Hiring Team at Maxobiz,

I am writing to apply for the Admin & Data Entry Assistant position at Maxobiz, Lahore.

I recently completed my Associate Degree in Computer Science (ADP CS, 14 years education) at Lahore Leads University (2026) and offer over 2.5 years of verified, continuous operational data experience at Impex (January 2024 – Present).

Core Competencies Aligned with Maxobiz:
- Spreadsheets & Alphanumeric Logging: Advanced daily command of MS Excel (formulas, sorting, validation rules, reporting) and office documentation tools.
- Data Quality & Reconciliation: High attention to detail auditing client files, order specifications, and administrative records.
- Typing Throughput: 45+ WPM typing speed with rapid turnaround on high-volume administrative tasks.
- Availability: Lahore resident, fully available for immediate full-time engagement.

Portfolio: https://ans108.github.io/ansshahid_portfolio/
GitHub: https://github.com/ans108

My resume is attached for your review. I look forward to hearing from your team.

Warm regards,

Ans Shahid
Lahore, Pakistan
Phone: 03144251026
Email: anssheikh43@gmail.com`
  }
];

function appendSingleDraft(draft) {
  return new Promise((resolve) => {
    if (!PASS) {
      console.warn('⚠️ No GMAIL_PASS provided in environment or .env. Skipping IMAP injection.');
      return resolve(false);
    }

    const emailRaw = `From: Ans Shahid <${USER}>
To: ${draft.to}
Subject: ${draft.subject}
Date: ${new Date().toUTCString()}
MIME-Version: 1.0
Content-Type: text/plain; charset=UTF-8

${draft.body}
`;

    console.log(`Connecting for ${draft.to}...`);
    const client = tls.connect(993, 'imap.gmail.com');
    let step = 0;
    let buf = '';

    client.on('data', data => {
      buf += data.toString();
      if (step === 0 && buf.includes('* OK')) {
        step = 1;
        buf = '';
        client.write(`A1 LOGIN ${USER} ${PASS}\r\n`);
      } else if (step === 1 && buf.includes('A1 OK')) {
        step = 2;
        buf = '';
        const byteLen = Buffer.byteLength(emailRaw, 'utf8');
        client.write(`A2 APPEND "[Gmail]/Drafts" (\\Draft) {${byteLen}}\r\n`);
      } else if (step === 2 && buf.includes('+')) {
        step = 3;
        buf = '';
        client.write(emailRaw + '\r\n');
      } else if (step === 3 && buf.includes('A2 OK')) {
        step = 4;
        console.log(`✅ Draft for ${draft.to} saved in [Gmail]/Drafts!`);
        client.write('A3 LOGOUT\r\n');
      } else if (step === 4 && buf.includes('A3 OK')) {
        client.end();
        resolve(true);
      } else if (buf.includes('A2 NO') || buf.includes('A2 BAD')) {
        console.error(`❌ Failed draft for ${draft.to}:`, buf);
        client.end();
        resolve(false);
      }
    });

    client.on('error', err => {
      console.error('IMAP error:', err);
      resolve(false);
    });

    setTimeout(() => {
      console.log(`Timeout for ${draft.to}, destroying`);
      client.destroy();
      resolve(false);
    }, 15000);
  });
}

async function run() {
  for (const d of drafts) {
    console.log(`Processing draft for ${d.to}...`);
    await appendSingleDraft(d);
  }
  console.log('✅ All drafts processed.');
}

run();
