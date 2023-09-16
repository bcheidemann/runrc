import { Diagnostic } from "../cli/diagnostics.ts";
import { Err, Ok } from "./result.ts";
import { Result } from "./types.ts";

export function toErrorMessage(t: unknown): string {
  switch (typeof t) {
    case "string":
      return t;
    case "number":
      return t.toString();
    case "boolean":
      return t ? "true" : "false";
    case "undefined":
      return "undefined";
    case "object":
      if (t === null) {
        return "null";
      }
      if (Array.isArray(t)) {
        return Deno.inspect(t);
      }
      if (t instanceof Diagnostic) {
        return t.message;
      }
      if ("toString" in t) {
        return t.toString();
      }
      return Deno.inspect(t);
    case "function":
      return `Function(${t.name})`;
    case "symbol":
      return t.toString();
    case "bigint":
        return t.toString();
  }
}

export function toDiagnosticError(t: unknown): Diagnostic {
  if (t instanceof Diagnostic) {
    return t;
  }
  return Diagnostic.error(toErrorMessage(t));
}

export function trySync<T>(fn: () => T): Result<T, Diagnostic> {
  try {
    return Ok(fn());
  } catch (error) {
    return error(toDiagnosticError(error));
  }
}

export async function tryAsync<T>(fn: () => Promise<T>): Promise<Result<T, Diagnostic>> {
  try {
    return Ok(await fn());
  } catch (error) {
    return Err(toDiagnosticError(error));
  }
}
