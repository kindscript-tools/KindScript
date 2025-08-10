console.log("✅ quick-messages.js loaded");

const categoryEl = document.getElementById('category');
const messageEl  = document.getElementById('message');
const fieldsEl   = document.getElementById('dynamic-fields');

const includeSubjectChk = document.getElementById('include-subject');
const generateBtn = document.getElementById('generate-btn');

const subjectWrap = document.getElementById('subjectWrap');
const subjectBox  = document.getElementById('qmSubject');
const outputBox   = document.getElementById('qmOutput');

const copySubjectBtn = document.getElementById('copy-subject-btn');
const copyBtn   = document.getElementById('copy-btn');
const printBtn  = document.getElementById('print-btn');
const downloadBtn = document.getElementById('download-btn');

/**
 * categories = {
 *   id: { label, items: { key: { label, fields:[[id,label,placeholder]], subject: fn(data), body: fn(data) } } }
 * }
 */
const categories = {
  labs: {
    label: "Lab & Test Results",
    items: {
      "lab-results": {
        label: "Check in on lab/test results",
        fields: [
          ["testName", "Test name", "blood work"],
          ["dateDone", "Date done (optional)", "Aug 5, 2025"]
        ],
        subject: ({ testName }) => `Follow-up on ${testName || "test"} results`,
        body: ({ testName, dateDone }) =>
`Hi,

I’m checking in to see if the results for my ${testName || "recent test"}${dateDone ? ` from ${dateDone}` : ""} are available yet.
If they are, could you please share them or let me know how I can access them?

Thank you,
[Your name]`
      },
      "lab-copy": {
        label: "Request a copy of results",
        fields: [
          ["testName", "Test name", "CBC / MRI / X-ray"],
          ["dateDone", "Date done (optional)", "Aug 5, 2025"]
        ],
        subject: ({ testName }) => `Request: Copy of ${testName || "test"} results`,
        body: ({ testName, dateDone }) =>
`Hi,

Could you please send me a copy of my ${testName || "test"} results${dateDone ? ` from ${dateDone}` : ""} for my records?
Portal or email works.

Thank you,
[Your name]`
      },
      "lab-explain": {
        label: "Ask for explanation/next steps",
        fields: [
          ["testName", "Test name", "thyroid panel"],
          ["dateDone", "Date (optional)", "Aug 5, 2025"]
        ],
        subject: ({ testName }) => `Question: ${testName || "test"} results`,
        body: ({ testName, dateDone }) =>
`Hi,

I received my ${testName || "test"} results${dateDone ? ` from ${dateDone}` : ""} and was hoping you could share your thoughts and any next steps.

Thank you,
[Your name]`
      },
      "lab-when": {
        label: "When will results be available?",
        fields: [
          ["testName", "Test name", "ultrasound"],
          ["dateDone", "Date done (optional)", "Aug 5, 2025"]
        ],
        subject: ({ testName }) => `When to expect ${testName || "test"} results`,
        body: ({ testName, dateDone }) =>
`Hi,

Could you let me know when to expect the results of my ${testName || "test"}${dateDone ? ` from ${dateDone}` : ""}?

Thank you,
[Your name]`
      }
    }
  },

  meds: {
    label: "Medication Questions",
    items: {
      "med-why": {
        label: "Why do I need this medicine?",
        fields: [
          ["medication","Medication","Sertraline 50mg"]
        ],
        subject: ({ medication }) => `Question about ${medication || "medication"}`,
        body: ({ medication }) =>
`Hi,

Could you explain why ${medication || "this medication"} was prescribed and what it’s intended to do?

Thank you,
[Your name]`
      },
      "med-side-effects": {
        label: "Side effects to watch for",
        fields: [
          ["medication","Medication (optional)","Sertraline 50mg"]
        ],
        subject: ({ medication }) => `Side effects for ${medication || "medication"}`,
        body: ({ medication }) =>
`Hi,

Could you share possible side effects of ${medication || "this medication"} so I know what to watch for?

Thank you,
[Your name]`
      },
      "med-alternatives": {
        label: "Ask about alternatives",
        fields: [
          ["medication","Medication (optional)","Sertraline 50mg"]
        ],
        subject: ({ medication }) => `Alternative options for ${medication || "medication"}`,
        body: ({ medication }) =>
`Hi,

Are there alternative medications that might work for my situation instead of ${medication || "this one"}?

Thank you,
[Your name]`
      },
      "refill-low": {
        label: "Running low on a medication",
        fields: [
          ["medication","Medication + dose","Sertraline 50mg"],
          ["daysLeft","Days left","5"],
          ["pharmacy","Pharmacy (name/location)","Walgreens on 3rd & Pine"]
        ],
        subject: ({ medication }) => `Refill request for ${medication || "medication"}`,
        body: ({ medication, daysLeft, pharmacy }) =>
`Hi,

I’m running low on ${medication || "my medication"} and have about ${daysLeft || "a few"} days left.
Could you please send a refill to ${pharmacy || "my usual pharmacy"}?

Thank you,
[Your name]`
      }
    }
  },

  symptoms: {
    label: "Symptom Updates",
    items: {
      "symptom-new": {
        label: "New symptom — ask what to do",
        fields: [
          ["symptom","Symptom","dizziness when standing"],
          ["since","Since when (optional)","last week"]
        ],
        subject: ({ symptom }) => `New symptom: ${symptom || "update"}`,
        body: ({ symptom, since }) =>
`Hi,

I’ve noticed ${symptom || "a new symptom"}${since ? ` since ${since}` : ""}.
Should I schedule a visit or monitor it for now?

Thank you,
[Your name]`
      },
      "symptom-change": {
        label: "Symptom got better/worse",
        fields: [
          ["symptom","Symptom","back pain"],
          ["direction","Better or worse?","worse"]
        ],
        subject: ({ symptom }) => `${(symptom || "Symptom")} update`,
        body: ({ symptom, direction }) =>
`Hi,

My ${symptom || "symptom"} has gotten ${direction || "worse"} since my last visit.
Any next steps you recommend?

Thank you,
[Your name]`
      }
    }
  },

  treatment: {
    label: "Treatment & Options",
    items: {
      "tx-options": {
        label: "Ask about treatment options",
        fields: [
          ["condition","Condition/diagnosis (optional)","migraines"]
        ],
        subject: ({ condition }) => `Treatment options${condition ? ` for ${condition}` : ""}`,
        body: ({ condition }) =>
`Hi,

Could you share what treatment options are available${condition ? ` for ${condition}` : ""}?

Thank you,
[Your name]`
      },
      "tx-working": {
        label: "How will we know it’s working?",
        fields: [
          ["treatment","Treatment (optional)","new medication"]
        ],
        subject: ({ treatment }) => `Tracking ${treatment || "treatment"} progress`,
        body: ({ treatment }) =>
`Hi,

How will we know if ${treatment || "the treatment"} is working, and when would we reassess?

Thank you,
[Your name]`
      }
    }
  },

  insurance: {
    label: "Insurance & Access",
    items: {
      "pa-status": {
        label: "Status of prior authorization",
        fields: [
          ["item","Test/med/procedure","MRI of lower back"],
          ["date","Date requested (optional)","Aug 6, 2025"]
        ],
        subject: ({ item }) => `Prior auth status for ${item || "request"}`,
        body: ({ item, date }) =>
`Hi,

Could you let me know the status of the prior authorization for ${item || "my request"}${date ? ` submitted on ${date}` : ""}?
If anything is needed from me or my provider, please let me know.

Thank you,
[Your name]`
      },

      "pa-copy": {
        label: "Request copy of prior auth submission",
        fields: [
          ["item","Test/med/procedure","physical therapy"],
          ["insurer","Insurer (optional)","BlueCross"]
        ],
        subject: ({ item }) => `Copy of prior auth for ${item || "request"}`,
        body: ({ item, insurer }) =>
`Hi,

Could you send me a copy of the prior authorization request${insurer ? ` submitted to ${insurer}` : ""} for ${item || "my care"}?
If possible, please include any notes sent to insurance.

Thank you,
[Your name]`
      },

      "oop-estimate": {
        label: "Estimate out-of-pocket cost",
        fields: [
          ["item","Test/med/procedure","sleep study"]
        ],
        subject: ({ item }) => `Cost estimate for ${item || "procedure"}`,
        body: ({ item }) =>
`Hi,

Do you have an estimate of my out-of-pocket cost for ${item || "this"}?
If there are alternatives at lower cost, please let me know.

Thank you,
[Your name]`
      },

      "coverage-check": {
        label: "Ask if something is covered",
        fields: [
          ["item","Test/med/procedure","allergy panel"],
          ["insurer","Insurer (optional)","Aetna"]
        ],
        subject: ({ item }) => `Coverage question: ${item || "service"}`,
        body: ({ item, insurer }) =>
`Hi,

I’m considering ${item || "a service"} and wanted to confirm whether my insurance${insurer ? ` (${insurer})` : ""} will cover it.
If pre-approval is needed, what’s the process?

Thank you,
[Your name]`
      },

      "insurance-denied-med": {
        label: "Insurance denied medication",
        fields: [
          ["med","Medication","Ozempic"],
          ["reason","Reason given (optional)","Not medically necessary"],
          ["date","Date denied (optional)","Aug 8, 2025"]
        ],
        subject: ({ med }) => `Insurance denial: ${med || "medication"}`,
        body: ({ med, reason, date }) =>
`Hi,

My insurance has denied coverage for ${med || "my medication"}${date ? ` as of ${date}` : ""}${reason ? `, stating: "${reason}"` : ""}.
Could you let me know if there’s an alternative that is covered, or help me start an appeal?

Thank you,
[Your name]`
      },

      "billing-question": {
        label: "Billing question about a charge",
        fields: [
          ["charge","Charge amount","$250"],
          ["date","Date of service (optional)","Aug 3, 2025"]
        ],
        subject: ({ charge }) => `Billing question: ${charge || "charge"}`,
        body: ({ charge, date }) =>
`Hi,

I have a question about a bill for ${charge || "a recent charge"}${date ? ` from ${date}` : ""}.
Could you provide a breakdown of the charges and let me know if my insurance has been billed?

Thank you,
[Your name]`
      },

      "referral-status": {
        label: "Referral status",
        fields: [
          ["specialty","Specialty or provider","dermatology"],
          ["date","Date requested (optional)","Aug 1, 2025"]
        ],
        subject: ({ specialty }) => `Referral status: ${specialty || "specialist"}`,
        body: ({ specialty, date }) =>
`Hi,

Could you let me know the status of my referral to ${specialty || "the specialist"}${date ? ` requested on ${date}` : ""}?
If anything is needed from me, please let me know.

Thank you,
[Your name]`
      },

      "pharmacy-out-of-stock": {
        label: "Pharmacy out-of-stock workaround",
        fields: [
          ["med","Medication","lisinopril"],
          ["pharmacy","Pharmacy","CVS Main Street"]
        ],
        subject: ({ med }) => `Pharmacy out-of-stock: ${med || "medication"}`,
        body: ({ med, pharmacy }) =>
`Hi,

${pharmacy || "My pharmacy"} is out of stock for ${med || "my medication"}.
Could you send the prescription to another pharmacy or suggest an alternative until it’s available?

Thank you,
[Your name]`
      }
    }
  },

  workleave: {
    label: "Work & Leave Support",
    items: {
      "accommodation-note": {
        label: "Workplace accommodation note",
        fields: [
          ["accommodation","Accommodation needed","flexible schedule / remote work / lifting limit"]
        ],
        subject: ({ accommodation }) => `Work accommodation note (${accommodation || "medical"})`,
        body: ({ accommodation }) =>
`Hi,

Could you provide a note for my employer stating that I need ${accommodation || "a workplace accommodation"} due to a medical condition?
Please include the duration if appropriate.

Thank you,
[Your name]`
      },

      "fmla-paperwork": {
        label: "Request FMLA paperwork completion",
        fields: [
          ["employer","Employer (optional)","Acme Corp"],
          ["deadline","Deadline (optional)","Aug 20, 2025"]
        ],
        subject: ({ employer }) => `FMLA paperwork${employer ? ` for ${employer}` : ""}`,
        body: ({ employer, deadline }) =>
`Hi,

Could you complete the attached FMLA paperwork${employer ? ` for ${employer}` : ""}?${deadline ? ` The deadline is ${deadline}.` : ""}
If you need anything from me, please let me know.

Thank you,
[Your name]`
      },

      "leave-note": {
        label: "Medical leave note (dates)",
        fields: [
          ["start","Start date","Aug 10, 2025"],
          ["end","End date (optional)","Aug 24, 2025"]
        ],
        subject: ({ start, end }) => `Medical leave note (${start || "start"}${end ? `–${end}` : ""})`,
        body: ({ start, end }) =>
`Hi,

I need a medical leave note for my employer for ${start || "the period starting"}${end ? ` through ${end}` : ""}.
Please include any relevant restrictions.

Thank you,
[Your name]`
      },

      "rtw-clearance": {
        label: "Return-to-work clearance",
        fields: [
          ["date","Return date","Aug 21, 2025"],
          ["restrictions","Restrictions (optional)","no lifting >10 lb for 2 weeks"]
        ],
        subject: ({ date }) => `Return-to-work clearance (${date || "date"})`,
        body: ({ date, restrictions }) =>
`Hi,

Could you provide a note stating that I’m cleared to return to work on ${date || "the specified date"}${restrictions ? ` with the following restrictions: ${restrictions}` : ""}?

Thank you,
[Your name]`
      },

      "extend-accommodation": {
        label: "Extend accommodation or leave",
        fields: [
          ["what","Accommodation/leave","reduced hours"],
          ["newDate","Extend until","Sept 30, 2025"]
        ],
        subject: ({ what }) => `Extension request: ${what || "accommodation/leave"}`,
        body: ({ what, newDate }) =>
`Hi,

Could you provide updated documentation to extend my ${what || "accommodation/leave"} until ${newDate || "the new date"}?

Thank you,
[Your name]`
      }
    }
  },

  // NEW: Clinic & Appointments (Admin)
  admin: {
    label: "Clinic & Appointments",
    items: {
      "appt-schedule": {
        label: "Schedule an appointment",
        fields: [
          ["reason","Reason (optional)","follow-up for migraines"],
          ["timing","Preferred timing (optional)","weekday mornings or next week"]
        ],
        subject: () => "Appointment request",
        body: ({ reason, timing }) =>
`Hi,

I’d like to schedule an appointment${reason ? ` for ${reason}` : ""}.
${timing ? `My availability: ${timing}.\n` : ""}Please let me know the next openings.

Thank you,
[Your name]`
      },

      "appt-reschedule": {
        label: "Reschedule an appointment",
        fields: [
          ["currentDate","Current appointment date/time","Aug 20 at 2pm"],
          ["reason","Reason (optional)","work conflict"]
        ],
        subject: ({ currentDate }) => `Reschedule request (${currentDate || "appt"})`,
        body: ({ currentDate, reason }) =>
`Hi,

I need to reschedule my appointment${currentDate ? ` on ${currentDate}` : ""}.${reason ? ` Reason: ${reason}.` : ""}
Could you share the next available options?

Thank you,
[Your name]`
      },

      "appt-cancel": {
        label: "Cancel an appointment",
        fields: [
          ["date","Appointment date/time","Aug 20 at 2pm"],
          ["reason","Reason (optional)","feeling unwell"]
        ],
        subject: ({ date }) => `Cancel appointment (${date || "date"})`,
        body: ({ date, reason }) =>
`Hi,

I need to cancel my appointment${date ? ` on ${date}` : ""}.${reason ? ` Reason: ${reason}.` : ""}
Please confirm the cancellation.

Thank you,
[Your name]`
      },

      "appt-type": {
        label: "Switch to telehealth / in-person",
        fields: [
          ["requestedType","Requested type","telehealth"],
          ["currentDate","Appointment date/time (optional)","Aug 20 at 2pm"]
        ],
        subject: ({ requestedType }) => `Appointment type request (${requestedType || "visit"})`,
        body: ({ requestedType, currentDate }) =>
`Hi,

Could we switch my ${currentDate ? `${currentDate} ` : ""}appointment to ${requestedType || "a different format"}?
Please let me know if that’s possible.

Thank you,
[Your name]`
      },

      "contact-info-update": {
        label: "Update contact information",
        fields: [
          ["phone","Phone (optional)","(555) 123‑4567"],
          ["email","Email (optional)","me@example.com"],
          ["address","Address (optional)","123 Maple St, Apt 4B, Springfield"]
        ],
        subject: () => "Update contact information",
        body: ({ phone, email, address }) =>
`Hi,

I’d like to update my contact information:
${phone ? `• Phone: ${phone}\n` : ""}${email ? `• Email: ${email}\n` : ""}${address ? `• Address: ${address}\n` : ""}Please confirm the change when complete.

Thank you,
[Your name]`
      },

      "records-request": {
        label: "Request medical records",
        fields: [
          ["scope","What you need (optional)","full chart / office notes / imaging"],
          ["dates","Date range (optional)","July–August 2025"],
          ["delivery","Delivery preference","via patient portal or secure email"]
        ],
        subject: ({ scope }) => `Records request: ${scope || "medical records"}`,
        body: ({ scope, dates, delivery }) =>
`Hi,

I’d like to request ${scope || "my medical records"}${dates ? ` for ${dates}` : ""}.
Please share them ${delivery || "through the portal"}.

Thank you,
[Your name]`
      },

      "portal-access": {
        label: "Patient portal access issue",
        fields: [
          ["issue","Issue","can’t log in / password reset not working"],
          ["contact","Best contact (optional)","(555) 123‑4567"]
        ],
        subject: () => "Patient portal access issue",
        body: ({ issue, contact }) =>
`Hi,

I’m having trouble with the patient portal (${issue || "access issue"}).
${contact ? `You can reach me at ${contact} if needed.\n` : ""}Could you help me get access?

Thank you,
[Your name]`
      },

      "provider-change": {
        label: "Change to a different provider",
        fields: [
          ["from","Current provider (optional)","Dr. Smith"],
          ["to","Requested provider (optional)","Dr. Lee"],
          ["reason","Reason (optional)","schedule fit / continuity of care"]
        ],
        subject: ({ to }) => `Provider change request${to ? ` (${to})` : ""}`,
        body: ({ from, to, reason }) =>
`Hi,

I’d like to change providers${from ? ` from ${from}` : ""}${to ? ` to ${to}` : ""}${reason ? ` for ${reason}` : ""}.
Please let me know next steps.

Thank you,
[Your name]`
      },

      "forms-before-visit": {
        label: "Any forms before my visit?",
        fields: [
          ["visitType","Type of visit (optional)","new patient / follow‑up"],
          ["date","Date (optional)","Aug 28"]
        ],
        subject: () => "Pre‑visit forms or steps?",
        body: ({ visitType, date }) =>
`Hi,

Do I need to complete any forms or steps before my ${visitType || "upcoming"} visit${date ? ` on ${date}` : ""}?
If so, could you send them to me?

Thank you,
[Your name]`
      },

      "office-hours": {
        label: "Clinic hours / availability",
        fields: [
          ["date","Date (optional)","Labor Day weekend"]
        ],
        subject: () => "Clinic hours / availability",
        body: ({ date }) =>
`Hi,

Could you share your clinic hours${date ? ` for ${date}` : ""}?
Also, do you accept walk‑ins or same‑day appointments?

Thank you,
[Your name]`
      }
    }
  },

  // NEW: Billing & Office
  billing: {
    label: "Billing & Office",
    items: {
      "itemized-receipt": {
        label: "Request itemized receipt",
        fields: [
          ["date","Date of service","Aug 3, 2025"],
          ["visit","Visit or invoice (optional)","Invoice #12345"]
        ],
        subject: ({ date }) => `Itemized receipt request${date ? ` (${date})` : ""}`,
        body: ({ date, visit }) =>
`Hi,

Could you send me an itemized receipt for my visit${date ? ` on ${date}` : ""}${visit ? ` (${visit})` : ""}?
I need it for my records/insurance.

Thank you,
[Your name]`
      },

      "superbill": {
        label: "Request superbill (for reimbursement)",
        fields: [
          ["date","Date of service (optional)","Aug 3, 2025"],
          ["recipient","Where to send (optional)","patient portal"]
        ],
        subject: () => "Superbill request",
        body: ({ date, recipient }) =>
`Hi,

Could you provide a superbill${date ? ` for my ${date} visit` : ""}${recipient ? ` via ${recipient}` : ""} so I can submit for reimbursement?

Thank you,
[Your name]`
      },

      "insurance-info-update": {
        label: "Update insurance information",
        fields: [
          ["insurer","New insurer (optional)","Aetna"],
          ["memberId","Member ID (optional)","ABC123456"],
          ["group","Group # (optional)","GRP7890"]
        ],
        subject: () => "Update insurance information",
        body: ({ insurer, memberId, group }) =>
`Hi,

I need to update my insurance information:
${insurer ? `• Insurer: ${insurer}\n` : ""}${memberId ? `• Member ID: ${memberId}\n` : ""}${group ? `• Group #: ${group}\n` : ""}Please confirm once updated.

Thank you,
[Your name]`
      },

      "payment-plan": {
        label: "Ask about payment plan",
        fields: [
          ["balance","Balance (optional)","$600"],
          ["invoice","Invoice/Account (optional)","Acct #4321"]
        ],
        subject: () => "Payment plan options",
        body: ({ balance, invoice }) =>
`Hi,

Are payment plans available${balance ? ` for my balance of ${balance}` : ""}${invoice ? ` (${invoice})` : ""}?
If so, could you share the options and next steps?

Thank you,
[Your name]`
      },

      "financial-assistance": {
        label: "Ask about financial assistance",
        fields: [
          ["reason","Context (optional)","temporary job loss"],
          ["docs","Documents needed (optional)","proof of income"]
        ],
        subject: () => "Financial assistance inquiry",
        body: ({ reason, docs }) =>
`Hi,

Do you offer financial assistance or sliding‑scale programs${reason ? ` due to ${reason}` : ""}?
${docs ? `If documentation is needed (${docs}), let me know.\n` : ""}Please share how to apply.

Thank you,
[Your name]`
      },

      "charge-dispute": {
        label: "Dispute or question a charge",
        fields: [
          ["amount","Amount","$420"],
          ["date","Date of service (optional)","Aug 2, 2025"],
          ["reason","Reason (optional)","duplicate charge / coding issue"]
        ],
        subject: ({ amount }) => `Charge dispute: ${amount || "bill"}`,
        body: ({ amount, date, reason }) =>
`Hi,

I’d like to dispute a charge of ${amount || "an amount"}${date ? ` from ${date}` : ""}${reason ? ` (reason: ${reason})` : ""}.
Could you review and let me know the outcome or next steps?

Thank you,
[Your name]`
      }
    }
  }
};

// Populate category select
categoryEl.innerHTML = Object.entries(categories)
  .map(([cid, cat]) => `<option value="${cid}">${cat.label}</option>`)
  .join('');

// Populate message select based on current category
function populateMessages(categoryKey){
  const items = categories[categoryKey]?.items || {};
  messageEl.innerHTML = Object.entries(items)
    .map(([mid, m]) => `<option value="${mid}">${m.label}</option>`)
    .join('');
}
populateMessages(categoryEl.value);

// Render dynamic fields for current selection
function renderFields(categoryKey, messageKey){
  const msg = categories[categoryKey]?.items?.[messageKey];
  fieldsEl.innerHTML = (msg?.fields || []).map(([id,label,ph]) => `
    <label>${label}:
      <input type="text" id="field-${id}" placeholder="${ph || ''}" />
    </label>
  `).join('');
}
renderFields(categoryEl.value, messageEl.value);

categoryEl.addEventListener('change', () => {
  populateMessages(categoryEl.value);
  renderFields(categoryEl.value, messageEl.value);
  subjectWrap.style.display = 'none';
  subjectBox.innerText = '';
  outputBox.innerText = '(Choose a message and click Generate)';
});

messageEl.addEventListener('change', () => {
  renderFields(categoryEl.value, messageEl.value);
  subjectWrap.style.display = 'none';
  subjectBox.innerText = '';
  outputBox.innerText = '(Fill fields and click Generate)';
});

// Collect field data
function collectData(categoryKey, messageKey){
  const msg = categories[categoryKey]?.items?.[messageKey];
  const data = {};
  (msg?.fields || []).forEach(([id]) => {
    data[id] = document.getElementById(`field-${id}`)?.value.trim();
  });
  return data;
}

// Generate output
function updateOutput(){
  const catKey = categoryEl.value;
  const msgKey = messageEl.value;
  const msg = categories[catKey]?.items?.[msgKey];
  if (!msg) return;

  const data = collectData(catKey, msgKey);
  const body = msg.body(data);
  outputBox.innerText = body || '(Fill fields and click Generate)';

  if (includeSubjectChk.checked && typeof msg.subject === 'function') {
    subjectBox.innerText = `Subject: ${msg.subject(data)}`;
    subjectWrap.style.display = 'block';
  } else {
    subjectWrap.style.display = 'none';
    subjectBox.innerText = '';
  }
}

generateBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  updateOutput();
});

// Copy subject
copySubjectBtn?.addEventListener('click', () => {
  const text = subjectBox.innerText.trim();
  if (!text) return;
  navigator.clipboard.writeText(text).catch(err =>
    console.error('Clipboard copy failed:', err)
  );
});

// Copy message
copyBtn?.addEventListener('click', () => {
  navigator.clipboard.writeText(outputBox.innerText).catch(err =>
    console.error('Clipboard copy failed:', err)
  );
});

// Print (subject + body)
printBtn?.addEventListener('click', () => {
  const subject = subjectWrap.style.display !== 'none' ? subjectBox.innerText.trim() + '\n\n' : '';
  const text = outputBox.innerText.trim();
  const w = window.open('', '_blank');
  w.document.write(`
    <html>
      <head>
        <title>Quick Message</title>
        <style>
          body { font-family: Georgia, serif; font-size: 0.85rem; padding: 2rem; }
          pre { white-space: pre-wrap; word-wrap: break-word; max-width: 100%; }
        </style>
      </head>
      <body>
        ${subject ? `<pre>${subject}</pre>` : ''}
        ${text ? `<pre>${text}</pre>` : '<p>(No output)</p>'}
      </body>
    </html>
  `);
  w.document.close();
  w.focus();
  w.print();
});

// Download .txt (subject + body)
downloadBtn?.addEventListener('click', () => {
  const subject = subjectWrap.style.display !== 'none' ? subjectBox.innerText.trim() + '\n\n' : '';
  const text = outputBox.innerText;
  const blob = new Blob([subject + text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quick-message.txt';
  a.click();
  URL.revokeObjectURL(url);
});
