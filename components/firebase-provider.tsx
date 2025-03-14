'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { getOrCreateUserId } from '@/lib/firebase'

// Define context type
interface FirebaseContextType {
  userId: string | null
  isLoading: boolean
  isAuthenticated: boolean
  error: Error | null
}

// Create context with default values
const FirebaseContext = createContext<FirebaseContextType>({
  userId: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
})

// Hook to use the Firebase context
export const useFirebase = () => useContext(FirebaseContext)

// Provider component
export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Try to get or create user ID
        const uid = await getOrCreateUserId()
        setUserId(uid)
        setIsLoading(false)
      } catch (err) {
        console.error('Failed to initialize auth:', err)
        setError(err instanceof Error ? err : new Error('Unknown authentication error'))
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  // Value that will be provided to consumers
  const contextValue: FirebaseContextType = {
    userId,
    isLoading,
    isAuthenticated: !!userId,
    error,
  }

  return (
    <FirebaseContext.Provider value={contextValue}>
      {children}
    </FirebaseContext.Provider>
  )
} 