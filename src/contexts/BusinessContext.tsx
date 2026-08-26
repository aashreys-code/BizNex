import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface BusinessProfile {
  id: string
  name: string // user-given label like "My Grocery Store"
  // Personal
  age: number
  gender: string
  category: string

  // Business
  businessType: string
  businessDescription: string
  location: string
  radius: number

  // Financial
  investmentAmount: number
  monthlyIncome: number
  existingLoans: number
  workingCapital: number
  equipmentCost: number

  // Preferences
  preferredLanguage: string
  createdAt: string
}

interface BusinessContextType {
  profiles: BusinessProfile[]
  activeId: string | null
  business: BusinessProfile | null // currently active profile
  isComplete: boolean
  addProfile: (data: Omit<BusinessProfile, 'id' | 'createdAt'>) => BusinessProfile
  updateProfile: (id: string, data: Partial<BusinessProfile>) => void
  deleteProfile: (id: string) => void
  setActiveId: (id: string) => void
}

const STORAGE_KEY = 'bizpulse_business_profiles'
const ACTIVE_KEY = 'bizpulse_active_profile'

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined)

export function BusinessProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<BusinessProfile[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  const [activeId, setActiveIdState] = useState<string | null>(() => {
    return localStorage.getItem(ACTIVE_KEY)
  })

  // Persist profiles
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles))
  }, [profiles])

  // Persist active ID
  useEffect(() => {
    if (activeId) localStorage.setItem(ACTIVE_KEY, activeId)
    else localStorage.removeItem(ACTIVE_KEY)
  }, [activeId])

  // Auto-select first profile if none active
  useEffect(() => {
    if (profiles.length > 0 && !profiles.find((p) => p.id === activeId)) {
      setActiveIdState(profiles[0].id)
    }
  }, [profiles, activeId])

  const business = profiles.find((p) => p.id === activeId) ?? null

  const isComplete = Boolean(
    business &&
    business.businessType &&
    business.location &&
    business.investmentAmount > 0
  )

  function addProfile(data: Omit<BusinessProfile, 'id' | 'createdAt'>): BusinessProfile {
    const newProfile: BusinessProfile = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }
    setProfiles((prev) => [...prev, newProfile])
    setActiveIdState(newProfile.id)
    return newProfile
  }

  function updateProfile(id: string, data: Partial<BusinessProfile>) {
    setProfiles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data } : p))
    )
  }

  function deleteProfile(id: string) {
    setProfiles((prev) => {
      const next = prev.filter((p) => p.id !== id)
      if (activeId === id) {
        setActiveIdState(next.length > 0 ? next[0].id : null)
      }
      return next
    })
  }

  function setActiveId(id: string) {
    setActiveIdState(id)
  }

  return (
    <BusinessContext.Provider
      value={{
        profiles,
        activeId,
        business,
        isComplete,
        addProfile,
        updateProfile,
        deleteProfile,
        setActiveId,
      }}
    >
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
