<script setup lang="ts">
defineProps<{ message?: string; colspan?: number }>()
</script>

<template>
  <tr>
    <td :colspan="colspan || 5" class="text-center text-base-content/60 py-8">
      <div class="flex flex-col items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="text-sm">{{ message || '暂无数据' }}</span>
      </div>
    </td>
  </tr>
</template>
