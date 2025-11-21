/**
 * Reusable, styled table builder for PDFMake
 * Matches StandardTable layout & above pdfStyles
 */
export const buildStandardPdfTable = ({
  title = "",
  headers = [],
  data = [],
  totalRow = null,
  percentKeys = [],
  highlightKeys = [],
  formatNumberKeys = [], // <-- NEW
  firstColAlign = "center", // <-- UPDATED default
  cellWidth = "",
  widths = [],
  pageBreakAfter = false,
}) => {
  // --- WIDTH LOGIC ---
  const pdfWidths = headers.map((_, idx) => (idx === 0 ? "10%" : cellWidth));

  // --- HEADER ROW ---
  const headerRow = headers.map((h, idx) => ({
    text: h.label,
    style: "tableHeader",
    alignment: idx === 0 ? firstColAlign : "center",
  }));

  // --- BODY ROWS ---
  const bodyRows = data.map((row) =>
    headers.map((h, idx) => {
      const value = row[h.key];
      const isPercent = percentKeys.includes(h.key);
      const isHighlighted = highlightKeys.includes(h.key);

      const shouldFormat =
        typeof value === "number" && formatNumberKeys.includes(h.key);

      const displayValue = shouldFormat
        ? value.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) + (isPercent ? " %" : "")
        : isPercent
        ? value + " %"
        : value ?? "-";

      return {
        text: displayValue,
        style: idx === 0 ? "tableCellCenter" : "tableCellRight", // <-- CENTER FIRST COLUMN
        alignment: idx === 0 ? "center" : "right", // <-- CENTER FIRST COLUMN
        fillColor: isHighlighted ? "#E5F3FD" : null,
      };
    })
  );

  // --- TOTAL ROW (optional) ---
  if (totalRow) {
    const totalCells = headers.map((h, idx) => {
      const value = totalRow[h.key];
      const isHighlighted = highlightKeys.includes(h.key);

      const shouldFormat =
        typeof value === "number" && formatNumberKeys.includes(h.key);

      const displayValue = shouldFormat
        ? value.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : value ?? "-";

      return {
        text: displayValue,
        style: idx === 0 ? "tableCellCenterBold" : "tableCellRightBold",
        alignment: idx === 0 ? "center" : "right",
        fillColor: isHighlighted ? "#f5f5f5" : "#f5f5f5",
      };
    });

    bodyRows.push(totalCells);
  }

  return {
    width: "100%",
    stack: [
      title
        ? {
            table: {
              widths: ["*"],
              body: [[{ text: title, style: "sectionHeader" }]],
            },
            layout: "noBorders",
          }
        : null,
      {
        table: {
          headerRows: 1,
          widths: widths.length ? widths : pdfWidths,
          body: [headerRow, ...bodyRows],
        },
        layout: {
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => "#000000",
          vLineColor: () => "#000000",
        },
        margin: [0, 5, 0, 20],
        dontBreakRows: true,
        fontSize: 9,
        pageBreak: pageBreakAfter ? "after" : undefined,
      },
    ].filter(Boolean),
  };
};

export const pdfStyles = {
  sectionHeader: {
    fontSize: 15,
    bold: true,
    background: "#1C4D82",
    fillColor: "#1C4D82",
    color: "#FFFFFF",
    padding: [8, 3],
    margin: [8, 4],
    alignment: "left",
  },
  tableHeader: {
    bold: true,
    fontSize: 9,
    // background: "#E5F3FD",
    fillColor: "#E5F3FD",
    padding: [4, 2],
  },
  tableCell: {
    fontSize: 9,
    padding: [4, 2],
  },
  tableCellRight: {
    fontSize: 9,
    padding: [4, 2],
    alignment: "right",
  },
  tableCellRightBold: {
    fontSize: 9,
    bold: true,
    padding: [4, 2],
    alignment: "right",
    color: "#000000",
  },
};
