<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  tabs: { key: string; label: string; icon?: string }[]
  activeTab: string
}>()

const emit = defineEmits<{
  'update:activeTab': [key: string]
}>()

function switchTab(key: string) {
  emit('update:activeTab', key)
}
</script>

<template>
  <div class="bg-base-100 px-4 py-2 shrink-0">
    <div class="flex items-center justify-between">
      <div role="tablist" class="tabs tabs-lifted">
        <a
          v-for="tab in tabs"
          :key="tab.key"
          role="tab"
          class="tab gap-2 text-sm"
          :class="{ 'tab-active': activeTab === tab.key }"
          @click="switchTab(tab.key)"
        >
          <slot :name="`icon-${tab.key}`" />
          {{ tab.label }}
        </a>
      </div>
      <slot name="extra" />
    </div>
  </div>
</template>
