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
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="搜索节点名称..." 
            class="input input-bordered w-full text-sm"
          />

          <select v-model="statusFilter" class="select select-bordered text-sm">
            <option value="all">全部状态</option>
            <option value="online">在线</option>
            <option value="offline">离线</option>
          </select>

          <div class="dropdown dropdown-bottom">
            <div tabindex="0" role="button" class="select select-bordered text-sm min-w-[120px] justify-between">
              <span>{{ selectedTags.length > 0 ? `已选${selectedTags.length}个` : '全部标签' }}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
            <div tabindex="0" class="dropdown-content bg-base-100 rounded-box shadow-lg border border-base-300 w-48 p-2 z-[1]">
              <div class="max-h-48 overflow-y-auto">
                <label class="flex items-center gap-2 p-2 hover:bg-base-200 rounded cursor-pointer">
                  <input 
                    type="checkbox" 
                    class="checkbox checkbox-sm" 
                    @change="toggleAllTags"
                    :checked="selectedTags.length === availableTags.length && availableTags.length > 0"
                    :indeterminate="selectedTags.length > 0 && selectedTags.length < availableTags.length"
                  />
                  <span class="text-sm">全选</span>
                </label>
                <div class="divider my-1"></div>
                <label 
                  v-for="tag in availableTags" 
                  :key="tag"
                  class="flex items-center gap-2 p-2 hover:bg-base-200 rounded cursor-pointer"
                >
                  <input 
                    type="checkbox" 
                    class="checkbox checkbox-sm" 
                    :value="tag"
                    v-model="selectedTags"
                  />
                  <span class="text-sm">{{ tag }}</span>
                </label>
              </div>
              <div class="divider my-1"></div>
              <div class="flex items-center justify-between p-2">
                <span class="text-xs text-base-content/60">{{ selectedTags.length }}/{{ availableTags.length }}</span>
                <button 
                  v-if="selectedTags.length > 0"
                  @click="clearTagSelection"
                  class="btn btn-ghost btn-xs"
                >
                  清除
                </button>
              </div>
            </div>
          </div>

          <div class="flex gap-2">
            <select v-model="sortBy" class="select select-bordered text-sm min-w-[120px]">
              <option value="name">按名称排序</option>
              <option value="id">按ID排序</option>
              <option value="load">按负载排序</option>
              <option value="connections">按连接数排序</option>
            </select>
            <button @click="toggleSortOrder" class="btn btn-outline btn-sm">
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
            <span class="text-sm font-medium text-base-content/70">当前连接数</span>
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
          v-for="node in paginatedNodes" 
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

      <!-- 分页控件 -->
      <div class="bg-base-100 rounded-lg px-4 py-4 mx-4 mt-6 border border-base-300">
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
          <!-- 分页信息 -->
          <div class="text-sm text-base-content/70">
            显示 {{ ((currentPage - 1) * pageSize) + 1 }} - {{ Math.min(currentPage * pageSize, totalNodes) }} 
            共 {{ totalNodes }} 条记录
          </div>

          <!-- 每页显示数量选择 -->
          <div class="flex items-center gap-2 whitespace-nowrap">
            <span class="text-sm text-base-content/70">每页</span>
            <select v-model="pageSize" @change="changePageSize" class="select select-bordered select-sm">
              <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }}</option>
            </select>
            <span class="text-sm text-base-content/70">条</span>
          </div>

          <!-- 分页按钮 -->
          <div class="flex items-center gap-2">
            <!-- 首页 -->
            <button 
              @click="goToPage(1)"
              :disabled="currentPage === 1"
              class="btn btn-outline btn-sm"
              :class="{ 'btn-disabled': currentPage === 1 }"
            >
              首页
            </button>

            <!-- 上一页 -->
            <button 
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="btn btn-outline btn-sm"
              :class="{ 'btn-disabled': currentPage === 1 }"
            >
              上一页
            </button>

            <!-- 页码 -->
            <div class="flex items-center gap-1">
              <button 
                v-for="page in getPageNumbers()" 
                :key="page"
                @click="goToPage(page)"
                class="btn btn-sm"
                :class="page === currentPage ? 'btn-primary' : 'btn-outline'"
              >
                {{ page }}
              </button>
            </div>

            <!-- 下一页 -->
            <button 
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="btn btn-outline btn-sm"
              :class="{ 'btn-disabled': currentPage === totalPages }"
            >
              下一页
            </button>

            <!-- 末页 -->
            <button 
              @click="goToPage(totalPages)"
              :disabled="currentPage === totalPages"
              class="btn btn-outline btn-sm"
              :class="{ 'btn-disabled': currentPage === totalPages }"
            >
              末页
            </button>
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
  id: number
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
const selectedTags = ref<string[]>([])
const sortBy = ref('id')
const sortOrder = ref<'asc' | 'desc'>('asc')

