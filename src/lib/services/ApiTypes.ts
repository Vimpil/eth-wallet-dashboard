
// All error classes now unified in AppError.ts

export interface ApiResponse<T> {
  status: string;
  message: string;
  result: T;
}
