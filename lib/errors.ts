import { AxiosError } from 'axios';

export type ErrorCode = 'NETWORK' | 'NOT_FOUND' | 'VALIDATION' | 'AUTH' | 'SERVER' | 'UNKNOWN';

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public statusCode?: number,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function classifyError(error: unknown): AppError {
  if (error instanceof AppError) return error;

  if (error instanceof AxiosError) {
    if (!error.response) {
      return new AppError('NETWORK', 'Chyba pripojenia k serveru');
    }
    const status = error.response.status;
    const message = error.response.data?.message || error.message;

    if (status === 401 || status === 403) return new AppError('AUTH', message, status);
    if (status === 404) return new AppError('NOT_FOUND', message, status);
    if (status === 422 || status === 400) return new AppError('VALIDATION', message, status);
    if (status >= 500) return new AppError('SERVER', message, status);
  }

  if (error instanceof Error) {
    return new AppError('UNKNOWN', error.message);
  }

  return new AppError('UNKNOWN', 'Nastala neočakávaná chyba');
}

export function getUserMessage(error: AppError): string {
  switch (error.code) {
    case 'NETWORK':
      return 'Nepodarilo sa pripojiť k serveru. Skontrolujte pripojenie k internetu.';
    case 'NOT_FOUND':
      return 'Požadovaný záznam nebol nájdený.';
    case 'VALIDATION':
      return error.message || 'Neplatné údaje. Skontrolujte formulár.';
    case 'AUTH':
      return 'Nemáte oprávnenie. Prihláste sa znova.';
    case 'SERVER':
      return 'Chyba servera. Skúste to neskôr.';
    default:
      return 'Nastala neočakávaná chyba.';
  }
}
