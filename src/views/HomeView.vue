<template>
  <section style="padding:2rem; text-align:center;">
    <h2 class="text-2xl font-bold mb-2">欢迎来到 EasyTierMC Uptime</h2>
    <p>使用上方导航查看节点监控或提交新的节点。</p>
    <div>
      <div class="flex flex-wrap gap-2 justify-center-safe sm:flex-row md:flex-row lg:flex-row">
        <div class="card w-full sm:w-96 bg-base-100 card-sm shadow-sm">
          <div class="card-body">
            <h2 class="card-title font-bold">总节点数</h2>
            <p class="text-3xl font-bold">211</p>
          </div>
        </div>
        <div class="card w-full sm:w-96 bg-base-100 card-sm shadow-sm">
          <div class="card-body">
            <h2 class="card-title font-bold">在线节点数</h2>
            <p class="text-3xl font-bold">205</p>
          </div>
        </div>
        <div class="card w-full sm:w-96 bg-base-100 card-sm shadow-sm">
          <div class="card-body">
            <h2 class="card-title font-bold">调配节点数</h2>
            <p class="text-3xl font-bold">42</p>
          </div>
        </div>
        <div class="card w-full sm:w-96 bg-base-100 card-sm shadow-sm">
          <div class="card-body">
            <h2 class="card-title font-bold">当前连接数/可连接数</h2>
            <p class="text-3xl font-bold">211/114</p>
          </div>
        </div>
        <div class="card w-full sm:w-96 bg-base-100 card-sm shadow-sm">
          <div class="card-body">
            <h2 class="card-title font-bold">总负载</h2>
            <p class="text-3xl font-bold">114%</p>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-center items-center">
      <Map class="w-full sm:w-1/2 h-auto sm:h-96" />
    </div>
  </section>
</template>

<script setup lang="ts">
import Map from '@/components/dashboard/Map.vue';
</script>
