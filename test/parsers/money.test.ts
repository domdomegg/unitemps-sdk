import { expect, test } from "vitest";
import moneyParser from "../../src/parsers/money";

// Valid

test("processes £100.00 correctly", () => {
  expect(moneyParser("£100.00").asFloat).toBe(100);
  expect(moneyParser("£100.00").asText).toBe("£100.00");
});

test("processes £100.01 correctly", () => {
  expect(moneyParser("£100.01").asFloat).toBe(100.01);
});

test("processes £1,000.00 correctly", () => {
  expect(moneyParser("£1,000.00").asFloat).toBe(1000);
});

test("processes £1,000,000.00 correctly", () => {
  expect(moneyParser("£1,000,000.00").asFloat).toBe(1000000);
});

test("processes £1,234.56 correctly", () => {
  expect(moneyParser("£1,234.56").asFloat).toBe(1234.56);
});

test("processes £1,234,567.89 correctly", () => {
  expect(moneyParser("£1,234,567.89").asFloat).toBe(1234567.89);
});

test("processes £0.00 correctly", () => {
  expect(moneyParser("£0.00").asFloat).toBe(0);
});

test("processes £0 correctly", () => {
  expect(moneyParser("£0").asFloat).toBe(0);
});

test("processes £1 correctly", () => {
  expect(moneyParser("£1").asFloat).toBe(1);
});

test("processes £10 correctly", () => {
  expect(moneyParser("£10").asFloat).toBe(10);
});

test("handles extra whitespace in £100.00 correctly", () => {
  expect(moneyParser("£ 100   . 00").asFloat).toBe(100);
  expect(moneyParser("£ 100   . 00").asText).toBe("£100.00");
});

test("handles extra whitespace around £100.00 correctly", () => {
  expect(moneyParser(" £100.00    ").asFloat).toBe(100);
  expect(moneyParser(" £100.00    ").asText).toBe("£100.00");
});

test("handles extra whitespace in and around £100.00 correctly", () => {
  expect(moneyParser(" £100 . 00    ").asFloat).toBe(100);
  expect(moneyParser(" £100 . 00    ").asText).toBe("£100.00");
});

// Special case

test("processes £--.-- correctly", () => {
  expect(moneyParser("£--.--").asFloat).toBe(null);
  expect(moneyParser("£--.--").asText).toBe(null);
  expect(moneyParser("£--.--").asRawText).toBe("£--.--");
});

// Invalid

test("throws when provided £1.00p", () => {
  expect(() => moneyParser("£1.00p")).toThrow();
});

test("throws when provided ££1.00", () => {
  expect(() => moneyParser("££1.00")).toThrow();
});

test("throws when provided 1.00q", () => {
  expect(() => moneyParser("1.00q")).toThrow();
});

test("throws when provided £1.00p", () => {
  expect(() => moneyParser("£1.00p")).toThrow();
});

test("throws when provided ££1.00", () => {
  expect(() => moneyParser("££1.00")).toThrow();
});

test("throws when provided £1.00%", () => {
  expect(() => moneyParser("£1.00%")).toThrow();
});
