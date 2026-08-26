import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface BusinessProfile {
  // Personal
  age: number
  gender: string
  category: string // General / SC / ST / OBC / Minority / Women

  // Business
  businessType: string
  businessDescription: string
  location: string // district, state
  radius: number // search radius in km for competitors

  // Financial
  investmentAmount: number
  monthlyIncome: number
  existingLoans: number
  workingCapital: number
  equipmentCost: number

  // Preferences
  preferredLanguage: string
}

interface BusinessContextType {
  business: BusinessProfile | null
  isComplete: boolean
  setBusiness: (data: BusinessProfile) => void
  clearBusiness: () => void
}

const DEFAULT: BusinessProfile = {
  age: 30,
  gender: 'Male',
  category: 'General',
  businessType: '',
  businessDescription: '',
  location: '',
  radius: 10,
  investmentAmount: 0,
  monthlyIncome: 0,
  existingLoans: 0,
  workingCapital: 0,
  equipmentCost: 0,
  preferredLanguage: 'English',
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined)

const STORAGE_KEY = 'bizpulse_business_profile'

export function BusinessProvider({ children }: { children: ReactNode }) {
  const [business, setBusinessState] = useState<BusinessProfile | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (business) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(business))
    }
  }, [business])

  function setBusiness(data: BusinessProfile) {
    setBusinessState(data)
  }

  function clearBusiness() {
    setBusinessState(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const isComplete = Boolean(
    business &&
    business.businessType &&
    business.location &&
    business.investmentAmount > 0
  )

  return (
    <BusinessContext.Provider value={{ business, isComplete, setBusiness, clearBusiness }}>
      {children}
    </BusinessContext.Provider>
  )
}

export function useBusiness() {
  const context = useContext(BusinessContext)
  if (context === undefined) {
    throw new Error('useBusiness must be used within a BusinessProvider')
  }
  return context
}

export { DEFAULT }
