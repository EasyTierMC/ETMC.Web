<template>
  <div class="min-h-screen bg-linear-to-br from-base-200 via-base-100 to-base-200 rounded-xl p-4 sm:p-6">
    <div class="flex flex-col lg:flex-row gap-4 sm:gap-6">
      <div class="flex-1 flex flex-col gap-4 sm:gap-6">
        <div class="card bg-base-100/80 backdrop-blur-sm shadow-lg border border-base-300">
          <div class="card-body p-4 sm:p-6">
            <OnlineNodesChart 
              :hourly-data="hourlyData" 
              :current-status="globalStatus" 
            />
          </div>
        </div>

        <div>
          <LoadGauge :percent="loadPercent" />
        </div>
      </div>

      <div class="lg:w-[45%] xl:w-[50%]">
        <div class="card bg-base-100 shadow-lg md:shadow-xl lg:shadow-2xl border border-base-300">
          <div class="card-body p-4 sm:p-6">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
              <h2 class="card-title text-xl sm:text-2xl font-bold">节点分布</h2>
              <div class="badge badge-primary badge-sm sm:badge-md md:badge-lg">China</div>
            </div>
            <div class="w-full h-[600px] rounded-lg overflow-hidden bg-base-200">
              <Map class="w-full h-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Map from '@/components/dashboard/Map.vue';
import LoadGauge from '@/components/dashboard/LoadGauge.vue';
import OnlineNodesChart from '@/components/dashboard/OnlineNodesChart.vue';
import { getGlobalNodeStatus, type GlobalNodeStatusWithHourly, type HourlyData, type GlobalNodeStatus } from '@/utils/request/api';

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
