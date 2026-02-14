<script setup lang="ts">
import { getClientId, getProfile, isAuthenticated, login } from '@/utils/request/api'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()


const loading = ref(false)

onMounted(async () => {
  const isLoggedIn = await isAuthenticated()
  if (route.query.code && typeof route.query.code === 'string' && !isLoggedIn) {
    loading.value = true
    login(route.query.code).then(res => {
      if (typeof window !== 'undefined' && window.cookieStore) {
        window.cookieStore.set('auth_token', res.data.token)
      }
      getProfile().then(() => {
        window.location.reload()
      })
    })
  }
  if (isLoggedIn) {
    window.location.href = '/'
  }
})

function loginWithGitHub() {
  loading.value = true
  const thisUrl = window.location.href
  getClientId().then(cid => {
    console.log(cid)
    window.location.href = `https://github.com/login/oauth/authorize?response_type=code&redirect_uri=${encodeURIComponent(thisUrl)}&client_id=${cid.data.client_id}`
  })
}
</script>

<template>
  <div class="min-h-[calc(100vh-200px)] flex items-center justify-center">
    <!-- 装饰 -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl"></div>
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl">
      </div>
    </div>

    <div class="max-w-md w-full mx-auto px-4">
      <div class="card bg-base-100 shadow-lg">
        <div class="card-body">
          <h2 class="card-title text-2xl justify-center mb-6">欢迎登录</h2>
          <p class="text-center text-base-content/70 mb-6">使用您的GitHub账户快速登录</p>

          <button @click="loginWithGitHub" class="btn btn-primary w-full" :disabled="loading">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span>{{ loading ? '登录中...' : '使用 GitHub 登录' }}</span>
          </button>

          <div class="mt-4 text-center">
            <p class="text-sm text-base-content/60">
              <span class="inline-flex items-center gap-1 text-warning">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd" />
                </svg>
                登录即表示同意获取您的用户名和头像信息
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
