export type Result<T, E extends Error = Error> = 
  | { success: true; value: T }
  | { success: false; error: E };

export function ok<T, E extends Error = Error>(value: T): Result<T, E> {
  return { success: true, value };
}

export function err<E extends Error>(error: E): Result<never, E> {
  return { success: false, error };
}

export function isSuccess<T, E extends Error>(result: Result<T, E>): result is { success: true; value: T } {
  return result.success;
}

export function isError<T, E extends Error>(result: Result<T, E>): result is { success: false; error: E } {
  return !result.success;
}
