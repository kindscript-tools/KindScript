const addButton = document.getElementById('add-medication');
const medsContainer = document.getElementById('medications');
const generateBtn = document.getElementById('generate-button');
const outputField = document.getElementById('output');
const copyBtn = document.getElementById('copy-button');
const printBtn = document.getElementById('print-button');
const downloadBtn = document.getElementById('download-button');

if (!addButton || !medsContainer || !generateBtn || !outputField) {
  console.warn("Missing required form elements. Medication script not initialized.");
} else {
  function addMedicationRow() {
    const row = document.createElement('div');
    row.className = 'medication-row';
    row.innerHTML = `
      <input type="text" placeholder="e.g. Zyrtec" class="med-name" />
      <input type="text" placeholder="10 mg" class="med-dosage" />
      <input type="text" placeholder="Once daily" class="med-frequency" />
      <button type="button" class="remove-med" aria-label="Remove">❌</button>
    `;
    medsContainer.appendChild(row);
  }

  window.addEventListener('DOMContentLoaded', () => {
    addMedicationRow();
  });

  addButton.addEventListener('click', addMedicationRow);

  medsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-med')) {
      e.target.parentElement.remove();
    }
  });

  generateBtn.addEventListener('click', () => {
    const name = document.getElementById('name')?.value.trim();
    const date = document.getElementById('date')?.value.trim();
    const supplements = document.getElementById('supplements')?.value.trim();

    const medRows = document.querySelectorAll('.medication-row');
    const meds = [];

    medRows.forEach(row => {
      const medName = row.querySelector('.med-name')?.value.trim();
      const dose = row.querySelector('.med-dosage')?.value.trim();
      const freq = row.querySelector('.med-frequency')?.value.trim();
      if (medName) {
        meds.push(`${medName} ${dose} (${freq})`);
      }
    });

    let result = '';
    if (name) result += `Name: ${name}\n`;
    if (date) result += `Date: ${date}\n`;
    result += 'Medication List\n';
    if (meds.length) result += `Medications: ${meds.join(', ')}\n`;
    if (supplements) result += `Supplements: ${supplements}`;

    outputField.value = result.trim();
  });

  copyBtn?.addEventListener('click', () => {
    navigator.clipboard.writeText(outputField.value).catch(err =>
      console.error('Clipboard copy failed:', err)
    );
  });

  printBtn?.addEventListener('click', () => {
    const text = outputField.value.trim();
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Medication List</title>
          <style>
            body {
              font-family: Georgia, serif;
              font-size: 0.85rem;
              padding: 2rem;
              white-space: pre-wrap;
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
    const blob = new Blob([outputField.value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'medication-list.txt';
    a.click();
    URL.revokeObjectURL(url);
  });
}
