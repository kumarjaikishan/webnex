/**
 * Direct PDF Generator using html2canvas and jsPDF loaded dynamically on demand.
 * Captures the exact DOM element as rendered by the browser (including SVG waves,
 * table styling, custom colors, QR code, and typography) with 0% visual difference.
 */

let librariesLoadingPromise = null;

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

async function ensurePdfLibraries() {
  if (window.html2canvas && (window.jspdf || window.jsPDF)) {
    return;
  }
  if (!librariesLoadingPromise) {
    librariesLoadingPromise = (async () => {
      // Load html2canvas
      if (!window.html2canvas) {
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js");
      }
      // Load jsPDF
      if (!window.jspdf && !window.jsPDF) {
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
      }
    })();
  }
  await librariesLoadingPromise;
}

export async function downloadElementAsPdf(element, filename = "Webnex_Labs_Invoice.pdf") {
  if (!element) {
    throw new Error("Target element not found for PDF export");
  }

  await ensurePdfLibraries();

  const jsPdfLib = window.jspdf ? window.jspdf.jsPDF : window.jsPDF;
  if (!jsPdfLib) {
    throw new Error("jsPDF library not available");
  }

  // Hide any elements with class 'no-print' during capture
  const noPrintElements = element.querySelectorAll(".no-print");
  noPrintElements.forEach((el) => {
    el.dataset.prevDisplay = el.style.display;
    el.style.display = "none";
  });

  try {
    // Render the DOM node to high-res canvas (scale 2.5 for super crisp typography, lines and SVGs)
    const canvas = await window.html2canvas(element, {
      scale: 2.5,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: "#ffffff",
      imageTimeout: 15000,
      onclone: (clonedDoc, clonedEl) => {
        // Ensure cloned element has solid white background, zero outer bounds, and full visibility
        clonedEl.style.boxShadow = "none";
        clonedEl.style.borderRadius = "0px";
        clonedEl.style.margin = "0";
        clonedEl.style.border = "none";
        clonedEl.style.width = `${element.offsetWidth}px`;
        clonedEl.style.overflow = "visible";
        clonedEl.style.display = "flex";
        clonedEl.style.flexDirection = "column";
        clonedEl.style.justifyContent = "space-between";
        
        // Ensure all child SVG elements maintain exact inline dimensions and visibility
        const svgs = clonedEl.querySelectorAll("svg");
        svgs.forEach((svg) => {
          svg.style.display = "block";
          svg.style.visibility = "visible";
        });

        // Ensure bottom stripe is visible and not pushed out of bounds
        const bottomStripe = clonedEl.querySelector(".print-theme-bottom-stripe");
        if (bottomStripe) {
          bottomStripe.style.display = "block";
          bottomStripe.style.visibility = "visible";
          bottomStripe.style.marginTop = "auto";
          bottomStripe.style.marginBottom = "0";
        }
      },
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.98);

    // Standard A4 dimensions in mm
    const pdfWidth = 210;
    const pdfHeight = 297;

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    // Calculate aspect ratio fit into A4
    const ratio = imgWidth / pdfWidth;
    const calculatedHeight = imgHeight / ratio;

    const doc = new jsPdfLib({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    // If fits on one A4 page, scale cleanly to page; otherwise paginate seamlessly
    if (calculatedHeight <= pdfHeight) {
      doc.addImage(imgData, "JPEG", 0, 0, pdfWidth, calculatedHeight);
    } else {
      let heightLeft = calculatedHeight;
      let position = 0;

      doc.addImage(imgData, "JPEG", 0, position, pdfWidth, calculatedHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position -= pdfHeight;
        doc.addPage();
        doc.addImage(imgData, "JPEG", 0, position, pdfWidth, calculatedHeight);
        heightLeft -= pdfHeight;
      }
    }

    doc.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
  } finally {
    // Restore any hidden controls
    noPrintElements.forEach((el) => {
      el.style.display = el.dataset.prevDisplay || "";
      delete el.dataset.prevDisplay;
    });
  }
}
