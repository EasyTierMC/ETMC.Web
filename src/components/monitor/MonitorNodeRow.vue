<script setup lang="ts">
import type { NodeView } from '@/utils/request/types'
import { formatDateShort, getLoadScoreColor, getLoadScoreBarColor } from '@/composables'

defineProps<{ node: NodeView }>()
</script>

<template>
  <div class="w-full border border-base-300 bg-base-100 rounded-lg px-4 py-3 hover:shadow-lg transition-all duration-300">
    <div class="flex items-center gap-6 h-full">
      <div class="flex items-center gap-3 min-w-[200px] shrink-0">
        <div
          class="w-2 h-2 rounded-full"
          :class="node.isOnline ? 'bg-success' : 'bg-error'"
        ></div>
        <span class="text-sm text-base-content/60 font-mono">{{ node.id }}</span>
        <h2 class="text-base font-semibold">{{ node.name }}</h2>
      </div>

      <div class="min-w-[200px] shrink-0">
        <div class="flex items-center gap-3">
          <div class="flex-1 bg-base-300 rounded-full h-2.5 min-w-[100px]">
            <div
              class="h-2.5 rounded-full transition-all duration-300"
              :class="getLoadScoreBarColor(node.loadScore)"
              :style="{ width: `${node.loadScore}%` }"
            ></div>
          </div>
          <span class="text-sm font-bold min-w-[45px] text-right" :class="getLoadScoreColor(node.loadScore)">
            {{ node.loadScore.toFixed(1) }}%
          </span>
        </div>
      </div>

      <div class="min-w-[140px] shrink-0">
        <div class="flex items-center gap-2 text-xs">
          <span class="font-bold">{{ node.currentConnections }} / {{ node.maxConnections }}</span>
        </div>
      </div>

      <div class="flex items-center gap-2 flex-1 min-w-[280px]">
        <span v-for="tag in node.tags" :key="tag" class="badge badge-secondary">{{ tag }}</span>
        <span
          class="badge badge-ghost badge-sm"
          :title="node.provider?.githubId ? `GitHub ID: ${node.provider.githubId}` : ''"
        >
          {{ node.provider?.username || '未知' }}
        </span>
      </div>

      <div class="min-w-[280px] shrink-0 text-right">
        <p class="text-sm text-base-content/70 mb-1">{{ node.description }}</p>
        <div class="text-xs text-base-content/50">创建于 {{ formatDateShort(node.createdAt) }}</div>
      </div>
    </div>
  </div>
</template>
