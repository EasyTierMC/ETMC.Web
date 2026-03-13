<script setup lang="ts">
defineProps<{
  currentPage: number
  totalPages: number
  totalNodes: number
  pageSize: number
  pageSizeOptions: number[]
}>()

const emit = defineEmits<{
  'update:currentPage': [page: number]
  'update:pageSize': [size: number]
}>()

function goToPage(page: number) {
  emit('update:currentPage', page)
}

function getPageNumbers(current: number, total: number): number[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [...Array.from({ length: 5 }, (_, i) => i + 1), total]
  if (current >= total - 3) return [1, ...Array.from({ length: 5 }, (_, i) => total - 4 + i)]
  return [1, current - 1, current, current + 1, total]
}
</script>

<template>
  <div class="bg-base-100 rounded-lg px-4 py-4 mx-4 mt-6 border border-base-300">
    <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
      <div class="text-sm text-base-content/70">
        显示 {{ ((currentPage - 1) * pageSize) + 1 }} - {{ Math.min(currentPage * pageSize, totalNodes) }}
        共 {{ totalNodes }} 条记录
      </div>

      <div class="flex items-center gap-2 whitespace-nowrap">
        <span class="text-sm text-base-content/70">每页</span>
        <select
          :value="pageSize"
          @change="emit('update:pageSize', Number(($event.target as HTMLSelectElement).value))"
          class="select select-bordered select-sm"
        >
          <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }}</option>
        </select>
        <span class="text-sm text-base-content/70">条</span>
      </div>

      <div class="flex items-center gap-2">
        <button @click="goToPage(1)" :disabled="currentPage === 1" class="btn btn-outline btn-sm" :class="{ 'btn-disabled': currentPage === 1 }">首页</button>
        <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" class="btn btn-outline btn-sm" :class="{ 'btn-disabled': currentPage === 1 }">上一页</button>
        <div class="flex items-center gap-1">
          <button
            v-for="page in getPageNumbers(currentPage, totalPages)"
            :key="page"
            @click="goToPage(page)"
            class="btn btn-sm"
            :class="page === currentPage ? 'btn-primary' : 'btn-outline'"
          >{{ page }}</button>
        </div>
        <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" class="btn btn-outline btn-sm" :class="{ 'btn-disabled': currentPage === totalPages }">下一页</button>
        <button @click="goToPage(totalPages)" :disabled="currentPage === totalPages" class="btn btn-outline btn-sm" :class="{ 'btn-disabled': currentPage === totalPages }">末页</button>
      </div>
    </div>
  </div>
</template>
