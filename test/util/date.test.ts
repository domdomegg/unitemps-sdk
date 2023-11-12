import { expect, test } from "vitest";
import { toUnitempsDate } from "../../src/util/date";

test("processes 2020-01-01 correctly", () => {
  expect(toUnitempsDate("2020-01-01")).toBe("01 January 2020");
});

test("processes 2020-01-20 correctly", () => {
  expect(toUnitempsDate("2020-01-20")).toBe("20 January 2020");
});

test("processes 1970-01-01 correctly", () => {
  expect(toUnitempsDate("1970-01-01")).toBe("01 January 1970");
});
