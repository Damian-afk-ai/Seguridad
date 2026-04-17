import type { ApiResponse } from './types.js';

/**
 * Helper — genera ApiResponse estándar con intOpCode.
 * Formato: Sx + 2 primeras letras recurso MAYÚSCULA + statusCode
 */
export function respond<T>(
  statusCode: number,
  service: string,
  resource: string,
  data: T
): ApiResponse<T> {
  const tag = resource.substring(0, 2).toUpperCase();
  return {
    statusCode,
    intOpCode: `Sx${tag}${statusCode}`,
    data,
    timestamp: new Date().toISOString(),
    service,
  };
}
