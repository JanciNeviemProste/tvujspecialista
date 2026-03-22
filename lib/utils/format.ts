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

const monthNamesByLocale: Record<string, string[]> = {
  cs: ['ledna', 'února', 'března', 'dubna', 'května', 'června', 'července', 'srpna', 'září', 'října', 'listopadu', 'prosince'],
  sk: ['januára', 'februára', 'marca', 'apríla', 'mája', 'júna', 'júla', 'augusta', 'septembra', 'októbra', 'novembra', 'decembra'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  pl: ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'],
}

const monthNamesShortByLocale: Record<string, string[]> = {
  cs: ['led', 'úno', 'bře', 'dub', 'kvě', 'čvn', 'čvc', 'srp', 'zář', 'říj', 'lis', 'pro'],
  sk: ['jan', 'feb', 'mar', 'apr', 'máj', 'jún', 'júl', 'aug', 'sep', 'okt', 'nov', 'dec'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  pl: ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'],
}

export function formatDatePattern(date: string | Date, formatStr: string = 'DD. MM. YYYY', locale: string = 'cs'): string {
  const d = typeof date === 'string' ? new Date(date) : date

  const day = d.getDate()
  const month = d.getMonth() + 1
  const year = d.getFullYear()
  const hours = d.getHours()
  const minutes = d.getMinutes()

  const pad = (n: number) => n.toString().padStart(2, '0')

  const monthNames = monthNamesByLocale[locale] || monthNamesByLocale['cs']
  const monthNamesShort = monthNamesShortByLocale[locale] || monthNamesShortByLocale['cs']

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
