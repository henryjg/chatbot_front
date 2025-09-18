import { AxiosError } from 'axios';

export enum ErrorType {
  VALIDATION = 'VALIDATION_ERROR',
  AUTH = 'AUTH_ERROR',
  NOT_FOUND = 'NOT_FOUND_ERROR',
  SERVER = 'SERVER_ERROR',
  NETWORK = 'NETWORK_ERROR',
  UNKNOWN = 'UNKNOWN_ERROR'
}

export class ApiError extends Error {
  constructor(
    message: string,
    public type: ErrorType,
    public statusCode?: number,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError) {
    // Error de respuesta (el servidor respondió con un código de estado diferente de 2xx)
    if (error.response) {
      const statusCode = error.response.status;
      const backendMsg = error.response.data?.message;
      // Mapear códigos de estado HTTP a tipos de error
      switch (statusCode) {
        case 400:
          return new ApiError(
            backendMsg || 'Datos inválidos', 
            ErrorType.VALIDATION, 
            statusCode, 
            error
          );
        case 401:
          return new ApiError(
            backendMsg || 'Su sesión ha expirado o no está autorizado', 
            ErrorType.AUTH, 
            statusCode, 
            error
          );
        case 403:
          return new ApiError(
            backendMsg || 'No tiene permisos para realizar esta acción', 
            ErrorType.AUTH, 
            statusCode, 
            error
          );
        case 404:
          return new ApiError(
            backendMsg || 'Recurso no encontrado', 
            ErrorType.NOT_FOUND, 
            statusCode, 
            error
          );
        case 422:
          return new ApiError(
            backendMsg || 'Error de validación', 
            ErrorType.VALIDATION, 
            statusCode, 
            error
          );
        case 500:
        case 502:
        case 503:
          return new ApiError(
            backendMsg || 'Error en el servidor', 
            ErrorType.SERVER, 
            statusCode, 
            error
          );
        default:
          // SIEMPRE prioriza el mensaje del backend si existe
          return new ApiError(
            backendMsg || 'Error desconocido en la comunicación con el servidor', 
            ErrorType.UNKNOWN, 
            statusCode, 
            error
          );
      }
    }
    // Error de red (sin conexión)
    if (error.request) {
      return new ApiError(
        'No se pudo conectar con el servidor. Verifique su conexión a internet', 
        ErrorType.NETWORK, 
        undefined, 
        error
      );
    }
  }
  // Error no relacionado con Axios
  // SIEMPRE prioriza el mensaje si existe en error.message
  let msg = 'Error desconocido';
  if (error && typeof error === 'object' && 'message' in error && typeof (error as any).message === 'string') {
    msg = (error as any).message;
  }
  return new ApiError(
    msg,
    ErrorType.UNKNOWN,
    undefined,
    error
  );
};