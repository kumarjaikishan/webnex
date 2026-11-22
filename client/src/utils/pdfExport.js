import * as htmlToImage from "html-to-image";
import { jsPDF } from "jspdf";

/**
 * Direct High-Fidelity PDF Generator.
 * Uses html-to-image (native browser SVG foreignObject engine) for 100% pixel-perfect
 * rendering identical to the live webpage (including flexbox centering, exact margins,
 * font baselines, SVG waves, and dynamic QR codes).
 *
 * ZERO LIVE LAYOUT SHIFT:
 * Never mutates live on-screen DOM elements. All A4 layout transformations (zeroing
 * margins, squaring corners, setting A4 height, pinning the footer) are passed exclusively
 * to the cloned capture node via html-to-image's options.style and html2canvas's onclone.
 */

let html2canvasLoadingPromise = null;

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

async function ensureHtml2Canvas() {
  if (window.html2canvas) return;
  if (!html2canvasLoadingPromise) {
    html2canvasLoadingPromise = loadScript(
      "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"
    );
  }
  await html2canvasLoadingPromise;
}

/**
 * Wait for all images inside an element to finish loading before capture
 */
async function waitForImages(el) {
  const imgs = Array.from(el.querySelectorAll("img"));
  await Promise.all(
    imgs.map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete && img.naturalHeight !== 0) {
            resolve();
          } else {
            img.onload = () => resolve();
            img.onerror = () => resolve();
            setTimeout(resolve, 3000);
          }
        })
    )
  );
}

export async function downloadElementAsPdf(element, filename = "Webnex_Labs_Invoice.pdf") {
  if (!element) {
    throw new Error("Target element not found for PDF export");
  }

  // 1. Calculate dimensions without altering live DOM
  const targetWidth = element.offsetWidth || 800;
  const a4Ratio = 297 / 210;
  const singlePageA4Height = Math.round(targetWidth * a4Ratio);

  const naturalHeight = element.scrollHeight || element.offsetHeight;
  const numPages = Math.max(1, Math.ceil(naturalHeight / singlePageA4Height));
  const fullTargetHeight = numPages * singlePageA4Height;

  await waitForImages(element);

  let imgData = null;
  let imgWidth = 0;
  let imgHeight = 0;

  // PRIMARY ENGINE: html-to-image
  // All style normalizations are applied exclusively to the cloned node inside options.style.
  // The on-screen live DOM element is NEVER mutated, preventing any visible layout jumps.
  try {
    imgData = await htmlToImage.toPng(element, {
      pixelRatio: 2.5,
      backgroundColor: "#ffffff",
      cacheBust: false,
      width: targetWidth,
      height: fullTargetHeight,
      style: {
        margin: "0px",
        marginTop: "0px",
        marginBottom: "0px",
        marginLeft: "0px",
        marginRight: "0px",
        padding: "0px",
        borderRadius: "0px",
        boxShadow: "none",
        transform: "none",
        width: `${targetWidth}px`,
        height: `${fullTargetHeight}px`,
        minHeight: `${fullTargetHeight}px`,
        maxHeight: "none",
        overflow: "visible",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      },
      filter: (node) => {
        if (node.classList && node.classList.contains("no-print")) {
          return false;
        }
        return true;
      },
    });

    // Obtain image natural dimensions
    await new Promise((resolve, reject) => {
      const probeImg = new Image();
      probeImg.onload = () => {
        imgWidth = probeImg.naturalWidth || probeImg.width;
        imgHeight = probeImg.naturalHeight || probeImg.height;
        resolve();
      };
      probeImg.onerror = reject;
      probeImg.src = imgData;
    });
  } catch (primaryErr) {
    console.warn("Primary engine (html-to-image) encountered an issue, falling back to html2canvas:", primaryErr);

    // FALLBACK ENGINE: html2canvas
    // Applies overrides exclusively to clonedEl in onclone, leaving live DOM untouched
    await ensureHtml2Canvas();
    const canvas = await window.html2canvas(element, {
      scale: 2.5,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: "#ffffff",
      imageTimeout: 15000,
      width: targetWidth,
      height: fullTargetHeight,
      onclone: (clonedDoc, clonedEl) => {
        clonedEl.style.boxShadow = "none";
        clonedEl.style.borderRadius = "0px";
        clonedEl.style.margin = "0px";
        clonedEl.style.marginTop = "0px";
        clonedEl.style.marginBottom = "0px";
        clonedEl.style.marginLeft = "0px";
        clonedEl.style.marginRight = "0px";
        clonedEl.style.padding = "0px";
        clonedEl.style.border = "none";
        clonedEl.style.transform = "none";
        clonedEl.style.width = `${targetWidth}px`;
        clonedEl.style.height = `${fullTargetHeight}px`;
        clonedEl.style.minHeight = `${fullTargetHeight}px`;
        clonedEl.style.display = "flex";
        clonedEl.style.flexDirection = "column";
        clonedEl.style.justifyContent = "space-between";
        clonedEl.style.overflow = "visible";

        // Hide any elements marked no-print in the cloned doc
        const noPrints = clonedEl.querySelectorAll(".no-print");
        noPrints.forEach((np) => (np.style.display = "none"));

        // Ensure all SVG waves and brand marks render cleanly
        const svgs = clonedEl.querySelectorAll("svg");
        svgs.forEach((svg) => {
          svg.style.display = "block";
          svg.style.visibility = "visible";
        });
      },
    });

    imgData = canvas.toDataURL("image/png");
    imgWidth = canvas.width;
    imgHeight = canvas.height;
  }

  if (!imgData || imgWidth === 0 || imgHeight === 0) {
    throw new Error("Failed to render document image for PDF generation");
  }

  // Standard A4 dimensions in mm
  const pdfWidth = 210;
  const pdfHeight = 297;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  if (numPages === 1) {
    // 100% full-bleed A4 sheet (0 margin, header at y=0, footer at y=297)
    doc.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
  } else {
    for (let p = 0; p < numPages; p++) {
      if (p > 0) doc.addPage();
      const yOffset = -p * pdfHeight;
      doc.addImage(imgData, "PNG", 0, yOffset, pdfWidth, numPages * pdfHeight, undefined, "FAST");
    }
  }

  const safeFilename = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
  doc.save(safeFilename);
}
