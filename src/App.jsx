import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { backend } from './mockBackend'

const IMAGE_ICON_URL = 'https://www.figma.com/api/mcp/asset/d7b50615-b081-4bba-907f-ebb8f753008b'
const MAP_IMAGE_URL = 'https://www.figma.com/api/mcp/asset/66c803f4-8106-456b-81d0-f22108fa7504'
const MARKER_URL = 'https://www.figma.com/api/mcp/asset/e47d0a65-8bd4-44ed-a091-1c6d7d3e8dc3'
const CLUSTER_MARKER_URL = 'https://www.figma.com/api/mcp/asset/572be55f-9830-463a-a20c-8bb279ce807d'
const CHECK_ICON_URL = 'https://www.figma.com/api/mcp/asset/a000b48d-84ad-4da3-b41b-67e0cd2a196e'

const BOARD = {
  BROWSE: 'browse',
  BROWSE_HELP: 'browse_help',
  BROWSE_INFO: 'browse_info',
  BROWSE_MESSAGE: 'browse_message',
  CREATE_ACCOUNT: 'create_account',
  SIGN_IN: 'sign_in',
  CREATE_LISTING: 'create_listing',
  EDIT_LISTING: 'edit_listing',
  MESSAGES: 'messages',
  MY_LISTINGS: 'my_listings',
  MY_ACCOUNT: 'my_account',
}

const MENU_ITEMS = ['Browse', 'Create Listing', 'Messages', 'My Listings']

const MENU_TO_BOARD = {
  Browse: BOARD.BROWSE,
  'Create Listing': BOARD.CREATE_LISTING,
  Messages: BOARD.MESSAGES,
  'My Listings': BOARD.MY_LISTINGS,
}

const CREATE_INTENTS = [
  {
    label: 'Create Listing',
    helper: 'I have a unit and need roommates',
  },
  {
    label: 'Find Housing',
    helper: "I'm searching for a place to live",
  },
]

function pickActiveById(items, id) {
  if (!Array.isArray(items) || items.length === 0) {
    return null
  }

  return items.find((item) => item.id === id) || items[0]
}

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

function ImagePlaceholder({ alt = '' }) {
  return <img className="image-placeholder" src={IMAGE_ICON_URL} alt={alt} />
}

function EmptyListingCard() {
  return (
    <article className="listing-card listing-card--empty" aria-hidden="true">
      <div className="listing-card__image-shell">
        <ImagePlaceholder />
      </div>
      <div className="listing-card__content">
        <h2>No Listing</h2>
        <p>Data unavailable</p>
      </div>
      <div className="listing-card__cta listing-card__cta--disabled">See More</div>
    </article>
  )
}

function WireframeHeader({
  activeMenu,
  onMenuClick,
  profileMode = 'icon',
  authMode,
  onAuthModeChange,
  onProfileClick,
}) {
  return (
    <header className="menu-bar">
      <span className="menu-bar__logo">LOGO</span>

      <nav className="menu-bar__nav" aria-label="Primary">
        {MENU_ITEMS.map((item) => (
          <button
            key={item}
            className={`menu-bar__tab ${activeMenu === item ? 'menu-bar__tab--active' : ''}`}
            type="button"
            onClick={() => onMenuClick(item)}
          >
            {item}
          </button>
        ))}
      </nav>

      {profileMode === 'auth' ? (
        <div className="menu-auth-links">
          <button
            type="button"
            className={authMode === BOARD.SIGN_IN ? 'menu-auth-links__active' : ''}
            onClick={() => onAuthModeChange(BOARD.SIGN_IN)}
          >
            Sign In
          </button>
          <button
            type="button"
            className={authMode === BOARD.CREATE_ACCOUNT ? 'menu-auth-links__active' : ''}
            onClick={() => onAuthModeChange(BOARD.CREATE_ACCOUNT)}
          >
            Create Account
          </button>
        </div>
      ) : (
        <button className="menu-bar__profile" type="button" aria-label="Profile" onClick={onProfileClick}>
          <ProfileIcon />
        </button>
      )}
    </header>
  )
}

