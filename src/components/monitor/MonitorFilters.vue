<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  searchQuery: string
  statusFilter: string
  selectedTags: string[]
  availableTags: string[]
  sortBy: string
  sortOrder: 'asc' | 'desc'
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:statusFilter': [value: string]
  'update:selectedTags': [value: string[]]
  'update:sortBy': [value: string]
  'update:sortOrder': [value: 'asc' | 'desc']
}>()

function toggleAllTags() {
  if (props.selectedTags.length === props.availableTags.length) {
    emit('update:selectedTags', [])
  } else {
    emit('update:selectedTags', [...props.availableTags])
  }
}

function clearTagSelection() {
  emit('update:selectedTags', [])
}

function toggleSortOrder() {
  emit('update:sortOrder', props.sortOrder === 'asc' ? 'desc' : 'asc')
}
</script>

<template>
  <div class="bg-base-100 rounded-lg p-4 mb-6 mx-4 border border-base-300">
    <div class="flex flex-col lg:flex-row gap-4">
      <input
        :value="searchQuery"
        @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
        type="text"
        placeholder="搜索节点名称..."
        class="input input-bordered w-full text-sm"
      />

      <select
        :value="statusFilter"
        @change="emit('update:statusFilter', ($event.target as HTMLSelectElement).value)"
        class="select select-bordered text-sm"
      >
        <option value="all">全部状态</option>
        <option value="online">在线</option>
        <option value="offline">离线</option>
      </select>

      <div class="dropdown dropdown-bottom">
        <div tabindex="0" role="button" class="select select-bordered text-sm min-w-[120px] justify-between">
          <span>{{ selectedTags.length > 0 ? `已选${selectedTags.length}个` : '全部标签' }}</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
        <div tabindex="0" class="dropdown-content bg-base-100 rounded-box shadow-lg border border-base-300 w-48 p-2 z-1">
          <div class="max-h-48 overflow-y-auto">
            <label class="flex items-center gap-2 p-2 hover:bg-base-200 rounded cursor-pointer">
              <input
                type="checkbox"
                class="checkbox checkbox-sm"
                @change="toggleAllTags"
                :checked="selectedTags.length === availableTags.length && availableTags.length > 0"
              />
              <span class="text-sm">全选</span>
            </label>
            <div class="divider my-1"></div>
            <label
              v-for="tag in availableTags"
              :key="tag"
              class="flex items-center gap-2 p-2 hover:bg-base-200 rounded cursor-pointer"
            >
              <input
                type="checkbox"
                class="checkbox checkbox-sm"
                :value="tag"
                :checked="selectedTags.includes(tag)"
                @change="emit('update:selectedTags', selectedTags.includes(tag) 
                  ? selectedTags.filter(t => t !== tag) 
                  : [...selectedTags, tag])"
              />
              <span class="text-sm">{{ tag }}</span>
            </label>
          </div>
          <div class="divider my-1"></div>
          <div class="flex items-center justify-between p-2">
            <span class="text-xs text-base-content/60">{{ selectedTags.length }}/{{ availableTags.length }}</span>
            <button v-if="selectedTags.length > 0" @click="clearTagSelection" class="btn btn-ghost btn-xs">清除</button>
          </div>
        </div>
      </div>

      <div class="flex gap-2">
        <select
          :value="sortBy"
          @change="emit('update:sortBy', ($event.target as HTMLSelectElement).value)"
          class="select select-bordered text-sm min-w-[120px]"
        >
          <option value="name">按名称排序</option>
          <option value="id">按ID排序</option>
          <option value="load">按负载排序</option>
          <option value="connections">按连接数排序</option>
        </select>
        <button @click="toggleSortOrder" class="btn btn-outline btn-sm">
          {{ sortOrder === 'asc' ? '↑' : '↓' }}
        </button>
      </div>
    </div>
  </div>
</template>
