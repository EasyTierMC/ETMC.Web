import { ref, onMounted, onUnmounted } from 'vue'
import { isAuthenticated, getProfile, logout, ensureProfile } from '@/utils/request/api'

export interface UserInfo {
  login?: string
  avatar_url?: string
  role?: string
}

export function useAuth() {
  const isLoggedIn = ref(false)
  const userInfo = ref<UserInfo | null>(null)
  const loading = ref(true)

  async function checkAuth() {
    loading.value = true
    
    const profile = await ensureProfile()
    
    if (profile) {
      isLoggedIn.value = true
      userInfo.value = profile
    } else {
      isLoggedIn.value = false
      userInfo.value = null
    }
    
    loading.value = false
  }

  function handleLogout() {
    logout()
    isLoggedIn.value = false
    userInfo.value = null
    window.location.href = '/login'
  }

  onMounted(() => {
    checkAuth()
    window.addEventListener('storage', checkAuth)
  })

  onUnmounted(() => {
    window.removeEventListener('storage', checkAuth)
  })

  return { isLoggedIn, userInfo, loading, checkAuth, handleLogout }
}