function ListingCard({ listing, onSeeMore }) {
  return (
    <article className="listing-card" aria-label={`${listing.title} listing`}>
      <div className="listing-card__image-shell">
        <ImagePlaceholder alt="Listing" />
      </div>

      <div className="listing-card__content">
        <h2>{listing.title}</h2>
        <p>{listing.owner}</p>
        <p>{listing.address}</p>
        <p>{listing.rentLabel}</p>
        <p>{listing.distance}</p>
        <p>{listing.lease}</p>
      </div>

      {onSeeMore ? (
        <button className="listing-card__cta" type="button" onClick={onSeeMore}>
          See More
        </button>
      ) : (
        <div className="listing-card__cta listing-card__cta--disabled">See More</div>
      )}
    </article>
  )
}

function MapPanel({ showHelp, onHelpOpen, onHelpClose }) {
  return (
    <section className="map-panel" aria-label="Map of listings">
      <img className="map-panel__image" src={MAP_IMAGE_URL} alt="Listing map" />

      <div className="map-controls">
        <button type="button" aria-label="Zoom in">
          +
        </button>
        <button type="button" aria-label="Zoom out">
          -
        </button>
        <button type="button" aria-label="Map help" onClick={showHelp ? onHelpClose : onHelpOpen}>
          ?
        </button>
      </div>

      <img className="marker marker--one" src={MARKER_URL} alt="" />
      <img className="marker marker--two" src={MARKER_URL} alt="" />
      <img className="marker marker--three" src={CLUSTER_MARKER_URL} alt="" />

      {showHelp ? (
        <aside className="map-help" aria-live="polite">
          <button className="map-help__close" type="button" onClick={onHelpClose}>
            x
          </button>
          <p>
            This map will allow you to locate the position of each listing. Drag the map around with the pointer,
            click on map pin for each listing to pop up and use the + and - symbols to zoom in and out of the map.
          </p>
        </aside>
      ) : null}
    </section>
  )
}

function SearchLayout({
  listings,
  showHelp,
  onHelpOpen,
  onHelpClose,
  onOpenListing,
  activeMenu,
  onMenuClick,
  onProfileClick,
  children,
}) {
  return (
    <div className="board board--search">
      <WireframeHeader activeMenu={activeMenu} onMenuClick={onMenuClick} onProfileClick={onProfileClick} />

      <section className="search-body">
        <h1>Find Housing</h1>

        <div className="search-row" role="search">
          <div className="search-row__bar">Search</div>
          <button className="search-row__filters" type="button">
            Filters
          </button>
        </div>

        <div className="results-layout">
          <div className="results-feed">
            {listings.length === 0 ? (
              <EmptyListingCard />
            ) : (
              listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} onSeeMore={() => onOpenListing(listing.id)} />
              ))
            )}
          </div>

          <aside className="results-map-rail">
            <MapPanel showHelp={showHelp} onHelpOpen={onHelpOpen} onHelpClose={onHelpClose} />
          </aside>
        </div>
      </section>

      <footer className="map-credit">
        <p>Map image by thecreation.design on Figma</p>
        <p>Map image edited with Gemini Nano Banana</p>
      </footer>

      {children}
    </div>
  )
}

