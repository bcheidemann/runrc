import { Result } from "./deps.ts";

export function resultFromSync<T, E extends Error>(
  fn: () => T,
): Result<T, E> {
  try {
    const data = fn();
    return Result.ok(data);
  } catch (error) {
    return Result.err(error);
  }
}
