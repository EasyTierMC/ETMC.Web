<template>
  <template v-for="(chart, index) in chartConfigs" :key="index">
    <div class="card bg-base-100 shadow-lg border border-base-300">
      <div class="card-body p-3 sm:p-4 flex flex-col h-full">
        <div class="mb-1">
          <h3 class="text-xs font-medium opacity-60">{{ chart.subtitle }}</h3>
          <p :class="`text-lg sm:text-xl font-bold ${chart.colorClass}`">{{ chart.currentValue }}</p>
        </div>
        <div v-if="hourlyData.length > 0" class="w-full flex-1" style="min-height: 220px;">
          <v-chart :option="chart.option" autoresize class="w-full h-full" />
        </div>
        <div v-else class="w-full flex-1 flex items-center justify-center text-base-content/30 text-xs" style="min-height: 220px;">
          暂无数据
        </div>
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import { TooltipComponent, GridComponent } from 'echarts/components';
import VChart from 'vue-echarts';
import type { HourlyData, GlobalNodeStatus } from '@/utils/request/api';

use([CanvasRenderer, LineChart, TooltipComponent, GridComponent]);

const props = defineProps<{
  hourlyData: HourlyData[];
  currentStatus: GlobalNodeStatus;
}>();

const isDark = ref(false);

const updateTheme = () => {
  isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
};

let mediaQuery: MediaQueryList;

onMounted(() => {
  mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  updateTheme();
  mediaQuery.addEventListener('change', updateTheme);
});

onUnmounted(() => {
  if (mediaQuery) {
    mediaQuery.removeEventListener('change', updateTheme);
  }
});

const axisLineColor = computed(() => isDark.value ? '#4b5563' : '#d1d5db');
const splitLineColor = computed(() => isDark.value ? '#374151' : '#e5e7eb');
const textColor = computed(() => isDark.value ? '#9ca3af' : '#6b7280');

const createChartOption = (getData: (item: HourlyData) => number, unit: string, isConnectionChart: boolean = false) => {
  const hours = Array.from({ length: 24 }, (_, i) => `${i}时`);
  const fullData: (number | null)[] = Array(24).fill(null);
  const maxData: (number | null)[] = Array(24).fill(null);
  
  props.hourlyData.forEach(item => {
    if (item.hour >= 0 && item.hour <= 23) {
      fullData[item.hour] = getData(item);
      if (isConnectionChart) {
        maxData[item.hour] = item.maxConnections;
      }
    }
  });

  const seriesConfig: any[] = [{
    type: 'line',
    smooth: true,
    symbol: 'circle',
    symbolSize: 3,
    connectNulls: false,
    lineStyle: {
      color: '#86efac',
      width: 1.5
    },
    itemStyle: {
      color: '#86efac'
    },
    areaStyle: {
      color: {
        type: 'linear',
        x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: 'rgba(134, 239, 172, 0.4)' },
          { offset: 1, color: 'rgba(134, 239, 172, 0.05)' }
        ]
      }
    },
    data: fullData
  }];

  if (isConnectionChart) {
    seriesConfig[0].name = '已连接';
    seriesConfig.push({
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 3,
      connectNulls: false,
      lineStyle: {
        color: '#60a5fa',
        width: 1.5,
        type: 'dashed'
      },
      itemStyle: {
        color: '#60a5fa'
      },
      data: maxData,
      name: '最大连接'
    });
  }

  return {
    tooltip: {
      trigger: 'axis',
      backgroundColor: isDark.value ? '#1f2937' : '#fff',
      borderColor: isDark.value ? '#374151' : '#e5e7eb',
      textStyle: {
        color: isDark.value ? '#f3f4f6' : '#374151',
        fontSize: 11
      },
      formatter: (params: any) => {
        if (!params || params.length === 0) {
          return undefined;
        }
        const validParams = params.filter((p: any) => p.value !== null && p.value !== undefined);
        if (validParams.length === 0) {
          return undefined;
        }
        const timeName = validParams[0].name;
        let content = `<div style="padding: 4px 8px;">
          <div style="font-weight: 500; margin-bottom: 4px;">${timeName}</div>`;
        validParams.forEach((p: any) => {
          const hasSeriesName = isConnectionChart && p.seriesName;
          const seriesNameText = hasSeriesName ? `${p.seriesName}: ` : '';
          content += `<div style="display: flex; align-items: center; gap: 6px;">
            <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: ${p.color}"></span>
            <span>${seriesNameText}${p.value} ${unit}</span>
          </div>`;
        });
        content += '</div>';
        return content;
      }
    },
    legend: isConnectionChart ? {
      data: ['已连接', '最大连接'],
      textStyle: {
        color: textColor.value,
        fontSize: 10
      },
      bottom: 0
    } : undefined,
    grid: {
      left: '8%',
      right: '4%',
      bottom: isConnectionChart ? '18%' : '12%',
      top: '8%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: hours,
      axisLine: {
        lineStyle: { color: axisLineColor.value }
      },
      axisLabel: {
        color: textColor.value,
        fontSize: 8
      },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: textColor.value,
        fontSize: 8
      },
      splitLine: {
        lineStyle: {
          color: splitLineColor.value,
          type: 'solid'
        }
      }
    },
    series: seriesConfig
  };
};

const chartConfigs = computed(() => {
  const { totalNodes, onlineNodes, deployedNodes, connections, maxConnections } = props.currentStatus;
  
  return [
    {
      subtitle: '总节点数',
      currentValue: `${totalNodes}个`,
      colorClass: 'text-primary',
      option: createChartOption(item => item.onlineNodes, '个')
    },
    {
      subtitle: '在线节点',
      currentValue: `${onlineNodes}个`,
      colorClass: 'text-success',
      option: createChartOption(item => item.onlineNodes, '个')
    },
    {
      subtitle: '调配节点',
      currentValue: `${deployedNodes}个`,
      colorClass: 'text-warning',
      option: createChartOption(item => item.deployedNodes, '个')
    },
    {
      subtitle: '连接状态',
      currentValue: `${connections}/${maxConnections}`,
      colorClass: 'text-info',
      option: createChartOption(item => item.connections, '次', true)
    }
  ];
});
</script>
