const fs = require('fs');
const path = require('path');
const tls = require('tls');

// Load .env
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

const USER = process.env.GMAIL_USER || 'anssheikh43@gmail.com';
const PASS = process.env.GMAIL_PASS || process.env.GMAIL_APP_PASSWORD || '';

if (!PASS) {
  console.error('❌ Missing GMAIL_PASS in .env. Exiting.');
  process.exit(1);
}

const drafts = [
  {
    to: 'info@ubmtechnologies.com',
    subject: 'Data Entry Operator Application – Ans Shahid (2.5+ Years Operational Data Experience)',
    body: `Dear Hiring Team at UBM Technologies,

I am writing to apply for the Data Entry Operator position currently open at UBM Technologies in Gulberg II, Lahore.

I hold an Associate Degree in Computer Science (ADP CS, 14 years completed education) from Lahore Leads University (2026) and bring over 2.5 years of continuous operational experience as a Data Operator at Impex (January 2024 – Present).

Why I am an immediate, high-accuracy fit for UBM Technologies:
- High-Accuracy Data Entry & Validation: Daily experience entering, updating, and maintaining digital inventory records, e-commerce product logs, and verification spreadsheets in MS Excel with zero error tolerance.
- Alphanumeric Speed: 45+ WPM typing speed with strict adherence to data entry guidelines and data integrity standards.
- Database & Computer Fluency: Solid computer science foundation facilitating fast mastery of internal software tools, web dashboards, and administrative systems.
- Commute & Availability: Lahore resident with convenient access to Gulberg II, ready for immediate full-time on-site deployment.

- Portfolio: https://ans108.github.io/ansshahid_portfolio/
- GitHub: https://github.com/ans108

My resume is attached for your review. I look forward to the opportunity to discuss my qualifications with your team.

Warm regards,

Ans Shahid
Lahore, Pakistan
Phone: 03144251026
Email: anssheikh43@gmail.com`
  },
  {
    to: 'hr@datumlabs.io',
    subject: 'Data Annotation Specialist Application – Ans Shahid (ADP CS & 2.5+ Years Data Ops)',
    body: `Dear Hiring Team at DatumLabs,

I am writing to express my strong interest in the Data Annotation Specialist / Data Specialist position at DatumLabs in Lahore.

I recently completed my Associate Degree in Computer Science (ADP CS) from Lahore Leads University (2026) and offer over 2.5 years of continuous operational experience as a Data Operator at Impex (January 2024 – Present).

Key Strengths Aligned with DatumLabs:
- Data Precision & Quality Auditing: Extensive daily experience validating datasets, categorizing records, performing quality assurance checks, and maintaining structured logs in MS Excel.
- Technical & AI Familiarity: Built a computer vision final project ("Smart Attendance System Using Face Recognition") in Python and OpenCV, giving me first-hand experience in dataset labeling, feature extraction, and facial bounding boxes.
- Analytical Focus: High sustained attention to detail, capable of handling repetitive, high-volume labeling and classification tasks with rigorous precision.
- Immediate Full-Time Availability: Lahore resident, fully available for on-site or hybrid deployment.

- Portfolio: https://ans108.github.io/ansshahid_portfolio/
- GitHub: https://github.com/ans108
- Computer Vision Project: https://github.com/ans108/Smart-Attendance-System

My CV is attached for your consideration. I look forward to speaking with your recruitment team.

Warm regards,

Ans Shahid
Lahore, Pakistan
Phone: 03144251026
Email: anssheikh43@gmail.com`
  },
  {
    to: 'hr@gtechsources.com',
    subject: 'IT Operations & Recruitment Assistant Application – Ans Shahid (ADP CS Graduate)',
    body: `Dear Hiring Team at GTechSources,

I am writing to apply for the IT Operations & Recruitment Assistant position at GTechSources in Lahore.

I hold an Associate Degree in Computer Science (ADP CS, 14 years education) from Lahore Leads University (2026) and bring over 2.5 years of verified operational experience as a Data Operator at Impex (January 2024 – Present).

Core Competencies Aligned with GTechSources:
- Database Tracking & Data Management: Skilled in maintaining candidate repositories, logging profiles, tracking recruitment pipelines, and managing operational spreadsheets in MS Excel.
- Tech Literacy: Strong grasp of computer science terminology, programming languages (Python, C++, JavaScript), databases, and software tools, enabling seamless screening and technical coordination.
- Professional Communication: Experienced in corporate correspondence, daily reporting, and schedule tracking.
- Location & Full-Time Commitment: Based in Lahore, ready for immediate full-time engagement.

- Portfolio: https://ans108.github.io/ansshahid_portfolio/
- GitHub: https://github.com/ans108

My resume is attached for your review. Thank you for your time and consideration.

Warm regards,

Ans Shahid
Lahore, Pakistan
Phone: 03144251026
Email: anssheikh43@gmail.com`
  }
];

