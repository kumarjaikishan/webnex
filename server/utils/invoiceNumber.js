/**
 * Helper to compute Financial Year code, e.g. FY 2026-2027 => "2627"
 * In India/standard FY:
 * April 1 to March 31.
 * If month >= April (month index >= 3), start year is current year, end year is next year.
 * If month < April, start year is previous year, end year is current year.
 */
export function getFinancialYearCode(date = new Date()) {
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth(); // 0 = Jan, 3 = Apr

  let startYear, endYear;
  if (currentMonth >= 3) {
    startYear = currentYear;
    endYear = currentYear + 1;
  } else {
    startYear = currentYear - 1;
    endYear = currentYear;
  }

  const startStr = String(startYear).slice(-2);
  const endStr = String(endYear).slice(-2);
  return `${startStr}${endStr}`;
}

/**
 * Generate next sequential invoice number in format: INV-{FY}-{XXXX}
 * e.g., INV-2627-0001
 * 
 * @param {Array} existingInvoices - list of existing invoice objects
 * @param {string} prefix - default 'INV' (or 'INV-MNT' if desired)
 * @returns {string} next formatted invoice number
 */
export function generateNextInvoiceNumber(existingInvoices = [], prefix = "INV") {
  const fyCode = getFinancialYearCode();
  const patternPrefix = `${prefix}-${fyCode}-`;

  // Find all used sequence numbers in this pattern
  const usedSeqs = new Set();
  for (const inv of existingInvoices) {
    if (inv && typeof inv.invoiceNumber === "string") {
      const numStr = inv.invoiceNumber.trim();
      if (numStr.startsWith(patternPrefix)) {
        const seqPart = numStr.slice(patternPrefix.length);
        const parsed = parseInt(seqPart, 10);
        if (!isNaN(parsed) && parsed > 0) {
          usedSeqs.add(parsed);
        }
      }
    }
  }

  // Find the smallest available sequence number (fills gaps when an invoice is deleted)
  let nextSeq = 1;
  while (usedSeqs.has(nextSeq)) {
    nextSeq++;
  }

  const paddedSeq = String(nextSeq).padStart(3, "0");
  return `${patternPrefix}${paddedSeq}`;
}