function ListingInfoModal({ listing, onClose, onMessage }) {
  return (
    <div className="listing-modal-backdrop" role="dialog" aria-modal="true" aria-label="Listing details">
      <section className="listing-modal">
        <button className="listing-modal__close" type="button" onClick={onClose}>
          x
        </button>

        <div className="listing-modal__grabber" aria-hidden="true" />
        <p className="listing-modal__title">Search Page Information</p>

        <div className="listing-modal__carousel">
          <div className="listing-modal__image-block">
            <ImagePlaceholder alt="Listing preview" />
          </div>
          <div className="listing-modal__image-block">
            <ImagePlaceholder alt="Listing preview" />
          </div>
          <button className="listing-modal__chevron" type="button" aria-label="Next image">
            {'>'}
          </button>
        </div>

        <div className="listing-modal__details-grid">
          <div>
            <h2>{listing.title}</h2>
            <p className="listing-modal__owner">{listing.owner}</p>
            <p>{listing.address}</p>
            <p>{listing.distance.replace('mi', ' mi')}</p>
            <p>{listing.lease}</p>
          </div>

          <div className="listing-modal__price">
            <p>{listing.price}</p>
            <p>{listing.roommates}</p>
          </div>

          <div className="listing-modal__description">
            <h3>Description</h3>
            <p>{listing.description}</p>
          </div>
        </div>

        <div className="listing-modal__footer-row">
          <div className="listing-modal__amenities">
            {listing.amenities.map((amenity) => (
              <span key={amenity} className="amenity-chip">
                <img src={CHECK_ICON_URL} alt="" />
                {amenity}
              </span>
            ))}
          </div>

          <button className="message-action" type="button" onClick={onMessage}>
            Message
          </button>
        </div>
      </section>
    </div>
  )
}

function BrowseMessageBoard({
  listing,
  thread,
  messages,
  chatDraft,
  onChatDraftChange,
  onSend,
  onClose,
  onMenuClick,
  onProfileClick,
}) {
  return (
    <div className="board board--message-open">
      <WireframeHeader activeMenu="Browse" onMenuClick={onMenuClick} onProfileClick={onProfileClick} />

      <section className="message-open-layout">
        <div className="message-open-left">
          <div className="message-open-carousel">
            <div className="message-open-image">
              <ImagePlaceholder alt="Listing preview" />
            </div>
            <div className="message-open-image message-open-image--tail">
              <button className="message-open-chevron" type="button" aria-label="Next image">
                {'>'}
              </button>
            </div>
          </div>

          <div className="message-open-meta">
            <div>
              <h2>{listing.title}</h2>
              <p className="message-open-meta__owner">{listing.owner}</p>
              <p>{listing.address}</p>
              <p>{listing.distance.replace('mi', ' mi')}</p>
              <p>{listing.lease}</p>
            </div>
            <div className="message-open-meta__price">
              <p>{listing.price}</p>
              <p>{listing.roommates}</p>
            </div>
          </div>

          <div className="message-open-description">
            <h3>Description</h3>
            <p>{listing.description}</p>
          </div>
        </div>

        <aside className="message-open-thread">
          <header>
            <ProfileIcon />
            <p>{thread.user}</p>
            <button type="button" onClick={onClose} aria-label="Close thread">
              x
            </button>
          </header>

          <div className="message-open-thread__messages">
            {messages.map((message, index) => (
              <p key={`${message.sender}-${index}`} className={`chat-bubble chat-bubble--${message.sender}`}>
                {message.text}
              </p>
            ))}
          </div>

          <form
            className="message-open-thread__composer"
            onSubmit={(event) => {
              event.preventDefault()
              onSend()
            }}
          >
            <input
              value={chatDraft}
              onChange={(event) => onChatDraftChange(event.target.value)}
              placeholder="Message"
              aria-label="Message"
            />
            <button type="submit" aria-label="Send message">
              ↑
            </button>
          </form>
        </aside>
      </section>
    </div>
  )
}

