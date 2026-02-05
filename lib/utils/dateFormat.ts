/**
 * Format date to Slovak locale
 * @param date - Date string or Date object
 * @param formatStr - Format string (DD. MM. YYYY, HH:mm, etc.)
 * @returns Formatted date string
 */
export function formatDate(date: string | Date, formatStr: string = 'DD. MM. YYYY'): string {
  const d = typeof date === 'string' ? new Date(date) : date

  const day = d.getDate()
  const month = d.getMonth() + 1
  const year = d.getFullYear()
  const hours = d.getHours()
  const minutes = d.getMinutes()

  const pad = (n: number) => n.toString().padStart(2, '0')

  // Month names in Slovak
  const monthNames = [
    'január', 'február', 'marec', 'apríl', 'máj', 'jún',
    'júl', 'august', 'september', 'október', 'november', 'december'
  ]

  const monthNamesShort = [
    'jan', 'feb', 'mar', 'apr', 'máj', 'jún',
    'júl', 'aug', 'sep', 'okt', 'nov', 'dec'
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
  return d.toLocaleDateString('sk-SK')
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
    return 'práve teraz'
  } else if (diffInMins < 60) {
    return `pred ${diffInMins} ${diffInMins === 1 ? 'minútou' : diffInMins < 5 ? 'minútami' : 'minútami'}`
  } else if (diffInHours < 24) {
    return `pred ${diffInHours} ${diffInHours === 1 ? 'hodinou' : diffInHours < 5 ? 'hodinami' : 'hodinami'}`
  } else if (diffInDays === 1) {
    return 'včera'
  } else if (diffInDays < 7) {
    return `pred ${diffInDays} dňami`
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7)
    return `pred ${weeks} ${weeks === 1 ? 'týždňom' : 'týždňami'}`
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30)
    return `pred ${months} ${months === 1 ? 'mesiacom' : 'mesiacmi'}`
  } else {
    const years = Math.floor(diffInDays / 365)
    return `pred ${years} ${years === 1 ? 'rokom' : 'rokmi'}`
  }
}
