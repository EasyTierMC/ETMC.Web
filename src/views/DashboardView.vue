<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import NodeDetailModal from '@/components/dashboard/NodeDetailModal.vue'
import NodeEditModal from '@/components/dashboard/NodeEditModal.vue'
import ApiKeyCreateModal from '@/components/dashboard/ApiKeyCreateModal.vue'
import {
  getProfile,
  listAdmins,
  deleteAdmin,
  listApiKeys,
  createApiKey,
  toggleApiKeyStatus,
  deleteApiKey,
  listNodes,
  deleteNode,
  updateNode,
  logout
} from '@/utils/request/api'

const router = useRouter()

const currentUser = ref<any>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const activeTab = ref<'nodes' | 'apiKeys' | 'users'>('nodes')

const nodeList = ref<any[]>([])
const loadingNodes = ref(false)
const selectedNode = ref<any>(null)
const editingNode = ref<any>(null)

const apiKeys = ref<any[]>([])
const loadingApiKeys = ref(false)
const showApiKeyCreateModal = ref(false)

const userList = ref<any[]>([])
const loadingAdmins = ref(false)

const isAdmin = computed(() => currentUser.value?.username === 'admin')

async function fetchUserInfo() {
  try {
    const me = await getProfile()
    currentUser.value = me
  } catch (e: any) {
    console.error(e);
    
    error.value = '未授权，请先登录'
    logout()
    setTimeout(() => router.push('/login'), 1500)
  } finally {
    loading.value = false
  }
}

async function fetchNodes() {
  loadingNodes.value = true
  try {
    const data = await listNodes()
    nodeList.value = data
  } catch (e: any) {
    console.error('获取节点失败:', e)
    nodeList.value = [
      {
        id: 1,
        name: "北京节点",
        description: "主服务器节点",
        host: "192.168.1.100",
        port: 11010,
        network_name: "easytier-main",
        protocol: "wss",
        max_connections: 100,
        allow_relay: true,
        region: "北京",
        ISP: "中国电信",
        status: "Online",
        response_time: 45,
        last_status_update: "2024-01-15T10:30:00Z",
        qq_number: "123456789",
        mail: "admin@example.com",
        tags: ["主节点", "稳定"]
      },
      {
        id: 2,
        name: "上海节点",
        description: "备用节点",
        host: "192.168.1.101",
        port: 11010,
        network_name: "easytier-main",
        protocol: "quic",
        max_connections: 50,
        allow_relay: false,
        region: "上海",
        ISP: "中国联通",
        status: "Offline",
        response_time: null,
        last_status_update: "2024-01-15T09:15:00Z",
        qq_number: "987654321",
        mail: "shanghai@example.com",
        tags: ["备用"]
      },
      {
        id: 3,
        name: "深圳节点",
        description: "测试节点",
        host: "192.168.1.102",
        port: 11010,
        network_name: "easytier-test",
        protocol: "tcp",
        max_connections: 20,
        allow_relay: true,
        region: "深圳",
        ISP: "中国移动",
        status: "Pending",
        response_time: 120,
        last_status_update: "2024-01-15T10:25:00Z",
        qq_number: null,
        mail: "test@example.com",
        tags: ["测试", "开发"]
      }
    ]
  } finally {
    loadingNodes.value = false
  }
}

async function handleDeleteNode(id: string | number) {
  if (!confirm('确定删除此节点？')) return
  try {
    await deleteNode(id)
    await fetchNodes()
  } catch (e: any) {
    alert('删除失败: ' + (e.message || e))
  }
}

async function fetchApiKeys() {
  loadingApiKeys.value = true
  try {
    const data = await listApiKeys()
    apiKeys.value = data
  } catch (e: any) {
    console.error('获取 API Keys 失败:', e)
  } finally {
    loadingApiKeys.value = false
  }
}

async function handleCreateApiKey(data: any) {
  try {
    await createApiKey(data)
    showApiKeyCreateModal.value = false
    await fetchApiKeys()
  } catch (e: any) {
    alert('创建 API Key 失败: ' + (e.message || e))
  }
}

async function handleToggleApiKeyStatus(key: any) {
  try {
    const newStatus = key.status === 'active' ? 'inactive' : 'active'
    await toggleApiKeyStatus(key.id, newStatus)
    await fetchApiKeys()
  } catch (e: any) {
    alert('更新状态失败: ' + (e.message || e))
  }
}

async function handleDeleteApiKey(id: string | number) {
  if (!confirm('确定删除此 API Key')) return
  try {
    await deleteApiKey(id)
    await fetchApiKeys()
  } catch (e: any) {
    alert('删除失败: ' + (e.message || e))
  }
}

async function fetchAdmins() {
  if (!isAdmin.value) return
  loadingAdmins.value = true
  try {
    const data = await listAdmins()
    userList.value = data
  } catch (e: any) {
    console.error('获取管理员列表失败:', e)
  } finally {
    loadingAdmins.value = false
  }
}

async function handleDeleteAdmin(id: string | number) {
  if (!confirm('确定删除此管理员？')) return
  try {
    await deleteAdmin(id)
    await fetchAdmins()
  } catch (e: any) {
    alert('删除失败: ' + (e.message || e))
  }
}

