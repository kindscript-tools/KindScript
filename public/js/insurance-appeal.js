const defaultClosing = "Thank you for your time and for reviewing this appeal.";

// Get DOM elements
const generateBtn = document.getElementById("generate-btn");
const copyBtn = document.getElementById("copy-btn");
const printBtn = document.getElementById("print-btn");
const downloadBtn = document.getElementById("download-btn");
const appealOutput = document.getElementById("appealOutput");

function generateLetter() {
  const patientName = document.getElementById("patientName").value.trim() || "[Your Name]";
  const insuranceProvider = document.getElementById("insuranceProvider").value.trim() || "[Insurance Provider]";
  const denialDate = document.getElementById("denialDate").value.trim();
  const deniedItem = document.getElementById("deniedItem").value.trim() || "[Denied Item]";
  const denialReason = document.getElementById("denialReason").value.trim();
  const medicalNeed = document.getElementById("medicalNeed").value.trim() || "[Reason You Need This]";
  const doctorName = document.getElementById("doctorName").value.trim();
  const closingLine = document.getElementById("closingLine").value.trim() || defaultClosing;

  const tone = document.getElementById("tone-select").value;

  let letter = "";

  if (tone === "gentle") {
    // Gentle tone
    letter += `Hi ${insuranceProvider},\n\n`;
    letter += `I'm reaching out because my recent request for coverage of ${deniedItem}`;
    if (denialDate) letter += ` was denied on ${denialDate}`;
    letter += `. I understand this might be a routine policy, but I wanted to share why this is important for my health.\n\n`;
    if (doctorName) {
      letter += `I've been experiencing ongoing symptoms, and my doctor, ${doctorName}, has recommended ${deniedItem} as the next step. `;
    } else {
      letter += `I've been experiencing ongoing symptoms, and my doctor has recommended ${deniedItem} as the next step. `;
    }
    if (triedOrFailed(medicalNeed)) {
      letter += `${medicalNeed} `;
    }
    letter += `This could help identify what's going on and guide the right treatment plan.\n\n`;
    letter += `${closingLine}\n\n`;
    letter += `Sincerely,\n${patientName}`;
  } else {
    // Professional tone
    const today = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    letter += `${today}\n\n`;
    letter += `${insuranceProvider}\nAppeals Department\n\n`;
    letter += `Re: Appeal for Denial of Coverage – ${deniedItem}\n\n`;
    letter += `To Whom It May Concern at ${insuranceProvider},\n\n`;
    letter += `I am writing to formally appeal the denial of coverage for ${deniedItem}`;
    if (denialDate) letter += `, which was denied on ${denialDate}`;
    letter += `. This request has been recommended as medically necessary for my treatment by my healthcare provider`;
    if (doctorName) letter += `, ${doctorName}`;
    letter += `.\n\n`;
    if (denialReason) {
      letter += `The stated reason for denial was: "${denialReason}". `;
    }
    letter += `${medicalNeed}\n\n`;
    letter += `I respectfully request a full review of this decision, considering the medical necessity and the supporting documentation provided by my healthcare provider.\n\n`;
    letter += `${closingLine}\n\n`;
    letter += `Sincerely,\n${patientName}`;
  }

  appealOutput.textContent = letter.trim() || '(Fill out the form and click Generate)';
}

// Helper to check if the user provided any "tried/failed" or need description
function triedOrFailed(text) {
  return text && text.trim().length > 0;
}

function copyToClipboard() {
  navigator.clipboard.writeText(appealOutput.innerText).catch(err =>
    console.error('Clipboard copy failed:', err)
  );
}

function printOutput() {
  const text = appealOutput.innerText.trim();
  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <html>
      <head>
        <title>Insurance Appeal Letter</title>
        <style>
          body {
            font-family: Georgia, serif;
            font-size: 0.8rem;
            padding: 2rem;
            line-height: 1.5;
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
}

function downloadTxt() {
  const content = appealOutput.innerText;
  const blob = new Blob([content], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "insurance-appeal-letter.txt";
  link.click();
  URL.revokeObjectURL(link.href);
}

// Event listeners
generateBtn?.addEventListener("click", generateLetter);
copyBtn?.addEventListener("click", copyToClipboard);
printBtn?.addEventListener("click", printOutput);
downloadBtn?.addEventListener("click", downloadTxt);
