import axios, { AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'
import type { ApiResponse } from './types'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
  timeout: 30000
})

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined' && window.cookieStore) {
      const token = await window.cookieStore.get('auth_token')
      if (token) {
        config.headers = config.headers || {}
        config.headers.Authorization = token.value
      }
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>): any => {
    const apiResponse = response.data
    if (!apiResponse.success) {
      return Promise.reject(new Error(apiResponse.message || 'Request failed'))
    }
    return apiResponse
  },
  (error: AxiosError<ApiResponse>) => {
    if (error.response) {
      const { status, data } = error.response
      const message = data?.message || `Request failed with status ${status}`
      return Promise.reject(new Error(message))
    }
    if (error.request) {
      return Promise.reject(new Error('Network error or no response from server'))
    }
    return Promise.reject(error)
  }
)

const Api = {
  get<T = any>(url: string): Promise<ApiResponse<T>> {
    return axiosInstance.get(url)
  },
  post<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return axiosInstance.post(url, data)
  },
  put<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return axiosInstance.put(url, data)
  },
  patch<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return axiosInstance.patch(url, data)
  },
  delete<T = any>(url: string): Promise<ApiResponse<T>> {
    return axiosInstance.delete(url)
  }
}

export default Api
