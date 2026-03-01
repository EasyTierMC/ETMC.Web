import { ref } from 'vue'

export function useAsync<T = any>() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function execute(fn: () => Promise<T>): Promise<T | undefined> {
    loading.value = true
    error.value = null
    try {
      return await fn()
    } catch (e: any) {
      error.value = e.message || String(e)
      return undefined
    } finally {
      loading.value = false
    }
  }

  return { loading, error, execute }
}

export function useConfirm() {
  function confirmAction(message: string): boolean {
    return confirm(message)
  }
  return { confirmAction }
}

export function useAlert() {
  function showAlert(message: string) {
    alert(message)
  }
  return { showAlert }
}
