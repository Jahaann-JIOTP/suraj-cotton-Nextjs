import React from "react";

const Alarms = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="13"
    viewBox="0 0 12 13"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.62872 9.95802C7.50741 10.8061 6.77805 11.458 5.89645 11.458C5.01483 11.458 4.28548 10.8061 4.16419 9.95802H7.62872ZM1.5 9.458L2.50001 6.60301V5.45802C2.50001 3.248 4.065 1.45801 6 1.45801C6.26326 1.47472 6.52351 1.52341 6.77501 1.60302C8.39501 1.973 9.49999 3.70801 9.49999 5.603V6.60301L10.5 9.458H1.5Z"
      fill="currentColor"
    />
  </svg>
);

export default Alarms;
