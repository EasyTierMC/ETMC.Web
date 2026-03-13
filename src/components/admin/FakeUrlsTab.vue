<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { listFakeUrls, createFakeUrl, updateFakeUrl, deleteFakeUrl, type FakeUrl } from '@/utils/request/api'
import { formatDate, useConfirm } from '@/composables'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import Pagination from '@/components/common/Pagination.vue'

const { confirmAction } = useConfirm()

const loading = ref(false)
const fakeUrls = ref<FakeUrl[]>([])
const total = ref(0)
const page = ref(0)
const pageSize = ref(20)

const showEditModal = ref(false)
const editingFakeUrl = ref<FakeUrl | null>(null)

const formData = ref({
  protocol: 'tcp' as 'tcp' | 'udp' | 'ws' | 'wss',
  host: '',
  port: 8080,
  description: ''
})

const protocols = ['tcp', 'udp', 'ws', 'wss'] as const

const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

const modalTitle = computed(() => editingFakeUrl.value ? '编辑 FakeUrl' : '创建 FakeUrl')

async function fetchFakeUrls() {
  loading.value = true
  try {
    const data = await listFakeUrls(pageSize.value, page.value * pageSize.value)
    fakeUrls.value = data.items || []
    total.value = data.total || 0
  } finally {
    loading.value = false
  }
}

function openCreateModal() {
  editingFakeUrl.value = null
  formData.value = {
    protocol: 'tcp',
    host: '',
    port: 8080,
    description: ''
  }
  showEditModal.value = true
}

function openEditModal(fakeUrl: FakeUrl) {
  editingFakeUrl.value = fakeUrl
  formData.value = {
    protocol: fakeUrl.protocol,
    host: fakeUrl.host,
    port: fakeUrl.port,
    description: fakeUrl.description || ''
  }
  showEditModal.value = true
}

function closeModal() {
  showEditModal.value = false
  editingFakeUrl.value = null
}

async function handleSave() {
  if (!formData.value.host.trim()) {
    alert('请输入主机地址')
    return
  }
  if (!formData.value.port || formData.value.port < 1 || formData.value.port > 65535) {
    alert('请输入有效的端口号 (1-65535)')
    return
  }

  try {
    if (editingFakeUrl.value) {
      await updateFakeUrl(editingFakeUrl.value.id, formData.value)
    } else {
      await createFakeUrl(formData.value)
    }
    closeModal()
    fetchFakeUrls()
  } catch (error: any) {
    alert(error.response?.data?.message || '操作失败')
  }
}

async function handleDelete(id: number) {
  if (!confirmAction('确定删除此 FakeUrl？')) return
  try {
    await deleteFakeUrl(id)
    fetchFakeUrls()
  } catch (error: any) {
    alert(error.response?.data?.message || '删除失败')
  }
}

watch(page, fetchFakeUrls)
onMounted(fetchFakeUrls)
</script>

<template>
  <div class="card bg-base-100 shadow flex-1 flex flex-col">
    <div class="card-body p-4 flex-1 flex flex-col overflow-hidden">
      <div class="flex justify-between items-center mb-3 shrink-0">
        <h2 class="card-title text-base">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          FakeUrl 列表
        </h2>
        <button class="btn btn-sm btn-primary" @click="openCreateModal">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          创建
        </button>
      </div>

      <div class="flex-1 overflow-auto">
        <table class="table table-sm table-pin-rows">
          <thead>
            <tr>
              <th>ID</th>
              <th>协议</th>
              <th>主机地址</th>
              <th>端口</th>
              <th>描述</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="6" class="text-center py-8"><LoadingSpinner /></td>
            </tr>
            <EmptyState v-else-if="fakeUrls.length === 0" :colspan="6" message="暂无 FakeUrl" />
            <tr v-else v-for="fakeUrl in fakeUrls" :key="fakeUrl.id">
              <td class="font-mono text-xs">{{ fakeUrl.id }}</td>
              <td>
                <div class="badge badge-sm badge-outline">{{ fakeUrl.protocol.toUpperCase() }}</div>
              </td>
              <td class="font-mono text-sm">{{ fakeUrl.host }}</td>
              <td class="font-mono text-sm">{{ fakeUrl.port }}</td>
              <td class="text-sm text-base-content/70">{{ fakeUrl.description || '-' }}</td>
              <td>
                <div class="flex gap-1">
                  <button class="btn btn-xs btn-ghost" @click="openEditModal(fakeUrl)">编辑</button>
                  <button class="btn btn-xs btn-ghost text-error" @click="handleDelete(fakeUrl.id)">删除</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Pagination :current-page="page" :total-pages="totalPages" @update:current-page="page = $event" />
    </div>
  </div>

  <dialog class="modal" :class="{ 'modal-open': showEditModal }">
    <div class="modal-box max-w-md">
      <h3 class="font-bold text-lg mb-4">{{ modalTitle }}</h3>
      <div class="space-y-4">
        <div class="form-control">
          <label class="label">
            <span class="label-text">协议 <span class="text-error">*</span></span>
          </label>
          <select v-model="formData.protocol" class="select select-bordered select-sm w-full">
            <option v-for="protocol in protocols" :key="protocol" :value="protocol">{{ protocol.toUpperCase() }}</option>
          </select>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">主机地址 <span class="text-error">*</span></span>
          </label>
          <input v-model="formData.host" type="text" placeholder="example.com" class="input input-bordered input-sm w-full" />
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">端口 <span class="text-error">*</span></span>
          </label>
          <input v-model.number="formData.port" type="number" placeholder="8080" min="1" max="65535" class="input input-bordered input-sm w-full" />
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">描述</span>
          </label>
          <textarea v-model="formData.description" placeholder="输入描述信息" class="textarea textarea-bordered textarea-sm w-full" rows="2"></textarea>
        </div>
      </div>
      <div class="modal-action">
        <button class="btn" @click="closeModal">取消</button>
        <button class="btn btn-primary" @click="handleSave">保存</button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="closeModal">close</button>
    </form>
  </dialog>
</template>
