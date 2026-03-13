<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getProfile, logout, listMyNodes, deleteNode, updateNode, listMyApiKeys, createApiKey, updateApiKey, deleteApiKey } from '@/utils/request/api'
import { useAsync, useConfirm, copyToClipboard } from '@/composables'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorDisplay from '@/components/common/ErrorDisplay.vue'
import NodeCard from '@/components/dashboard/NodeCard.vue'
import NodeDetailModal from '@/components/dashboard/NodeDetailModal.vue'
import NodeEditModal from '@/components/dashboard/NodeEditModal.vue'
import ApiKeyCreateModal from '@/components/dashboard/ApiKeyCreateModal.vue'
import ApiKeyDetailModal from '@/components/dashboard/ApiKeyDetailModal.vue'
import ApiKeyEditModal from '@/components/dashboard/ApiKeyEditModal.vue'

const router = useRouter()
const { confirmAction } = useConfirm()
const { loading: nodesLoading, execute: execNodes } = useAsync<any>()
const { loading: apiKeysLoading, execute: execApiKeys } = useAsync<any>()

const currentUser = ref<any>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const activeTab = ref<'nodes' | 'apiKeys'>('nodes')

const nodeList = ref<any[]>([])
const selectedNode = ref<any>(null)
const editingNode = ref<any>(null)

const apiKeys = ref<any[]>([])
const showApiKeyCreateModal = ref(false)
const selectedApiKey = ref<any>(null)
const editingApiKey = ref<any>(null)

async function fetchUserInfo() {
  try {
    currentUser.value = await getProfile()
  } catch (e: any) {
    error.value = '未授权，请先登录'
    logout()
    setTimeout(() => router.push('/login'), 1500)
  } finally {
    loading.value = false
  }
}

async function fetchNodes() {
  const data = await execNodes(() => listMyNodes())
  if (data) nodeList.value = data
}

async function handleDeleteNode(id: string | number) {
  if (!confirmAction('确定删除此节点？')) return
  await execNodes(() => deleteNode(id))
  fetchNodes()
}

async function handleSaveNode(data: any) {
  if (!editingNode.value) return
  await execNodes(() => updateNode(String(editingNode.value.id), data))
  fetchNodes()
  editingNode.value = null
}

async function fetchApiKeys() {
  const data = await execApiKeys(() => listMyApiKeys())
  if (data) apiKeys.value = data
}

async function handleCreateApiKey(data: any) {
  await execApiKeys(() => createApiKey(data))
  showApiKeyCreateModal.value = false
  fetchApiKeys()
}

async function handleDeleteApiKey(id: number) {
  if (!confirmAction('确定删除此 API Key')) return
  await execApiKeys(() => deleteApiKey(id))
  fetchApiKeys()
}

async function handleUpdateApiKey(data: any) {
  if (!editingApiKey.value) return
  await execApiKeys(() => updateApiKey(editingApiKey.value.id, data))
  editingApiKey.value = null
  fetchApiKeys()
}

function switchTab(tab: 'nodes' | 'apiKeys') {
  activeTab.value = tab
  if (tab === 'nodes' && nodeList.value.length === 0) fetchNodes()
  if (tab === 'apiKeys' && apiKeys.value.length === 0) fetchApiKeys()
}

onMounted(async () => {
  await fetchUserInfo()
  if (!error.value) fetchNodes()
})
</script>

