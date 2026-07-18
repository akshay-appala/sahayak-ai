const form = document.getElementById("eligibilityForm");
const downloadPdfBtn = document.getElementById("downloadPdfBtn");

let eligibilityData = null;

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const userProfile = {
    age: document.getElementById("age").value,
    income: document.getElementById("income").value,
    gender: document.getElementById("gender").value,
    state: document.getElementById("state").value,
    occupation: document.getElementById("occupation").value,
    student: document.getElementById("student").value,
    farmer: document.getElementById("farmer").value,
    disability: document.getElementById("disability").value,
  };

  const checkBtn = document.getElementById("checkBtn");
  const loader = document.getElementById("loader");
  const buttonText = document.getElementById("buttonText");

  checkBtn.disabled = true;
  loader.classList.remove("d-none");
  buttonText.textContent = "Checking...";

  downloadPdfBtn.classList.add("d-none");
  eligibilityData = null;
  try {
    const response = await fetch("/eligibility", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userProfile),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || `Request failed with status ${response.status}`,
      );
    }

    eligibilityData = data;
    downloadPdfBtn.classList.remove("d-none");

    const schemeResults = document.getElementById("schemeResults");
    schemeResults.innerHTML = "";

    data.schemes.forEach(function (scheme) {
      schemeResults.innerHTML += `
        <div class="card shadow-sm mb-3">
          <div class="card-body">

            <h4 class="card-title text-primary">
              ${scheme.name}
            </h4>

            <span class="badge bg-success mb-3">
              ${scheme.category}
            </span>

            <p>
              <strong>Description:</strong><br>
              ${scheme.description}
            </p>

            <p>
              <strong>Benefits:</strong><br>
              ${scheme.benefits}
            </p>

            <p class="mb-2">
              <strong>Required Documents</strong>
            </p>

            <ul>
              ${scheme.required_documents
                .map((document) => `<li>${document}</li>`)
                .join("")}
            </ul>

            <a
              href="${scheme.application_link}"
              target="_blank"
              class="btn btn-outline-primary"
            >
              Visit Official Website
            </a>

          </div>
        </div>
      `;
    });

    const aiRecommendation = document.getElementById("aiRecommendation");
    aiRecommendation.innerHTML = marked.parse(data.aiRecommendation);
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong. Please try again.");
  } finally {
    checkBtn.disabled = false;
    loader.classList.add("d-none");
    buttonText.textContent = "Check Eligibility";
  }
});

downloadPdfBtn.addEventListener("click", function () {
  if (!eligibilityData) return;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let y = 20;

  // ---------- Title ----------
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(13, 110, 253);
  doc.text("SahayakAI", pageWidth / 2, y, { align: "center" });

  y += 8;

  doc.setFontSize(12);
  doc.setTextColor(80);
  doc.text("Government Scheme Eligibility Report", pageWidth / 2, y, {
    align: "center",
  });

  y += 15;

  doc.setDrawColor(13, 110, 253);
  doc.line(margin, y, pageWidth - margin, y);

  y += 10;

  // ---------- Schemes ----------
  eligibilityData.schemes.forEach((scheme, index) => {
    if (y > 240) {
      doc.addPage();
      y = 20;
    }

    doc.setFillColor(13, 110, 253);
    doc.rect(margin, y - 5, pageWidth - 2 * margin, 10, "F");

    doc.setTextColor(255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);

    doc.text(`${index + 1}. ${scheme.name}`, margin + 2, y + 2);

    y += 12;

    doc.setTextColor(0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    doc.text(`Category: ${scheme.category}`, margin, y);

    y += 7;

    doc.setFont("helvetica", "bold");
    doc.text("Description:", margin, y);

    doc.setFont("helvetica", "normal");

    y += 6;

    let text = doc.splitTextToSize(scheme.description, pageWidth - 2 * margin);

    doc.text(text, margin, y);

    y += text.length * 6 + 2;

    doc.setFont("helvetica", "bold");
    doc.text("Benefits:", margin, y);

    doc.setFont("helvetica", "normal");

    y += 6;

    text = doc.splitTextToSize(scheme.benefits, pageWidth - 2 * margin);

    doc.text(text, margin, y);

    y += text.length * 6 + 2;

    doc.setFont("helvetica", "bold");
    doc.text("Required Documents:", margin, y);

    y += 6;

    doc.setFont("helvetica", "normal");

    scheme.required_documents.forEach((document) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      doc.text("• " + document, margin + 5, y);
      y += 6;
    });

    y += 2;

    doc.setFont("helvetica", "bold");

    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.text("Official Website:", margin, y);

    doc.setFont("helvetica", "normal");

    doc.setTextColor(0, 0, 255);

    y += 6;

    doc.text(scheme.application_link, margin, y);

    doc.setTextColor(0);

    y += 12;
  });

  // ---------- AI Recommendation ----------
  doc.addPage();
  y = 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(13, 110, 253);
  doc.text("AI Recommendation", pageWidth / 2, y, {
    align: "center",
  });

  y += 15;

  doc.setTextColor(0);

  const lines = eligibilityData.aiRecommendation.split("\n");

  lines.forEach((line) => {
    line = line.trim();

    if (!line) {
      y += 6;
      return;
    }

    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    // Remove markdown symbols
    line = line
      .replace(/^#+\s*/, "")
      .replace(/\*\*/g, "")
      .replace(/`/g, "")
      .replace(/^[-*]\s*/, "• ");

    // Headings
    if (
      /^\d+\./.test(line) ||
      line.startsWith("Scheme Name") ||
      line.startsWith("Why Eligible") ||
      line.startsWith("Benefits") ||
      line.startsWith("Required Documents") ||
      line.startsWith("Official Website") ||
      line.startsWith("Application Steps") ||
      line.startsWith("Important Notes")
    ) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);

      doc.text(line, margin, y);

      y += 8;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);

      return;
    }

    const wrapped = doc.splitTextToSize(line, pageWidth - 2 * margin);

    doc.text(wrapped, margin, y);

    y += wrapped.length * 6 + 2;
  });

  doc.save("SahayakAI_Report.pdf");
});
