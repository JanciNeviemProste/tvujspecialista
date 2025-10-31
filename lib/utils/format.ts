export function formatDate(date: Date | string, locale: string = 'cs'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale === 'cs' ? 'cs-CZ' : 'sk-SK', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d)
}

export function formatDateTime(date: Date | string, locale: string = 'cs'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale === 'cs' ? 'cs-CZ' : 'sk-SK', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function formatPrice(amount: number, locale: string = 'cs'): string {
  return new Intl.NumberFormat(locale === 'cs' ? 'cs-CZ' : 'sk-SK', {
    style: 'currency',
    currency: 'CZK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatPhone(phone: string): string {
  // Format +420 XXX XXX XXX
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('420')) {
    const number = cleaned.substring(3)
    return `+420 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`
  }
  return phone
}

export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

export function pluralize(
  count: number,
  one: string,
  few: string,
  many: string,
  locale: string = 'cs'
): string {
  if (count === 1) return one
  if (locale === 'cs' && count >= 2 && count <= 4) return few
  return many
}

// Example: pluralize(5, 'recenze', 'recenze', 'recenzí') => '5 recenzí'
export function formatReviewCount(count: number, locale: string = 'cs'): string {
  if (locale === 'cs') {
    return `${count} ${pluralize(count, 'recenze', 'recenze', 'recenzí', locale)}`
  }
  return `${count} ${pluralize(count, 'recenzia', 'recenzie', 'recenzií', locale)}`
}
