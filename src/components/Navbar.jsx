import { Link, useLocation } from 'react-router-dom'

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

export default function Navbar({ user, onProfileClick, onSignOut }) {
  const location = useLocation()
  
  const menuItems = [
    { label: 'Browse Listings', path: '/' },
    { label: 'Create Listing', path: '/create-listing' },
    { label: 'Messages', path: '/messages' },
    { label: 'My Listings', path: '/my-listings' },
  ]

  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname.startsWith('/?')
    }
    return location.pathname.startsWith(path)
  }

  return (
    <header className="menu-bar">
      <Link to="/" className="menu-bar__logo">
        LOGO
      </Link>

      <nav className="menu-bar__nav" aria-label="Primary">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`menu-bar__tab ${isActivePath(item.path) ? 'menu-bar__tab--active' : ''}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {user ? (
        <button 
          className="menu-bar__profile" 
          type="button" 
          aria-label="Profile" 
          onClick={onProfileClick}
        >
          <ProfileIcon />
        </button>
      ) : (
        <div className="menu-auth-links">
          <Link 
            to="/auth?mode=signin" 
            className={`menu-bar__auth-link ${location.pathname === '/auth' && new URLSearchParams(location.search).get('mode') === 'signin' ? 'menu-bar__auth-link--active' : ''}`}
          >
            Sign In
          </Link>
          <Link 
            to="/auth?mode=register"
            className={`menu-bar__auth-link ${location.pathname === '/auth' && new URLSearchParams(location.search).get('mode') === 'register' ? 'menu-bar__auth-link--active' : ''}`}
          >
            Create Account
          </Link>
        </div>
      )}
    </header>
  )
}