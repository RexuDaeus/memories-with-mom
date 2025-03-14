"use client"

import { useState, useEffect } from 'react'
import { testFirebaseConnection, getFirebaseInfo } from '@/lib/firebase-debug'
import { useFirebase } from '@/components/firebase-provider'

export default function DebugPage() {
  const [connectionStatus, setConnectionStatus] = useState<string>('Unknown')
  const [isLoading, setIsLoading] = useState(false)
  const [firebaseInfo, setFirebaseInfo] = useState<any>(null)
  const { userId, isAuthenticated, isLoading: authLoading } = useFirebase()
  
  useEffect(() => {
    // Get Firebase initialization info
    const info = getFirebaseInfo()
    setFirebaseInfo(info)
  }, [])

  const handleTestConnection = async () => {
    setIsLoading(true)
    setConnectionStatus('Testing...')
    
    try {
      const result = await testFirebaseConnection()
      setConnectionStatus(result ? 'Connected successfully' : 'Connection failed')
    } catch (error) {
      setConnectionStatus(`Error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Firebase Debug Page</h1>
      
      <div className="mb-8 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Firebase Initialization</h2>
        {firebaseInfo && (
          <>
            <p className="mb-2">Status: {firebaseInfo.isInitialized ? 'Initialized' : 'Not initialized'}</p>
            <p className="mb-2">Message: {firebaseInfo.message}</p>
          </>
        )}
      </div>
      
      <div className="mb-8 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Authentication Status</h2>
        {authLoading ? (
          <p>Loading authentication state...</p>
        ) : (
          <>
            <p className="mb-2">User ID: {userId || 'Not authenticated'}</p>
            <p className="mb-2">Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
          </>
        )}
      </div>
      
      <div className="mb-8 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Connection Test</h2>
        <p className="mb-4">Status: {connectionStatus}</p>
        <button 
          onClick={handleTestConnection}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Test Connection'}
        </button>
      </div>
      
      <div className="mb-8 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Firebase Configuration</h2>
        <pre className="bg-gray-200 dark:bg-gray-700 p-4 rounded overflow-auto text-sm">
          {`// Current Firebase configuration:
{
  apiKey: "AIzaSyCY3fKv1J4aNyO_MiRypjWWGx9tqbdZJWQ",
  authDomain: "memories-with-mom.firebaseapp.com",
  projectId: "memories-with-mom",
  storageBucket: "memories-with-mom.appspot.com",
  messagingSenderId: "342583074565",
  appId: "1:342583074565:web:7bafec02d0d3e3f23e8e26"
}`}
        </pre>
        <p className="mt-4 text-red-500">
          Note: This configuration may not be valid if the Firebase project hasn't been created yet or if it was created with different credentials.
        </p>
      </div>
      
      <div className="mb-8 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Setup Instructions</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Create a new Firebase project at <a href="https://console.firebase.google.com" target="_blank" className="text-blue-500 hover:underline">console.firebase.google.com</a></li>
          <li>Once created, add a Web App to the project</li>
          <li>Copy the Firebase config from the Web App and update the config in <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">lib/firebase.ts</code></li>
          <li>Enable Firestore Database and Authentication in the Firebase console</li>
          <li>Update Firestore rules to allow read/write access for authenticated users</li>
        </ol>
      </div>
    </div>
  )
} 