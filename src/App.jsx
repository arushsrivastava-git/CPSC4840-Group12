import { useMemo, useState } from 'react'
import './App.css'

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

const LISTINGS = [
  {
    id: 'listing-john',
    threadId: 'thread-john',
    title: '2 Bed, 2 Bath',
    owner: 'John Doe',
    address: '123 Apple St',
    price: '$1,500 / month',
    rentLabel: '$1500/mo',
    distance: '0.7mi from center of campus',
    lease: '1 year lease - Starts May 17',
    roommates: '2 roomates',
    description:
      'Bright and modern flat featuring a spacious open-plan living area, well-equipped kitchen, and comfortable bedrooms. Designed for everyday convenience, it offers natural light, clean finishes, and a practical layout in a well-connected location.',
    amenities: ['Attached Bathroom', 'In House Laundry', 'Fully Furnished'],
  },
  {
    id: 'listing-mary',
    threadId: 'thread-mary',
    title: '1 Bed, 1 Bath',
    owner: 'Mary Smith',
    address: '472 Orange St',
    price: '$800 / month',
    rentLabel: '$800/mo',
    distance: '1.4mi from center of campus',
    lease: '1 year lease - Starts Aug 1',
    roommates: '1 roomate',
    description:
      'Quiet one-bedroom unit with updated kitchen appliances, dedicated work nook, and easy bus access. Great for a single tenant looking for a simple, comfortable setup close to campus.',
    amenities: ['Heating Included', 'Bike Storage', 'Pet Friendly'],
  },
  {
    id: 'listing-alex',
    threadId: 'thread-alex',
    title: '3 Bed, 2 Bath',
    owner: 'Alex Kim',
    address: '88 Chapel St',
    price: '$2,100 / month',
    rentLabel: '$2100/mo',
    distance: '0.5mi from center of campus',
    lease: '9 month lease - Starts Sep 1',
    roommates: '2 roomates',
    description:
      'Large shared apartment with generous common area and private study spaces. Suitable for groups who want to split rent and stay within walking distance of classes.',
    amenities: ['Dishwasher', 'Central Air', 'Study Room'],
  },
]

const THREADS = [
  {
    id: 'thread-john',
    user: 'John Doe',
    subject: '2 Bed, 2 Bath Listing',
    preview: 'Is this listing still available?',
    unread: true,
    time: '1m ago',
  },
  {
    id: 'thread-mary',
    user: 'Mary Smith',
    subject: '1 Bed, 1 Bath Listing',
    preview: 'Would July move-in work for you?',
    unread: true,
    time: '12m ago',
  },
  {
    id: 'thread-alex',
    user: 'Alex Kim',
    subject: '3 Bed, 2 Bath Listing',
    preview: 'Can I schedule an in-person tour?',
    unread: false,
    time: '3h ago',
  },
]

