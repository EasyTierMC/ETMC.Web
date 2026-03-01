<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getProfile, logout } from '@/utils/request/api'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorDisplay from '@/components/common/ErrorDisplay.vue'
import UsersTab from '@/components/admin/UsersTab.vue'
import ApiKeysTab from '@/components/admin/ApiKeysTab.vue'
import NodesTab from '@/components/admin/NodesTab.vue'

const router = useRouter()
const currentUser = ref<any>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const activeTab = ref<'users' | 'apiKeys' | 'nodes'>('users')

const tabs = [
  { key: 'users', label: '用户管理' },
  { key: 'apiKeys', label: 'API Key 管理' },
  { key: 'nodes', label: '节点管理' }
]

onMounted(async () => {
  try {
    currentUser.value = await getProfile()
  } catch (e: any) {
    error.value = '未授权，请先登录'
    logout()
    setTimeout(() => router.push('/login'), 1500)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="h-[calc(100vh-2rem)] w-full bg-base-200 overflow-hidden flex flex-col rounded-xl" style="min-width: 320px;">
    <div v-if="loading" class="flex items-center justify-center h-full">
      <LoadingSpinner size="lg" />
    </div>
    <ErrorDisplay v-else-if="error" :error="error" />
    <div v-else class="flex-1 flex flex-col overflow-hidden">
      <div class="bg-base-100 px-4 py-2 shrink-0">
        <div class="flex items-center justify-between">
          <div role="tablist" class="tabs tabs-lifted">
            <a
              v-for="tab in tabs"
              :key="tab.key"
              role="tab"
              class="tab gap-2 text-sm"
              :class="{ 'tab-active': activeTab === tab.key }"
              @click="activeTab = tab.key as any"
            >
              {{ tab.label }}
            </a>
          </div>
          <div class="text-sm text-base-content/60">管理员面板</div>
        </div>
      </div>
      <div class="flex-1 overflow-hidden p-4">
        <UsersTab v-show="activeTab === 'users'" />
        <ApiKeysTab v-show="activeTab === 'apiKeys'" />
        <NodesTab v-show="activeTab === 'nodes'" />
      </div>
    </div>
  </div>
</template>
