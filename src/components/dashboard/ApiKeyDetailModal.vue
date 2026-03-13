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

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
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
          <label class="text-xs text-base-content/60">名称</label>
          <div class="text-sm">{{ apiKey.name }}</div>
        </div>
        <div class="space-y-1">
          <label class="text-xs text-base-content/60">描述</label>
          <div class="text-sm">{{ apiKey.description || '-' }}</div>
        </div>
        <div class="space-y-1">
          <label class="text-xs text-base-content/60">User-Agent</label>
          <code class="bg-base-200 px-2 py-1 rounded text-sm font-mono block">{{ apiKey.userAgent || '-' }}</code>
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
