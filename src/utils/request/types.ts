export interface ApiResponse<T = any> {
  status: number
  success: boolean
  data?: T
  message?: string
}

export interface HealthResponse {
  status?: string
  uptime?: number
  [key: string]: any
}

export interface ClientIdData {
  client_id: string
}

export interface IClientId extends ApiResponse<ClientIdData> {}

export interface ProfileData {
  login: string
  avatar_url: string
}

export interface IProfile extends ApiResponse<ProfileData> {}

export interface LoginData {
  token: string
  ttl: number
}

export interface ILogin extends ApiResponse<LoginData> {}

export interface LoginResponse {
  token: string
  [key: string]: any
}

export interface User {
  uuid: string
  username: string
  githubId: number
  avatarUrl: string
  role: 'admin' | 'user'
  lastLoginAt: string
  registeredAt: string
}

export interface UserListResponse {
  items: User[]
  total: number
  offset: number
  limit: number
}

export interface ApiKeyData {
  id: number
  name: string
  description: string | null
  userAgent: string
  providerUuid: number
  type: 'active' | 'pending'
  createdAt: string
  provider?: {
    username: string
    githubId: number
  }
}

export interface ApiKeyListResponse {
  items: ApiKeyData[]
  total: number
  offset: number
  limit: number
}

export interface ApiKeyMyData {
  id: number
  name: string
  description: string | null
  userAgent: string
  providerUuid: number
  createdAt: string | Date
}

export interface ApiKeyRegisterRequest {
  name: string
  description: string
  userAgent: string
}

export interface ApiKey {
  id: string | number
  name: string
  rateLimit: number
  status: string
  [key: string]: any
}

export interface NodeCreateRequest {
  name: string
  description: string
  host: string
  port: number
  protocol: 'tcp' | 'udp' | 'ws' | 'wss'
  isRelay: boolean
  maximumBandwidth: number
  network: {
    name: string
    secret: string
  }
  contact: {
    email: string | null
    qq: string | null
  }
}

export interface Node {
  id: string | number
  name: string
  status: string
  [key: string]: any
}

export interface AdminNodeData {
  id: number
  name: string
  description: string | null
  providerUuid: number
  providerName: string
  isReviewed: boolean
  isPublic: boolean
  status: string
  connections: number
  maxConnections: number
  createdAt: string
}

export interface AdminNodeListResponse {
  items: AdminNodeData[]
  total: number
  offset: number
  limit: number
}

export interface Provider {
  githubId: number
  username: string
}

export interface Contact {
  qq: string | null
  email: string | null
}

export interface NodeStatus {
  status: string
  connections: number
  maxConnections: number
  [key: string]: any
}

export interface NodeView {
  id: number
  name: string
  isOnline: boolean
  maxConnections: number
  currentConnections: number
  loadScore: number
  createdAt: Date
  description: string
  tags: string[]
  provider?: Provider
  providerUuid?: number
  contact?: Contact
  nodeStatuses?: NodeStatus[]
}

export interface Peer {
  id: string | number
  [key: string]: any
}

export interface GlobalNodeStatus {
  totalNodes: number
  onlineNodes: number
  deployedNodes: number
  connections: number
  maxConnections: number
}

export interface GlobalNodeStatusResponse extends ApiResponse<GlobalNodeStatus> {}

export interface ClusterChallengeData {
  challenge: string
}

export interface ClusterChallengeResponse extends ApiResponse<ClusterChallengeData> {}

export interface ClusterTokenData {
  token: string
  ttl: number
}

export interface ClusterTokenResponse extends ApiResponse<ClusterTokenData> {}

export interface ClusterTokenRequest {
  clusterId: string
  challenge: string
  signature: string
}

export interface ClusterRefreshRequest {
  clusterId: string
  token: string
}
