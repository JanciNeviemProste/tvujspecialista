export * from './specialist'
export * from './review'
export * from './lead'
export * from './user'
export * from './subscriptions'
export * from './academy'
export * from './deals'
export * from './commissions'
export * from './community'

export interface Category {
  id: string
  name: string
  nameCs: string
  nameSk: string
  slug: string
  icon: string
  description?: string
}

export interface Location {
  id: string
  name: string
  region: string
  slug: string
}

export type Locale = 'cs' | 'sk'
