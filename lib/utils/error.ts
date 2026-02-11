import { AxiosError } from 'axios'

export { classifyError, getUserMessage, AppError } from '@/lib/errors'
export type { ErrorCode } from '@/lib/errors'

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'Nastala neočakávaná chyba'
}