// 分页状态
const currentPage = ref(1)
const pageSize = ref(30)
const pageSizeOptions = [10, 30, 50, 100, 200]

// 示例节点数据
const nodes = ref<Node[]>([
  {
    id: 1,
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
    id: 2,
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
    id: 3,
    name: '边缘服务节点',
    isOnline: false,
    maxConnections: 50,
    currentConnections: 0,
    loadScore: 0,
    createdAt: new Date('2024-03-10T09:45:00'),
    description: '部署在网络边缘的服务节点，提供低延迟的本地化服务。',
    tags: ['边缘', '低延迟', '本地服务']
  },
  {
    id: 4,
    name: '缓存服务节点',
    isOnline: true,
    maxConnections: 200,
    currentConnections: 120,
    loadScore: 0,
    createdAt: new Date('2024-01-20T08:00:00'),
    description: '提供高速缓存服务，支持分布式缓存和内存数据库功能。',
    tags: ['缓存', '高性能', '分布式']
  },
  {
    id: 5,
    name: 'API网关节点',
    isOnline: true,
    maxConnections: 150,
    currentConnections: 85,
    loadScore: 0,
    createdAt: new Date('2024-02-01T12:00:00'),
    description: '统一API入口，负责请求路由、负载均衡和安全认证。',
    tags: ['API', '网关', '安全']
  },
  {
    id: 6,
    name: '文件存储节点',
    isOnline: true,
    maxConnections: 75,
    currentConnections: 30,
    loadScore: 0,
    createdAt: new Date('2024-01-25T16:30:00'),
    description: '提供分布式文件存储服务，支持大文件上传和下载。',
    tags: ['存储', '文件', '分布式']
  },
  {
    id: 7,
    name: '消息队列节点',
    isOnline: false,
    maxConnections: 90,
    currentConnections: 0,
    loadScore: 0,
    createdAt: new Date('2024-03-05T11:20:00'),
    description: '处理异步消息传递，支持发布订阅模式和消息持久化。',
    tags: ['消息', '队列', '异步']
  },
  {
    id: 8,
    name: '监控收集节点',
    isOnline: true,
    maxConnections: 60,
    currentConnections: 45,
    loadScore: 0,
    createdAt: new Date('2024-02-10T09:15:00'),
    description: '收集和聚合系统监控数据，提供实时监控和告警功能。',
    tags: ['监控', '数据收集', '告警']
  },
  {
    id: 9,
    name: '日志处理节点',
    isOnline: true,
    maxConnections: 120,
    currentConnections: 95,
    loadScore: 0,
    createdAt: new Date('2024-01-18T14:45:00'),
    description: '处理和存储系统日志，支持日志搜索和分析功能。',
    tags: ['日志', '处理', '存储']
  },
  {
    id: 10,
    name: '认证服务节点',
    isOnline: true,
    maxConnections: 80,
    currentConnections: 35,
    loadScore: 0,
    createdAt: new Date('2024-02-15T10:00:00'),
    description: '提供用户认证和授权服务，支持多种认证方式。',
    tags: ['认证', '安全', '授权']
  },
  {
    id: 11,
    name: '配置管理节点',
    isOnline: true,
    maxConnections: 50,
    currentConnections: 20,
    loadScore: 0,
    createdAt: new Date('2024-01-22T13:30:00'),
    description: '集中管理应用配置，支持动态配置更新和版本控制。',
    tags: ['配置', '管理', '动态']
  },
  {
    id: 12,
    name: '任务调度节点',
    isOnline: false,
    maxConnections: 70,
    currentConnections: 0,
    loadScore: 0,
    createdAt: new Date('2024-03-08T15:00:00'),
    description: '负责任务调度和执行，支持定时任务和分布式任务处理。',
    tags: ['任务', '调度', '分布式']
  },
  {
    id: 13,
    name: '搜索服务节点',
    isOnline: true,
    maxConnections: 100,
    currentConnections: 78,
    loadScore: 0,
    createdAt: new Date('2024-02-05T08:45:00'),
    description: '提供全文搜索和索引服务，支持复杂查询和实时搜索。',
    tags: ['搜索', '索引', '查询']
  },
  {
    id: 14,
    name: '图像处理节点',
    isOnline: true,
    maxConnections: 60,
    currentConnections: 42,
    loadScore: 0,
    createdAt: new Date('2024-01-28T11:15:00'),
    description: '专门处理图像相关任务，包括压缩、裁剪和格式转换。',
    tags: ['图像', '处理', '媒体']
  },
  {
    id: 15,
    name: '机器学习节点',
    isOnline: true,
    maxConnections: 40,
    currentConnections: 28,
    loadScore: 0,
    createdAt: new Date('2024-02-18T16:00:00'),
    description: '提供机器学习模型训练和推理服务，支持多种算法框架。',
    tags: ['AI', '机器学习', '推理']
  }
])

