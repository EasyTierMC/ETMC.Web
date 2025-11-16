<template>
  <div>
    <v-chart class="chart" :option="option" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import VChart from 'vue-echarts';
import china from "../../../public/china.json"
import * as echarts from 'echarts';
echarts.registerMap('china',china as any);

const data = [
      { name: '北京', value: 85 },
      { name: '上海', value: 92 },
      { name: '广东', value: 9 },
      { name: '浙江', value: 65 },
      { name: '江苏', value: 58 },
      // 更多数据...
    ]

const option = ref<echarts.EChartsOption>({
  tooltip: {
    show: true,
    formatter: '{b}: {c}个节点'
  },
  visualMap: {
    type: 'piecewise',
    min: 0,
    max: 50,
    pieces:[
      {
        max:5,
        label:'少',
        color:'#ff4d4d'
      },
      {
        min:5,
        max:15,
        label:'中',
        color:'#ffa64d'
      },
      {
        min:15,
        max:20,
        label:'多',
        color:'#ffcc00'
      },
      {
        min:20,
        max:30,
        label:'非常多',
        color:'#99cc33'
      },
      {
        min:30,
        label:'数据中心',
        color:'#33cc33'
      }
    ],
    textStyle:{
      color:'#fff'
    }
  },
  series: [{
    name: '服务器节点',
    type: 'map',
    map: 'china',
    roam: false,
    select: {
      disabled: true     // 禁用选择状态
    },
    emphasis: {
      label: {
        show: true,
      },
      itemStyle:{
        areaColor:'#FFDE59'
      }
    },
    data
  }]
});
</script>

<style scoped>
.chart {
  height: 600px;
  width: 30%;
}
</style>