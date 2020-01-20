import * as Types from "../types";

/**
 * Parses text representing some money
 * @param rawText Raw text representing some money
 * @example moneyParser('£12.34')
 */
const moneyParser = (rawText: string): Types.ParsedMoney => {
  const parsedText = rawText.replace(/[,\s]/g, "").replace("£", "");

  if (parsedText == "--.--") {
    return {
      asFloat: null,
      asText: null,
      asRawText: rawText.trim()
    };
  }

  if (!/^\d+(\.\d\d)?$/.test(parsedText)) {
    throw new Error("Not a valid money string: " + rawText);
  }

  return {
    asFloat: parseFloat(parsedText),
    asText: "£" + parsedText,
    asRawText: rawText.trim()
  };
};

export default moneyParser;
