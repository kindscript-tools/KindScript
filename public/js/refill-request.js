console.log('✅ refill-request.js loaded');

const form = document.getElementById('form');
const outputBox = document.getElementById('refillOutput');
const copyBtn = document.getElementById('copy-btn');
const printBtn = document.getElementById('print-btn');
const downloadBtn = document.getElementById('download-btn');
const generateBtn = document.getElementById('generate-btn');

function getFormData() {
  return {
    patientName: document.getElementById('patientName')?.value.trim(),
    medication: document.getElementById('medication')?.value.trim(),
    duration: document.getElementById('duration')?.value.trim(),
    reason: document.getElementById('reason')?.value.trim(),
    forWhom: document.getElementById('forWhom')?.value.trim(),
    extraInfo: document.getElementById('extraInfo')?.value.trim()
  };
}

function generateRefillMessage(data) {
  const {
    patientName,
    medication,
    duration,
    reason,
    forWhom,
    extraInfo
  } = data;

  let text = 'Hi,\n\n';

  if (forWhom && forWhom.toLowerCase() !== 'myself') {
    text += `I'm reaching out on behalf of ${forWhom}, who needs a refill for ${medication || 'a medication'}.`;
    if (duration) text += ` They’ve been taking it for ${duration}.`;
    text += '\n\n';
  } else {
    text += `I'm writing to request a refill for ${medication || 'a medication'}`;
    if (duration) text += `, which I’ve been taking for ${duration}`;
    text += '.\n\n';
  }

  if (reason) {
    text += `${reason}\n\n`;
  }

  if (extraInfo) {
    text += `${extraInfo}\n\n`;
  }

  text += 'Thanks so much,\n';
  text += patientName || '';

  return text.trim();
}

function updateOutput() {
  const data = getFormData();
  const message = generateRefillMessage(data);
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
        <title>Refill Request</title>
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
  a.download = 'refill-request.txt';
  a.click();
  URL.revokeObjectURL(url);
});