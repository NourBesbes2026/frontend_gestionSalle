/**
 * Toutes les réponses de ton backend PHP suivent ce format
 * (voir la classe Response::success / Response::error côté PHP).
 */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
