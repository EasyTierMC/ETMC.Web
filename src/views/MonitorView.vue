<template>
  <div class="p-6 min-h-screen bg-base-200">
    <div class="w-full">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-base-content">节点监控</h1>
        <p class="text-base-content/70 mt-2">实时监控节点状态和负载情况</p>
      </div>

      <!-- 搜索和筛选栏 -->
      <div class="bg-base-100 rounded-lg p-4 mb-6 mx-4 border border-base-300">
        <div class="flex flex-col lg:flex-row gap-4">
          <!-- 搜索框 -->
          <div class="flex-1">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="搜索节点名称..." 
              class="input input-bordered w-full text-sm"
            />
          </div>

          <!-- 状态筛选 -->
          <div class="flex gap-2">
            <select 
              v-model="statusFilter"
              class="select select-bordered text-sm"
            >
              <option value="all">全部状态</option>
              <option value="online">在线</option>
              <option value="offline">离线</option>
            </select>
          </div>

          <!-- 标签筛选 -->
          <div class="flex gap-2">
            <select 
              v-model="tagFilter"
              class="select select-bordered text-sm min-w-[120px]"
            >
              <option value="">全部标签</option>
              <option 
                v-for="tag in availableTags" 
                :key="tag" 
                :value="tag"
              >
                {{ tag }}
              </option>
            </select>
          </div>

          <!-- 排序选择 -->
          <div class="flex gap-2">
            <select 
              v-model="sortBy"
              class="select select-bordered text-sm"
            >
              <option value="name">按名称排序</option>
              <option value="id">按ID排序</option>
              <option value="load">按负载排序</option>
              <option value="connections">按连接数排序</option>
            </select>
            <button 
              @click="toggleSortOrder"
              class="btn btn-outline btn-sm"
            >
              {{ sortOrder === 'asc' ? '↑' : '↓' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 表头标题卡片 -->
      <div class="bg-base-100 rounded-lg px-4 py-3 mb-3 mx-4 border border-base-300">
        <div class="flex items-center gap-6 h-full">
          <!-- 左侧：基本信息标题 -->
          <div class="flex items-center gap-3 min-w-[200px] shrink-0">
            <div class="w-2 h-2 rounded-full bg-base-300"></div>
            <span class="text-sm font-medium text-base-content/70">节点ID</span>
            <span class="text-sm font-medium text-base-content/70">节点名称</span>
          </div>

          <!-- 负载分数标题 -->
          <div class="min-w-[200px] shrink-0">
            <div class="flex items-center gap-3">
              <span class="text-sm font-medium text-base-content/70">负载分数</span>
            </div>
          </div>

          <!-- 连接数标题 -->
          <div class="min-w-[140px] shrink-0">
            <span class="text-sm font-medium text-base-content/70">当前/最大连接</span>
          </div>

          <!-- 标签标题 -->
          <div class="flex items-center gap-2 flex-1 min-w-[200px]">
            <span class="text-sm font-medium text-base-content/70">标签</span>
          </div>

          <!-- 右侧：描述和时间标题 -->
          <div class="min-w-[280px] shrink-0 text-right">
            <span class="text-sm font-medium text-base-content/70">描述 / 创建时间</span>
          </div>
        </div>
      </div>

      <div class="space-y-3 px-4">
        <div 
          v-for="node in filteredAndSortedNodes" 
          :key="node.id"
          class="w-full border border-base-300 bg-base-100 rounded-lg px-4 py-3 hover:shadow-lg transition-all duration-300"
        >
          <div class="flex items-center gap-6 h-full">
            <!-- 左侧：基本信息 -->
            <div class="flex items-center gap-3 min-w-[200px] shrink-0">
              <div 
                class="w-2 h-2 rounded-full"
                :class="node.isOnline ? 'bg-success' : 'bg-error'"
              ></div>
              <span class="text-sm text-base-content/60 font-mono">{{ node.id }}</span>
              <h2 class="text-base font-semibold">{{ node.name }}</h2>
            </div>

            <!-- 负载分数 -->
            <div class="min-w-[200px] shrink-0">
              <div class="flex items-center gap-3">
                <div class="flex-1 bg-base-300 rounded-full h-2.5 min-w-[100px]">
                  <div 
                    class="h-2.5 rounded-full transition-all duration-300"
                    :class="getLoadScoreBarColor(node.loadScore)"
                    :style="{ width: `${node.loadScore}%` }"
                  ></div>
                </div>
                <span 
                  class="text-sm font-bold min-w-[45px] text-right"
                  :class="getLoadScoreColor(node.loadScore)"
                >
                  {{ node.loadScore.toFixed(1) }}%
                </span>
              </div>
            </div>

            <!-- 连接数 -->
            <div class="min-w-[140px] shrink-0">
              <div class="flex items-center gap-2 text-xs">
                <span class="font-bold">{{ node.currentConnections }}</span>
                <span class="text-base-content/60">/</span>
                <span class="font-bold">{{ node.maxConnections }}</span>
                <span class="text-base-content/60">连接</span>
              </div>
            </div>

            <!-- 标签 -->
            <div class="flex items-center gap-2 flex-1 min-w-[200px]">
              <span 
                v-for="tag in node.tags" 
                :key="tag"
                class="badge badge-secondary"
              >
                {{ tag }}
              </span>
            </div>

            <!-- 右侧：描述和时间 -->
            <div class="min-w-[280px] shrink-0 text-right">
              <p class="text-sm text-base-content/70 mb-1">{{ node.description }}</p>
              <div class="text-xs text-base-content/50">
                创建于 {{ formatDate(node.createdAt) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 节点接口定义
interface Node {
  id: string
  name: string
  isOnline: boolean
  maxConnections: number
  currentConnections: number
  loadScore: number
  createdAt: Date
  description: string
  tags: string[]
}

// 搜索和筛选状态
const searchQuery = ref('')
const statusFilter = ref('all')
const tagFilter = ref('')
const sortBy = ref('name')
const sortOrder = ref<'asc' | 'desc'>('asc')

// 示例节点数据
const nodes = ref<Node[]>([
  {
    id: 'NODE-001',
    name: '主控节点',
    isOnline: true,
    maxConnections: 100,
    currentConnections: 25,
    loadScore: 0,
    createdAt: new Date('2024-01-15T10:30:00'),
    description: '负责整体协调和管控的核心节点，具备高可用性和故障恢复能力。',
    tags: ['核心', '主控', '高可用']
  },
  {
    id: 'NODE-002',
    name: '数据处理节点',
    isOnline: true,
    maxConnections: 80,
    currentConnections: 65,
    loadScore: 0,
    createdAt: new Date('2024-02-20T14:15:00'),
    description: '专门处理大规模数据分析和计算任务，配备高性能计算资源。',
    tags: ['计算', '数据分析', '高性能']
  },
  {
    id: 'NODE-003',
    name: '边缘服务节点',
    isOnline: false,
    maxConnections: 50,
    currentConnections: 0,
    loadScore: 0,
    createdAt: new Date('2024-03-10T09:45:00'),
    description: '部署在网络边缘的服务节点，提供低延迟的本地化服务。',
    tags: ['边缘', '低延迟', '本地服务']
  }
])

// 获取所有可用标签
const availableTags = computed(() => {
  const tags = new Set<string>()
  nodes.value.forEach(node => {
    node.tags.forEach(tag => tags.add(tag))
  })
  return Array.from(tags).sort()
})

// 过滤和排序后的节点
const filteredAndSortedNodes = computed(() => {
  let filtered = nodes.value.filter(node => {
    // 搜索过滤
    const matchesSearch = node.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    // 状态过滤
    const matchesStatus = statusFilter.value === 'all' || 
      (statusFilter.value === 'online' && node.isOnline) ||
      (statusFilter.value === 'offline' && !node.isOnline)
    
    // 标签过滤
    const matchesTag = !tagFilter.value || node.tags.includes(tagFilter.value)
    
    return matchesSearch && matchesStatus && matchesTag
  })

  // 排序
  filtered.sort((a, b) => {
    let comparison = 0
    
    switch (sortBy.value) {
      case 'name':
        comparison = a.name.localeCompare(b.name, 'zh-CN')
        break
      case 'id':
        comparison = a.id.localeCompare(b.id)
        break
      case 'load':
        comparison = a.loadScore - b.loadScore
        break
      case 'connections':
        comparison = a.currentConnections - b.currentConnections
        break
    }
    
    return sortOrder.value === 'asc' ? comparison : -comparison
  })

  return filtered
})

// 切换排序顺序
const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
}

// 计算负载分数
const calculateLoadScore = (maxConnections: number, currentConnections: number): number => {
  if (maxConnections === 0) return 0
  return Math.min((currentConnections / maxConnections) * 100, 100)
}

// 更新所有节点的负载分数
const updateLoadScores = () => {
  nodes.value.forEach(node => {
    node.loadScore = calculateLoadScore(node.maxConnections, node.currentConnections)
  })
}

// 获取负载分数颜色
const getLoadScoreColor = (score: number): string => {
  if (score < 30) return 'text-success'
  if (score < 70) return 'text-warning'
  return 'text-error'
}

// 获取负载分数条颜色
const getLoadScoreBarColor = (score: number): string => {
  if (score < 30) return 'bg-success'
  if (score < 70) return 'bg-warning'
  return 'bg-error'
}

// 格式化日期
const formatDate = (date: Date): string => {
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 初始化负载分数
updateLoadScores()
</script>
