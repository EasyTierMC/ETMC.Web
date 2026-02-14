<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref, onMounted } from 'vue'
import { isAuthenticated, getProfile, logout } from '@/utils/request/api'

const year = new Date().getFullYear()
const isLoggedIn = ref(false)
const userInfo = ref<{ login?: string; avatar_url?: string } | null>(null)

onMounted(async () => {
  isLoggedIn.value = await isAuthenticated()
  
  if (isLoggedIn.value) {
    try {
      const userData = await getProfile();
      if(!userData) return;
      userInfo.value = userData.data
    } catch (error) {
      console.error('Failed to fetch user info:', error)
    }
  }else{
    logout(); //防止cookie没了用户数据还在
  }
  
  // Re-check auth status on storage changes
  window.addEventListener('storage', async () => {
    isLoggedIn.value = await isAuthenticated()
    if (isLoggedIn.value) {
      try {
        const userData = await getProfile()
        if(!userData) return;
        userInfo.value = userData.data
      } catch (error) {
        console.error('Failed to fetch user info:', error)
      }
    } else {
      logout(); //防止cookie没了用户数据还在
      userInfo.value = null
    }
  })
})

const handleLogout = () => {
  logout()
  isLoggedIn.value = false
  userInfo.value = null
  window.location.href = '/login'
}
</script>

<template>
  <div class="layout">
    <header class="navbar bg-base-100 shadow-md">
      <div class="navbar-start">
        <div class="flex-1">
          <h1 class="btn btn-ghost normal-case text-2xl font-bold">EasyTierMC Uptime</h1>
        </div>
      </div>
      
      <!-- 用户信息显示在正中心 -->
      <div class="navbar-center" v-if="isLoggedIn && userInfo">
        <div class="flex items-center gap-3 px-4 py-2">
          <div class="avatar">
            <div class="w-8 h-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img 
                :src="userInfo.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.login || 'User')}&background=random`" 
                :alt="userInfo.login || 'User'"
              />
            </div>
          </div>
          <span class="font-medium text-sm">{{ userInfo.login || '用户' }}</span>
          <div class="dropdown dropdown-end">
            <label tabindex="0" class="btn btn-ghost btn-circle btn-xs">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </label>
            <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
              <li><RouterLink to="/dashboard" class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                管理控制台
              </RouterLink></li>
              <li><button @click="handleLogout" class="flex items-center gap-2 text-error">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                退出登录
              </button></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class="navbar-end lg:flex">
        <ul class="menu menu-horizontal px-1 gap-2">
          <li><RouterLink to="/" class="btn btn-ghost">主页</RouterLink></li>
          <li><RouterLink to="/monitor" class="btn btn-ghost">节点监控</RouterLink></li>
          <li><RouterLink to="/submit" class="btn btn-ghost">提交节点</RouterLink></li>
          <li v-if="!isLoggedIn"><RouterLink to="/login" class="btn btn-ghost">登录</RouterLink></li>
        </ul>
      </div>
    </header>
    <main class="flex-1">
      <RouterView />
    </main>
    <footer class="footer footer-center bg-base-200 text-base-content p-4 border-t">
      <div>
        <small>© {{ year }} EasyTierMC Uptime</small>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  flex-shrink: 0;
}

main {
  flex: 1;
  padding: 1.25rem 1.5rem 2rem;
}

footer {
  flex-shrink: 0;
}

@media (min-width: 1024px) {
  main { 
    padding: 1.75rem 2rem 2.5rem; 
  }
}
</style>
