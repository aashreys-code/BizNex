import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import supabase from '../lib/supabase'

const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
)

interface UserProfile {
  id: string
  name: string
  email: string
  mobile: string
  village: string
  district: string
  state: string
  language: string
  role: 'user' | 'admin'
  created_at: string
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  loading: boolean
  isAdmin: boolean
  isSupabaseConfigured: boolean
  signUp: (data: {
    email: string
    password: string
    name: string
    mobile: string
    village: string
    district: string
    state: string
    language: string
  }) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    }).catch(() => {
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        // Create a default profile if none exists
        const { data: newProfile } = await supabase
          .from('profiles')
          .upsert({
            id: userId,
            name: user?.user_metadata?.name || 'User',
            email: user?.email || '',
            role: 'user',
          })
          .select()
          .single()
        setProfile(newProfile)
      } else {
        setProfile(data)
      }
    } catch (err) {
      console.error('Profile fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  async function refreshProfile() {
    if (user) {
      await fetchProfile(user.id)
    }
  }

  async function signUp(data: {
    email: string
    password: string
    name: string
    mobile: string
    village: string
    district: string
    state: string
    language: string
  }) {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          mobile: data.mobile,
        },
      },
    })

    if (!error) {
      // Create profile
      const { data: authData } = await supabase.auth.getUser()
      if (authData.user) {
        await supabase.from('profiles').upsert({
          id: authData.user.id,
          name: data.name,
          email: data.email,
          mobile: data.mobile,
          village: data.village,
          district: data.district,
          state: data.state,
          language: data.language,
          role: 'user',
        })
      }
    }

    return { error }
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setSession(null)
  }

  const isAdmin = profile?.role === 'admin'

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        isAdmin,
        isSupabaseConfigured,
        signUp,
        signIn,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
