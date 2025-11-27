export const buildKeyValuePdfTable = ({
  title = "",
  data = {},
  isSingleCol = false,
  pageBreakAfter = false,
  unit = "",
  boldKeys = [],
  hiligthValueCell = false, // optional unit (e.g. "(kWh)")
}) => {
  // Build table rows
  const body = Object.entries(data).map(([key, value], idx) => {
    const isFirst = idx === 0;
    const labelStyle = "tableHeader";
    const valueStyle = "tableCell";

    let fillColor;
    if (isSingleCol) {
      if (isFirst) {
        fillColor = "#E5F3FD";
      } else {
        fillColor = "";
      }
    } else {
      fillColor = "#E5F3FD";
    }

    // Conditional background for first column
    // let fillColor =
    //   isSingleCol && isFirst ? "#E5F3FD" : !isSingleCol ? "#E5F3FD" : null;
    const shouldBold = boldKeys.includes(key);
    const boldStyle = shouldBold ? { bold: true } : {};
    if (isSingleCol) {
      // Single column layout
      return [
        {
          text: key.replace(/_/g, " "),
          style: labelStyle,
          fillColor: fillColor,
          backgroundColor: "",
          ...boldStyle,
        },
      ];
    } else {
      // Dual column layout
      const formattedValue =
        typeof value === "number"
          ? value.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : value ?? "-";

      return [
        {
          text: key.replace(/_/g, " "),
          style: labelStyle,
          fillColor: fillColor,
          backgroundColor: "",
          ...boldStyle,
        },
        {
          text: unit
            ? `${formattedValue} ${typeof value === "number" ? unit : ""}`
            : formattedValue, // ✅ append unit if provided
          style: valueStyle,
          // fillColor: null, // no background
          fillColor: hiligthValueCell ? "#E5F3FD" : null, // no background
          ...boldStyle,
        },
      ];
    }
  });

  // Final return structure
  return {
    width: isSingleCol ? "25%" : "50%",
    stack: [
      title?.length > 0
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
          widths: isSingleCol ? ["25%"] : ["25%", "25%"],
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
