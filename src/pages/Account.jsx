import { useNavigate } from 'react-router-dom'

function ProfileIcon() {
  return (
    <span className="profile-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" role="presentation">
        <circle cx="12" cy="8" r="4" />
        <path d="M4.5 19.5c1.6-3.6 4.5-5.5 7.5-5.5s5.9 1.9 7.5 5.5" />
      </svg>
    </span>
  )
}

export default function Account({ 
  profile, 
  onSignOut, 
  isLoading 
}) {
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await onSignOut?.()
    navigate('/')
  }

  if (!profile) {
    return (
      <div className="board board--account">
        <section className="account-body">
          <h1>My Account</h1>
          <p>Loading profile...</p>
        </section>
      </div>
    )
  }

  return (
    <div className="board board--account">
      <section className="account-body">
        <h1>My Account</h1>

        <div className="account-grid">
          <article className="account-card account-card--profile">
            <div className="account-avatar">
              <ProfileIcon />
            </div>
            <h2>
              {profile.firstName} {profile.lastName}
            </h2>
            <p>Class: {profile.classYear}</p>
            <p>Email: {profile.email}</p>
            <p>Role: {profile.role}</p>

            <div className="account-actions">
              <button type="button">Edit Profile</button>
              <button 
                type="button" 
                onClick={handleSignOut}
                disabled={isLoading}
              >
                {isLoading ? 'Signing out...' : 'Sign Out'}
              </button>
            </div>
          </article>

          <article className="account-card account-card--about">
            <h2>About me</h2>
            <p>{profile.about || 'No description provided.'}</p>
          </article>
        </div>
      </section>
    </div>
  )
}