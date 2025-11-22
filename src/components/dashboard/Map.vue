<template>
  <div>
    <v-chart class="chart" :option="option" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import VChart from 'vue-echarts';
import china from "@/assets/china.json"
import * as echarts from 'echarts';
echarts.registerMap('china', china as any);

const data = [
  { name: '北京', value: 85 },
  { name: '上海', value: 92 },
  { name: '广东', value: 9 },
  { name: '浙江', value: 65 },
  { name: '江苏', value: 58 },
  // 更多数据...
]

const option = ref<echarts.EChartsOption>({
  tooltip: { show: true, formatter: '{b}: {c}个节点' },
  visualMap: {
    type: 'piecewise',
    min: 0,
    max: 50,
    pieces: [
      { max: 3, label: '少(0-3)', color: '#ff4d4d' },
      { min: 3, max: 10, label: '中(3-10)', color: '#ffa64d' },
      { min: 10, max: 15, label: '多(10-15)', color: '#ffcc00' },
      { min: 15, max: 25, label: '非常多(15-25)', color: '#99cc33' },
      { min: 30, label: '数据中心(30+)', color: '#33cc33' }
    ],
    textStyle: { color: undefined }
  },
  series: [{
    name: '服务器节点',
    type: 'map',
    map: 'china',
    roam: false,
    select: { disabled: true },
    emphasis: { label: { show: true }, itemStyle: { areaColor: '#FFDE59' } },
    data
  }]
});

const updateTheme = (e: MediaQueryListEvent | boolean) => {
  const isDark = typeof e === 'boolean' ? e : e.matches;
  const color = option.value.visualMap as { textStyle: { color: string } };
  color.textStyle.color = isDark ? '#fff' : '#000';
};

onMounted(() => {
  const chart = echarts.getInstanceByDom(document.querySelector('.chart') as HTMLElement);
  const resizeObserver = new ResizeObserver(() => {
    chart?.resize();
  });
  resizeObserver.observe(document.querySelector('.chart') as HTMLElement);

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  updateTheme(mediaQuery.matches);
  mediaQuery.addEventListener('change', updateTheme);

  return () => {
    resizeObserver.disconnect();
    mediaQuery.removeEventListener('change', updateTheme);
  };
});
</script>