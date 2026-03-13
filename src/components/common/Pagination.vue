<script setup lang="ts">
defineProps<{
  currentPage: number
  totalPages: number
  showPageInfo?: boolean
}>()

const emit = defineEmits<{
  'update:currentPage': [page: number]
}>()
</script>

<template>
  <div class="flex justify-center mt-3 shrink-0" v-if="totalPages > 1">
    <div class="join">
      <button
        class="join-item btn btn-sm"
        :disabled="currentPage === 0"
        @click="emit('update:currentPage', currentPage - 1)"
      >«</button>
      <button class="join-item btn btn-sm">第 {{ currentPage + 1 }} 页</button>
      <button
        class="join-item btn btn-sm"
        :disabled="currentPage >= totalPages - 1"
        @click="emit('update:currentPage', currentPage + 1)"
      >»</button>
    </div>
  </div>
</template>
