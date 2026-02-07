import Api from './index'
import type {
  HealthResponse,
  IClientId,
  IMe,
  ILogin,
  LoginResponse,
  Admin,
  ApiKey,
  Node,
  Peer
} from './types'

export type {
  HealthResponse,
  IClientId,
  IMe,
  ILogin,
  LoginResponse,
  Admin,
  ApiKey,
  Node,
  Peer
}

export async function login(code: string): Promise<ILogin> {
  return (await Api.post<ILogin>('api/oauth/callback?code=' + code)) as unknown as ILogin
}

export async function getClientId(): Promise<IClientId> {
  return (await Api.get<IClientId>('oauth/clientId')) as unknown as IClientId
}

export function getHealth(): Promise<HealthResponse> {
  const path = import.meta.env.VITE_HEALTH_PATH || '/health'
  return Api.get<HealthResponse>(path) as unknown as Promise<HealthResponse>
}

export function getApiDocsUrl() {
  return import.meta.env.VITE_API_DOCS_URL || `${import.meta.env.VITE_API_BASE_URL}/api`
}

export async function logout() {
  sessionStorage.removeItem('me')
  if (typeof window !== 'undefined' && window.cookieStore) {
    await window.cookieStore.delete('auth_token')
  }
}

export async function isAuthenticated() {
  const s = sessionStorage.getItem('me')
  if (typeof window !== 'undefined' && window.cookieStore) {
    const c = await window.cookieStore.get('auth_token')
    return !!(s && c)
  }
  return false
}

export function getMe(): IMe | undefined {
  const localme = sessionStorage.getItem('me')
  if (localme) {
    return JSON.parse(localme)
  }
  return undefined
}

export function listAdmins(): Promise<Admin[]> {
  return Api.get<Admin[]>('/admins') as unknown as Promise<Admin[]>
}

export function deleteAdmin(id: string | number) {
  return Api.delete(`/admins/${id}`)
}

export function createApiKey(data: Partial<ApiKey>) {
  return Api.post('/api-keys', data)
}

export function listApiKeys(): Promise<ApiKey[]> {
  return Api.get<ApiKey[]>('/api-keys') as unknown as Promise<ApiKey[]>
}

export function toggleApiKeyStatus(id: string | number, status: string) {
  return Api.patch(`/api-keys/${id}/status`, { status })
}

export function deleteApiKey(id: string | number) {
  return Api.delete(`/api-keys/${id}`)
}

export function createNode(data: Partial<Node>) {
  return Api.post('/nodes', data)
}

export function listNodes(): Promise<Node[]> {
  return Api.get<Node[]>('/nodes') as unknown as Promise<Node[]>
}

export function deleteNode(id: string | number) {
  return Api.delete(`/nodes/${id}`)
}

export function updateNodeStatus(id: string | number, status: string) {
  return Api.put(`/nodes/${id}/status`, { status })
}

export function getPeers(): Promise<Peer[]> {
  return Api.get<Peer[]>('/peers') as unknown as Promise<Peer[]>
}