export type CheerioedResponse = {
  /** The raw HTML data as a string */
  html: string;
  /** An instance of a CheerioSelector the entire response document */
  $: CheerioStatic;
};

export type ParsedText = {
  /** Parsed text, usually standardised in some way */
  asText: string;
  /** Raw text directly from the website */
  asRawText: string;
};

export type ParsedDate = {
  /**
   * The date formatted in ISO 8601 date format (YYYY-MM-DD)
   * @example '2020-01-01'
   */
  asText: string;
  /** @example '2020/01/01' */
  asRawText: string;
} & ParsedText;

export type ParsedFloat = {
  /**
   * Floating point representation of the parsed number
   * @example 1.5
   */
  asFloat: number;
  /** @example '1.5' */
  asText: string;
  /** @example '1.50' */
  asRawText: string;
} & ParsedText;

export type ParsedMoney = {
  /**
   * Floating point representation of the parsed amount of money
   * @example 1.5
   */
  asFloat: number;
  /**
   * The amount of money formatted with a pound symbol, two decimal places and no whitespace
   * @example '£1.50'
   */
  asText: string;
  /** @example '£\r\n1.50' */
  asRawText: string;
} & ParsedText;

export type PageDataResponse = {
  /**
   * The page's first item's index of the total result set
   * @example 'Displaying 11 to 20 of 25' => 11
   */
  from: number;

  /**
   * The page's last item's index of the total result set
   * @example 'Displaying 11 to 20 of 25' => 20
   */
  to: number;

  /**
   * The size of the total result set
   * @example 'Displaying 11 to 20 of 25' => 25
   */
  total: number;
};

export type TimesheetResponse = {
  ref: string;
  id: string;
  jobTitle: string;
  weekEnding: ParsedDate;
  hours: ParsedFloat;
  pay: ParsedMoney;
  status: "Authorised" | "Entered" | "Paid" | "Rejected" | string;
};

export type JobResponse = {
  ref: string;
  company: string;
  id: string;
  jobTitle: string;
  rateOfPay: ParsedMoney;
  holidayRate: ParsedMoney;
  start: ParsedDate;
  end: ParsedDate;
  status: "Current" | "Past" | string;
};
