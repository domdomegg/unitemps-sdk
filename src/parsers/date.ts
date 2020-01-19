import * as Types from "../types";

/**
 * Parses text representing some date
 * @param rawText Raw text representing some date
 * @example dateParser('2.50')
 */
const dateParser = (rawText: string): Types.ParsedDate => {
  const parsedText = rawText.replace(/[,\s]/g, "");

  if (!/^[0123]\d\/[01]\d\/\d\d\d\d$/.test(parsedText)) {
    throw new Error(
      "Not a valid date string (expecting format DD/MM/YYYY): " + rawText
    );
  }

  return {
    asText:
      parsedText.substr(6, 4) +
      "-" +
      parsedText.substr(3, 2) +
      "-" +
      parsedText.substr(0, 2),
    asRawText: rawText.trim()
  };
};

export default dateParser;
