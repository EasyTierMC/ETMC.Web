<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  node: any
}

const props = defineProps<Props>()

const emit = defineEmits<{
  detail: [node: any]
  edit: [node: any]
  delete: [id: string | number]
}>()

const nodeInfo = computed(() => props.node.nodeInfo?.[0] || {})

function handleDetail() {
  emit('detail', props.node)
}

function handleEdit() {
  emit('edit', props.node)
}

function handleDelete() {
  emit('delete', props.node.id)
}
</script>

<template>
  <div class="card bg-base-200 shadow hover:shadow-md transition-shadow">
    <div class="card-body p-4 gap-3">
      <div class="flex justify-between items-start">
        <div class="flex-1 min-w-0">
          <h3 class="font-semibold truncate">{{ node.name }}</h3>
          <p v-if="node.description" class="text-xs text-base-content/60 truncate mt-1">{{ node.description }}</p>
        </div>
        <div class="badge shrink-0 ml-2" :class="{
          'badge-success': node.isOnline === true,
          'badge-error': node.isOnline === false
        }">
          {{ node.isOnline === true ? '在线' : '离线' }}
        </div>
      </div>
      
      <div v-if="node.tags && node.tags.length > 0" class="flex flex-wrap gap-1">
        <span v-for="tag in node.tags" :key="tag" class="badge badge-secondary badge-sm">{{ tag }}</span>
      </div>
      
      <div class="space-y-2 text-sm">
        <div class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-base-content/50 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <span class="text-base-content/70">协议:</span>
          <span class="font-medium">{{ nodeInfo.protocol || '-' }}</span>
        </div>
        <div class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-base-content/50 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
          </svg>
          <span class="text-base-content/70">地址:</span>
          <span class="font-medium truncate">{{ nodeInfo.host || '-' }}:{{ nodeInfo.port || '-' }}</span>
        </div>
        <div class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-base-content/50 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          <span class="text-base-content/70">中继:</span>
          <span class="font-medium">{{ nodeInfo.isRelay ? '允许' : '禁止' }}</span>
        </div>
        <div v-if="nodeInfo.maximumBandwidth" class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-base-content/50 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span class="text-base-content/70">带宽:</span>
          <span class="font-medium">{{ nodeInfo.maximumBandwidth }} Mbps</span>
        </div>
      </div>
      
      <div class="flex gap-2 pt-3 border-t border-base-300">
        <button class="btn btn-ghost btn-sm flex-1" @click="handleDetail">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          详情
        </button>
        <button class="btn btn-ghost btn-sm flex-1" @click="handleEdit">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          编辑
        </button>
        <button class="btn btn-ghost btn-sm text-error flex-1" @click="handleDelete">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          删除
        </button>
      </div>
    </div>
  </div>
</template>
