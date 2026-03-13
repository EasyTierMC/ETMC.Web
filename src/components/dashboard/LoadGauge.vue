<template>
  <div ref="containerRef" class="w-full flex flex-col items-center justify-center" style="min-height: 350px;">
    <h2 class="card-title text-sm font-semibold mb-2 opacity-70">总负载</h2>
    <div ref="chartRef" class="w-full" style="height: 280px;">
      <v-chart v-if="isReady" :option="gaugeOption" autoresize class="w-full h-full" />
    </div>
    <div class="text-xs opacity-60 mt-2">系统负载</div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { GaugeChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent } from 'echarts/components';
import VChart from 'vue-echarts';

use([CanvasRenderer, GaugeChart, TitleComponent, TooltipComponent]);

const props = defineProps<{
  percent: number;
}>();

const containerRef = ref<HTMLElement | null>(null);
const chartRef = ref<HTMLElement | null>(null);
const isReady = ref(false);

const isDark = ref(false);
const isSmallScreen = ref(false);

const updateTheme = () => {
  isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const updateScreenSize = () => {
  isSmallScreen.value = window.innerWidth < 1024;
};

let mediaQuery: MediaQueryList;
let resizeObserver: ResizeObserver | null = null;

const checkAndRender = () => {
  if (chartRef.value) {
    const rect = chartRef.value.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      isReady.value = true;
      return true;
    }
  }
  return false;
};

onMounted(() => {
  mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  updateTheme();
  updateScreenSize();
  mediaQuery.addEventListener('change', updateTheme);
  window.addEventListener('resize', updateScreenSize);
  
  setTimeout(() => {
    if (!checkAndRender() && chartRef.value) {
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
            isReady.value = true;
            if (resizeObserver) {
              resizeObserver.disconnect();
            }
          }
        }
      });
      resizeObserver.observe(chartRef.value);
    }
  }, 100);
});

onUnmounted(() => {
  if (mediaQuery) {
    mediaQuery.removeEventListener('change', updateTheme);
  }
  window.removeEventListener('resize', updateScreenSize);
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});

const getDetailColor = (percent: number): string => {
  if (percent >= 80) return '#FF8A8A';
  if (percent >= 40) return '#FFE066';
  return '#86E8AB';
};

const gapColor = computed(() => isDark.value ? '#1f2937' : '#fff');
const tickColor = computed(() => isDark.value ? '#6b7280' : '#999');
const splitLineColor = computed(() => isDark.value ? '#9ca3af' : '#666');
const labelColor = computed(() => isDark.value ? '#9ca3af' : '#666');

const gaugeOption = computed(() => {
  const percent = props.percent;
  const pointerColor = getDetailColor(percent);
  const small = isSmallScreen.value;
  
  return {
    series: [
      {
        type: 'gauge',
        startAngle: 210,
        endAngle: -30,
        min: 0,
        max: 100,
        splitNumber: 5,
        radius: small ? '90%' : '85%',
        pointer: {
          show: true,
          length: small ? '50%' : '55%',
          width: small ? 4 : 5,
          itemStyle: {
            color: pointerColor
          }
        },
        axisLine: {
          lineStyle: {
            width: small ? 10 : 16,
            color: [
              [0.195, '#86E8AB'],
              [0.2, gapColor.value],
              [0.395, '#86E8AB'],
              [0.4, gapColor.value],
              [0.595, '#FFE066'],
              [0.6, gapColor.value],
              [0.795, '#FFE066'],
              [0.8, gapColor.value],
              [1, '#FF8A8A']
            ]
          }
        },
        axisTick: {
          show: true,
          splitNumber: 4,
          length: small ? 4 : 6,
          lineStyle: {
            width: 1,
            color: tickColor.value
          }
        },
        splitLine: {
          show: true,
          length: small ? 8 : 12,
          lineStyle: {
            width: small ? 1 : 2,
            color: splitLineColor.value
          }
        },
        axisLabel: {
          show: true,
          distance: small ? 18 : 25,
          fontSize: small ? 9 : 10,
          fontWeight: 'normal',
          formatter: (value: number) => {
            if (value % 20 === 0) {
              return value.toString();
            }
            return '';
          },
          color: labelColor.value
        },
        anchor: {
          show: true,
          showAbove: true,
          size: small ? 10 : 12,
          itemStyle: {
            borderWidth: small ? 2 : 3,
            borderColor: pointerColor,
            color: gapColor.value
          }
        },
        title: {
          show: false
        },
        detail: {
          valueAnimation: true,
          fontSize: small ? 22 : 28,
          fontWeight: 'bold',
          offsetCenter: [0, small ? '70%' : '75%'],
          formatter: '{value}%',
          color: getDetailColor(percent)
        },
        data: [
          {
            value: percent
          }
        ]
      }
    ]
  };
});
</script>