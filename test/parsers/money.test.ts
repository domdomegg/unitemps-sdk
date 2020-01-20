import moneyParser from "../../src/parsers/money";

// Valid

it("processes £100.00 correctly", () => {
  expect(moneyParser("£100.00").asFloat).toBe(100);
  expect(moneyParser("£100.00").asText).toBe("£100.00");
});

it("processes £100.01 correctly", () => {
  expect(moneyParser("£100.01").asFloat).toBe(100.01);
});

it("processes £1,000.00 correctly", () => {
  expect(moneyParser("£1,000.00").asFloat).toBe(1000);
});

it("processes £1,000,000.00 correctly", () => {
  expect(moneyParser("£1,000,000.00").asFloat).toBe(1000000);
});

it("processes £1,234.56 correctly", () => {
  expect(moneyParser("£1,234.56").asFloat).toBe(1234.56);
});

it("processes £1,234,567.89 correctly", () => {
  expect(moneyParser("£1,234,567.89").asFloat).toBe(1234567.89);
});

it("processes £0.00 correctly", () => {
  expect(moneyParser("£0.00").asFloat).toBe(0);
});

it("processes £0 correctly", () => {
  expect(moneyParser("£0").asFloat).toBe(0);
});

it("processes £1 correctly", () => {
  expect(moneyParser("£1").asFloat).toBe(1);
});

it("processes £10 correctly", () => {
  expect(moneyParser("£10").asFloat).toBe(10);
});

it("handles extra whitespace in £100.00 correctly", () => {
  expect(moneyParser("£ 100   . 00").asFloat).toBe(100);
  expect(moneyParser("£ 100   . 00").asText).toBe("£100.00");
});

it("handles extra whitespace around £100.00 correctly", () => {
  expect(moneyParser(" £100.00    ").asFloat).toBe(100);
  expect(moneyParser(" £100.00    ").asText).toBe("£100.00");
});

it("handles extra whitespace in and around £100.00 correctly", () => {
  expect(moneyParser(" £100 . 00    ").asFloat).toBe(100);
  expect(moneyParser(" £100 . 00    ").asText).toBe("£100.00");
});

// Special case

it("processes £--.-- correctly", () => {
  expect(moneyParser("£--.--").asFloat).toBe(null);
  expect(moneyParser("£--.--").asText).toBe(null);
  expect(moneyParser("£--.--").asRawText).toBe("£--.--");
});

// Invalid

it("throws when provided £1.00p", () => {
  expect(() => moneyParser("£1.00p")).toThrow();
});

it("throws when provided ££1.00", () => {
  expect(() => moneyParser("££1.00")).toThrow();
});

it("throws when provided 1.00q", () => {
  expect(() => moneyParser("1.00q")).toThrow();
});

it("throws when provided £1.00p", () => {
  expect(() => moneyParser("£1.00p")).toThrow();
});

it("throws when provided ££1.00", () => {
  expect(() => moneyParser("££1.00")).toThrow();
});

it("throws when provided £1.00%", () => {
  expect(() => moneyParser("£1.00%")).toThrow();
});
