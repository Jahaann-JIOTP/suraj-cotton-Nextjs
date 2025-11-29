export const ThreecolsPdfTable = ({
  title = "",
  data = {},
  pageBreakAfter = false,
  unit = "",
}) => {
  // Build table rows
  const body = Object.entries(data).map(([key, value], idx) => {
    const isFirstRow = idx === 0;

    // Format values
    const p1 =
      typeof value?.p1 === "number"
        ? value.p1.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : value?.p1 ?? "-";

    const p2 =
      typeof value?.p2 === "number"
        ? value.p2.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : value?.p2 ?? "-";

    return [
      {
        text: key.replace(/_/g, " "),
        style: "tableHeader",
        fillColor: "#E5F3FD",
        bold: isFirstRow,
        // alignment: isFirstRow ? "center" : "left",
        alignment: "left",
      },
      {
        text: unit && p1 !== "-" ? `${p1} ${unit}` : p1,
        style: "tableCell",
        fillColor: isFirstRow ? "#E5F3FD" : null,
        bold: isFirstRow,
        // alignment: isFirstRow ? "center" : "left",
        alignment: "left",
      },
      {
        text: unit && p2 !== "-" ? `${p2} ${unit}` : p2,
        style: "tableCell",
        fillColor: isFirstRow ? "#E5F3FD" : null,
        bold: isFirstRow,
        // alignment: isFirstRow ? "center" : "left",
        alignment: "left",
      },
    ];
  });

  return {
    width: "60%",
    stack: [
      title
        ? {
            table: {
              widths: ["*"],
              body: [
                [
                  {
                    text: title,
                    style: "sectionHeader",
                  },
                ],
              ],
            },
            layout: "noBorders",
          }
        : null,
      {
        table: {
          widths: ["20%", "20%", "20%"], // 3 columns for label, p1, p2
          body,
        },
        layout: {
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => "#000000",
          vLineColor: () => "#000000",
        },
        margin: [0, 5, 0, 10],
      },
    ].filter(Boolean),
    margin: [0, 0, 0, 0],
    dontBreakRows: true,
    pageBreak: pageBreakAfter ? "after" : undefined,
  };
};