function buildMimeMessage(draft) {
  const normalizedBody = draft.body.replace(/\r?\n/g, '\r\n');
  const msgId = `<${Date.now()}.${Math.random().toString(36).substring(2)}@gmail.com>`;
  const dateStr = new Date().toUTCString();

  const headers = [
    `From: Ans Shahid <${USER}>`,
    `To: ${draft.to}`,
    `Subject: ${draft.subject}`,
    `Date: ${dateStr}`,
    `Message-ID: ${msgId}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/plain; charset=UTF-8; format=flowed`,
    `Content-Transfer-Encoding: 8bit`
  ];

  const fullMessage = headers.join('\r\n') + '\r\n\r\n' + normalizedBody + '\r\n';
  return Buffer.from(fullMessage, 'utf8');
}

function appendSingleDraft(draft) {
  return new Promise((resolve) => {
    const rawBuffer = buildMimeMessage(draft);
    const byteLen = rawBuffer.length;

    console.log(`Connecting to imap.gmail.com:993 for ${draft.to} (size: ${byteLen} bytes)...`);
    const client = tls.connect(993, 'imap.gmail.com', { rejectUnauthorized: false });
    let step = 0;
    let buf = '';

    client.on('data', data => {
      buf += data.toString('utf8');

      if (step === 0 && buf.includes('* OK')) {
        step = 1;
        buf = '';
        client.write(`A1 LOGIN "${USER}" "${PASS}"\r\n`);
      } else if (step === 1 && buf.includes('A1 OK')) {
        step = 2;
        buf = '';
        client.write(`A2 APPEND "[Gmail]/Drafts" (\\Draft) {${byteLen}}\r\n`);
      } else if (step === 2 && buf.includes('+')) {
        step = 3;
        buf = '';
        client.write(rawBuffer);
        client.write('\r\n');
      } else if (step === 3 && buf.includes('A2 OK')) {
        step = 4;
        console.log(`✅ SUCCESS: Complete draft for ${draft.to} saved in [Gmail]/Drafts!`);
        client.write('A3 LOGOUT\r\n');
      } else if (step === 4 && buf.includes('A3 OK')) {
        client.end();
        resolve(true);
      } else if (buf.includes('A1 NO') || buf.includes('A1 BAD')) {
        console.error(`❌ Login failed:`, buf);
        client.end();
        resolve(false);
      } else if (buf.includes('A2 NO') || buf.includes('A2 BAD')) {
        console.error(`❌ Append failed for ${draft.to}:`, buf);
        client.end();
        resolve(false);
      }
    });

    client.on('error', err => {
      console.error(`❌ IMAP socket error for ${draft.to}:`, err.message);
      resolve(false);
    });

    setTimeout(() => {
      if (step < 4) {
        console.warn(`⚠️ Timeout for ${draft.to}, closing connection.`);
        client.destroy();
        resolve(false);
      }
    }, 15000);
  });
}

async function run() {
  console.log(`Starting draft creation for ${drafts.length} new employers...`);
  let successCount = 0;
  for (const d of drafts) {
    const ok = await appendSingleDraft(d);
    if (ok) successCount++;
    await new Promise(r => setTimeout(r, 1000));
  }
  console.log(`🎉 COMPLETED: ${successCount} of ${drafts.length} new drafts successfully created in [Gmail]/Drafts.`);
}

run();