const INITIAL_CHAT_LOG = {
  'thread-john': [
    { sender: 'them', text: 'Hi Arush, is this listing still available?' },
    { sender: 'me', text: 'Yes, it is available starting May 17.' },
  ],
  'thread-mary': [
    { sender: 'them', text: 'Would July move-in work for you?' },
    { sender: 'me', text: 'July works. Can you share utilities estimate?' },
  ],
  'thread-alex': [
    { sender: 'them', text: 'Can I schedule an in-person tour?' },
    { sender: 'me', text: 'Sure, I can do Friday after 2pm.' },
  ],
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

function CutResultCard() {
  return (
    <article className="cut-result" aria-hidden="true">
      <div className="cut-result__image-shell">
        <ImagePlaceholder />
      </div>
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
      <WireframeHeader
        activeMenu={activeMenu}
        onMenuClick={onMenuClick}
        onProfileClick={onProfileClick}
      />

      <section className="search-body">
        <h1>Find Housing</h1>

        <div className="search-row" role="search">
          <div className="search-row__bar">Search</div>
          <button className="search-row__filters" type="button">
            Filters
          </button>
        </div>

        <div className="results-layout">
          <ListingCard listing={LISTINGS[0]} onSeeMore={() => onOpenListing(LISTINGS[0].id)} />
          <ListingCard listing={LISTINGS[1]} onSeeMore={() => onOpenListing(LISTINGS[1].id)} />
          <MapPanel showHelp={showHelp} onHelpOpen={onHelpOpen} onHelpClose={onHelpClose} />
        </div>

        <div className="cut-results" aria-hidden="true">
          <CutResultCard />
          <CutResultCard />
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

function AuthBoard({ mode, onModeChange, onSubmit, onMenuClick, onProfileClick }) {
  const isCreate = mode === BOARD.CREATE_ACCOUNT

  return (
    <div className="board board--auth">
      <WireframeHeader
        activeMenu=""
        onMenuClick={onMenuClick}
        profileMode="auth"
        authMode={mode}
        onAuthModeChange={onModeChange}
        onProfileClick={onProfileClick}
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
                <input type="text" />
              </label>

              <label>
                Last Name
                <input type="text" />
              </label>

              <label>
                University Email (must end in .edu)
                <input type="email" />
              </label>

              <small>A verification code will be sent to this address</small>

              <label>
                Password
                <input type="password" />
              </label>

              <label>
                Confirm Password
                <input type="password" />
              </label>

              <p className="auth-role-label">I am looking to...</p>

              <div className="auth-role-grid">
                <button type="button" className="auth-role-card auth-role-card--active">
                  <strong>Create Listing</strong>
                  <span>I have a unit and need roommates</span>
                </button>
                <button type="button" className="auth-role-card">
                  <strong>Find Housing</strong>
                  <span>I'm searching for a place to live</span>
                </button>
              </div>

              <button className="auth-submit" type="button" onClick={onSubmit}>
                Send Verification Code →
              </button>
            </form>
          ) : (
            <form className="auth-form auth-form--sign-in" onSubmit={(event) => event.preventDefault()}>
              <h2>Sign In</h2>

              <label>
                Email Address
                <input type="email" />
              </label>

              <label>
                Password
                <input type="password" />
              </label>

              <button className="auth-submit" type="button" onClick={onSubmit}>
                Sign In →
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}

function AccountBoard({ onMenuClick, onProfileClick, onSignOut }) {
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
            <h2>Alicia Stone</h2>
            <p>Class: 2027</p>
            <p>Email: alicia.stone@yale.edu</p>
            <p>Role: Looking for housing</p>

            <div className="account-actions">
              <button type="button">Edit Profile</button>
              <button type="button" onClick={onSignOut}>
                Sign Out
              </button>
            </div>
          </article>

          <article className="account-card account-card--about">
            <h2>About me</h2>
            <p>
              Hi there! I'm a 24-year-old graduate student looking for a 2-year housing lease. Super fun and easy to
              connect with, clean, responsible and mostly keep to myself. Thanks!
            </p>
          </article>
        </div>
      </section>
    </div>
  )
}

function ListingEditorBoard({ mode, listing, onMenuClick, onProfileClick, onSubmit }) {
  const isEdit = mode === BOARD.EDIT_LISTING

  return (
    <div className="board board--editor">
      <WireframeHeader
        activeMenu="Create Listing"
        onMenuClick={onMenuClick}
        onProfileClick={onProfileClick}
      />

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
                <input type="text" defaultValue={listing.title} />
              </label>

              <label>
                Address
                <input type="text" defaultValue={listing.address} />
              </label>

              <label>
                Monthly Price
                <input type="text" defaultValue={listing.price} />
              </label>

              <label>
                Lease Details
                <input type="text" defaultValue={listing.lease} />
              </label>
            </section>
          </div>

          <div className="editor-right">
            <label className="editor-description">
              Description
              <textarea defaultValue={listing.description} />
            </label>

            <fieldset className="editor-amenities">
              <legend>Amenities</legend>
              <label>
                <input type="checkbox" defaultChecked /> Attached Bathroom
              </label>
              <label>
                <input type="checkbox" defaultChecked /> In House Laundry
              </label>
              <label>
                <input type="checkbox" defaultChecked={listing.id !== 'listing-mary'} /> Fully Furnished
              </label>
            </fieldset>
          </div>
        </div>

        <button className="editor-submit" type="button" onClick={onSubmit}>
          {isEdit ? 'Update Post' : 'Upload Post'}
        </button>
      </section>
    </div>
  )
}

function MyListingsBoard({ onMenuClick, onProfileClick, onEditListing, onOpenListing }) {
  return (
    <div className="board board--my-listings">
      <WireframeHeader activeMenu="My Listings" onMenuClick={onMenuClick} onProfileClick={onProfileClick} />

      <section className="my-listings-body">
        <h1>My Listings</h1>

        <div className="my-listings-layout">
          <div className="my-listings-grid">
            {LISTINGS.slice(0, 2).map((listing) => (
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
            ))}
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
                className={`thread-list__item ${thread.id === activeThread.id ? 'thread-list__item--active' : ''}`}
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

          <section className="conversation-panel" aria-label={`Conversation with ${activeThread.user}`}>
            <header>
              <ProfileIcon />
              <div>
                <p>{activeThread.user}</p>
                <span>{activeThread.subject}</span>
              </div>
            </header>

            <div className="conversation-panel__messages">
              {messages.map((message, index) => (
                <p key={`${message.sender}-${index}`} className={`chat-bubble chat-bubble--${message.sender}`}>
                  {message.text}
                </p>
              ))}
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

function App() {
  const [board, setBoard] = useState(BOARD.BROWSE)
  const [activeListingId, setActiveListingId] = useState(LISTINGS[0].id)
  const [threads, setThreads] = useState(THREADS)
  const [activeThreadId, setActiveThreadId] = useState(THREADS[0].id)
  const [chatLog, setChatLog] = useState(INITIAL_CHAT_LOG)
  const [chatDraft, setChatDraft] = useState('')

  const activeListing = useMemo(
    () => LISTINGS.find((listing) => listing.id === activeListingId) ?? LISTINGS[0],
    [activeListingId],
  )

  const activeThread = useMemo(
    () => threads.find((thread) => thread.id === activeThreadId) ?? threads[0],
    [threads, activeThreadId],
  )

  const activeThreadMessages = chatLog[activeThread.id] ?? []

  const handleMenuClick = (menuItem) => {
    setBoard(MENU_TO_BOARD[menuItem])
  }

  const handleProfileClick = () => {
    setBoard(BOARD.MY_ACCOUNT)
  }

  const openListing = (listingId) => {
    setActiveListingId(listingId)
    setBoard(BOARD.BROWSE_INFO)
  }

  const openThread = (threadId) => {
    setActiveThreadId(threadId)
    setThreads((currentThreads) =>
      currentThreads.map((thread) => (thread.id === threadId ? { ...thread, unread: false } : thread)),
    )
  }

  const sendMessage = () => {
    const text = chatDraft.trim()
    if (!text) {
      return
    }

    setChatLog((currentLog) => ({
      ...currentLog,
      [activeThread.id]: [...(currentLog[activeThread.id] ?? []), { sender: 'me', text }],
    }))

    setChatDraft('')
  }

  let renderedBoard = null

  if (board === BOARD.BROWSE) {
    renderedBoard = (
      <SearchLayout
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
        showHelp
        onHelpOpen={() => setBoard(BOARD.BROWSE_HELP)}
        onHelpClose={() => setBoard(BOARD.BROWSE)}
        onOpenListing={openListing}
        activeMenu="Browse"
        onMenuClick={handleMenuClick}
        onProfileClick={handleProfileClick}
      />
    )
  } else if (board === BOARD.BROWSE_INFO) {
    renderedBoard = (
      <SearchLayout
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
          onMessage={() => {
            openThread(activeListing.threadId)
            setBoard(BOARD.BROWSE_MESSAGE)
          }}
        />
      </SearchLayout>
    )
  } else if (board === BOARD.BROWSE_MESSAGE) {
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
      <AuthBoard
        mode={board}
        onModeChange={setBoard}
        onSubmit={() => setBoard(board === BOARD.CREATE_ACCOUNT ? BOARD.SIGN_IN : BOARD.BROWSE)}
        onMenuClick={handleMenuClick}
        onProfileClick={handleProfileClick}
      />
    )
  } else if (board === BOARD.CREATE_LISTING || board === BOARD.EDIT_LISTING) {
    renderedBoard = (
      <ListingEditorBoard
        mode={board}
        listing={activeListing}
        onMenuClick={handleMenuClick}
        onProfileClick={handleProfileClick}
        onSubmit={() => setBoard(BOARD.MY_LISTINGS)}
      />
    )
  } else if (board === BOARD.MY_LISTINGS) {
    renderedBoard = (
      <MyListingsBoard
        onMenuClick={handleMenuClick}
        onProfileClick={handleProfileClick}
        onEditListing={(listingId) => {
          setActiveListingId(listingId)
          setBoard(BOARD.EDIT_LISTING)
        }}
        onOpenListing={openListing}
      />
    )
  } else if (board === BOARD.MY_ACCOUNT) {
    renderedBoard = (
      <AccountBoard
        onMenuClick={handleMenuClick}
        onProfileClick={handleProfileClick}
        onSignOut={() => setBoard(BOARD.SIGN_IN)}
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

  return <main className="app-root">{renderedBoard}</main>
}

export default App
