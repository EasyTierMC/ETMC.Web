<template>
  <div class="min-h-screen bg-linear-to-br from-base-200 via-base-100 to-base-200 rounded-xl p-4 sm:p-6">
    <div class="flex flex-col lg:flex-row gap-4 sm:gap-6">
      <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <OnlineNodesChart 
          :hourly-data="hourlyData" 
          :current-status="globalStatus" 
        />
      </div>
      <div class="w-full lg:w-1/3 xl:w-1/4 flex-shrink-0">
        <div class="card bg-base-100/80 backdrop-blur-sm shadow-lg border border-base-300 min-h-[400px] lg:h-[480px]">
          <div class="card-body p-4 min-h-[350px] lg:h-full">
            <LoadGauge :percent="loadPercent" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import LoadGauge from '@/components/dashboard/LoadGauge.vue';
import OnlineNodesChart from '@/components/dashboard/OnlineNodesChart.vue';
import { getGlobalNodeStatus, type HourlyData, type GlobalNodeStatus } from '@/utils/request/api';

const globalStatus = ref<GlobalNodeStatus>({
  totalNodes: 0,
  onlineNodes: 0,
  deployedNodes: 0,
  connections: 0,
  maxConnections: 0
});

const hourlyData = ref<HourlyData[]>([]);

const fetchGlobalStatus = async () => {
  try {
    const response = await getGlobalNodeStatus();
    const { hourly, ...status } = response;
    globalStatus.value = status;
    hourlyData.value = hourly || [];
  } catch (error) {
    console.error('Failed to fetch global node status:', error);
  }
};

onMounted(() => {
  fetchGlobalStatus();
});

const loadPercent = computed(() => {
  const { connections, maxConnections } = globalStatus.value;
  return maxConnections > 0 ? Math.round((connections / maxConnections) * 100) : 0;
});
</script>