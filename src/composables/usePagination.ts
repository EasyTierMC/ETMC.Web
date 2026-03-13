import { ref, computed, watch, type Ref, type ComputedRef } from 'vue'

export interface PaginationOptions {
  defaultPage?: number
  defaultPageSize?: number
  pageSizeOptions?: number[]
}

export function usePagination(
  totalItems: Ref<number> | ComputedRef<number>,
  options: PaginationOptions = {}
) {
  const {
    defaultPage = 0,
    defaultPageSize = 20,
    pageSizeOptions = [10, 20, 30, 50, 100]
  } = options

  const page = ref(defaultPage)
  const pageSize = ref(defaultPageSize)

  const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value))
  const offset = computed(() => page.value * pageSize.value)

  function goToPage(p: number) {
    page.value = Math.max(0, Math.min(p, totalPages.value - 1))
  }

  function nextPage() {
    if (page.value < totalPages.value - 1) page.value++
  }

  function prevPage() {
    if (page.value > 0) page.value--
  }

  function reset() {
    page.value = 0
  }

  return {
    page,
    pageSize,
    pageSizeOptions,
    totalPages,
    offset,
    goToPage,
    nextPage,
    prevPage,
    reset
  }
}
