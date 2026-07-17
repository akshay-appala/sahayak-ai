const form = document.getElementById("eligibilityForm");

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

    console.log(data);

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
