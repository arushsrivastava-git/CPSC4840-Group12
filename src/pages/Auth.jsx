import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { CREATE_INTENTS } from '../utils/constants'

export default function Auth({ 
  onSignIn, 
  onCreateAccount, 
  onVerifyEmail, 
  pendingVerification,
  isLoading 
}) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const mode = searchParams.get('mode') || 'signin' // signin, register, verify

  const [createForm, setCreateForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    intent: CREATE_INTENTS[0].label,
  })

  const [signInForm, setSignInForm] = useState({
    email: '',
    password: '',
  })

  const [verifyForm, setVerifyForm] = useState({
    email: '',
    code: '',
  })

  const verifyEmailValue = verifyForm.email || pendingVerification?.email || ''

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    if (mode === 'register') {
      const result = await onCreateAccount?.(createForm)
      if (result?.success) {
        navigate('/auth?mode=verify')
      }
    } else if (mode === 'verify') {
      const result = await onVerifyEmail?.(verifyForm)
      if (result?.success) {
        navigate('/account')
      }
    } else {
      const result = await onSignIn?.(signInForm)
      if (result?.success) {
        navigate('/')
      }
    }
  }

  return (
    <div className="board board--auth">
      <section className="auth-body">
        <div className="auth-panel">
          <div className="auth-switcher">
            <button
              type="button"
              className={mode === 'register' ? 'auth-switcher__active' : ''}
              onClick={() => navigate('/auth?mode=register')}
            >
              Create Account
            </button>
            <button
              type="button"
              className={mode === 'signin' ? 'auth-switcher__active' : ''}
              onClick={() => navigate('/auth?mode=signin')}
            >
              Sign In
            </button>
          </div>

          {mode === 'register' ? (
            <form className="auth-form" onSubmit={handleSubmit}>
              <h2>Create Account</h2>

              <label>
                First Name
                <input
                  type="text"
                  required
                  value={createForm.firstName}
                  onChange={(event) => setCreateForm((prev) => ({ ...prev, firstName: event.target.value }))}
                />
              </label>

              <label>
                Last Name
                <input
                  type="text"
                  required
                  value={createForm.lastName}
                  onChange={(event) => setCreateForm((prev) => ({ ...prev, lastName: event.target.value }))}
                />
              </label>

              <label>
                University Email (must end in .edu)
                <input
                  type="email"
                  required
                  pattern=".*\.edu$"
                  value={createForm.email}
                  onChange={(event) => setCreateForm((prev) => ({ ...prev, email: event.target.value }))}
                />
              </label>

              <small>A verification code will be sent to this address</small>

              <label>
                Password
                <input
                  type="password"
                  required
                  minLength={6}
                  value={createForm.password}
                  onChange={(event) => setCreateForm((prev) => ({ ...prev, password: event.target.value }))}
                />
              </label>

              <label>
                Confirm Password
                <input
                  type="password"
                  required
                  value={createForm.confirmPassword}
                  onChange={(event) =>
                    setCreateForm((prev) => ({ ...prev, confirmPassword: event.target.value }))
                  }
                />
              </label>

              <p className="auth-role-label">I am looking to...</p>

              <div className="auth-role-grid">
                {CREATE_INTENTS.map((intent) => (
                  <button
                    key={intent.label}
                    type="button"
                    className={`auth-role-card ${createForm.intent === intent.label ? 'auth-role-card--active' : ''}`}
                    onClick={() => setCreateForm((prev) => ({ ...prev, intent: intent.label }))}
                  >
                    <strong>{intent.label}</strong>
                    <span>{intent.helper}</span>
                  </button>
                ))}
              </div>

              <button
                className="auth-submit"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Verification Code →'}
              </button>
            </form>
          ) : mode === 'verify' ? (
            <form className="auth-form auth-form--verify" onSubmit={handleSubmit}>
              <h2>Verify Email Account</h2>
              <p className="auth-verify-copy">
                We sent a 6-digit verification code to your university email. Enter it below to activate your account.
              </p>

              <label>
                University Email
                <input
                  type="email"
                  required
                  value={verifyEmailValue}
                  onChange={(event) => setVerifyForm((prev) => ({ ...prev, email: event.target.value }))}
                />
              </label>

              <label>
                Verification Code
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  value={verifyForm.code}
                  onChange={(event) => setVerifyForm((prev) => ({ ...prev, code: event.target.value }))}
                />
              </label>

              {pendingVerification?.devCode ? (
                <small className="auth-dev-note">
                  Prototype email preview code: {pendingVerification.devCode}
                </small>
              ) : null}

              <button
                className="auth-submit"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Verifying...' : 'Verify Email →'}
              </button>
            </form>
          ) : (
            <form className="auth-form auth-form--sign-in" onSubmit={handleSubmit}>
              <h2>Sign In</h2>

              <label>
                Email Address
                <input
                  type="email"
                  required
                  value={signInForm.email}
                  onChange={(event) => setSignInForm((prev) => ({ ...prev, email: event.target.value }))}
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  required
                  value={signInForm.password}
                  onChange={(event) => setSignInForm((prev) => ({ ...prev, password: event.target.value }))}
                />
              </label>

              <button
                className="auth-submit"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In →'}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}