export interface HealthResponse {
  status?: string
  uptime?: number
  [key: string]: any
}

export interface IClientId {
  clientId: string
}

export interface IMe {
  username: string
  avatar: string
}

export interface ILogin {
  info: {
    login: string
    avatar_url: string
  }
}

export interface LoginResponse {
  token: string
  [key: string]: any
}

export interface Admin {
  id: string | number
  username: string
  [key: string]: any
}

export interface ApiKey {
  id: string | number
  name: string
  rateLimit: number
  status: string
  [key: string]: any
}

export interface Node {
  id: string | number
  name: string
  status: string
  [key: string]: any
}

export interface Peer {
  id: string | number
  [key: string]: any
}
