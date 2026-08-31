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
  loadDemoProfiles: () => void
}

const STORAGE_KEY = 'biznex_business_profiles'
const ACTIVE_KEY = 'biznex_active_profile'
const SEED_KEY = 'biznex_seeded'

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

const SEED_PROFILES: BusinessProfile[] = [
  {
    id: 'seed-gaming-1',
    name: 'Pixel Arena Gaming Cafe',
    age: 24,
    gender: 'Male',
    category: 'General',
    businessType: 'Cyber Cafe',
    businessDescription: 'A premium gaming cafe with 20 high-end gaming PCs, PS5 stations, and VR setups. Located near a college hub with heavy foot traffic from students and young professionals. Offers hourly gaming sessions, tournaments, snacks, and streaming packages.',
    location: 'Koramangala, Bengaluru, Karnataka',
    radius: 5,
    investmentAmount: 1200000,
    monthlyIncome: 180000,
    existingLoans: 200000,
    workingCapital: 250000,
    equipmentCost: 600000,
    preferredLanguage: 'English',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed-startup-2',
    name: 'NovaTech Solutions',
    age: 29,
    gender: 'Female',
    category: 'General',
    businessType: 'Other',
    businessDescription: 'A software startup building SaaS products for small businesses — inventory management, billing, and customer analytics. Currently 5-member team, bootstrapped, with 3 paying clients. Planning to raise seed funding for product expansion.',
    location: 'Hitech City, Hyderabad, Telangana',
    radius: 20,
    investmentAmount: 800000,
    monthlyIncome: 120000,
    existingLoans: 0,
    workingCapital: 300000,
    equipmentCost: 250000,
    preferredLanguage: 'English',
    createdAt: new Date().toISOString(),
  },
]

const BusinessContext = createContext<BusinessContextType | undefined>(undefined)

export function BusinessProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<BusinessProfile[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
      // Seed 2 demo profiles on first load
      if (!localStorage.getItem(SEED_KEY)) {
        localStorage.setItem(SEED_KEY, 'true')
        return SEED_PROFILES
      }
      return []
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

  function loadDemoProfiles() {
    setProfiles(SEED_PROFILES)
    setActiveIdState(SEED_PROFILES[0].id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_PROFILES))
    localStorage.setItem(ACTIVE_KEY, SEED_PROFILES[0].id)
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
        loadDemoProfiles,
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
