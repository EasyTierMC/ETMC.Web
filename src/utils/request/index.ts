import axios, { AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'

const Api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
  timeout: 30000
})

Api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined' && window.cookieStore) {
      const token = await window.cookieStore.get('auth_token')
      if (token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${token.value}`
      }
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

Api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError) => {
    if (error.response) {
      const { status, data } = error.response as any
      const message = data?.message || `Request failed with status ${status}`
      return Promise.reject(new Error(message))
    }
    if (error.request) {
      return Promise.reject(new Error('Network error or no response from server'))
    }
    return Promise.reject(error)
  }
)

export default Api