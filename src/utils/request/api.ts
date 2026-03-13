import Api from "./index";
import type {
  HealthResponse,
  ProfileData,
  ClientIdData,
  LoginData,
  User,
  UserListResponse,
  ApiKeyData,
  ApiKeyListResponse,
  ApiKeyMyData,
  ApiKeyRegisterRequest,
  NodeCreateRequest,
  AdminNodeData,
  AdminNodeListResponse,
  GlobalNodeStatus,
  GlobalNodeStatusWithHourly,
  HourlyData,
  ClusterChallengeData,
  ClusterTokenData,
  ClusterTokenRequest,
  ClusterRefreshRequest,
  Peer,
  FakeUrl,
  FakeUrlListResponse,
  FakeUrlCreateRequest,
  FakeUrlUpdateRequest,
} from "./types";

export type {
  HealthResponse,
  ProfileData,
  ClientIdData,
  LoginData,
  User,
  UserListResponse,
  ApiKeyData,
  ApiKeyListResponse,
  ApiKeyMyData,
  ApiKeyRegisterRequest,
  NodeCreateRequest,
  AdminNodeData,
  AdminNodeListResponse,
  GlobalNodeStatus,
  GlobalNodeStatusWithHourly,
  HourlyData,
  ClusterChallengeData,
  ClusterTokenData,
  ClusterTokenRequest,
  ClusterRefreshRequest,
  Peer,
  FakeUrl,
  FakeUrlListResponse,
  FakeUrlCreateRequest,
  FakeUrlUpdateRequest,
};

export function login(code: string) {
  return Api.post<LoginData>("/oauth/callback?code=" + code);
}

export function getClientId() {
  return Api.get<ClientIdData>("/oauth/clientId");
}

export function getHealth() {
  const path = import.meta.env.VITE_HEALTH_PATH || "/health";
  return Api.get(path) as unknown as Promise<HealthResponse>;
}

export function getApiDocsUrl() {
  return (
    import.meta.env.VITE_API_DOCS_URL ||
    `${import.meta.env.VITE_API_BASE_URL}/api`
  );
}

export async function logout() {
  sessionStorage.removeItem("me");
  if (typeof window !== "undefined" && window.cookieStore) {
    await window.cookieStore.delete("auth_token");
  }
}

export async function hasAuthToken(): Promise<boolean> {
  if (typeof window !== "undefined" && window.cookieStore) {
    const c = await window.cookieStore.get("auth_token");
    return !!c;
  }
  return false;
}

export async function isAuthenticated() {
  const s = sessionStorage.getItem("profile");
  if (typeof window !== "undefined" && window.cookieStore) {
    const c = await window.cookieStore.get("auth_token");
    return !!(s && c);
  }
  return false;
}

export async function getProfile() {
  let localme = sessionStorage.getItem("profile");
  if (localme) {
    return Promise.resolve(JSON.parse(localme));
  } else {
    const response = await Api.get<ProfileData>("/oauth/profile");
    const profile = response.data;
    if (profile) {
      sessionStorage.setItem("profile", JSON.stringify(profile));
    }
    return profile || null;
  }
}

export async function ensureProfile(): Promise<ProfileData | null> {
  const hasToken = await hasAuthToken();
  const localProfile = sessionStorage.getItem("profile");
  
  if (!hasToken) {
    return null;
  }
  
  if (localProfile) {
    return JSON.parse(localProfile);
  }
  
  try {
    const response = await Api.get<ProfileData>("/oauth/profile");
    const profile = response.data;
    if (profile) {
      sessionStorage.setItem("profile", JSON.stringify(profile));
    }
    return profile || null;
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return null;
  }
}

export function listUsers(limit: number, offset: number, role?: 'admin' | 'user') {
  let url = `/admin/users?limit=${limit}&offset=${offset}`;
  if (role) {
    url += `&role=${role}`;
  }
  return Api.get<UserListResponse>(url).then(res => res.data || { items: [], total: 0, offset: 0, limit: 20 });
}

export function deleteUser(uuid: string) {
  return Api.delete(`/admin/users/${uuid}`);
}

export function updateUserRole(uuid: string, role: 'admin' | 'user') {
  return Api.put(`/admin/users/role/${uuid}`, { role });
}