// 获取所有可用标签
const availableTags = computed(() => 
  [...new Set(nodes.value.flatMap(node => node.tags))].sort()
)

// 过滤和排序后的节点
const filteredAndSortedNodes = computed(() => {
  const sortMethods = {
    name: (a: Node, b: Node) => a.name.localeCompare(b.name, 'zh-CN'),
    id: (a: Node, b: Node) => a.id - b.id,
    load: (a: Node, b: Node) => a.loadScore - b.loadScore,
    connections: (a: Node, b: Node) => a.currentConnections - b.currentConnections
  }

  return nodes.value
    .filter(node => 
      node.name.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
      (statusFilter.value === 'all' || 
        (statusFilter.value === 'online' && node.isOnline) ||
        (statusFilter.value === 'offline' && !node.isOnline)) &&
      (selectedTags.value.length === 0 || selectedTags.value.some(tag => node.tags.includes(tag)))
    )
    .sort((a, b) => {
      const comparison = sortMethods[sortBy.value as keyof typeof sortMethods](a, b)
      return sortOrder.value === 'asc' ? comparison : -comparison
    })
})

// 分页相关计算属性
const totalNodes = computed(() => filteredAndSortedNodes.value.length)
const totalPages = computed(() => Math.ceil(totalNodes.value / pageSize.value))
const paginatedNodes = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredAndSortedNodes.value.slice(start, end)
})

// 分页方法
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const changePageSize = () => {
  currentPage.value = 1 // 重置到第一页
}

// 获取要显示的页码数组
const getPageNumbers = () => {
  const current = currentPage.value
  const total = totalPages.value
  
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  
  if (current <= 4) return [...Array.from({ length: 5 }, (_, i) => i + 1), total]
  if (current >= total - 3) return [1, ...Array.from({ length: 5 }, (_, i) => total - 4 + i)]
  
  return [1, current - 1, current, current + 1, total]
}

// 切换排序顺序
const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
}

// 标签选择相关方法
const toggleAllTags = () => {
  if (selectedTags.value.length === availableTags.value.length) {
    selectedTags.value = []
  } else {
    selectedTags.value = [...availableTags.value]
  }
}

const clearTagSelection = () => {
  selectedTags.value = []
}

// 计算负载分数
const calculateLoadScore = (max: number, current: number) => 
  max === 0 ? 0 : Math.min((current / max) * 100, 100)

// 更新所有节点的负载分数
const updateLoadScores = () => 
  nodes.value.forEach(node => {
    node.loadScore = calculateLoadScore(node.maxConnections, node.currentConnections)
  })

// 获取负载分数颜色
const getLoadScoreColor = (score: number) => 
  score < 30 ? 'text-success' : score < 70 ? 'text-warning' : 'text-error'

// 获取负载分数条颜色
const getLoadScoreBarColor = (score: number) => 
  score < 30 ? 'bg-success' : score < 70 ? 'bg-warning' : 'bg-error'

// 格式化日期
const formatDate = (date: Date) => 
  date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })

// 初始化负载分数
updateLoadScores()
</script>
