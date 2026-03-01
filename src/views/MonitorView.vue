<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { listNodes } from '@/utils/request/api'
import { calculateLoadScore } from '@/composables'
import type { NodeView } from '@/utils/request/types'
import MonitorFilters from '@/components/monitor/MonitorFilters.vue'
import MonitorNodeRow from '@/components/monitor/MonitorNodeRow.vue'
import MonitorPagination from '@/components/monitor/MonitorPagination.vue'

const nodes = ref<NodeView[]>([])
const searchQuery = ref('')
const statusFilter = ref('all')
const selectedTags = ref<string[]>([])
const sortBy = ref('id')
const sortOrder = ref<'asc' | 'desc'>('asc')
const currentPage = ref(1)
const pageSize = ref(30)
const pageSizeOptions = [10, 30, 50, 100, 200]

const availableTags = computed(() => [...new Set(nodes.value.flatMap(n => n.tags))].sort())

const filteredAndSortedNodes = computed(() => {
  const sortMethods: Record<string, (a: NodeView, b: NodeView) => number> = {
    name: (a, b) => a.name.localeCompare(b.name, 'zh-CN'),
    id: (a, b) => a.id - b.id,
    load: (a, b) => a.loadScore - b.loadScore,
    connections: (a, b) => a.currentConnections - b.currentConnections
  }
  const sortFn = sortMethods[sortBy.value]
  return nodes.value
    .filter(n =>
      n.name.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
      (statusFilter.value === 'all' ||
        (statusFilter.value === 'online' && n.isOnline) ||
        (statusFilter.value === 'offline' && !n.isOnline)) &&
      (selectedTags.value.length === 0 || selectedTags.value.some(t => n.tags.includes(t)))
    )
    .sort((a, b) => {
      const cmp = sortFn ? sortFn(a, b) : 0
      return sortOrder.value === 'asc' ? cmp : -cmp
    })
})

const totalNodes = computed(() => filteredAndSortedNodes.value.length)
const totalPages = computed(() => Math.ceil(totalNodes.value / pageSize.value))
const paginatedNodes = computed(() => filteredAndSortedNodes.value.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value))

onMounted(async () => {
  const data = await listNodes()
  nodes.value = data.map((n: any) => {
    const latest = n.nodeStatuses?.[0]
    return {
      ...n,
      maxConnections: latest?.maxConnections ?? 100,
      currentConnections: latest?.connections ?? 0,
      isOnline: latest?.status === 'online',
      loadScore: calculateLoadScore(latest?.maxConnections ?? 100, latest?.connections ?? 0),
      createdAt: n.createdAt instanceof Date ? n.createdAt : new Date(n.createdAt)
    }
  })
})
</script>

<template>
  <div class="p-6 min-h-screen bg-base-200 rounded-xl">
    <div class="w-full">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-base-content">节点监控</h1>
        <p class="text-base-content/70 mt-2">实时监控节点状态和负载情况</p>
      </div>

      <MonitorFilters
        v-model:search-query="searchQuery"
        v-model:status-filter="statusFilter"
        v-model:selected-tags="selectedTags"
        v-model:sort-by="sortBy"
        v-model:sort-order="sortOrder"
        :available-tags="availableTags"
      />

      <div class="bg-base-100 rounded-lg px-4 py-3 mb-3 mx-4 border border-base-300">
        <div class="flex items-center gap-6 h-full">
          <div class="flex items-center gap-3 min-w-[200px] shrink-0">
            <div class="w-2 h-2 rounded-full bg-base-300"></div>
            <span class="text-sm font-medium text-base-content/70">节点ID</span>
            <span class="text-sm font-medium text-base-content/70">节点名称</span>
          </div>
          <div class="min-w-[200px] shrink-0">
            <span class="text-sm font-medium text-base-content/70">负载分数</span>
          </div>
          <div class="min-w-[140px] shrink-0">
            <span class="text-sm font-medium text-base-content/70">连接数</span>
          </div>
          <div class="flex items-center gap-2 flex-1 min-w-[280px]">
            <span class="text-sm font-medium text-base-content/70">标签 / 提供者</span>
          </div>
          <div class="min-w-[280px] shrink-0 text-right">
            <span class="text-sm font-medium text-base-content/70">描述 / 创建时间</span>
          </div>
        </div>
      </div>

      <div class="space-y-3 px-4">
        <MonitorNodeRow v-for="node in paginatedNodes" :key="node.id" :node="node" />
      </div>

      <MonitorPagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total-pages="totalPages"
        :total-nodes="totalNodes"
        :page-size-options="pageSizeOptions"
      />
    </div>
  </div>
</template>
