/**
 * Zero-dependency RFC 4180 compliant CSV parser and serializer utility
 */

/**
 * Escapes a field for safe CSV output.
 * If value contains comma, quotes, or newlines, wrap in quotes and escape internal quotes.
 */
export const escapeCsvField = (field) => {
  if (field === null || field === undefined) {
    return "";
  }
  const stringValue = Array.isArray(field)
    ? field.join(", ")
    : String(field);

  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n") ||
    stringValue.includes("\r")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

/**
 * Converts an array of objects into a CSV string.
 * @param {Array<Object>} records - Array of records
 * @param {Array<{key: string, label: string}>} columns - List of column mappings
 * @returns {string} - CSV formatted string
 */
export const recordsToCsv = (records, columns) => {
  const headerLine = columns.map((col) => escapeCsvField(col.label)).join(",");
  const rows = records.map((record) => {
    return columns
      .map((col) => {
        const val = record[col.key];
        return escapeCsvField(val);
      })
      .join(",");
  });

  return [headerLine, ...rows].join("\r\n");
};

/**
 * Parses a raw CSV string into an array of objects based on header row.
 * Handles quoted fields with embedded commas and newlines.
 * @param {string} csvText - Raw CSV text
 * @returns {Array<Object>} - Array of row objects
 */
export const parseCsv = (csvText) => {
  if (!csvText || typeof csvText !== "string") {
    return [];
  }

  const lines = [];
  let currentField = "";
  let inQuotes = false;
  let currentRow = [];

  const text = csvText.trim();

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentField += '"';
          i++; // Skip the escaped quote
        } else {
          inQuotes = false;
        }
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        currentRow.push(currentField.trim());
        currentField = "";
      } else if (char === "\r") {
        if (nextChar === "\n") {
          i++;
        }
        currentRow.push(currentField.trim());
        if (currentRow.some((field) => field !== "")) {
          lines.push(currentRow);
        }
        currentRow = [];
        currentField = "";
      } else if (char === "\n") {
        currentRow.push(currentField.trim());
        if (currentRow.some((field) => field !== "")) {
          lines.push(currentRow);
        }
        currentRow = [];
        currentField = "";
      } else {
        currentField += char;
      }
    }
  }

  if (currentField !== "" || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some((field) => field !== "")) {
      lines.push(currentRow);
    }
  }

  if (lines.length === 0) {
    return [];
  }

  const headers = lines[0].map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ""));
  const records = [];

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i];
    const record = {};
    headers.forEach((header, index) => {
      if (header) {
        record[header] = row[index] !== undefined ? row[index] : "";
      }
    });
    records.push(record);
  }

  return records;
};