function AuthBoard({ mode, onModeChange, onSubmit, onMenuClick }) {
  const isCreate = mode === BOARD.CREATE_ACCOUNT

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

  return (
    <div className="board board--auth">
      <WireframeHeader
        activeMenu=""
        onMenuClick={onMenuClick}
        profileMode="auth"
        authMode={mode}
        onAuthModeChange={onModeChange}
      />

      <section className="auth-body">
        <div className="auth-panel">
          <div className="auth-switcher">
            <button
              type="button"
              className={isCreate ? 'auth-switcher__active' : ''}
              onClick={() => onModeChange(BOARD.CREATE_ACCOUNT)}
            >
              Create Account
            </button>
            <button
              type="button"
              className={!isCreate ? 'auth-switcher__active' : ''}
              onClick={() => onModeChange(BOARD.SIGN_IN)}
            >
              Sign In
            </button>
          </div>

          {isCreate ? (
            <form className="auth-form" onSubmit={(event) => event.preventDefault()}>
              <h2>Create Account</h2>

              <label>
                First Name
                <input
                  type="text"
                  value={createForm.firstName}
                  onChange={(event) => setCreateForm((prev) => ({ ...prev, firstName: event.target.value }))}
                />
              </label>

              <label>
                Last Name
                <input
                  type="text"
                  value={createForm.lastName}
                  onChange={(event) => setCreateForm((prev) => ({ ...prev, lastName: event.target.value }))}
                />
              </label>

              <label>
                University Email (must end in .edu)
                <input
                  type="email"
                  value={createForm.email}
                  onChange={(event) => setCreateForm((prev) => ({ ...prev, email: event.target.value }))}
                />
              </label>

              <small>A verification code will be sent to this address</small>

              <label>
                Password
                <input
                  type="password"
                  value={createForm.password}
                  onChange={(event) => setCreateForm((prev) => ({ ...prev, password: event.target.value }))}
                />
              </label>

              <label>
                Confirm Password
                <input
                  type="password"
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
                type="button"
                onClick={() => onSubmit({ mode, data: createForm })}
              >
                Send Verification Code →
              </button>
            </form>
          ) : (
            <form className="auth-form auth-form--sign-in" onSubmit={(event) => event.preventDefault()}>
              <h2>Sign In</h2>

              <label>
                Email Address
                <input
                  type="email"
                  value={signInForm.email}
                  onChange={(event) => setSignInForm((prev) => ({ ...prev, email: event.target.value }))}
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  value={signInForm.password}
                  onChange={(event) => setSignInForm((prev) => ({ ...prev, password: event.target.value }))}
                />
              </label>

              <button
                className="auth-submit"
                type="button"
                onClick={() => onSubmit({ mode, data: signInForm })}
              >
                Sign In →
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}

function AccountBoard({ profile, onMenuClick, onProfileClick, onSignOut }) {
  return (
    <div className="board board--account">
      <WireframeHeader activeMenu="" onMenuClick={onMenuClick} onProfileClick={onProfileClick} />

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
              <button type="button" onClick={onSignOut}>
                Sign Out
              </button>
            </div>
          </article>

          <article className="account-card account-card--about">
            <h2>About me</h2>
            <p>{profile.about}</p>
          </article>
        </div>
      </section>
    </div>
  )
}

function ListingEditorBoard({ mode, listing, profile, onMenuClick, onProfileClick, onSubmit }) {
  const isEdit = mode === BOARD.EDIT_LISTING

  const [form, setForm] = useState({
    title: listing?.title || '1 Bed, 1 Bath',
    owner: listing?.owner || `${profile.firstName} ${profile.lastName}`,
    address: listing?.address || '',
    price: listing?.price || '$1,200 / month',
    lease: listing?.lease || '1 year lease - Starts Sep 1',
    description: listing?.description || '',
    amenities: listing?.amenities || ['Attached Bathroom', 'In House Laundry'],
  })

  const toggleAmenity = (amenity) => {
    setForm((prev) => {
      const exists = prev.amenities.includes(amenity)
      return {
        ...prev,
        amenities: exists ? prev.amenities.filter((item) => item !== amenity) : [...prev.amenities, amenity],
      }
    })
  }

  return (
    <div className="board board--editor">
      <WireframeHeader activeMenu="Create Listing" onMenuClick={onMenuClick} onProfileClick={onProfileClick} />

      <section className="editor-body">
        <h1>{isEdit ? 'Editing Your Post' : 'Your Post'}</h1>

        <div className="editor-layout">
          <div className="editor-left">
            <div className="editor-image-panel">
              <ImagePlaceholder alt="Listing image" />
            </div>

            <button className="editor-action" type="button">
              {isEdit ? 'Replace Images' : 'Upload Images'}
            </button>

            <section className="editor-room-details">
              <h2>Room Details</h2>

              <label>
                Title
                <input
                  type="text"
                  value={form.title}
                  onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                />
              </label>

              <label>
                Owner
                <input
                  type="text"
                  value={form.owner}
                  onChange={(event) => setForm((prev) => ({ ...prev, owner: event.target.value }))}
                />
              </label>

              <label>
                Address
                <input
                  type="text"
                  value={form.address}
                  onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
                />
              </label>

              <label>
                Monthly Price
                <input
                  type="text"
                  value={form.price}
                  onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
                />
              </label>

              <label>
                Lease Details
                <input
                  type="text"
                  value={form.lease}
                  onChange={(event) => setForm((prev) => ({ ...prev, lease: event.target.value }))}
                />
              </label>
            </section>
          </div>

          <div className="editor-right">
            <label className="editor-description">
              Description
              <textarea
                value={form.description}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              />
            </label>

            <fieldset className="editor-amenities">
              <legend>Amenities</legend>
              {['Attached Bathroom', 'In House Laundry', 'Fully Furnished', 'Dishwasher'].map((amenity) => (
                <label key={amenity}>
                  <input
                    type="checkbox"
                    checked={form.amenities.includes(amenity)}
                    onChange={() => toggleAmenity(amenity)}
                  />
                  {' '}
                  {amenity}
                </label>
              ))}
            </fieldset>
          </div>
        </div>

        <button className="editor-submit" type="button" onClick={() => onSubmit(form)}>
          {isEdit ? 'Update Post' : 'Upload Post'}
        </button>
      </section>
    </div>
  )
}

function MyListingsBoard({ listings, onMenuClick, onProfileClick, onEditListing, onOpenListing }) {
  return (
    <div className="board board--my-listings">
      <WireframeHeader activeMenu="My Listings" onMenuClick={onMenuClick} onProfileClick={onProfileClick} />

      <section className="my-listings-body">
        <h1>My Listings</h1>

        <div className="my-listings-layout">
          <div className="my-listings-grid">
            {listings.length === 0 ? (
              <article className="my-listing-card my-listing-card--empty">
                <h2>No listings yet</h2>
                <p>Create your first listing from the Create Listing tab.</p>
              </article>
            ) : (
              listings.map((listing) => (
                <article key={listing.id} className="my-listing-card">
                  <div className="my-listing-card__image">
                    <ImagePlaceholder alt="Listing" />
                  </div>

                  <h2>{listing.title}</h2>
                  <p>{listing.owner}</p>
                  <p>{listing.address}</p>

                  <div className="my-listing-card__actions">
                    <button type="button" onClick={() => onEditListing(listing.id)}>
                      Edit Post
                    </button>
                    <button type="button" onClick={() => onOpenListing(listing.id)}>
                      Open
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>

          <aside className="my-listings-filter">
            <h2>Filters</h2>
            <label>
              Price range
              <input type="text" defaultValue="$700 - $1800" />
            </label>
            <label>
              Bedrooms
              <input type="text" defaultValue="1 - 3" />
            </label>
            <label>
              Distance
              <input type="text" defaultValue="Within 1.5 mi" />
            </label>
            <button type="button">Apply</button>
          </aside>
        </div>
      </section>
    </div>
  )
}

function MessagesBoard({
  threads,
  activeThread,
  messages,
  chatDraft,
  onSelectThread,
  onChatDraftChange,
  onSend,
  onMenuClick,
  onProfileClick,
}) {
  return (
    <div className="board board--messages">
      <WireframeHeader activeMenu="Messages" onMenuClick={onMenuClick} onProfileClick={onProfileClick} />

      <section className="messages-body">
        <h1>Messages</h1>

        <div className="messages-layout">
          <aside className="thread-list">
            {threads.map((thread) => (
              <button
                key={thread.id}
                className={`thread-list__item ${thread.id === activeThread?.id ? 'thread-list__item--active' : ''}`}
                type="button"
                onClick={() => onSelectThread(thread.id)}
              >
                <div>
                  <p className="thread-list__name">{thread.user}</p>
                  <p className="thread-list__subject">{thread.subject}</p>
                  <p className="thread-list__preview">{thread.preview}</p>
                </div>
                <div className="thread-list__meta">
                  {thread.unread ? <span className="thread-list__dot" aria-hidden="true" /> : null}
                  <span>{thread.time}</span>
                </div>
              </button>
            ))}
          </aside>

          <section className="conversation-panel" aria-label={`Conversation with ${activeThread?.user || 'contact'}`}>
            <header>
              <ProfileIcon />
              <div>
                <p>{activeThread?.user || 'No thread selected'}</p>
                <span>{activeThread?.subject || 'Pick a message thread to begin.'}</span>
              </div>
            </header>

            <div className="conversation-panel__messages">
              {messages.length === 0 ? (
                <p className="chat-bubble chat-bubble--them">No messages yet.</p>
              ) : (
                messages.map((message, index) => (
                  <p key={`${message.sender}-${index}`} className={`chat-bubble chat-bubble--${message.sender}`}>
                    {message.text}
                  </p>
                ))
              )}
            </div>

            <form
              className="conversation-panel__composer"
              onSubmit={(event) => {
                event.preventDefault()
                onSend()
              }}
            >
              <input
                value={chatDraft}
                onChange={(event) => onChatDraftChange(event.target.value)}
                placeholder="Message"
                aria-label="Message"
              />
              <button type="submit">Send</button>
            </form>
          </section>
        </div>
      </section>
    </div>
  )
}

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

function App() {
  const [board, setBoard] = useState(BOARD.BROWSE)
  const [session, setSession] = useState({ signedIn: false, userId: null })
  const [profile, setProfile] = useState({
    firstName: 'Alicia',
    lastName: 'Stone',
    classYear: '2027',
    email: 'alicia.stone@yale.edu',
    role: 'Looking for housing',
    about: 'Profile loading...',
  })

  const [listings, setListings] = useState([])
  const [threads, setThreads] = useState([])
  const [chatLog, setChatLog] = useState({})

  const [activeListingId, setActiveListingId] = useState(null)
  const [activeThreadId, setActiveThreadId] = useState(null)
  const [chatDraft, setChatDraft] = useState('')

  const [isBooting, setIsBooting] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [notice, setNotice] = useState('')

  const hydrateFromSnapshot = (snapshot) => {
    setSession(snapshot.auth)
    setProfile(snapshot.user)
    setListings(snapshot.listings)
    setThreads(snapshot.threads)
    setChatLog(snapshot.messages)

    setActiveListingId((current) => {
      if (snapshot.listings.some((listing) => listing.id === current)) {
        return current
      }
      return snapshot.listings[0]?.id || null
    })

    setActiveThreadId((current) => {
      if (snapshot.threads.some((thread) => thread.id === current)) {
        return current
      }
      return snapshot.threads[0]?.id || null
    })
  }

  const runSnapshotTask = async (task, successMessage = '') => {
    setIsSyncing(true)

    try {
      const snapshot = await task()
      hydrateFromSnapshot(snapshot)
      if (successMessage) {
        setNotice(successMessage)
      }
      return snapshot
    } catch (error) {
      setNotice(error.message || 'Request failed.')
      return null
    } finally {
      setIsSyncing(false)
    }
  }

  useEffect(() => {
    let alive = true

    const bootstrap = async () => {
      setIsBooting(true)

      try {
        const snapshot = await backend.bootstrap()
        if (!alive) {
          return
        }
        hydrateFromSnapshot(snapshot)
        setBoard(snapshot.auth.signedIn ? BOARD.BROWSE : BOARD.SIGN_IN)
      } catch {
        if (alive) {
          setNotice('Failed to bootstrap local backend.')
          setBoard(BOARD.SIGN_IN)
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

  useEffect(() => {
    if (!notice) {
      return
    }

    const timerId = setTimeout(() => {
      setNotice('')
    }, 2600)

    return () => clearTimeout(timerId)
  }, [notice])

  const activeListing = useMemo(() => pickActiveById(listings, activeListingId), [listings, activeListingId])
  const activeThread = useMemo(() => pickActiveById(threads, activeThreadId), [threads, activeThreadId])
  const activeThreadMessages = activeThread ? chatLog[activeThread.id] || [] : []

  const handleMenuClick = (menuItem) => {
    const nextBoard = MENU_TO_BOARD[menuItem] || BOARD.BROWSE

    if (!session.signedIn && nextBoard !== BOARD.BROWSE) {
      setNotice('Please sign in to access this section.')
      setBoard(BOARD.SIGN_IN)
      return
    }

    setBoard(nextBoard)
  }

  const handleProfileClick = () => {
    if (!session.signedIn) {
      setBoard(BOARD.SIGN_IN)
      return
    }

    setBoard(BOARD.MY_ACCOUNT)
  }

  const openListing = (listingId) => {
    setActiveListingId(listingId)
    setBoard(BOARD.BROWSE_INFO)
  }

  const openThread = async (threadId) => {
    setActiveThreadId(threadId)
    await runSnapshotTask(() => backend.markThreadRead(threadId))
  }

  const sendMessage = async () => {
    const text = chatDraft.trim()

    if (!text || !activeThread) {
      return
    }

    setChatDraft('')
    await runSnapshotTask(() => backend.sendMessage(activeThread.id, text))
  }

  const handleAuthSubmit = async ({ mode, data }) => {
    if (mode === BOARD.CREATE_ACCOUNT) {
      setIsSyncing(true)
      try {
        const response = await backend.createAccount(data)
        setNotice(response.message)
        setBoard(BOARD.SIGN_IN)
      } catch (error) {
        setNotice(error.message || 'Unable to create account.')
      } finally {
        setIsSyncing(false)
      }
      return
    }

    const snapshot = await runSnapshotTask(() => backend.signIn(data), 'Signed in successfully.')
    if (snapshot) {
      setBoard(BOARD.BROWSE)
    }
  }

  const handleSignOut = async () => {
    const snapshot = await runSnapshotTask(() => backend.signOut(), 'Signed out.')
    if (snapshot) {
      setBoard(BOARD.SIGN_IN)
    }
  }

  const handleListingSubmit = async (payload) => {
    const mode = board === BOARD.EDIT_LISTING ? 'edit' : 'create'

    const snapshot = await runSnapshotTask(
      () =>
        backend.upsertListing({
          mode,
          listingId: activeListing?.id || undefined,
          payload,
        }),
      mode === 'edit' ? 'Listing updated.' : 'Listing published.',
    )

    if (snapshot) {
      setBoard(BOARD.MY_LISTINGS)
    }
  }

  if (isBooting) {
    return <BootScreen />
  }

  let renderedBoard = null

  if (board === BOARD.BROWSE) {
    renderedBoard = (
      <SearchLayout
        listings={listings}
        showHelp={false}
        onHelpOpen={() => setBoard(BOARD.BROWSE_HELP)}
        onHelpClose={() => setBoard(BOARD.BROWSE)}
        onOpenListing={openListing}
        activeMenu="Browse"
        onMenuClick={handleMenuClick}
        onProfileClick={handleProfileClick}
      />
    )
  } else if (board === BOARD.BROWSE_HELP) {
    renderedBoard = (
      <SearchLayout
        listings={listings}
        showHelp
        onHelpOpen={() => setBoard(BOARD.BROWSE_HELP)}
        onHelpClose={() => setBoard(BOARD.BROWSE)}
        onOpenListing={openListing}
        activeMenu="Browse"
        onMenuClick={handleMenuClick}
        onProfileClick={handleProfileClick}
      />
    )
  } else if (board === BOARD.BROWSE_INFO && activeListing) {
    renderedBoard = (
      <SearchLayout
        listings={listings}
        showHelp={false}
        onHelpOpen={() => setBoard(BOARD.BROWSE_HELP)}
        onHelpClose={() => setBoard(BOARD.BROWSE)}
        onOpenListing={openListing}
        activeMenu="Browse"
        onMenuClick={handleMenuClick}
        onProfileClick={handleProfileClick}
      >
        <ListingInfoModal
          listing={activeListing}
          onClose={() => setBoard(BOARD.BROWSE)}
          onMessage={async () => {
            if (!session.signedIn) {
              setNotice('Please sign in to send messages.')
              setBoard(BOARD.SIGN_IN)
              return
            }

            await openThread(activeListing.threadId)
            setBoard(BOARD.BROWSE_MESSAGE)
          }}
        />
      </SearchLayout>
    )
  } else if (board === BOARD.BROWSE_MESSAGE && activeListing && activeThread) {
    renderedBoard = (
      <BrowseMessageBoard
        listing={activeListing}
        thread={activeThread}
        messages={activeThreadMessages}
        chatDraft={chatDraft}
        onChatDraftChange={setChatDraft}
        onSend={sendMessage}
        onClose={() => setBoard(BOARD.BROWSE_INFO)}
        onMenuClick={handleMenuClick}
        onProfileClick={handleProfileClick}
      />
    )
  } else if (board === BOARD.CREATE_ACCOUNT || board === BOARD.SIGN_IN) {
    renderedBoard = (
      <AuthBoard mode={board} onModeChange={setBoard} onSubmit={handleAuthSubmit} onMenuClick={handleMenuClick} />
    )
  } else if ((board === BOARD.CREATE_LISTING || board === BOARD.EDIT_LISTING) && profile) {
    renderedBoard = (
      <ListingEditorBoard
        key={`${board}-${activeListing?.id || 'new'}-${profile.email}`}
        mode={board}
        listing={activeListing}
        profile={profile}
        onMenuClick={handleMenuClick}
        onProfileClick={handleProfileClick}
        onSubmit={handleListingSubmit}
      />
    )
  } else if (board === BOARD.MY_LISTINGS) {
    renderedBoard = (
      <MyListingsBoard
        listings={listings}
        onMenuClick={handleMenuClick}
        onProfileClick={handleProfileClick}
        onEditListing={(listingId) => {
          setActiveListingId(listingId)
          setBoard(BOARD.EDIT_LISTING)
        }}
        onOpenListing={openListing}
      />
    )
  } else if (board === BOARD.MY_ACCOUNT && profile) {
    renderedBoard = (
      <AccountBoard
        profile={profile}
        onMenuClick={handleMenuClick}
        onProfileClick={handleProfileClick}
        onSignOut={handleSignOut}
      />
    )
  } else {
    renderedBoard = (
      <MessagesBoard
        threads={threads}
        activeThread={activeThread}
        messages={activeThreadMessages}
        chatDraft={chatDraft}
        onSelectThread={openThread}
        onChatDraftChange={setChatDraft}
        onSend={sendMessage}
        onMenuClick={handleMenuClick}
        onProfileClick={handleProfileClick}
      />
    )
  }

  return (
    <main className="app-root">
      {renderedBoard}

      {isSyncing ? (
        <div className="async-status" aria-live="polite">
          <span className="async-status__dot" /> Syncing with local backend…
        </div>
      ) : null}

      {notice ? <div className="floating-notice">{notice}</div> : null}
    </main>
  )
}

export default App
