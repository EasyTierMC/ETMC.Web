<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  apiKey: any
  show: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

function handleClose() {
  emit('close')
}
</script>

<template>
  <dialog class="modal" :class="{ 'modal-open': show }">
    <div class="modal-box max-w-md">
      <h3 class="font-bold text-lg mb-4">API Key 详情</h3>
      <div v-if="apiKey" class="space-y-3">
        <div class="space-y-1">
          <label class="text-xs text-base-content/60">ID</label>
          <div class="font-mono text-sm">{{ apiKey.id }}</div>
        </div>
        <div class="space-y-1">
          <label class="text-xs text-base-content/60">API Key</label>
          <div class="flex items-center gap-2">
            <code class="bg-base-200 px-2 py-1 rounded text-sm font-mono flex-1">{{ apiKey.key }}</code>
            <button class="btn btn-ghost btn-sm btn-circle" @click="navigator.clipboard.writeText(apiKey.key)">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
        <div class="space-y-1">
          <label class="text-xs text-base-content/60">名称</label>
          <div class="text-sm">{{ apiKey.name }}</div>
        </div>
        <div class="space-y-1">
          <label class="text-xs text-base-content/60">描述</label>
          <div class="text-sm">{{ apiKey.description || '-' }}</div>
        </div>
        <div class="space-y-1">
          <label class="text-xs text-base-content/60">User-Agent</label>
          <code class="bg-base-200 px-2 py-1 rounded text-sm font-mono block">{{ apiKey.ua || '-' }}</code>
        </div>
        <div class="space-y-1">
          <label class="text-xs text-base-content/60">状态</label>
          <div class="badge badge-sm" :class="apiKey.status === 'active' ? 'badge-success' : 'badge-ghost'">
            {{ apiKey.status === 'active' ? '启用' : '禁用' }}
          </div>
        </div>
      </div>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn" @click="handleClose">关闭</button>
        </form>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="handleClose">close</button>
    </form>
  </dialog>
</template>
