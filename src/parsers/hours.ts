import * as Types from "../types";

/**
 * Parses text representing some hours
 * @param rawText Raw text representing some hours
 * @example hoursParser('2.50')
 */
const hoursParser = (rawText: string): Types.ParsedFloat => {
  const parsedText = rawText.replace(/[,\s]/g, "");

  if (!/^\d+(\.\d+)?$/.test(parsedText)) {
    throw new Error("Not a valid hour string: " + rawText);
  }

  return {
    asFloat: parseFloat(parsedText),
    asText: parseFloat(parsedText).toString(),
    asRawText: rawText.trim()
  };
};

export default hoursParser;