function handleLogout() {
  logout()
  router.push('/login')
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
}

function showNodeDetail(node: any) {
  selectedNode.value = node
}

function closeNodeDetail() {
  selectedNode.value = null
}

function showNodeEdit(node: any) {
  editingNode.value = node
}

function closeNodeEdit() {
  editingNode.value = null
}

async function handleSaveNode(data: any) {
  if (!editingNode.value) return
  try {
    await updateNode(editingNode.value.id, data)
    await fetchNodes()
    closeNodeEdit()
  } catch (e: any) {
    alert('保存失败: ' + (e.message || e))
  }
}

function switchTab(tab: 'nodes' | 'apiKeys' | 'users') {
  activeTab.value = tab
  if (tab === 'nodes' && nodeList.value.length === 0) fetchNodes()
  if (tab === 'apiKeys' && apiKeys.value.length === 0) fetchApiKeys()
  if (tab === 'users' && userList.value.length === 0) fetchAdmins()
}

onMounted(async () => {
  await fetchUserInfo()
  
  if (!error.value) await fetchNodes()
})
</script>

<template>
  <div class="h-screen w-screen bg-base-200 overflow-hidden flex flex-col">
    <div v-if="loading" class="flex items-center justify-center h-full">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>
    
    <div v-else-if="error" class="flex items-center justify-center h-full">
      <div class="alert alert-error shadow-lg max-w-2xl">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ error }}</span>
      </div>
    </div>
    
    <div v-else class="flex-1 flex flex-col overflow-hidden">
      <div class="bg-base-100 px-4 py-2 shrink-0">
        <div role="tablist" class="tabs tabs-lifted">
          <a role="tab" class="tab gap-2 text-sm" :class="{ 'tab-active': activeTab === 'nodes' }" @click="switchTab('nodes')">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            节点管理
          </a>
          <a role="tab" class="tab gap-2 text-sm" :class="{ 'tab-active': activeTab === 'apiKeys' }" @click="switchTab('apiKeys')">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            API Keys
          </a>
          <a v-if="isAdmin" role="tab" class="tab gap-2 text-sm" :class="{ 'tab-active': activeTab === 'users' }" @click="switchTab('users')">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            管理员
          </a>
        </div>
      </div>

      <div class="flex-1 overflow-hidden p-4">
        <div v-show="activeTab === 'nodes'" class="h-full flex flex-col">
          <div class="card bg-base-100 shadow flex-1 flex flex-col">
            <div class="card-body p-4 flex-1 flex flex-col overflow-hidden">
              <h2 class="card-title text-base mb-3 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                节点列表
              </h2>
              
              <div class="flex-1 overflow-auto">
                <div v-if="loadingNodes" class="flex items-center justify-center h-40">
                  <span class="loading loading-spinner loading-sm"></span>
                </div>
                <div v-else-if="nodeList.length === 0" class="flex flex-col items-center justify-center h-40 text-base-content/60">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 opacity-50 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="text-sm">暂无节点</span>
                </div>
                <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3">
                  <div v-for="node in nodeList" :key="node.id" class="card bg-base-200 shadow hover:shadow-md transition-shadow">
                    <div class="card-body p-3">
                      <div class="flex justify-between items-start mb-2">
                        <div class="flex-1 min-w-0">
                          <h3 class="font-semibold text-sm truncate">{{ node.name }}</h3>
                          <p v-if="node.description" class="text-[10px] text-base-content/60 truncate">{{ node.description }}</p>
                        </div>
                        <div class="badge badge-[10px] shrink-0 ml-1" :class="{
                          'badge-success': node.status === 'Online',
                          'badge-error': node.status === 'Offline',
                          'badge-warning': node.status === 'Pending',
                          'badge-ghost': !node.status
                        }">
                          {{ node.status === 'Online' ? '在线' : node.status === 'Offline' ? '离线' : node.status === 'Pending' ? '等待' : node.status || 'Unknown' }}
                        </div>
                      </div>
                      
                      <div v-if="node.tags && node.tags.length > 0" class="flex flex-wrap gap-1 mb-2">
                        <span v-for="tag in node.tags" :key="tag" class="badge badge-secondary badge-[9px]">{{ tag }}</span>
                      </div>
                      
                      <div class="space-y-1 text-[11px]">
                        <div class="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-base-content/60 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span>{{ node.max_connections }}</span>
                          <span v-if="node.allow_relay" class="badge badge-success badge-[10px] gap-0.5 shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                            中继
                          </span>
                          <span v-else class="badge badge-ghost badge-[10px] shrink-0">禁中继</span>
                        </div>
                      </div>
                      
                      <div class="flex gap-1 mt-2 pt-2 border-t border-base-300">
                        <button class="btn btn-ghost btn-[10px] flex-1 h-7" @click="showNodeDetail(node)">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          详情
                        </button>
                        <button class="btn btn-ghost btn-[10px] flex-1 h-7" @click="showNodeEdit(node)">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          编辑
                        </button>
                        <button class="btn btn-ghost btn-[10px] text-error flex-1 h-7" @click="handleDeleteNode(node.id)">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          删除
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <NodeDetailModal :node="selectedNode" :show="!!selectedNode" @close="closeNodeDetail" />
        <NodeEditModal :node="editingNode" :show="!!editingNode" @close="closeNodeEdit" @save="handleSaveNode" />
        <ApiKeyCreateModal :show="showApiKeyCreateModal" @close="showApiKeyCreateModal = false" @save="handleCreateApiKey" />

        <div v-show="activeTab === 'apiKeys'" class="h-full flex flex-col">
          <div class="card bg-base-100 shadow flex-1 flex flex-col">
            <div class="card-body p-4 flex-1 flex flex-col overflow-hidden">
              <div class="flex justify-between items-center mb-3 shrink-0">
                <h2 class="card-title text-base">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  API Key 列表
                </h2>
                <button class="btn btn-primary btn-sm gap-2" @click="showApiKeyCreateModal = true">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  创建 API Key
                </button>
              </div>

              <div class="flex-1 overflow-auto">
                <table class="table table-xs table-pin-rows">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>API Key</th>
                      <th>描述</th>
                      <th>User-Agent</th>
                      <th>状态</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="loadingApiKeys">
                      <td colspan="6" class="text-center">
                        <span class="loading loading-spinner loading-sm"></span>
                      </td>
                    </tr>
                    <tr v-else-if="apiKeys.length === 0">
                      <td colspan="6" class="text-center text-base-content/60 py-4">
                        <div class="flex flex-col items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                          </svg>
                          <span class="text-sm">暂无 API Key</span>
                        </div>
                      </td>
                    </tr>
                    <tr v-else v-for="key in apiKeys" :key="key.id">
                      <td class="font-mono text-xs">{{ key.id }}</td>
                      <td>
                        <div class="flex items-center gap-1">
                          <code class="bg-base-200 px-1.5 py-0.5 rounded text-[10px] font-mono">{{ key.key }}</code>
                          <button class="btn btn-ghost btn-[10px] btn-circle" @click="copyToClipboard(key.key)">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                      <td class="text-sm">{{ key.description }}</td>
                      <td>
                        <code class="bg-base-200 px-1.5 py-0.5 rounded text-[10px] font-mono">{{ key.ua || '-' }}</code>
                      </td>
                      <td>
                        <div class="badge badge-xs" :class="key.status === 'active' ? 'badge-success' : 'badge-ghost'">
                          {{ key.status === 'active' ? '启用' : '禁用' }}
                        </div>
                      </td>
                      <td>
                        <div class="flex gap-1">
                          <button class="btn btn-ghost btn-xs" @click="handleToggleApiKeyStatus(key)">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            切换
                          </button>
                          <button class="btn btn-ghost btn-xs text-error" @click="handleDeleteApiKey(key.id)">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div v-if="isAdmin" v-show="activeTab === 'users'" class="h-full flex flex-col">
          <div class="card bg-base-100 shadow flex-1 flex flex-col">
            <div class="card-body p-4 flex-1 flex flex-col overflow-hidden">
              <h2 class="card-title text-base mb-3 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                管理员列表
              </h2>
              
              <div class="flex-1 overflow-auto">
                <table class="table table-xs table-pin-rows">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>用户信息</th>
                      <th>Email</th>
                      <th>创建时间</th>
                      <th>更新时间</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="loadingAdmins">
                      <td colspan="6" class="text-center">
                        <span class="loading loading-spinner loading-sm"></span>
                      </td>
                    </tr>
                    <tr v-else-if="userList.length === 0">
                      <td colspan="6" class="text-center text-base-content/60 py-4">
                        <div class="flex flex-col items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span class="text-sm">暂无管理员</span>
                        </div>
                      </td>
                    </tr>
                    <tr v-else v-for="user in userList" :key="user.id">
                      <td class="font-mono text-xs">{{ user.id }}</td>
                      <td>
                        <div class="flex items-center gap-2">
                          <div class="avatar placeholder">
                            <div class="bg-neutral text-neutral-content rounded-full w-8">
                              <span class="text-xs">{{ user.username?.charAt(0).toUpperCase() }}</span>
                            </div>
                          </div>
                          <div class="font-semibold text-sm">{{ user.username }}</div>
                        </div>
                      </td>
                      <td>
                        <div class="flex items-center gap-0.5 text-xs">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {{ user.email }}
                        </div>
                      </td>
                      <td>
                        <div class="flex items-center gap-0.5 text-xs">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {{ new Date(user.created_at).toLocaleDateString() }}
                        </div>
                      </td>
                      <td>
                        <div class="flex items-center gap-0.5 text-xs">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          {{ new Date(user.updated_at).toLocaleDateString() }}
                        </div>
                      </td>
                      <td>
                        <button v-if="user.id !== currentUser?.id" class="btn btn-ghost btn-xs text-error" @click="handleDeleteAdmin(user.id)">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          删除
                        </button>
                        <span v-else class="badge badge-ghost badge-xs">当前用户</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