<template>
  <div class="h-[calc(100vh-2rem)] w-full bg-base-200 overflow-hidden flex flex-col rounded-xl" style="min-width: 320px;">
    <div v-if="loading" class="flex items-center justify-center h-full">
      <LoadingSpinner size="lg" />
    </div>
    <ErrorDisplay v-else-if="error" :error="error" />
    <div v-else class="flex-1 flex flex-col overflow-hidden">
      <div class="bg-base-100 px-4 py-2 shrink-0">
        <div role="tablist" class="tabs tabs-lifted">
          <a role="tab" class="tab gap-2 text-sm" :class="{ 'tab-active': activeTab === 'nodes' }" @click="switchTab('nodes')">节点管理</a>
          <a role="tab" class="tab gap-2 text-sm" :class="{ 'tab-active': activeTab === 'apiKeys' }" @click="switchTab('apiKeys')">API Keys</a>
        </div>
      </div>

      <div class="flex-1 overflow-hidden p-4">
        <div v-show="activeTab === 'nodes'" class="h-full flex flex-col">
          <div class="card bg-base-100 shadow flex-1 flex flex-col">
            <div class="card-body p-4 flex-1 flex flex-col overflow-hidden">
              <h2 class="card-title text-base mb-3 shrink-0">节点列表</h2>
              <div class="flex-1 overflow-auto">
                <div v-if="nodesLoading" class="flex items-center justify-center h-40"><LoadingSpinner /></div>
                <div v-else-if="nodeList.length === 0" class="flex flex-col items-center justify-center h-40 text-base-content/60">
                  <span class="text-sm">暂无节点</span>
                </div>
                <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3" style="min-width: 280px;">
                  <NodeCard v-for="node in nodeList" :key="node.id" :node="node" @detail="selectedNode = $event" @edit="editingNode = $event" @delete="handleDeleteNode" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-show="activeTab === 'apiKeys'" class="h-full flex flex-col">
          <div class="card bg-base-100 shadow flex-1 flex flex-col">
            <div class="card-body p-4 flex-1 flex flex-col overflow-hidden">
              <div class="flex justify-between items-center mb-3 shrink-0">
                <h2 class="card-title text-base">API Key 列表</h2>
                <button class="btn btn-primary btn-sm gap-2" @click="showApiKeyCreateModal = true">创建 API Key</button>
              </div>
              <div class="flex-1 overflow-auto">
                <table class="table table-xs table-pin-rows">
                  <thead>
                    <tr>
                      <th class="w-12">ID</th>
                      <th class="w-36">API Key</th>
                      <th class="w-24">名称</th>
                      <th class="w-32">描述</th>
                      <th class="w-28">User-Agent</th>
                      <th class="w-16">状态</th>
                      <th class="w-28">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="apiKeysLoading">
                      <td colspan="7" class="text-center"><LoadingSpinner /></td>
                    </tr>
                    <tr v-else-if="apiKeys.length === 0">
                      <td colspan="7" class="text-center text-base-content/60 py-4">暂无 API Key</td>
                    </tr>
                    <tr v-else v-for="key in apiKeys" :key="key.id">
                      <td class="font-mono text-xs">{{ key.id }}</td>
                      <td>
                        <template v-if="key.key">
                          <code class="bg-base-200 px-1.5 py-0.5 rounded text-xs font-mono">{{ key.key }}</code>
                        </template>
                        <span v-else class="text-xs text-base-content/50">创建后仅显示一次</span>
                      </td>
                      <td class="text-sm truncate max-w-24">{{ key.name }}</td>
                      <td class="text-sm truncate max-w-32">{{ key.description || '-' }}</td>
                      <td><code class="bg-base-200 px-1.5 py-0.5 rounded text-[10px] font-mono truncate max-w-24 block">{{ key.userAgent || '-' }}</code></td>
                      <td>
                        <div class="badge badge-xs badge-success">启用</div>
                      </td>
                      <td>
                        <div class="flex gap-1">
                          <button class="btn btn-ghost btn-xs" @click="selectedApiKey = key">详情</button>
                          <button class="btn btn-ghost btn-xs" @click="editingApiKey = key">编辑</button>
                          <button class="btn btn-ghost btn-xs text-error" @click="handleDeleteApiKey(key.id)">删除</button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <NodeDetailModal :node="selectedNode" :show="!!selectedNode" @close="selectedNode = null" />
      <NodeEditModal :node="editingNode" :show="!!editingNode" @close="editingNode = null" @save="handleSaveNode" />
      <ApiKeyCreateModal :show="showApiKeyCreateModal" @close="showApiKeyCreateModal = false" @save="handleCreateApiKey" />
      <ApiKeyDetailModal :api-key="selectedApiKey" :show="!!selectedApiKey" @close="selectedApiKey = null" />
      <ApiKeyEditModal :api-key="editingApiKey" :show="!!editingApiKey" @close="editingApiKey = null" @save="handleUpdateApiKey" />
    </div>
  </div>
</template>
