// Select DOM elements
const fileInput = document.getElementById("fileInput");
const fileName = document.getElementById("fileName");
const summarizeBtn = document.getElementById("summarizeBtn");
const summaryBox = document.getElementById("summaryBox");
const downloadBtn = document.getElementById("downloadBtn");

let selectedFile = null;
let currentSummary = "";

// Handle file selection
fileInput.addEventListener("change", () => {
  selectedFile = fileInput.files[0];
  if (selectedFile) {
    fileName.textContent = selectedFile.name;
  } else {
    fileName.textContent = "No file selected";
  }
});

// Handle Summarize button click
summarizeBtn.addEventListener("click", async () => {
  if (!selectedFile) {
    alert("Please select a file first!");
    return;
  }

  // Show loader
  summaryBox.innerHTML = '<div class="loader"></div>';
  downloadBtn.style.display = "none";

  // Prepare form data
  const formData = new FormData();
  formData.append("file", selectedFile);

  try {
    // Send file to backend
    const response = await fetch("http://127.0.0.1:5000/summarize", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error("Failed to get summary");
    }

    const data = await response.json();
    currentSummary = data.summary;

    // Show summary
    summaryBox.innerHTML = `<p>${currentSummary}</p>`;

    // Show download button
    downloadBtn.style.display = "block";
  } catch (error) {
    summaryBox.innerHTML = `<p style="color: red;">❌ Error: ${error.message}</p>`;
  }
});

// Handle download
downloadBtn.addEventListener("click", () => {
  if (!currentSummary) return;

  const blob = new Blob([currentSummary], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "summary.txt";
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});
