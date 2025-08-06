console.log('✅ symptom-summary.js loaded');

const form = document.getElementById('symptom-form');
const outputBox = document.getElementById('output');
const copyBtn = document.getElementById('copy-btn');
const printBtn = document.getElementById('print-btn');
const downloadBtn = document.getElementById('download-btn');
const styleSelect = document.getElementById('style-select');
const generateBtn = document.getElementById('generate-btn');

function generateFriendly({ start, symptoms, tried, support, extra }) {
  let text = `To whom it may concern,\n\n`;
  text += `I’m sharing this brief summary ahead of our upcoming appointment, in case it helps streamline the conversation.\n\n`;
  if (start || symptoms) {
    text += `I’ve been dealing with the following symptoms or concerns${start ? ' since ' + start : ''}:\n${symptoms || '(Not specified)'}\n\n`;
  }
  if (tried) {
    text += `To try and address or understand what's going on, I've already tried:\n${tried}\n\n`;
  }
  if (support) {
    text += `At this point, I’m hoping to:\n${support}\n\n`;
  }
  if (extra) {
    text += `Other context:\n${extra}\n\n`;
  }
  text += `Thank you for taking the time to review this in advance. It’s been a lot to manage, and I appreciate anything we can do to make the next steps clearer.`;
  return text.trim();
}

function generateBullet({ start, symptoms, tried, support, extra }) {
  return [
    start && `🕒 When it started: ${start}`,
    symptoms && `🩺 Symptoms/changes: ${symptoms}`,
    tried && `🧪 Tried so far: ${tried}`,
    support && `🙋 Hoping for: ${support}`,
    extra && `📝 Other notes: ${extra}`,
  ]
    .filter(Boolean)
    .join('\n');
}

function getSummaryData() {
  return {
    start: document.getElementById("start")?.value.trim(),
    symptoms: document.getElementById("symptoms")?.value.trim(),
    tried: document.getElementById("tried")?.value.trim(),
    support: document.getElementById("support")?.value.trim(),
    extra: document.getElementById("extra")?.value.trim(),
  };
}

function updateOutput() {
  const data = getSummaryData();
  const style = styleSelect?.value || 'friendly';
  const summary = style === 'bullets'
    ? generateBullet(data)
    : generateFriendly(data);
  outputBox.innerText = summary || '(Fill out the form and click Generate)';
}

// Event listeners
generateBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  updateOutput();
});

styleSelect?.addEventListener('change', updateOutput);

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
        <title>Symptom Summary</title>
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
  a.download = 'symptom-summary.txt';
  a.click();
  URL.revokeObjectURL(url);
});
