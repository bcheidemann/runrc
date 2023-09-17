export type Result<T, E> = {
  error: E;
  value: null;
} | {
  error: null;
  value: T;
};
