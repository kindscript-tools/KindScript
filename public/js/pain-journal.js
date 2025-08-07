console.log('✅ pain-journal.js loaded');

const form = document.getElementById('journal-form');
const outputBox = document.getElementById('journalOutput');
const generateBtn = document.getElementById('generate-btn');
const copyBtn = document.getElementById('copy-btn');
const printBtn = document.getElementById('print-btn');
const downloadBtn = document.getElementById('download-btn');

function getFormData() {
  return {
    date: document.getElementById('date')?.value.trim(),
    location: document.getElementById('location')?.value.trim(),
    description: document.getElementById('description')?.value.trim(),
    severity: document.getElementById('severity')?.value.trim(),
    trigger: document.getElementById('trigger')?.value.trim(),
    relief: document.getElementById('relief')?.value.trim(),
    impact: document.getElementById('impact')?.value.trim(),
    notes: document.getElementById('notes')?.value.trim()
  };
}

function generateDetailedEntry(data) {
  const {
    date,
    location,
    description,
    severity,
    trigger,
    relief,
    impact,
    notes
  } = data;

  let text = '';

  if (date) text += `Date: ${date}\n`;
  if (location) text += `Location: ${location}\n`;
  if (description) text += `Description: ${description}\n`;
  if (severity) text += `Severity: ${severity}/10\n`;
  if (trigger) text += `Possible Trigger: ${trigger}\n`;
  if (relief) text += `What Helped: ${relief}\n`;
  if (impact) text += `Impact on Daily Life: ${impact}\n`;
  if (notes) text += `Additional Notes: ${notes}\n`;

  return text.trim();
}

function generateBulletEntry(data) {
  const {
    date,
    location,
    description,
    severity,
    trigger,
    relief,
    impact,
    notes
  } = data;

  let bulletText = '';
  if (date) bulletText += `🗓️ ${date}\n`;
  if (location) bulletText += `📍 ${location}\n`;
  if (description) bulletText += `📝 ${description}\n`;
  if (severity) bulletText += `🔢 Severity: ${severity}/10\n`;
  if (trigger) bulletText += `⚠️ Trigger: ${trigger}\n`;
  if (relief) bulletText += `✅ Relief: ${relief}\n`;
  if (impact) bulletText += `📉 Impact: ${impact}\n`;
  if (notes) bulletText += `🧠 Notes: ${notes}\n`;

  return bulletText.trim();
}

function updateOutput() {
  const data = getFormData();
  const style = document.getElementById('output-style')?.value || 'detailed';

  let message = '';

  if (style === 'bullets') {
    message = generateBulletEntry(data);
  } else {
    message = generateDetailedEntry(data);
  }

  outputBox.innerText = message || '(Fill out the form and click Generate)';
}

generateBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  updateOutput();
});

copyBtn?.addEventListener('click', () => {
  navigator.clipboard.writeText(outputBox.innerText).catch(err =>
    console.error('Clipboard copy failed:', err)
  );
});

printBtn?.addEventListener('click', () => {
  const text = outputBox.innerText.trim();
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>Pain & Fatigue Entry</title>
        <style>
          body {
            font-family: Georgia, serif;
            font-size: 0.85rem;
            padding: 2rem;
          }
          pre {
            white-space: pre-wrap;
            word-wrap: break-word;
            max-width: 100%;
          }
        </style>
      </head>
      <body>
        ${text ? `<pre>${text}</pre>` : '<p>(No output)</p>'}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
});

downloadBtn?.addEventListener('click', () => {
  const blob = new Blob([outputBox.innerText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'pain-journal.txt';
  a.click();
  URL.revokeObjectURL(url);
});

// Auto-fill today's date
window.addEventListener('DOMContentLoaded', () => {
  const dateInput = document.getElementById('date');
  if (dateInput && !dateInput.value) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.value = `${yyyy}-${mm}-${dd}`;
  }
});
