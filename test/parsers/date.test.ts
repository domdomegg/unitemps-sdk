import { expect, test } from "vitest";
import dateParser from "../../src/parsers/date";

// Valid

test("processes 01/01/2020 correctly", () => {
  expect(dateParser("01/01/2020").asText).toBe("2020-01-01");
});

test("processes 20/01/2020 correctly", () => {
  expect(dateParser("20/01/2020").asText).toBe("2020-01-20");
});

test("processes 01/01/1970 correctly", () => {
  expect(dateParser("01/01/1970").asText).toBe("1970-01-01");
});

test("processes 01 / 01 / 2020 correctly", () => {
  expect(dateParser("01 / 01 / 2020").asText).toBe("2020-01-01");
});

// Invalid

test("throws when provided 1234", () => {
  expect(() => dateParser("1234")).toThrow();
});

test("throws when provided 01/20/2020", () => {
  expect(() => dateParser("01/20/2020")).toThrow();
});

test("throws when provided 40/01/2020", () => {
  expect(() => dateParser("40/01/2020")).toThrow();
});

test("throws when provided 01/01/20", () => {
  expect(() => dateParser("01/01/20")).toThrow();
});
