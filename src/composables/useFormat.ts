export function formatDate(dateStr: string | Date | null | undefined): string {
  if (!dateStr) return '-'
  const date = dateStr instanceof Date ? dateStr : new Date(dateStr)
  return date.toLocaleString('zh-CN')
}

export function formatDateShort(date: Date): string {
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function calculateLoadScore(max: number, current: number): number {
  return max === 0 ? 0 : Math.min((current / max) * 100, 100)
}

export function getLoadScoreColor(score: number): string {
  return score < 30 ? 'text-success' : score < 70 ? 'text-warning' : 'text-error'
}

export function getLoadScoreBarColor(score: number): string {
  return score < 30 ? 'bg-success' : score < 70 ? 'bg-warning' : 'bg-error'
}

export function copyToClipboard(text: string): void {
  navigator.clipboard.writeText(text)
}
