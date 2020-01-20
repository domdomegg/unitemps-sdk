export interface ClientConfig {
  USERNAME: string;
  PASSWORD: string;
}

export type CheerioedResponse = {
  html: string;
  $: CheerioStatic;
};

export type ParsedText = {
  asText: string;
  asRawText: string;
};

export type ParsedDate = ParsedText;

export type ParsedFloat = {
  asFloat: number;
} & ParsedText;

export type PageDataResponse = {
  from: number;
  to: number;
  total: number;
};

export type TimesheetResponse = {
  ref: string;
  id: string;
  jobTitle: string;
  weekEnding: ParsedDate;
  hours: ParsedFloat;
  pay: ParsedFloat;
  status: string;
};

export type JobResponse = {
  ref: string;
  company: string;
  id: string;
  jobTitle: string;
  rateOfPay: ParsedFloat;
  holidayRate: ParsedFloat;
  start: ParsedDate;
  end: ParsedDate;
  status: string;
};
