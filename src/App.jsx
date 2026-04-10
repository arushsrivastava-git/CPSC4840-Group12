import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom'
import Navbar from './components/Navbar'
import Browse from './pages/Browse'
import Auth from './pages/Auth'
import CreateListing from './pages/CreateListing'
import MyListings from './pages/MyListings'
import Messages from './pages/Messages'
import Account from './pages/Account'
import './App.css'
import { backend } from './mockBackend'
import { pickActiveById } from './utils/helpers'

function BootScreen() {
  return (
    <main className="boot-screen">
      <div className="boot-screen__card">
        <span className="boot-screen__logo">LOGO</span>
        <p>Loading high-fidelity prototype…</p>
      </div>
    </main>
  )
}

// Edit Listing Route Component
function EditListingRoute({ profile, listings, onSubmit, isLoading }) {
  const { id } = useParams()
  const listing = listings.find(l => l.id === id)
  
  return (
    <CreateListing 
      profile={profile}
      listing={listing}
      onSubmit={onSubmit}
      isLoading={isLoading}
      mode="edit"
    />
  )
}

// Protected Route component
function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/auth?mode=signin" replace />
  }
  return children
}

function AppContent() {
  const navigate = useNavigate()
  
  // State management
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [listings, setListings] = useState([])
  const [threads, setThreads] = useState([])
  const [chatLog, setChatLog] = useState({})
  
  const [activeThreadId, setActiveThreadId] = useState(null)
  const [chatDraft, setChatDraft] = useState('')
  
  const [isBooting, setIsBooting] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [notice, setNotice] = useState('')
  const [pendingVerification, setPendingVerification] = useState({ email: '', devCode: '' })
  const [pendingRegistrationData, setPendingRegistrationData] = useState(null)

  // Helper functions
  const hydrateFromSnapshot = (snapshot) => {
    if (snapshot.auth?.signedIn) {
      setUser(snapshot.auth)
      setProfile(snapshot.user)
    } else {
      setUser(null)
      setProfile(null)
    }
    
    setListings(snapshot.listings || [])
    setThreads(snapshot.threads || [])
    setChatLog(snapshot.messages || {})

    setActiveThreadId((current) => {
      if (snapshot.threads?.some((thread) => thread.id === current)) {
        return current
      }
      return snapshot.threads?.[0]?.id || null
    })
  }

  const runSnapshotTask = async (task, successMessage = '') => {
    setIsLoading(true)

    try {
      const snapshot = await task()
      hydrateFromSnapshot(snapshot)
      if (successMessage) {
        setNotice(successMessage)
      }
      return { success: true, data: snapshot }
    } catch (error) {
      setNotice(error.message || 'Request failed.')
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  // Initialize app
  useEffect(() => {
    let alive = true

    const bootstrap = async () => {
      setIsBooting(true)

      try {
        // Check if user was previously signed in
        const savedSession = localStorage.getItem('userSession')
        const savedProfile = localStorage.getItem('userProfile')
        const wasSignedIn = savedSession ? JSON.parse(savedSession) : null
        const savedProfileData = savedProfile ? JSON.parse(savedProfile) : null

        const snapshot = await backend.bootstrap()
        if (!alive) return

        // If we had a saved session, restore it
        if (wasSignedIn?.signedIn && savedProfileData) {
          snapshot.auth = wasSignedIn
          snapshot.user = savedProfileData
        }

        hydrateFromSnapshot(snapshot)
      } catch {
        if (alive) {
          setNotice('Failed to bootstrap local backend.')
        }
      } finally {
        if (alive) {
          setIsBooting(false)
        }
      }
    }

    bootstrap()

    return () => {
      alive = false
    }
  }, [])

  // Persist session
  useEffect(() => {
    if (user?.signedIn) {
      localStorage.setItem('userSession', JSON.stringify(user))
      localStorage.setItem('userProfile', JSON.stringify(profile))
    } else {
      localStorage.removeItem('userSession')
      localStorage.removeItem('userProfile')
    }
  }, [user, profile])

  // Auto-clear notices
  useEffect(() => {
    if (!notice) return

    const timerId = setTimeout(() => {
      setNotice('')
    }, 2600)

    return () => clearTimeout(timerId)
  }, [notice])

  // Auth handlers
  const handleSignIn = async (data) => {
    return await runSnapshotTask(() => backend.signIn(data), 'Signed in successfully.')
  }

  const handleCreateAccount = async (data) => {
    setIsLoading(true)
    try {
      const response = await backend.createAccount(data)
      setNotice(response.message)
      setPendingRegistrationData(data)
      setPendingVerification({
        email: response.email || data.email || '',
        devCode: response.devVerificationCode || '',
      })
      return { success: true }
    } catch (error) {
      setNotice(error.message || 'Unable to create account.')
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyEmail = async (data) => {
    const result = await runSnapshotTask(
      () => backend.verifyUniversityEmail({ ...data, profileData: pendingRegistrationData }),
      'Email verified and signed in.',
    )

    if (result.success) {
      setPendingRegistrationData(null)
      setPendingVerification({ email: '', devCode: '' })
    }
    
    return result
  }

  const handleSignOut = async () => {
    return await runSnapshotTask(() => backend.signOut(), 'Signed out.')
  }

  // Listing handlers
  const handleCreateListing = async (payload, editId) => {
    const mode = editId ? 'edit' : 'create'
    return await runSnapshotTask(
      () => backend.upsertListing({
        mode,
        listingId: editId,
        payload,
        actorUserId: user?.userId || null,
      }),
      mode === 'edit' ? 'Listing updated.' : 'Listing published.',
    )
  }

  // Message handlers
  const activeThread = pickActiveById(threads, activeThreadId)
  const activeMessages = activeThread ? chatLog[activeThread.id] || [] : []

  const handleSelectThread = async (threadId) => {
    setActiveThreadId(threadId)
    await runSnapshotTask(() => backend.markThreadRead(threadId))
  }

  const handleSendMessage = async () => {
    const text = chatDraft.trim()
    if (!text || !activeThread) return

    setChatDraft('')
    return await runSnapshotTask(() => backend.sendMessage(activeThread.id, text))
  }

  const handleMarkThreadRead = async (threadId) => {
    return await runSnapshotTask(() => backend.markThreadRead(threadId))
  }

  if (isBooting) {
    return <BootScreen />
  }

  return (
    <>
      <Navbar 
        user={user} 
        onProfileClick={() => navigate('/account')}
        onSignOut={handleSignOut} 
      />
      
      <Routes>
        <Route 
          path="/" 
          element={
            <Browse 
              listings={listings}
              user={user}
              onOpenThread={handleSelectThread}
              onMarkThreadRead={handleMarkThreadRead}
            />
          } 
        />
        
        <Route 
          path="/auth" 
          element={
            <Auth 
              onSignIn={handleSignIn}
              onCreateAccount={handleCreateAccount}
              onVerifyEmail={handleVerifyEmail}
              pendingVerification={pendingVerification}
              isLoading={isLoading}
            />
          } 
        />
        
        <Route 
          path="/create-listing" 
          element={
            <ProtectedRoute user={user}>
              <CreateListing 
                profile={profile}
                onSubmit={handleCreateListing}
                isLoading={isLoading}
                mode="create"
              />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/edit-listing/:id" 
          element={
            <ProtectedRoute user={user}>
              <EditListingRoute 
                profile={profile}
                listings={listings}
                onSubmit={handleCreateListing}
                isLoading={isLoading}
              />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/my-listings" 
          element={
            <ProtectedRoute user={user}>
              <MyListings 
                listings={listings}
                currentUserId={user?.userId || null}
                currentProfile={profile}
              />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/messages" 
          element={
            <ProtectedRoute user={user}>
              <Messages 
                threads={threads}
                activeThread={activeThread}
                messages={activeMessages}
                chatDraft={chatDraft}
                onSelectThread={handleSelectThread}
                onChatDraftChange={setChatDraft}
                onSend={handleSendMessage}
              />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/account" 
          element={
            <ProtectedRoute user={user}>
              <Account 
                profile={profile}
                onSignOut={handleSignOut}
                isLoading={isLoading}
              />
            </ProtectedRoute>
          } 
        />
      </Routes>

      {isLoading && (
        <div className="loading-indicator" aria-live="polite" aria-label="Loading">
          <span className="loading-indicator__spinner" aria-hidden="true" />
        </div>
      )}

      {notice && <div className="floating-notice">{notice}</div>}
    </>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
