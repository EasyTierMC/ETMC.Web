<template>
  <section style="padding:2rem; text-align:center;">
    <h2 class="text-2xl font-bold mb-2">欢迎来到 EasyTierMC Uptime</h2>
    <p>使用上方导航查看节点监控或提交新的节点。</p>
    <div>
      <div class="flex gap-2 grid-cols-[200px_minmax(900px,1fr)_100px] justify-center-safe">
        <div class="card w-96 bg-base-100 card-sm shadow-sm">
          <div class="card-body">
            <h2 class="card-title font-bold">总节点数</h2>
            <p class="text-3xl font-bold">211</p>
          </div>
        </div>
        <div class="card w-96 bg-base-100 card-sm shadow-sm">
          <div class="card-body">
            <h2 class="card-title font-bold">在线节点数</h2>
            <p class="text-3xl font-bold">205</p>
          </div>
        </div>
        <div class="card w-96 bg-base-100 card-sm shadow-sm">
          <div class="card-body">
            <h2 class="card-title font-bold">调配节点数</h2>
            <p class="text-3xl font-bold">42</p>
          </div>
        </div>
        <div class="card w-96 bg-base-100 card-sm shadow-sm">
          <div class="card-body">
            <h2 class="card-title font-bold">当前连接数/可连接数</h2>
            <p class="text-3xl font-bold">211/114</p>
          </div>
        </div>
        <div class="card w-96 bg-base-100 card-sm shadow-sm">
          <div class="card-body">
            <h2 class="card-title font-bold">总负载</h2>
            <p class="text-3xl font-bold">114%</p>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-center items-center">
      <Map class="w-1/2 h-96" />
    </div>
  </section>
</template>

<script setup lang="ts">
import Map from '@/components/dashboard/Map.vue';
</script>