export function listAdminApiKeys(limit: number, offset: number, type?: 'active' | 'pending') {
  let url = `/admin/apikey?limit=${limit}&offset=${offset}`;
  if (type) {
    url += `&type=${type}`;
  }
  return Api.get<ApiKeyListResponse>(url).then(res => res.data || { items: [], total: 0, offset: 0, limit: 20 });
}

export function deleteAdminApiKey(id: number) {
  return Api.delete(`/admin/apikey/${id}`);
}

export function updateApiKeyType(id: number, type: 'active' | 'pending') {
  return Api.put(`/admin/apikey/type/${id}`, { type });
}

export function listAdminNodes(limit: number = 30, offset: number = 0, isReviewed?: boolean, isPublic?: boolean) {
  let url = `/admin/nodes?limit=${limit}&offset=${offset}`;
  if (isReviewed !== undefined) {
    url += `&isReviewed=${isReviewed}`;
  }
  if (isPublic !== undefined) {
    url += `&isPublic=${isPublic}`;
  }
  return Api.get<AdminNodeListResponse>(url).then(res => res.data || { items: [], total: 0, offset: 0, limit: 20 });
}

export function updateNodeReviewStatus(id: string | number, isReviewed: boolean) {
  return Api.put(`/admin/nodes/review/${id}`, { isReviewed });
}

export function updateNodePublicStatus(id: string | number, isPublic: boolean) {
  return Api.put(`/admin/nodes/public/${id}`, { isPublic });
}

export function deleteAdminNode(id: string | number) {
  return Api.delete(`/admin/nodes/${id}`);
}

export function registerApiKey(data: ApiKeyRegisterRequest) {
  return Api.post("/apikey/register", data);
}

export function createApiKey(data: ApiKeyRegisterRequest) {
  return Api.post("/apikey/register", data);
}

export function updateApiKey(id: number, data: ApiKeyRegisterRequest) {
  return Api.put(`/apikey/${id}`, data);
}

export function deleteApiKey(id: number | string) {
  return Api.delete(`/apikey/${id}`);
}

export function listMyApiKeys() {
  return Api.get<ApiKeyMyData[]>("/apikey/my").then(res => res.data || []);
}

export function createNode(data: NodeCreateRequest) {
  return Api.post("/nodes", data);
}

export function listNodes(limit?: number, offset?: number, sort?: string, order?: string) {
  let url = "/nodes?";
  if (limit !== undefined) url += `limit=${limit}&`;
  if (offset !== undefined) url += `offset=${offset}&`;
  if (sort) url += `sort=${sort}&`;
  if (order) url += `order=${order}&`;
  return Api.get(url).then(res => res.data?.nodes || []);
}

export function listMyNodes() {
  return Api.get("/nodes/me").then(res => res.data || []);
}

export function updateNode(nodeId: string, data: NodeCreateRequest) {
  return Api.put(`/nodes/${nodeId}`, data);
}

export function deleteNode(id: string | number) {
  return Api.delete(`/nodes/${id}`);
}

export function getGlobalNodeStatus() {
  return Api.get<GlobalNodeStatusWithHourly>("/nodes/status/global").then(res => res.data!);
}

export function getClusterChallenge(clusterId: string) {
  return Api.get<ClusterChallengeData>(`/cluster/challenge?clusterId=${clusterId}`);
}

export function getClusterToken(data: ClusterTokenRequest) {
  return Api.post<ClusterTokenData>("/cluster/token", data);
}

export function refreshClusterToken(data: ClusterRefreshRequest) {
  return Api.post<ClusterTokenData>("/cluster/refresh", data);
}

export function getPeers() {
  return Api.get<Peer[]>("/peers");
}

export function listFakeUrls(limit: number = 30, offset: number = 0) {
  return Api.get<FakeUrlListResponse>(`/admin/fakeurl/?limit=${limit}&offset=${offset}`).then(res => res.data || { items: [], total: 0, offset: 0, limit: 20 });
}

export function createFakeUrl(data: FakeUrlCreateRequest) {
  return Api.post<FakeUrl>("/admin/fakeurl/", data);
}

export function updateFakeUrl(id: number, data: FakeUrlUpdateRequest) {
  return Api.put<FakeUrl>(`/admin/fakeurl/${id}`, data);
}

export function deleteFakeUrl(id: number) {
  return Api.delete(`/admin/fakeurl/${id}`);
}
