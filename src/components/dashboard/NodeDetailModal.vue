<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  node: any
  show: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const formattedDate = computed(() => {
  if (!props.node?.last_status_update) return '-'
  return new Date(props.node.last_status_update).toLocaleString()
})

function handleClose() {
  emit('close')
}
</script>

<template>
  <dialog class="modal" :class="{ 'modal-open': show }">
    <div class="modal-box max-w-2xl">
      <h3 class="font-bold text-lg mb-4">节点详细信息</h3>
      <div v-if="node" class="space-y-3">
        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="text-xs text-base-content/60">节点名称</label>
            <div class="font-medium">{{ node.name }}</div>
          </div>
          <div class="space-y-1">
            <label class="text-xs text-base-content/60">节点ID</label>
            <div class="font-mono text-sm">{{ node.id }}</div>
          </div>
          <div class="space-y-1">
            <label class="text-xs text-base-content/60">连接地址</label>
            <div class="font-mono text-sm">{{ node.host }}:{{ node.port }}</div>
          </div>
          <div class="space-y-1">
            <label class="text-xs text-base-content/60">网络名称</label>
            <div class="text-sm">{{ node.network_name || '-' }}</div>
          </div>
          <div class="space-y-1">
            <label class="text-xs text-base-content/60">协议</label>
            <div class="badge badge-info badge-sm">{{ node.protocol?.toUpperCase() }}</div>
          </div>
          <div class="space-y-1">
            <label class="text-xs text-base-content/60">最大连接数</label>
            <div class="text-sm">{{ node.max_connections }}</div>
          </div>
          <div class="space-y-1">
            <label class="text-xs text-base-content/60">状态</label>
            <div class="badge badge-sm" :class="{
              'badge-success': node.status === 'Online',
              'badge-error': node.status === 'Offline',
              'badge-warning': node.status === 'Pending',
              'badge-ghost': !node.status
            }">
              {{ node.status === 'Online' ? '在线' : node.status === 'Offline' ? '离线' : node.status === 'Pending' ? '等待' : node.status || 'Unknown' }}
            </div>
          </div>
          <div class="space-y-1">
            <label class="text-xs text-base-content/60">是否允许中继</label>
            <div class="badge badge-sm" :class="node.allow_relay ? 'badge-success' : 'badge-ghost'">
              {{ node.allow_relay ? '是' : '否' }}
            </div>
          </div>
          <div class="space-y-1">
            <label class="text-xs text-base-content/60">响应时间</label>
            <div class="text-sm">{{ node.response_time ? node.response_time + 'ms' : '-' }}</div>
          </div>
          <div class="space-y-1">
            <label class="text-xs text-base-content/60">最后状态更新</label>
            <div class="text-sm">{{ formattedDate }}</div>
          </div>
        </div>
        
        <div v-if="node.tags && node.tags.length > 0" class="space-y-1">
          <label class="text-xs text-base-content/60">标签</label>
          <div class="flex flex-wrap gap-1">
            <span v-for="tag in node.tags" :key="tag" class="badge badge-secondary badge-sm">{{ tag }}</span>
          </div>
        </div>
        
        <div v-if="node.description" class="space-y-1">
          <label class="text-xs text-base-content/60">描述</label>
          <div class="text-sm">{{ node.description }}</div>
        </div>
        
        <div v-if="node.qq_number || node.mail" class="space-y-2 pt-2 border-t border-base-300">
          <div v-if="node.qq_number" class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-base-content/60" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10c0-5.52-4.48-10-10-10zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
            </svg>
            <span class="text-sm">{{ node.qq_number }}</span>
          </div>
          <div v-if="node.mail" class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-base-content/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span class="text-sm">{{ node.mail }}</span>
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
