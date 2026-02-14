<script setup lang="ts">
interface Props {
  node: any
}

const props = defineProps<Props>()

const emit = defineEmits<{
  detail: [node: any]
  edit: [node: any]
  delete: [id: string | number]
}>()

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
    <div class="card-body p-3">
      <div class="flex justify-between items-start mb-2">
        <div class="flex-1 min-w-0">
          <h3 class="font-semibold text-sm truncate">{{ node.name }}</h3>
          <p v-if="node.description" class="text-[10px] text-base-content/60 truncate">{{ node.description }}</p>
        </div>
        <div class="badge badge-[10px] shrink-0 ml-1" :class="{
          'badge-success': node.status === 'Online',
          'badge-error': node.status === 'Offline',
          'badge-warning': node.status === 'Pending',
          'badge-ghost': !node.status
        }">
          {{ node.status === 'Online' ? '在线' : node.status === 'Offline' ? '离线' : node.status === 'Pending' ? '等待' : node.status || 'Unknown' }}
        </div>
      </div>
      
      <div v-if="node.tags && node.tags.length > 0" class="flex flex-wrap gap-1 mb-2">
        <span v-for="tag in node.tags" :key="tag" class="badge badge-secondary badge-[9px]">{{ tag }}</span>
      </div>
      
      <div class="space-y-1 text-[11px]">
        <div class="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-base-content/60 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>{{ node.max_connections }}</span>
          <span v-if="node.allow_relay" class="badge badge-success badge-[10px] gap-0.5 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            中继
          </span>
          <span v-else class="badge badge-ghost badge-[10px] shrink-0">禁中继</span>
        </div>
      </div>
      
      <div class="flex gap-1 mt-2 pt-2 border-t border-base-300">
        <button class="btn btn-ghost btn-[10px] flex-1 h-7" @click="handleDetail">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          详情
        </button>
        <button class="btn btn-ghost btn-[10px] flex-1 h-7" @click="handleEdit">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          编辑
        </button>
        <button class="btn btn-ghost btn-[10px] text-error flex-1 h-7" @click="handleDelete">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          删除
        </button>
      </div>
    </div>
  </div>
</template>
