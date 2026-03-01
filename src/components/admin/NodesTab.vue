<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { listAdminNodes, updateNodeReviewStatus, updateNodePublicStatus, deleteAdminNode, type AdminNodeData } from '@/utils/request/api'
import { formatDate, useConfirm } from '@/composables'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import Pagination from '@/components/common/Pagination.vue'

const { confirmAction } = useConfirm()

const loading = ref(false)
const nodes = ref<AdminNodeData[]>([])
const total = ref(0)
const page = ref(0)
const pageSize = ref(20)
const reviewedFilter = ref<boolean | undefined>(undefined)
const publicFilter = ref<boolean | undefined>(undefined)

const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

async function fetchNodes() {
  loading.value = true
  try {
    const data = await listAdminNodes(pageSize.value, page.value * pageSize.value, reviewedFilter.value, publicFilter.value)
    nodes.value = data.items || []
    total.value = data.total || 0
  } finally {
    loading.value = false
  }
}

async function handleUpdateReview(id: number, isReviewed: boolean) {
  await updateNodeReviewStatus(id, isReviewed)
  fetchNodes()
}

async function handleUpdatePublic(id: number, isPublic: boolean) {
  await updateNodePublicStatus(id, isPublic)
  fetchNodes()
}

async function handleDelete(id: number) {
  if (!confirmAction('确定删除此节点？')) return
  await deleteAdminNode(id)
  fetchNodes()
}

watch([page, reviewedFilter, publicFilter], fetchNodes)
onMounted(fetchNodes)
</script>

<template>
  <div class="card bg-base-100 shadow flex-1 flex flex-col">
    <div class="card-body p-4 flex-1 flex flex-col overflow-hidden">
      <div class="flex justify-between items-center mb-3 shrink-0">
        <h2 class="card-title text-base">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
          </svg>
          节点列表
        </h2>
        <div class="flex gap-2">
          <select v-model="reviewedFilter" class="select select-sm select-bordered w-28">
            <option :value="undefined">审核状态</option>
            <option :value="true">已审核</option>
            <option :value="false">未审核</option>
          </select>
          <select v-model="publicFilter" class="select select-sm select-bordered w-28">
            <option :value="undefined">公开状态</option>
            <option :value="true">公开</option>
            <option :value="false">私有</option>
          </select>
        </div>
      </div>

      <div class="flex-1 overflow-auto">
        <table class="table table-sm table-pin-rows">
          <thead>
            <tr>
              <th>ID</th>
              <th>名称</th>
              <th>提供者</th>
              <th>状态</th>
              <th>连接数</th>
              <th>审核</th>
              <th>公开</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="9" class="text-center py-8"><LoadingSpinner /></td>
            </tr>
            <EmptyState v-else-if="nodes.length === 0" :colspan="9" message="暂无节点" />
            <tr v-else v-for="node in nodes" :key="node.id">
              <td class="font-mono text-xs">{{ node.id }}</td>
              <td>
                <div>
                  <div class="font-medium">{{ node.name }}</div>
                  <div v-if="node.description" class="text-xs text-base-content/50 max-w-32 truncate">{{ node.description }}</div>
                </div>
              </td>
              <td>
                <div class="flex items-center gap-1">
                  <div class="avatar">
                    <div class="w-6 h-6 rounded-full">
                      <img :src="`https://avatars.githubusercontent.com/u/${node.providerUuid}`" />
                    </div>
                  </div>
                  <span class="text-sm">{{ node.providerName }}</span>
                </div>
              </td>
              <td>
                <div class="badge badge-sm" :class="node.status === 'online' ? 'badge-success' : 'badge-error'">
                  {{ node.status === 'online' ? '在线' : '离线' }}
                </div>
              </td>
              <td class="text-sm">{{ node.connections }} / {{ node.maxConnections }}</td>
              <td>
                <div class="badge badge-sm" :class="node.isReviewed ? 'badge-success' : 'badge-warning'">
                  {{ node.isReviewed ? '已审核' : '未审核' }}
                </div>
              </td>
              <td>
                <div class="badge badge-sm" :class="node.isPublic ? 'badge-info' : 'badge-ghost'">
                  {{ node.isPublic ? '公开' : '私有' }}
                </div>
              </td>
              <td class="text-sm">{{ formatDate(node.createdAt) }}</td>
              <td>
                <div class="flex gap-1">
                  <button
                    v-if="!node.isReviewed"
                    class="btn btn-xs btn-ghost text-success"
                    @click="handleUpdateReview(node.id, true)"
                  >审核通过</button>
                  <button
                    v-else
                    class="btn btn-xs btn-ghost text-warning"
                    @click="handleUpdateReview(node.id, false)"
                  >取消审核</button>
                  <button
                    v-if="!node.isPublic"
                    class="btn btn-xs btn-ghost text-info"
                    @click="handleUpdatePublic(node.id, true)"
                  >设为公开</button>
                  <button
                    v-else
                    class="btn btn-xs btn-ghost"
                    @click="handleUpdatePublic(node.id, false)"
                  >设为私有</button>
                  <button class="btn btn-xs btn-ghost text-error" @click="handleDelete(node.id)">删除</button>
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
