import dateParser from "../../src/parsers/date";

// Valid

it("processes 01/01/2020 correctly", () => {
  expect(dateParser("01/01/2020").asText).toBe("2020-01-01");
});

it("processes 20/01/2020 correctly", () => {
  expect(dateParser("20/01/2020").asText).toBe("2020-01-20");
});

it("processes 01/01/1970 correctly", () => {
  expect(dateParser("01/01/1970").asText).toBe("1970-01-01");
});

it("processes 01 / 01 / 2020 correctly", () => {
  expect(dateParser("01 / 01 / 2020").asText).toBe("2020-01-01");
});

// Invalid

it("throws when provided 1234", () => {
  expect(() => dateParser("1234")).toThrow();
});

it("throws when provided 01/20/2020", () => {
  expect(() => dateParser("01/20/2020")).toThrow();
});

it("throws when provided 40/01/2020", () => {
  expect(() => dateParser("40/01/2020")).toThrow();
});

it("throws when provided 01/01/20", () => {
  expect(() => dateParser("01/01/20")).toThrow();
});
