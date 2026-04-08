import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import { createRequest } from './createHttpClient'

export interface BackendResponse<T> {
  code: number
  data: T
  message?: string
}

export async function requestData<TResponse, TBody = unknown>(
  client: AxiosInstance,
  config: AxiosRequestConfig<TBody>
): Promise<TResponse> {
  const response = await createRequest<BackendResponse<TResponse>, TBody>(client, config)
  return response.data
}
