<template>
  <div class="min-h-screen bg-linear-to-br from-base-200 via-base-100 to-base-200 rounded-xl">
    <!-- Hero Section with Stats Cards -->
    <section class="hero min-h-[25vh] lg:min-h-[30vh] bg-base-100/80 backdrop-blur-sm rounded-xl">
      <div class="hero-content text-center px-4">
        <div class="w-full max-w-7xl">
          <!-- Stats Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 auto-rows-fr gap-4 sm:gap-6 justify-items-center">
            <div 
              v-for="(stat, index) in nodeStats" 
              :key="index"
              class="stat-card group flex w-full"
            >
              <div class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-base-300 w-full">
                <div class="card-body p-4 sm:p-5 md:p-6 flex flex-col justify-between h-full min-h-[120px]">
                  <div class="flex items-center justify-between mb-2">
                    <h2 class="card-title text-sm sm:text-base md:text-lg font-semibold truncate">{{ stat.title }}</h2>
                    <div :class="`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full ${stat.bgColorClass} flex items-center justify-center group-hover:opacity-80 transition-colors shrink-0`">
                      <svg xmlns="http://www.w3.org/2000/svg" :class="`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 ${stat.colorClass}`" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="stat.iconPath" />
                      </svg>
                    </div>
                  </div>
                  <div class="grow flex items-center justify-center py-2">
                    <p :class="`text-xl sm:text-2xl md:text-3xl font-bold ${stat.colorClass}`">{{ stat.value }}</p>
                  </div>
                  <div class="text-xs sm:text-sm text-base-content/60 mt-1">{{ stat.subtitle }}</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Map Section -->
    <section class="w-full px-2 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
      <div class="w-full">
        <div class="card bg-base-100 shadow-lg md:shadow-xl lg:shadow-2xl border border-base-300">
          <div class="card-body p-4 sm:p-6">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
              <h2 class="card-title text-xl sm:text-2xl font-bold">节点分布</h2>
              <div class="badge badge-primary badge-sm sm:badge-md md:badge-lg">China</div>
            </div>
            <div class="w-full aspect-video sm:aspect-video lg:aspect-21/9 min-h-[400px] max-h-[800px] rounded-lg overflow-hidden bg-base-200">
              <Map class="w-full h-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Map from '@/components/dashboard/Map.vue';
import { getGlobalNodeStatus, type GlobalNodeStatus } from '@/utils/request/api';

interface NodeStat {
  title: string;
  value: string;
  subtitle: string;
  iconPath: string;
  colorClass: string;
  bgColorClass: string;
}

const globalStatus = ref<GlobalNodeStatus>({
  totalNodes: 0,
  onlineNodes: 0,
  deployedNodes: 0,
  connections: 0,
  maxConnections: 0
});

const fetchGlobalStatus = async () => {
  try {
    const response = await getGlobalNodeStatus();
    globalStatus.value = response;
  } catch (error) {
    console.error('Failed to fetch global node status:', error);
  }
};

onMounted(() => {
  fetchGlobalStatus();
});

const nodeStats = computed<NodeStat[]>(() => {
  const { totalNodes, onlineNodes, deployedNodes, connections, maxConnections } = globalStatus.value;
  const loadPercent = maxConnections > 0 ? Math.round((connections / maxConnections) * 100) : 0;
  
  let loadColorClass = 'text-success';
  let loadBgColorClass = 'bg-success/10';
  let loadIconPath = 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z';
  
  if (loadPercent > 100) {
    loadColorClass = 'text-error';
    loadBgColorClass = 'bg-error/10';
    loadIconPath = 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
  } else if (loadPercent > 75) {
    loadColorClass = 'text-warning';
    loadBgColorClass = 'bg-warning/10';
    loadIconPath = 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z';
  }
  
  return [
    {
      title: '总节点数',
      value: String(totalNodes),
      subtitle: '全球部署',
      iconPath: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01',
      colorClass: 'text-primary',
      bgColorClass: 'bg-primary/10'
    },
    {
      title: '在线节点数',
      value: String(onlineNodes),
      subtitle: '正常运行',
      iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      colorClass: 'text-success',
      bgColorClass: 'bg-success/10'
    },
    {
      title: '调配节点数',
      value: String(deployedNodes),
      subtitle: '负载均衡',
      iconPath: 'M13 10V3L4 14h7v7l9-11h-7z',
      colorClass: 'text-warning',
      bgColorClass: 'bg-warning/10'
    },
    {
      title: '连接状态',
      value: `${connections}/${maxConnections}`,
      subtitle: '活跃连接',
      iconPath: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      colorClass: 'text-info',
      bgColorClass: 'bg-info/10'
    },
    {
      title: '总负载',
      value: `${loadPercent}%`,
      subtitle: '系统负载',
      iconPath: loadIconPath,
      colorClass: loadColorClass,
      bgColorClass: loadBgColorClass
    }
  ];
});
</script>