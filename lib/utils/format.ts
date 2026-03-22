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

/**
 * Format date with a pattern string (legacy support from dateFormat.ts)
 * Supported patterns: 'DD. MM. YYYY', 'd. MMM yyyy', 'd. MMMM yyyy', 'HH:mm', 'DD. MM. YYYY HH:mm'
 */
export function formatDatePattern(date: string | Date, formatStr: string = 'DD. MM. YYYY'): string {
  const d = typeof date === 'string' ? new Date(date) : date

  const day = d.getDate()
  const month = d.getMonth() + 1
  const year = d.getFullYear()
  const hours = d.getHours()
  const minutes = d.getMinutes()

  const pad = (n: number) => n.toString().padStart(2, '0')

  const monthNames = [
    'ledna', 'února', 'března', 'dubna', 'května', 'června',
    'července', 'srpna', 'září', 'října', 'listopadu', 'prosince'
  ]

  const monthNamesShort = [
    'led', 'úno', 'bře', 'dub', 'kvě', 'čvn',
    'čvc', 'srp', 'zář', 'říj', 'lis', 'pro'
  ]

  if (formatStr === 'DD. MM. YYYY') {
    return `${pad(day)}. ${pad(month)}. ${year}`
  }

  if (formatStr === 'd. MMM yyyy') {
    return `${day}. ${monthNamesShort[month - 1]} ${year}`
  }

  if (formatStr === 'd. MMMM yyyy') {
    return `${day}. ${monthNames[month - 1]} ${year}`
  }

  if (formatStr === 'HH:mm') {
    return `${pad(hours)}:${pad(minutes)}`
  }

  if (formatStr === 'DD. MM. YYYY HH:mm') {
    return `${pad(day)}. ${pad(month)}. ${year} ${pad(hours)}:${pad(minutes)}`
  }

  // Default fallback
  return d.toLocaleDateString('cs-CZ')
}

/**
 * Get relative time string (e.g., "pred 2 hodinami")
 */
export function getRelativeTime(date: string | Date): string {
  const now = new Date()
  const past = typeof date === 'string' ? new Date(date) : date
  const diffInMs = now.getTime() - past.getTime()
  const diffInMins = Math.floor(diffInMs / 60000)
  const diffInHours = Math.floor(diffInMs / 3600000)
  const diffInDays = Math.floor(diffInMs / 86400000)

  if (diffInMins < 1) {
    return 'právě teď'
  } else if (diffInMins < 60) {
    return `před ${diffInMins} ${diffInMins === 1 ? 'minutou' : diffInMins < 5 ? 'minutami' : 'minutami'}`
  } else if (diffInHours < 24) {
    return `před ${diffInHours} ${diffInHours === 1 ? 'hodinou' : diffInHours < 5 ? 'hodinami' : 'hodinami'}`
  } else if (diffInDays === 1) {
    return 'včera'
  } else if (diffInDays < 7) {
    return `před ${diffInDays} dny`
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7)
    return `před ${weeks} ${weeks === 1 ? 'týdnem' : 'týdny'}`
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30)
    return `před ${months} ${months === 1 ? 'měsícem' : 'měsíci'}`
  } else {
    const years = Math.floor(diffInDays / 365)
    return `před ${years} ${years === 1 ? 'rokem' : 'roky'}`
  }
}

// Format duration in minutes to human readable format
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}min`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
}

// Format time in seconds to MM:SS or HH:MM:SS
export function formatVideoTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
