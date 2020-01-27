/**
 * Months of the year, 1-indexed
 * @example months[1] // 'January'
 */
const months = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

/**
 * Creates a date formatted how Unitemps accepts from an ISO 8601 date
 * @example toUnitempsDate('2020-01-19') // '19 January 2020'
 * @param iso8601date Date in ISO 8601 date format (YYYY-MM-DD)
 * @returns Date in format for Unitemps (DD MMMM YYYY)
 */
export const toUnitempsDate = (iso8601date: string) =>
  `${iso8601date.substr(8, 2)} ${
    months[parseInt(iso8601date.substr(5, 2))]
  } ${iso8601date.substr(0, 4)}`;
