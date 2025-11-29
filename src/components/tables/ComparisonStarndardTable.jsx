export const ComparisonStandardTable = ({
  title = "",
  data = [], // array of row objects
  headers = [], // array of main header labels, e.g. ["Total Actual Connected Load", "Total Connected Load", "Utilization"]
  keys = [], // array of keys matching data fields, e.g. ["TotalConnectedLoadPerDept", "TotalAvgConsumption", "UtilizationPercent"]
  percentKeys = [], // keys that should display % after values
  pageBreakAfter = false,
}) => {
  if (!headers.length || !keys.length || headers.length !== keys.length) {
    throw new Error("Headers and keys must be provided and match in length");
  }

  // Header Row 1: main headers
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
      {}, // placeholder for colSpan
    ]),
  ];

  // Header Row 2: sub-headers (P1, P2)
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
        const isPercent = percentKeys.includes(key);

        const formatValue = (v) =>
          typeof v === "number"
            ? v.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) + (isPercent ? " %" : "")
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

  // Determine widths dynamically (10% for Unit column + rest equally divided)
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
          body: [headerRow1, headerRow2, ...bodyRows],
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
