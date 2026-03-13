<script setup lang="ts">
defineProps<{ size?: 'sm' | 'md' | 'lg' }>()
</script>

<template>
  <span class="loading loading-spinner" :class="`loading-${size || 'md'} text-primary`"></span>
</template>
