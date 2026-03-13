<template>
  <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { GlobalNodeStatus } from '@/utils/request/api';

interface NodeStat {
  title: string;
  value: string;
  subtitle: string;
  iconPath: string;
  colorClass: string;
  bgColorClass: string;
}

const props = defineProps<{
  status: GlobalNodeStatus;
}>();

const nodeStats = computed<NodeStat[]>(() => {
  const { totalNodes, onlineNodes, deployedNodes, connections, maxConnections } = props.status;
  
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
    }
  ];
});
</script>
