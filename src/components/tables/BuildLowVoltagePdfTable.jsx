export const buildLowVoltagePdfTable = ({
  title = "",
  data = [], // array of row objects, e.g., lowVoltageSide
  totalRow = {}, // object with totals, e.g., lowVoltageTotla
  headers = [], // array of main headers, e.g., ["Total Incoming From Generation", "Total Incoming From Other Unit", ...]
  keys = [], // array of keys matching data fields, e.g., ["Total_I_C_G", "I_C_OU", "Total_Consumption", "Total_Tranferred_to_OU", "Unaccounted_Energy"]
  pageBreakAfter = false,
}) => {
  if (!headers.length || !keys.length || headers.length !== keys.length) {
    throw new Error("Headers and keys must be provided and match in length");
  }

  // Header Row 1: Main headers
  const headerRow1 = [
    {
      text: "Unit No.",
      style: "tableHeader",
      alignment: "center",
      rowSpan: 2,
      fillColor: "#E5F3FD",
    },
    ...headers.flatMap((h) => [
      {
        text: h,
        style: "tableHeader",
        alignment: "center",
        colSpan: 2,
        fillColor: "#E5F3FD",
      },
      {},
    ]),
  ];

  // Header Row 2: Sub-headers (P1, P2)
  const headerRow2 = [
    {},
    ...headers.flatMap(() => [
      {
        text: "P1",
        style: "tableHeader",
        alignment: "center",
        fillColor: "#E5F3FD",
      },
      {
        text: "P2",
        style: "tableHeader",
        alignment: "center",
        fillColor: "#E5F3FD",
      },
    ]),
  ];

  // Body rows
  const bodyRows = data.map((row) => {
    return [
      { text: row.unit ?? "-", style: "tableCell", alignment: "center" },
      ...keys.flatMap((key) => {
        const item = row[key] ?? {};
        const formatValue = (v) =>
          typeof v === "number"
            ? v.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : v ?? "-";
        return [
          {
            text: formatValue(item.p1),
            style: "tableCell",
            alignment: "center",
          },
          {
            text: formatValue(item.p2),
            style: "tableCell",
            alignment: "center",
          },
        ];
      }),
    ];
  });

  // Optional Total row
  let totalPdfRow = [];
  if (totalRow && Object.keys(totalRow).length) {
    totalPdfRow = [
      {
        text: "Total",
        style: "tableHeader",
        alignment: "center",
        fillColor: "#F0F0F0",
      },
      ...keys.flatMap((key) => {
        const item = totalRow[key] ?? {};
        const formatValue = (v) =>
          typeof v === "number"
            ? v.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : v ?? "-";
        return [
          {
            text: formatValue(item.p1),
            style: "tableCell",
            alignment: "center",
            fillColor: "#F0F0F0",
          },
          {
            text: formatValue(item.p2),
            style: "tableCell",
            alignment: "center",
            fillColor: "#F0F0F0",
          },
        ];
      }),
    ];
  }

  // Column widths: 10% for Unit, remaining evenly divided
  const numColumns = 1 + headers.length * 2;
  const widths = [
    "10%",
    ...Array(headers.length * 2).fill(
      `${(90 / (headers.length * 2)).toFixed(2)}%`
    ),
  ];

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
            margin: [0, 0, 0, 5],
          }
        : null,
      {
        table: {
          headerRows: 2,
          widths,
          body: [
            headerRow1,
            headerRow2,
            ...bodyRows,
            ...(totalPdfRow.length ? [totalPdfRow] : []),
          ],
        },
        layout: {
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => "#000000",
          vLineColor: () => "#000000",
        },
        margin: [0, 0, 0, 10],
      },
    ].filter(Boolean),
    pageBreak: pageBreakAfter ? "after" : undefined,
    dontBreakRows: true,
  };
};
