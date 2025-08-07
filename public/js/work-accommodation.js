console.log('✅ work-accommodation.js loaded');

const form = document.getElementById('form');
const outputBox = document.getElementById('workOutput');
const copyBtn = document.getElementById('copy-btn');
const printBtn = document.getElementById('print-btn');
const downloadBtn = document.getElementById('download-btn');
const generateBtn = document.getElementById('generate-btn');

function getFormData() {
  return {
    userName: document.getElementById('userName')?.value.trim(),
    employerName: document.getElementById('employerName')?.value.trim(),
    forWhom: document.getElementById('forWhom')?.value.trim(),
    requestType: document.getElementById('requestType')?.value,
    reason: document.getElementById('reason')?.value.trim(),
    timeframe: document.getElementById('timeframe')?.value.trim(),
    supportType: document.getElementById('supportType')?.value.trim(),
    closingLine: document.getElementById('closingLine')?.value.trim()
  };
}

function generateRequest(data) {
  const {
    userName,
    employerName,
    forWhom,
    requestType,
    reason,
    timeframe,
    supportType,
    closingLine
  } = data;

  let text = `Hi${employerName ? ' ' + employerName : ''},\n\n`;

  if (forWhom?.toLowerCase() !== 'myself') {
    text += `I’m reaching out on behalf of ${forWhom}, to request `;
  } else {
    text += `I’m writing to request `;
  }

  if (requestType === 'leave') {
    text += 'medical leave';
  } else if (requestType === 'accommodation') {
    text += 'a workplace accommodation';
  } else {
    text += 'medical leave and/or a workplace accommodation';
  }

  text += '.\n\n';

  if (reason) {
    text += `${reason}\n\n`;
  }

  if (timeframe) {
    text += `The requested timeframe is: ${timeframe}.\n\n`;
  }

  if (supportType) {
    text += `Requested support: ${supportType}\n\n`;
  }

  text += closingLine
    ? `${closingLine}\n\n`
    : 'Thank you for your time and understanding.\n\n';

  text += userName || '';

  return text.trim();
}

function updateOutput() {
  const data = getFormData();
  const message = generateRequest(data);
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
        <title>Work Accommodation Request</title>
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
  a.download = 'work-accommodation-request.txt';
  a.click();
  URL.revokeObjectURL(url);
});