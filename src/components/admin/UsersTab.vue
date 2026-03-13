<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { listUsers, deleteUser, updateUserRole, type User } from '@/utils/request/api'
import { formatDate, useConfirm } from '@/composables'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import Pagination from '@/components/common/Pagination.vue'

const { confirmAction } = useConfirm()

const loading = ref(false)
const users = ref<User[]>([])
const total = ref(0)
const page = ref(0)
const pageSize = ref(20)
const roleFilter = ref<'admin' | 'user' | undefined>(undefined)

const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

async function fetchUsers() {
  loading.value = true
  try {
    const data = await listUsers(pageSize.value, page.value * pageSize.value, roleFilter.value)
    users.value = data.items || []
    total.value = data.total || 0
  } finally {
    loading.value = false
  }
}

async function handleDelete(uuid: string) {
  if (!confirmAction('确定删除此用户？此操作不可恢复。')) return
  await deleteUser(uuid)
  fetchUsers()
}

async function handleUpdateRole(uuid: string, role: 'admin' | 'user') {
  await updateUserRole(uuid, role)
  fetchUsers()
}

watch([page, roleFilter], fetchUsers)
onMounted(fetchUsers)
</script>

<template>
  <div class="card bg-base-100 shadow flex-1 flex flex-col">
    <div class="card-body p-4 flex-1 flex flex-col overflow-hidden">
      <div class="flex justify-between items-center mb-3 shrink-0">
        <h2 class="card-title text-base">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          用户列表
        </h2>
        <select v-model="roleFilter" class="select select-sm select-bordered w-32">
          <option :value="undefined">全部角色</option>
          <option value="admin">管理员</option>
          <option value="user">普通用户</option>
        </select>
      </div>

      <div class="flex-1 overflow-auto">
        <table class="table table-sm table-pin-rows">
          <thead>
            <tr>
              <th>用户名</th>
              <th>角色</th>
              <th>注册时间</th>
              <th>最后登录</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="5" class="text-center py-8"><LoadingSpinner /></td>
            </tr>
            <EmptyState v-else-if="users.length === 0" :colspan="5" message="暂无用户" />
            <tr v-else v-for="user in users" :key="user.uuid">
              <td>
                <div class="flex items-center gap-2">
                  <div class="avatar">
                    <div class="w-8 h-8 rounded-full">
                      <img :src="user.avatarUrl" :alt="user.username" />
                    </div>
                  </div>
                  <div>
                    <div class="font-medium">{{ user.username }}</div>
                    <div class="text-xs text-base-content/50">{{ user.uuid.slice(0, 8) }}</div>
                  </div>
                </div>
              </td>
              <td>
                <div class="badge" :class="user.role === 'admin' ? 'badge-primary' : 'badge-ghost'">
                  {{ user.role === 'admin' ? '管理员' : '用户' }}
                </div>
              </td>
              <td class="text-sm">{{ formatDate(user.registeredAt) }}</td>
              <td class="text-sm">{{ formatDate(user.lastLoginAt) }}</td>
              <td>
                <div class="flex gap-1">
                  <button
                    v-if="user.role === 'user'"
                    class="btn btn-xs btn-ghost"
                    @click="handleUpdateRole(user.uuid, 'admin')"
                  >设为管理员</button>
                  <button
                    v-else
                    class="btn btn-xs btn-ghost"
                    @click="handleUpdateRole(user.uuid, 'user')"
                  >设为用户</button>
                  <button class="btn btn-xs btn-ghost text-error" @click="handleDelete(user.uuid)">删除</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Pagination :current-page="page" :total-pages="totalPages" @update:current-page="page = $event" />
    </div>
  </div>
</template>
