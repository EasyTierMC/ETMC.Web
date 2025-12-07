import Api from './index'

export interface HealthResponse {
  status?: string
  uptime?: number
  [key: string]: any
}

interface IMe{
  username:string,
  avatar:string,
}

interface ILogin{
  info:{
    login:string,
    avatar_url:string,
  }
}

export async function login(code:string){
  const res = await Api.post('http://localhost:3000/auth/oauth?code='+code);
  return res as unknown as ILogin
}

export function getHealth() {
  const path = import.meta.env.VITE_HEALTH_PATH || '/health'
  return Api.get<HealthResponse>(path)
}

export function getApiDocsUrl() {
  return import.meta.env.VITE_API_DOCS_URL || `${import.meta.env.VITE_API_BASE_URL}/api`
}

export interface LoginResponse {
  token: string
  [key: string]: any
}

// export async function login(username: string, password: string) {
//   const res = (await Api.post<LoginResponse>('/auth/login', { username, password })) as unknown as LoginResponse
//   const token = (res as any)?.data.token
//   if (token) {
//     localStorage.setItem('auth_token', token)
//   }
//   return res
// }

export function logout() {
  sessionStorage.removeItem('me')
  cookieStore.delete('auth_token')
}

export async function isAuthenticated() {
  const s = sessionStorage.getItem('me');
  const c = await cookieStore.get('auth_token')
   return !!(s&&c)
  //return true
}

export function getMe() {
  let result:IMe|undefined = undefined;
  const localme = sessionStorage.getItem('me')
  if(localme){
    result = JSON.parse(localme)
  }
  return /*(Api.get('/auth/me') as Promise<any>)*/result;
}

// Admin list (requires admin role)
export function listAdmins() {
  return Api.get('/admins') as Promise<any[]>
}

export function deleteAdmin(id: string | number) {
  return Api.delete(`/admins/${id}`)
}

export function createApiKey(data: any) {
  return Api.post('/api-keys', data)
}

export function listApiKeys() {
  return Api.get('/api-keys') as Promise<any[]>
}

export function toggleApiKeyStatus(id: string | number, status: string) {
  return Api.patch(`/api-keys/${id}/status`, { status })
}

export function deleteApiKey(id: string | number) {
  return Api.delete(`/api-keys/${id}`)
}

export function createNode(data: any) {
  return Api.post('/nodes', data)
}

export function listNodes() {
  return Api.get('/nodes') as Promise<any[]>
}

export function deleteNode(id: string | number) {
  return Api.delete(`/nodes/${id}`)
}

export function updateNodeStatus(id: string | number, status: string) {
  return Api.put(`/nodes/${id}/status`, { status })
}

// Public peers (optional API key)
export function getPeers() {
  return Api.get('/peers') as Promise<any[]>
}