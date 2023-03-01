import { template } from "../template.ts";
import { asserts, bdd, mock } from "./deps.ts";

const { describe, it } = bdd;

describe("template", () => {
  it("should replace {0} with the first argument", () => {
    const resolveArgument = mock.spy(() => "foo");

    const result = template({
      resolveArgument,
    })("{0}");

    asserts.assertEquals(result, '"foo"');
    mock.assertSpyCalls(resolveArgument, 1);
    mock.assertSpyCall(resolveArgument, 0, {
      args: [0],
    });
  });

  it("should replace multiple arguments correctly", () => {
    const resolveArgument = (index: number) => {
      return [
        "foo",
        "bar",
        "baz",
      ][index];
    };

    const result = template({
      resolveArgument,
    })("{0} {1} {2}");

    asserts.assertEquals(result, '"foo" "bar" "baz"');
  });

  it("should replace multiple arguments with the same index correctly", () => {
    const resolveArgument = (index: number) => {
      return [
        "foo",
        "bar",
        "baz",
        "qux",
      ][index];
    };

    const result = template({
      resolveArgument,
    })("{0} {1} {2} {0}");

    asserts.assertEquals(result, '"foo" "bar" "baz" "foo"');
  });

  it("should replace arguments with spaces correctly", () => {
    const resolveArgument = (index: number) => {
      return [
        "foo bar",
        "bar baz",
        "baz foo",
        "qux qux",
      ][index];
    };

    const result = template({
      resolveArgument,
    })("{0} {1} {2}");

    asserts.assertEquals(result, '"foo bar" "bar baz" "baz foo"');
  });

  it("should handle missing values correctly", () => {
    const resolveArgument = (index: number) => {
      return [
        "foo",
        "bar",
        "baz",
        "qux",
      ][index];
    };

    const result = template({
      resolveArgument,
    })("{0} {1} {2} {3} {4}");

    asserts.assertEquals(result, '"foo" "bar" "baz" "qux" ""');
  });

  it("should replace a range of arguments correctly", () => {
    const resolveArgument = (index: number) => {
      return [
        "foo",
        "bar",
        "baz",
        "qux",
      ][index];
    };

    const result = template({
      resolveArgument,
    })("{0..2}");

    asserts.assertEquals(result, '"foo" "bar" "baz"');
  });

  it("should replace an unbounded range of arguments correctly", () => {
    const resolveArgument = (index: number) => {
      return [
        "foo",
        "bar",
        "baz",
        "qux",
      ][index];
    };

    const result = template({
      resolveArgument,
    })("{..2}");

    asserts.assertEquals(result, '"foo" "bar" "baz"');
  });

  it("should replace an unbounded range of arguments starting from 0 correctly", () => {
    const resolveArgument = (index: number) => {
      return [
        "foo",
        "bar",
        "baz",
        "qux",
      ][index];
    };

    const result = template({
      resolveArgument,
    })("{0..}");

    asserts.assertEquals(result, '"foo" "bar" "baz" "qux"');
  });

  it("should replace an unbounded range of arguments starting from 1 correctly", () => {
    const resolveArgument = (index: number) => {
      return [
        "foo",
        "bar",
        "baz",
        "qux",
      ][index];
    };

    const result = template({
      resolveArgument,
    })("{1..}");

    asserts.assertEquals(result, '"bar" "baz" "qux"');
  });

  it("should replace a doubly unbounded range of arguments correctly", () => {
    const resolveArgument = (index: number) => {
      return [
        "foo",
        "bar",
        "baz",
        "qux",
      ][index];
    };

    const result = template({
      resolveArgument,
    })("{..}");

    asserts.assertEquals(result, '"foo" "bar" "baz" "qux"');
  });
});
