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
  firstColAlign = "left",
  widths = [],
  pageBreakAfter = false,
}) => {
  const headerRow = headers.map((h, idx) => ({
    text: h.label,
    style: "tableHeader",
    alignment: idx === 0 ? firstColAlign : "center",
  }));

  const bodyRows = data.map((row) =>
    headers.map((h, idx) => {
      const value = row[h.key];
      const isPercent = percentKeys.includes(h.key);
      const isHighlighted = highlightKeys.includes(h.key);

      return {
        text:
          typeof value === "number"
            ? value.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) + (isPercent ? " %" : "")
            : value ?? "-",
        style: idx === 0 ? "tableCell" : "tableCellRight",
        fillColor: isHighlighted ? "#E5F3FD" : null,
      };
    })
  );

  if (totalRow) {
    const totalCells = headers.map((h, idx) => {
      const value = totalRow[h.key];
      return {
        text:
          typeof value === "number"
            ? value.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : value ?? "-",
        style: idx === 0 ? "tableCell" : "tableCellRightBold",
        fillColor: "#f5f5f5",
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
          widths: widths.length ? widths : Array(headers.length).fill("*"),
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
    background: "#E5F3FD",
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
