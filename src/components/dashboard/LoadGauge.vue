<template>
  <div class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300">
    <div class="card-body p-4 sm:p-5 md:p-6 flex flex-col items-center justify-center min-h-[320px]">
      <h2 class="card-title text-sm sm:text-base md:text-lg font-semibold mb-2">总负载</h2>
      <div class="w-full h-[240px]">
        <v-chart :option="gaugeOption" autoresize class="w-full h-full" />
      </div>
      <div class="text-xs sm:text-sm text-base-content/60 mt-2">系统负载</div>
    </div>
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
  
  return {
    series: [
      {
        type: 'gauge',
        startAngle: 210,
        endAngle: -30,
        min: 0,
        max: 100,
        splitNumber: 5,
        radius: '95%',
        pointer: {
          show: true,
          length: '60%',
          width: 6,
          itemStyle: {
            color: pointerColor
          }
        },
        axisLine: {
          lineStyle: {
            width: 22,
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
          length: 8,
          lineStyle: {
            width: 1,
            color: tickColor.value
          }
        },
        splitLine: {
          show: true,
          length: 20,
          lineStyle: {
            width: 3,
            color: splitLineColor.value
          }
        },
        axisLabel: {
          show: true,
          distance: 40,
          fontSize: 11,
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
          size: 16,
          itemStyle: {
            borderWidth: 4,
            borderColor: pointerColor,
            color: gapColor.value
          }
        },
        title: {
          show: false
        },
        detail: {
          valueAnimation: true,
          fontSize: 36,
          fontWeight: 'bold',
          offsetCenter: [0, '85%'],
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
