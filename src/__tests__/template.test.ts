import { template } from "../lib/template.ts";
import { asserts, bdd } from "./deps.ts";

const { describe, it } = bdd;

describe("template", () => {
  it("should replace {0} with the first argument", () => {
    const args = ["foo", "bar", "baz", "qux"];

    const result = template({
      args,
    })("{0}");

    asserts.assertEquals(result, '"foo"');
  });

  it("should replace multiple arguments correctly", () => {
    const args = [
      "foo",
      "bar",
      "baz",
    ];

    const result = template({
      args,
    })("{0} {1} {2}");

    asserts.assertEquals(result, '"foo" "bar" "baz"');
  });

  it("should replace multiple arguments with the same index correctly", () => {
    const args = [
      "foo",
      "bar",
      "baz",
      "qux",
    ];

    const result = template({
      args,
    })("{0} {1} {2} {0}");

    asserts.assertEquals(result, '"foo" "bar" "baz" "foo"');
  });

  it("should replace arguments with spaces correctly", () => {
    const args = [
      "foo bar",
      "bar baz",
      "baz foo",
      "qux qux",
    ];

    const result = template({
      args,
    })("{0} {1} {2}");

    asserts.assertEquals(result, '"foo bar" "bar baz" "baz foo"');
  });

  it("should handle missing values correctly", () => {
    const args = [
      "foo",
      "bar",
      "baz",
      "qux",
    ];

    const result = template({
      args,
    })("{0} {1} {2} {3} {4}");

    asserts.assertEquals(result, '"foo" "bar" "baz" "qux" ""');
  });

  it("should replace a range of arguments correctly", () => {
    const args = [
      "foo",
      "bar",
      "baz",
      "qux",
    ];

    const result = template({
      args,
    })("{0..2}");

    asserts.assertEquals(result, '"foo" "bar" "baz"');
  });

  it("should replace an unbounded range of arguments correctly", () => {
    const args = [
      "foo",
      "bar",
      "baz",
      "qux",
    ];

    const result = template({
      args,
    })("{..2}");

    asserts.assertEquals(result, '"foo" "bar" "baz"');
  });

  it("should replace an unbounded range of arguments starting from 0 correctly", () => {
    const args = [
      "foo",
      "bar",
      "baz",
      "qux",
    ];

    const result = template({
      args,
    })("{0..}");

    asserts.assertEquals(result, '"foo" "bar" "baz" "qux"');
  });

  it("should replace an unbounded range of arguments starting from 1 correctly", () => {
    const args = [
      "foo",
      "bar",
      "baz",
      "qux",
    ];

    const result = template({
      args,
    })("{1..}");

    asserts.assertEquals(result, '"bar" "baz" "qux"');
  });

  it("should replace a doubly unbounded range of arguments correctly", () => {
    const args = [
      "foo",
      "bar",
      "baz",
      "qux",
    ];

    const result = template({
      args,
    })("{..}");

    asserts.assertEquals(result, '"foo" "bar" "baz" "qux"');
  });

  it("should replace negative arguments correctly", () => {
    const args = [
      "foo",
      "bar",
      "baz",
      "qux",
    ];

    const result = template({
      args,
    })("{-1} {-2} {-3} {-4} {-5}");

    asserts.assertEquals(result, '"qux" "baz" "bar" "foo" ""');
  });

  it("should replace negative ranges correctly", () => {
    const args = [
      "foo",
      "bar",
      "baz",
      "qux",
    ];

    const result = template({
      args,
    })("{-3..-1}");

    asserts.assertEquals(result, '"bar" "baz" "qux"');
  });

  it("should replace negative unbounded ranges correctly", () => {
    const args = [
      "foo",
      "bar",
      "baz",
      "qux",
    ];

    const result = template({
      args,
    })("{-2..}");

    asserts.assertEquals(result, '"baz" "qux"');
  });

  it("should replace negative unbounded ranges starting from 0 correctly", () => {
    const args = [
      "foo",
      "bar",
      "baz",
      "qux",
    ];

    const result = template({
      args,
    })("{..-3}");

    asserts.assertEquals(result, '"foo" "bar"');
  });

  it("should replace invalid ranges correctly", () => {
    const args = [
      "foo",
      "bar",
      "baz",
      "qux",
    ];

    const result = template({
      args,
    })("{0..-1}");

    asserts.assertEquals(result, "");
  });

  it("should replace wrapping ranges correctly", () => {
    const args = [
      "foo",
      "bar",
      "baz",
      "qux",
    ];

    const result = template({
      args,
    })("{-1..2}");

    asserts.assertEquals(result, '"qux" "foo" "bar" "baz"');
  });

  it("should replace the number of arguments correctly", () => {
    const args = [
      "foo",
      "bar",
      "baz",
      "qux",
    ];

    const result = template({
      args,
    })("{#}");

    asserts.assertEquals(result, "4");
  });
});
