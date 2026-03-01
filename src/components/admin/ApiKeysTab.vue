<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { listAdminApiKeys, deleteAdminApiKey, updateApiKeyType, type ApiKeyData } from '@/utils/request/api'
import { formatDate, useConfirm } from '@/composables'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import Pagination from '@/components/common/Pagination.vue'

const { confirmAction } = useConfirm()

const loading = ref(false)
const apiKeys = ref<ApiKeyData[]>([])
const total = ref(0)
const page = ref(0)
const pageSize = ref(20)
const typeFilter = ref<'active' | 'pending' | undefined>(undefined)

const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

async function fetchApiKeys() {
  loading.value = true
  try {
    const data = await listAdminApiKeys(pageSize.value, page.value * pageSize.value, typeFilter.value)
    apiKeys.value = data.items || []
    total.value = data.total || 0
  } finally {
    loading.value = false
  }
}

async function handleDelete(id: number) {
  if (!confirmAction('确定删除此 API Key？')) return
  await deleteAdminApiKey(id)
  fetchApiKeys()
}

async function handleUpdateType(id: number, type: 'active' | 'pending') {
  await updateApiKeyType(id, type)
  fetchApiKeys()
}

watch([page, typeFilter], fetchApiKeys)
onMounted(fetchApiKeys)
</script>

<template>
  <div class="card bg-base-100 shadow flex-1 flex flex-col">
    <div class="card-body p-4 flex-1 flex flex-col overflow-hidden">
      <div class="flex justify-between items-center mb-3 shrink-0">
        <h2 class="card-title text-base">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          API Key 列表
        </h2>
        <select v-model="typeFilter" class="select select-sm select-bordered w-32">
          <option :value="undefined">全部状态</option>
          <option value="active">已激活</option>
          <option value="pending">待审核</option>
        </select>
      </div>

      <div class="flex-1 overflow-auto">
        <table class="table table-sm table-pin-rows">
          <thead>
            <tr>
              <th>ID</th>
              <th>名称</th>
              <th>描述</th>
              <th>User-Agent</th>
              <th>提供者</th>
              <th>状态</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="8" class="text-center py-8"><LoadingSpinner /></td>
            </tr>
            <EmptyState v-else-if="apiKeys.length === 0" :colspan="8" message="暂无 API Key" />
            <tr v-else v-for="key in apiKeys" :key="key.id">
              <td class="font-mono text-xs">{{ key.id }}</td>
              <td class="font-medium">{{ key.name }}</td>
              <td class="text-sm max-w-32 truncate">{{ key.description || '-' }}</td>
              <td>
                <code class="bg-base-200 px-1.5 py-0.5 rounded text-xs">{{ key.userAgent || '-' }}</code>
              </td>
              <td>
                <div v-if="key.provider" class="flex items-center gap-1">
                  <div class="avatar">
                    <div class="w-6 h-6 rounded-full">
                      <img :src="`https://avatars.githubusercontent.com/u/${key.provider.githubId}`" />
                    </div>
                  </div>
                  <span class="text-sm">{{ key.provider.username }}</span>
                </div>
                <span v-else class="text-base-content/50">-</span>
              </td>
              <td>
                <div class="badge" :class="key.type === 'active' ? 'badge-success' : 'badge-warning'">
                  {{ key.type === 'active' ? '已激活' : '待审核' }}
                </div>
              </td>
              <td class="text-sm">{{ formatDate(key.createdAt) }}</td>
              <td>
                <div class="flex gap-1">
                  <button
                    v-if="key.type === 'pending'"
                    class="btn btn-xs btn-ghost text-success"
                    @click="handleUpdateType(key.id, 'active')"
                  >激活</button>
                  <button
                    v-else
                    class="btn btn-xs btn-ghost text-warning"
                    @click="handleUpdateType(key.id, 'pending')"
                  >禁用</button>
                  <button class="btn btn-xs btn-ghost text-error" @click="handleDelete(key.id)">删除</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Pagination :current-page="page" :total-pages="totalPages" @update:current-page="page = $event" />
    </div>
  </div>
</template>
