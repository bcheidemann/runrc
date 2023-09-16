import { Result } from "./types.ts";

// deno-lint-ignore no-explicit-any
export function Err<E>(error: E): Result<any, E> {
  return {
    error,
    value: null,
  };
}

// deno-lint-ignore no-explicit-any
export function Ok<T>(value: T): Result<T, any> {
  return {
    error: null,
    value,
  };
}
