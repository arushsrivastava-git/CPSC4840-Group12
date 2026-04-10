import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Bath,
  BedDouble,
  Bike,
  CalendarDays,
  Flame,
  MapPin,
  PawPrint,
  Ruler,
  Search,
  Shirt,
  Wallet,
} from 'lucide-react'
import L from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import './App.css'
import { backend } from './mockBackend'

const IMAGE_ICON_URL = 'https://www.figma.com/api/mcp/asset/d7b50615-b081-4bba-907f-ebb8f753008b'
const CHECK_ICON_URL = 'https://www.figma.com/api/mcp/asset/a000b48d-84ad-4da3-b41b-67e0cd2a196e'
const MAP_CENTER = [41.3083, -72.9279]

const BOARD = {
  BROWSE: 'browse',
  BROWSE_HELP: 'browse_help',
  BROWSE_INFO: 'browse_info',
  BROWSE_MESSAGE: 'browse_message',
  CREATE_ACCOUNT: 'create_account',
  VERIFY_ACCOUNT: 'verify_account',
  SIGN_IN: 'sign_in',
  CREATE_LISTING: 'create_listing',
  EDIT_LISTING: 'edit_listing',
  MESSAGES: 'messages',
  MY_LISTINGS: 'my_listings',
  MY_ACCOUNT: 'my_account',
}

const MENU_ITEMS = ['Browse Listings', 'Create Listing', 'Messages', 'My Listings']

const MENU_TO_BOARD = {
  'Browse Listings': BOARD.BROWSE,
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

function leaseDurationLabel(lease = '') {
  const match = lease.match(/^(\d+\s+(?:year|month)s?)/i)
  return match ? match[1] : lease
}

function numericPrice(priceLabel = '') {
  const digits = String(priceLabel).replace(/[^\d]/g, '')
  return Number(digits || '0')
}

function distanceMiles(distanceLabel = '') {
  const match = String(distanceLabel).match(/(\d+(?:\.\d+)?)\s*mi/i)
  return match ? Number(match[1]) : 0
}

function normalizedDistanceLabel(distanceLabel = '') {
  return String(distanceLabel).replace('from center of campus', 'from campus')
}

function resolvedPetPolicy(listing) {
  if (listing.petPolicy) {
    return listing.petPolicy
  }

  if (listing.amenities?.includes('Pet Friendly')) {
    return 'Pets allowed'
  }

  return 'No pets'
}

function hasInUnitLaundry(listing) {
  return Boolean(listing.inUnitLaundry || listing.amenities?.includes('In House Laundry'))
}

function featurePills(listing) {
  const pills = []
  const petPolicy = resolvedPetPolicy(listing)

  pills.push({ icon: PawPrint, label: petPolicy })

  if (hasInUnitLaundry(listing)) {
    pills.push({ icon: Shirt, label: 'In-unit laundry' })
  }

  if (listing.amenities?.includes('Heating Included')) {
    pills.push({ icon: Flame, label: 'Heating included' })
  }

  if (listing.amenities?.includes('Bike Storage')) {
    pills.push({ icon: Bike, label: 'Bike storage' })
  }

  return pills
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
  const leaseLabel = leaseDurationLabel(listing.lease)
  const distanceLabel = normalizedDistanceLabel(listing.distance)
  const pills = featurePills(listing)

  return (
    <article className="listing-card" aria-label={`${listing.title} listing`}>
      <div className="listing-card__image-shell">
        <img className="listing-card__image" src={listing.imageUrl || IMAGE_ICON_URL} alt={listing.title} />
      </div>

      <div className="listing-card__content">
        <h2>{listing.title}</h2>
        <p className="listing-card__owner">Listed by {listing.owner}</p>
        <p className="listing-card__address">{listing.address}</p>

        <div className="listing-card__stats">
          <span className="property-pill">
            <Wallet size={14} aria-hidden="true" />
            {listing.rentLabel}
          </span>
          <span className="property-pill">
            <BedDouble size={14} aria-hidden="true" />
            {listing.beds} bd
          </span>
          <span className="property-pill">
            <Bath size={14} aria-hidden="true" />
            {listing.baths} ba
          </span>
          <span className="property-pill">
            <Ruler size={14} aria-hidden="true" />
            {listing.sqFt} sq ft
          </span>
          <span className="property-pill">
            <MapPin size={14} aria-hidden="true" />
            {distanceLabel}
          </span>
          <span className="property-pill">
            <CalendarDays size={14} aria-hidden="true" />
            {leaseLabel}
          </span>

          {pills.map((pill) => (
            <span key={pill.label} className="property-pill property-pill--feature">
              <pill.icon size={14} aria-hidden="true" />
              {pill.label}
            </span>
          ))}
        </div>
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

function MapPanel({ listings, showHelp, onHelpOpen, onHelpClose, onOpenListing }) {
  const validListings = useMemo(
    () => listings.filter((listing) => Number.isFinite(listing.lat) && Number.isFinite(listing.lng)),
    [listings],
  )

  const tileSources = [
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  ]
  const [tileIndex, setTileIndex] = useState(0)

  const mapPinIcon = useMemo(
    () =>
      L.divIcon({
        className: 'listing-map-pin',
        html: '<span></span>',
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      }),
    [],
  )

  return (
    <section className="map-panel" aria-label="Map of listings">
      <MapContainer
        center={MAP_CENTER}
        zoom={13}
        scrollWheelZoom
        className="map-panel__map"
        attributionControl
        style={{ height: '100%', width: '100%' }}
      >
        <MapResizeFix />
        <MapFitBounds listings={validListings} />
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url={tileSources[tileIndex]}
          eventHandlers={{
            tileerror: () => {
              setTileIndex((current) => (current < tileSources.length - 1 ? current + 1 : current))
            },
          }}
        />

        {validListings.map((listing) => (
          <Marker key={listing.id} position={[listing.lat, listing.lng]} icon={mapPinIcon}>
            <Popup>
              <div className="map-popup">
                <img src={listing.imageUrl} alt={listing.title} />
                <p>{listing.title}</p>
                <span>{listing.rentLabel}</span>
                <button type="button" onClick={() => onOpenListing(listing.id)}>
                  View listing
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <button className="map-help-toggle" type="button" aria-label="Map help" onClick={showHelp ? onHelpClose : onHelpOpen}>
        {showHelp ? 'Hide map help' : 'Map help'}
      </button>

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

function MapResizeFix() {
  const map = useMap()

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize()
    }, 0)

    return () => clearTimeout(timer)
  }, [map])

  return null
}

function MapFitBounds({ listings }) {
  const map = useMap()

  useEffect(() => {
    if (listings.length === 0) {
      map.setView(MAP_CENTER, 13)
      return
    }

    const bounds = L.latLngBounds(listings.map((listing) => [listing.lat, listing.lng]))
    map.fitBounds(bounds, { padding: [30, 30], maxZoom: 14 })
  }, [listings, map])

  return null
}

function SearchLayout({
  listings,
  mapListings,
  showHelp,
  onHelpOpen,
  onHelpClose,
  onOpenListing,
  activeMenu,
  onMenuClick,
  onProfileClick,
  searchQuery,
  onSearchQueryChange,
  minBeds,
  onMinBedsChange,
  minBaths,
  onMinBathsChange,
  maxPrice,
  onMaxPriceChange,
  maxPriceBound,
  maxDistance,
  onMaxDistanceChange,
  maxDistanceBound,
  petPolicy,
  onPetPolicyChange,
  requireLaundry,
  onRequireLaundryChange,
  requireHeating,
  onRequireHeatingChange,
  requireBikeStorage,
  onRequireBikeStorageChange,
  currentPage,
  totalPages,
  onPageChange,
  children,
}) {
  const firstRowListings = listings.slice(0, 2)
  const remainingListings = listings.slice(2)

  return (
    <div className="board board--search">
      <WireframeHeader activeMenu={activeMenu} onMenuClick={onMenuClick} onProfileClick={onProfileClick} />

      <section className="search-body">
        <h1>Browse Listings</h1>

        <div className="results-controls" role="search">
          <div className="search-row">
            <Search size={16} aria-hidden="true" />
            <input
              id="listing-search-input"
              className="search-row__input"
              value={searchQuery}
              onChange={(event) => onSearchQueryChange(event.target.value)}
              placeholder="Search by title, owner, or address"
              aria-label="Search listings"
            />
            <button
              type="button"
              className="search-row__action"
              onClick={() => onSearchQueryChange(searchQuery.trim())}
            >
              Search
            </button>
          </div>

          <div className="icon-filters">
            <label className="icon-filter" htmlFor="min-beds-filter">
              <BedDouble size={14} aria-hidden="true" />
              Beds
              <select
                id="min-beds-filter"
                value={minBeds}
                onChange={(event) => onMinBedsChange(Number(event.target.value))}
              >
                <option value={0}>Any</option>
                <option value={1}>1+</option>
                <option value={2}>2+</option>
                <option value={3}>3+</option>
              </select>
            </label>

            <label className="icon-filter" htmlFor="min-baths-filter">
              <Bath size={14} aria-hidden="true" />
              Baths
              <select
                id="min-baths-filter"
                value={minBaths}
                onChange={(event) => onMinBathsChange(Number(event.target.value))}
              >
                <option value={0}>Any</option>
                <option value={1}>1+</option>
                <option value={2}>2+</option>
              </select>
            </label>

            <label className="icon-filter icon-filter--slider" htmlFor="max-price-filter">
              <Wallet size={14} aria-hidden="true" />
              Max Price ${maxPrice.toLocaleString()}
              <input
                id="max-price-filter"
                type="range"
                min={0}
                max={maxPriceBound}
                step={50}
                value={maxPrice}
                onChange={(event) => onMaxPriceChange(Number(event.target.value))}
              />
            </label>

            <label className="icon-filter icon-filter--slider" htmlFor="max-distance-filter">
              <MapPin size={14} aria-hidden="true" />
              Distance ≤ {maxDistance.toFixed(1)} mi
              <input
                id="max-distance-filter"
                type="range"
                min={0.1}
                max={maxDistanceBound}
                step={0.1}
                value={maxDistance}
                onChange={(event) => onMaxDistanceChange(Number(event.target.value))}
              />
            </label>

            <label className="icon-filter" htmlFor="pet-policy-filter">
              <PawPrint size={14} aria-hidden="true" />
              Pets
              <select
                id="pet-policy-filter"
                value={petPolicy}
                onChange={(event) => onPetPolicyChange(event.target.value)}
              >
                <option value="any">Any</option>
                <option value="pets">Pets allowed</option>
                <option value="cats">Only cats allowed</option>
                <option value="none">No pets</option>
              </select>
            </label>

            <label className="icon-filter icon-filter--check" htmlFor="in-unit-laundry-filter">
              <Shirt size={14} aria-hidden="true" />
              In-unit Laundry
              <input
                id="in-unit-laundry-filter"
                type="checkbox"
                checked={requireLaundry}
                onChange={(event) => onRequireLaundryChange(event.target.checked)}
              />
            </label>

            <label className="icon-filter icon-filter--check" htmlFor="heating-filter">
              <Flame size={14} aria-hidden="true" />
              Heating Included
              <input
                id="heating-filter"
                type="checkbox"
                checked={requireHeating}
                onChange={(event) => onRequireHeatingChange(event.target.checked)}
              />
            </label>

            <label className="icon-filter icon-filter--check" htmlFor="bike-storage-filter">
              <Bike size={14} aria-hidden="true" />
              Bike Storage
              <input
                id="bike-storage-filter"
                type="checkbox"
                checked={requireBikeStorage}
                onChange={(event) => onRequireBikeStorageChange(event.target.checked)}
              />
            </label>
          </div>
        </div>

        <div className="results-shell">
          <div className="results-left">
            <div className="results-feed results-feed--top">
            {firstRowListings.length === 0 ? (
              <EmptyListingCard />
            ) : (
              firstRowListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} onSeeMore={() => onOpenListing(listing.id)} />
              ))
            )}
            </div>

            {remainingListings.length > 0 ? (
              <div className="results-feed results-feed--below">
                {remainingListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} onSeeMore={() => onOpenListing(listing.id)} />
                ))}
              </div>
            ) : null}
          </div>

          <aside className="results-map-rail">
            <MapPanel
              listings={mapListings}
              showHelp={showHelp}
              onHelpOpen={onHelpOpen}
              onHelpClose={onHelpClose}
              onOpenListing={onOpenListing}
            />
          </aside>
        </div>

        <div className="browse-pagination" aria-label="Listings pagination">
          <button type="button" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>
            Previous
          </button>
          <p>
            Page {currentPage} of {totalPages}
          </p>
          <button type="button" disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)}>
            Next
          </button>
        </div>
      </section>

      <footer className="map-credit">
        <p>Interactive map data: OpenStreetMap contributors</p>
        <p>Click any pin to preview and open a listing</p>
      </footer>

      {children}
    </div>
  )
}

function ListingInfoModal({ listing, onClose, onMessage }) {
  const leaseLabel = leaseDurationLabel(listing.lease)
  const distanceLabel = normalizedDistanceLabel(listing.distance)
  const pills = featurePills(listing)

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
            <img className="listing-modal__image" src={listing.imageUrl || IMAGE_ICON_URL} alt={listing.title} />
          </div>
          <div className="listing-modal__image-block">
            <img className="listing-modal__image" src={listing.imageUrl || IMAGE_ICON_URL} alt={listing.title} />
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
            <p>{distanceLabel.replace('mi', ' mi')}</p>
            <p>{listing.lease}</p>

            <div className="listing-modal__stats">
              <span className="property-pill">
                <Wallet size={14} aria-hidden="true" />
                {listing.rentLabel}
              </span>
              <span className="property-pill">
                <BedDouble size={14} aria-hidden="true" />
                {listing.beds} bd
              </span>
              <span className="property-pill">
                <Bath size={14} aria-hidden="true" />
                {listing.baths} ba
              </span>
              <span className="property-pill">
                <Ruler size={14} aria-hidden="true" />
                {listing.sqFt} sq ft
              </span>
              <span className="property-pill">
                <CalendarDays size={14} aria-hidden="true" />
                {leaseLabel}
              </span>
              {pills.map((pill) => (
                <span key={pill.label} className="property-pill property-pill--feature">
                  <pill.icon size={14} aria-hidden="true" />
                  {pill.label}
                </span>
              ))}
            </div>
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
  const distanceLabel = normalizedDistanceLabel(listing.distance)

  return (
    <div className="board board--message-open">
      <WireframeHeader activeMenu="Browse Listings" onMenuClick={onMenuClick} onProfileClick={onProfileClick} />

      <section className="message-open-layout">
        <div className="message-open-left">
          <div className="message-open-carousel">
            <div className="message-open-image">
              <img className="message-open-photo" src={listing.imageUrl || IMAGE_ICON_URL} alt={listing.title} />
            </div>
            <div className="message-open-image message-open-image--tail">
              <img className="message-open-photo" src={listing.imageUrl || IMAGE_ICON_URL} alt={listing.title} />
            </div>
          </div>

          <div className="message-open-meta">
            <div>
              <h2>{listing.title}</h2>
              <p className="message-open-meta__owner">{listing.owner}</p>
              <p>{listing.address}</p>
              <p>{distanceLabel.replace('mi', ' mi')}</p>
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

function AuthBoard({ mode, onModeChange, onSubmit, onMenuClick, pendingVerification }) {
  const isCreate = mode === BOARD.CREATE_ACCOUNT
  const isVerify = mode === BOARD.VERIFY_ACCOUNT
  const isSignIn = mode === BOARD.SIGN_IN

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

  const verifyEmailValue = verifyForm.email || pendingVerification.email || ''

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
              className={isSignIn ? 'auth-switcher__active' : ''}
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
          ) : isVerify ? (
            <form className="auth-form auth-form--verify" onSubmit={(event) => event.preventDefault()}>
              <h2>Verify Email Account</h2>
              <p className="auth-verify-copy">
                We sent a 6-digit verification code to your university email. Enter it below to activate your account.
              </p>

              <label>
                University Email
                <input
                  type="email"
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
                  value={verifyForm.code}
                  onChange={(event) => setVerifyForm((prev) => ({ ...prev, code: event.target.value }))}
                />
              </label>

              {pendingVerification.devCode ? (
                <small className="auth-dev-note">
                  Prototype email preview code: {pendingVerification.devCode}
                </small>
              ) : null}

              <button
                className="auth-submit"
                type="button"
                onClick={() => onSubmit({ mode, data: verifyForm })}
              >
                Verify Email →
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
    beds: listing?.beds || 1,
    baths: listing?.baths || 1,
    petPolicy: listing?.petPolicy || 'No pets',
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
              📷 {isEdit ? 'Replace Images' : 'Upload Images'}
            </button>

            <section className="editor-room-details">
              <h2>Room Details</h2>

              <div className="form-field">
                <label>Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                />
              </div>

              <div className="form-field">
                <label>Owner</label>
                <input
                  type="text"
                  value={form.owner}
                  onChange={(event) => setForm((prev) => ({ ...prev, owner: event.target.value }))}
                />
              </div>

              <div className="form-field">
                <label>Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
                />
              </div>

              <div className="form-field">
                <label>Monthly Price</label>
                <input
                  type="text"
                  value={form.price}
                  onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
                />
              </div>

              <div className="form-field">
                <label>Lease Details</label>
                <input
                  type="text"
                  value={form.lease}
                  onChange={(event) => setForm((prev) => ({ ...prev, lease: event.target.value }))}
                />
              </div>
            </section>
          </div>

          <div className="editor-right">
            <div className="editor-description">
              <label>Description</label>
              <textarea
                value={form.description}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                placeholder="Describe your listing in detail..."
              />
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Beds</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={form.beds}
                  onChange={(event) => setForm((prev) => ({ ...prev, beds: Number(event.target.value) }))}
                />
              </div>

              <div className="form-field">
                <label>Baths</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  step="0.5"
                  value={form.baths}
                  onChange={(event) => setForm((prev) => ({ ...prev, baths: Number(event.target.value) }))}
                />
              </div>
            </div>

            <div className="form-field">
              <label>Pet Policy</label>
              <select
                value={form.petPolicy}
                onChange={(event) => setForm((prev) => ({ ...prev, petPolicy: event.target.value }))}
              >
                <option value="No pets">No pets</option>
                <option value="Pets allowed">Pets allowed</option>
                <option value="Only cats allowed">Only cats allowed</option>
              </select>
            </div>

            <fieldset className="editor-amenities">
              <legend>Amenities</legend>
              <div className="amenities-grid">
                {[
                  'Attached Bathroom',
                  'In House Laundry', 
                  'Fully Furnished',
                  'Dishwasher',
                  'Bike Storage',
                  'Heating Included'
                ].map((amenity) => (
                  <label key={amenity}>
                    <input
                      type="checkbox"
                      checked={form.amenities.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                    />
                    {amenity}
                  </label>
                ))}
              </div>
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
  const maxPriceBound = useMemo(() => {
    const prices = listings.map((listing) => numericPrice(listing.price)).filter((price) => price > 0)
    return prices.length > 0 ? Math.max(...prices) : 3000
  }, [listings])

  const maxDistanceBound = useMemo(() => {
    const distances = listings.map((listing) => distanceMiles(listing.distance)).filter((distance) => distance > 0)
    return distances.length > 0 ? Math.max(...distances) : 3
  }, [listings])

  const [searchQuery, setSearchQuery] = useState('')
  const [minBeds, setMinBeds] = useState(0)
  const [minBaths, setMinBaths] = useState(0)
  const [maxPrice, setMaxPrice] = useState(maxPriceBound)
  const [maxDistance, setMaxDistance] = useState(maxDistanceBound)
  const [petPolicy, setPetPolicy] = useState('any')
  const [requireLaundry, setRequireLaundry] = useState(false)
  const [requireHeating, setRequireHeating] = useState(false)
  const [requireBikeStorage, setRequireBikeStorage] = useState(false)

  useEffect(() => {
    setMaxPrice((current) => (current > maxPriceBound ? maxPriceBound : current || maxPriceBound))
  }, [maxPriceBound])

  useEffect(() => {
    setMaxDistance((current) => (current > maxDistanceBound ? maxDistanceBound : current || maxDistanceBound))
  }, [maxDistanceBound])

  const filteredListings = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return listings.filter((listing) => {
      const textMatch =
        query.length === 0
        || listing.title.toLowerCase().includes(query)
        || listing.owner.toLowerCase().includes(query)
        || listing.address.toLowerCase().includes(query)

      const bedsMatch = Number(listing.beds || 0) >= minBeds
      const bathsMatch = Number(listing.baths || 0) >= minBaths
      const priceMatch = numericPrice(listing.price) <= maxPrice
      const distanceMatch = distanceMiles(listing.distance) <= maxDistance

      const listingPetPolicy = resolvedPetPolicy(listing)
      const petMatch =
        petPolicy === 'any'
        || (petPolicy === 'pets' && listingPetPolicy === 'Pets allowed')
        || (petPolicy === 'cats' && listingPetPolicy === 'Only cats allowed')
        || (petPolicy === 'none' && listingPetPolicy === 'No pets')

      const laundryMatch = !requireLaundry || hasInUnitLaundry(listing)
      const heatingMatch = !requireHeating || listing.amenities?.includes('Heating Included')
      const bikeMatch = !requireBikeStorage || listing.amenities?.includes('Bike Storage')

      return textMatch && bedsMatch && bathsMatch && priceMatch && distanceMatch && petMatch && laundryMatch && heatingMatch && bikeMatch
    })
  }, [
    listings,
    searchQuery,
    minBeds,
    minBaths,
    maxPrice,
    maxDistance,
    petPolicy,
    requireLaundry,
    requireHeating,
    requireBikeStorage,
  ])

  return (
    <div className="board board--my-listings">
      <WireframeHeader activeMenu="My Listings" onMenuClick={onMenuClick} onProfileClick={onProfileClick} />

      <section className="my-listings-body">
        <h1>My Listings</h1>

        <div className="results-controls" role="search">
          <div className="search-row">
            <Search size={16} aria-hidden="true" />
            <input
              id="my-listings-search-input"
              className="search-row__input"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by title, owner, or address"
              aria-label="Search my listings"
            />
            <button type="button" className="search-row__action" onClick={() => setSearchQuery(searchQuery.trim())}>
              Search
            </button>
          </div>

          <div className="icon-filters">
            <label className="icon-filter" htmlFor="my-min-beds-filter">
              <BedDouble size={14} aria-hidden="true" />
              Beds
              <select
                id="my-min-beds-filter"
                value={minBeds}
                onChange={(event) => setMinBeds(Number(event.target.value))}
              >
                <option value={0}>Any</option>
                <option value={1}>1+</option>
                <option value={2}>2+</option>
                <option value={3}>3+</option>
              </select>
            </label>

            <label className="icon-filter" htmlFor="my-min-baths-filter">
              <Bath size={14} aria-hidden="true" />
              Baths
              <select
                id="my-min-baths-filter"
                value={minBaths}
                onChange={(event) => setMinBaths(Number(event.target.value))}
              >
                <option value={0}>Any</option>
                <option value={1}>1+</option>
                <option value={2}>2+</option>
              </select>
            </label>

            <label className="icon-filter icon-filter--slider" htmlFor="my-max-price-filter">
              <Wallet size={14} aria-hidden="true" />
              Max Price ${maxPrice.toLocaleString()}
              <input
                id="my-max-price-filter"
                type="range"
                min={0}
                max={maxPriceBound}
                step={50}
                value={maxPrice}
                onChange={(event) => setMaxPrice(Number(event.target.value))}
              />
            </label>

            <label className="icon-filter icon-filter--slider" htmlFor="my-max-distance-filter">
              <MapPin size={14} aria-hidden="true" />
              Distance ≤ {maxDistance.toFixed(1)} mi
              <input
                id="my-max-distance-filter"
                type="range"
                min={0.1}
                max={maxDistanceBound}
                step={0.1}
                value={maxDistance}
                onChange={(event) => setMaxDistance(Number(event.target.value))}
              />
            </label>

            <label className="icon-filter" htmlFor="my-pet-policy-filter">
              <PawPrint size={14} aria-hidden="true" />
              Pets
              <select
                id="my-pet-policy-filter"
                value={petPolicy}
                onChange={(event) => setPetPolicy(event.target.value)}
              >
                <option value="any">Any</option>
                <option value="pets">Pets allowed</option>
                <option value="cats">Only cats allowed</option>
                <option value="none">No pets</option>
              </select>
            </label>

            <label className="icon-filter icon-filter--check" htmlFor="my-in-unit-laundry-filter">
              <Shirt size={14} aria-hidden="true" />
              In-unit Laundry
              <input
                id="my-in-unit-laundry-filter"
                type="checkbox"
                checked={requireLaundry}
                onChange={(event) => setRequireLaundry(event.target.checked)}
              />
            </label>

            <label className="icon-filter icon-filter--check" htmlFor="my-heating-filter">
              <Flame size={14} aria-hidden="true" />
              Heating Included
              <input
                id="my-heating-filter"
                type="checkbox"
                checked={requireHeating}
                onChange={(event) => setRequireHeating(event.target.checked)}
              />
            </label>

            <label className="icon-filter icon-filter--check" htmlFor="my-bike-storage-filter">
              <Bike size={14} aria-hidden="true" />
              Bike Storage
              <input
                id="my-bike-storage-filter"
                type="checkbox"
                checked={requireBikeStorage}
                onChange={(event) => setRequireBikeStorage(event.target.checked)}
              />
            </label>
          </div>
        </div>

        <div className="my-listings-layout">
          <div className="my-listings-grid">
            {filteredListings.length === 0 ? (
              <article className="my-listing-card my-listing-card--empty">
                <h2>{listings.length === 0 ? 'No listings yet' : 'No listings match these filters'}</h2>
                <p>
                  {listings.length === 0
                    ? 'Create your first listing from the Create Listing tab.'
                    : 'Try broadening your filters to see more listings.'}
                </p>
              </article>
            ) : (
              filteredListings.map((listing) => (
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
  const messageListRef = useRef(null)
  const activeThreadId = activeThread?.id || null
  const previousThreadIdRef = useRef(null)
  const previousMessageCountRef = useRef(0)
  const shouldAutoScrollRef = useRef(true)

  const scrollMessagesToBottom = () => {
    const node = messageListRef.current
    if (!node) {
      return
    }
    node.scrollTop = node.scrollHeight
  }

  const updateAutoScrollPreference = () => {
    const node = messageListRef.current
    if (!node) {
      return
    }

    const distanceFromBottom = node.scrollHeight - node.scrollTop - node.clientHeight
    shouldAutoScrollRef.current = distanceFromBottom <= 24
  }

  useEffect(() => {
    if (previousThreadIdRef.current !== activeThreadId) {
      previousThreadIdRef.current = activeThreadId
      previousMessageCountRef.current = messages.length
      shouldAutoScrollRef.current = true
      requestAnimationFrame(scrollMessagesToBottom)
      return
    }

    const hadNewMessages = messages.length > previousMessageCountRef.current
    previousMessageCountRef.current = messages.length

    if (hadNewMessages && shouldAutoScrollRef.current) {
      requestAnimationFrame(scrollMessagesToBottom)
    }
  }, [activeThreadId, messages])

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

            <div
              ref={messageListRef}
              className="conversation-panel__messages"
              onScroll={updateAutoScrollPreference}
            >
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
  const BROWSE_PAGE_SIZE = 8
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
  const [browsePage, setBrowsePage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [minBeds, setMinBeds] = useState(0)
  const [minBaths, setMinBaths] = useState(0)
  const [maxDistance, setMaxDistance] = useState(3)
  const [petPolicy, setPetPolicy] = useState('any')
  const [requireLaundry, setRequireLaundry] = useState(false)
  const [requireHeating, setRequireHeating] = useState(false)
  const [requireBikeStorage, setRequireBikeStorage] = useState(false)

  const [isBooting, setIsBooting] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [notice, setNotice] = useState('')
  const [pendingVerification, setPendingVerification] = useState({ email: '', devCode: '' })
  const [pendingRegistrationData, setPendingRegistrationData] = useState(null)

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
        // Check if user was previously signed in
        const savedSession = localStorage.getItem('userSession')
        const savedProfile = localStorage.getItem('userProfile')
        const wasSignedIn = savedSession ? JSON.parse(savedSession) : null
        const savedProfileData = savedProfile ? JSON.parse(savedProfile) : null

        const snapshot = await backend.bootstrap()
        if (!alive) {
          return
        }

        // If we had a saved session, restore it
        if (wasSignedIn && wasSignedIn.signedIn && savedProfileData) {
          snapshot.auth = wasSignedIn
          snapshot.user = savedProfileData
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

  // Save session and profile to localStorage whenever they change
  useEffect(() => {
    if (session.signedIn) {
      localStorage.setItem('userSession', JSON.stringify(session))
      localStorage.setItem('userProfile', JSON.stringify(profile))
    } else {
      localStorage.removeItem('userSession')
      localStorage.removeItem('userProfile')
    }
  }, [session, profile])

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

  const maxPriceBound = useMemo(() => {
    const prices = listings.map((listing) => numericPrice(listing.price)).filter((price) => price > 0)
    return prices.length > 0 ? Math.max(...prices) : 3000
  }, [listings])

  const maxDistanceBound = useMemo(() => {
    const distances = listings.map((listing) => distanceMiles(listing.distance)).filter((distance) => distance > 0)
    return distances.length > 0 ? Math.max(...distances) : 3
  }, [listings])

  const [maxPrice, setMaxPrice] = useState(maxPriceBound)

  useEffect(() => {
    setMaxPrice((current) => (current > maxPriceBound ? maxPriceBound : current || maxPriceBound))
  }, [maxPriceBound])

  useEffect(() => {
    setMaxDistance((current) => (current > maxDistanceBound ? maxDistanceBound : current || maxDistanceBound))
  }, [maxDistanceBound])

  const filteredListings = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return listings.filter((listing) => {
      const textMatch =
        query.length === 0
        || listing.title.toLowerCase().includes(query)
        || listing.owner.toLowerCase().includes(query)
        || listing.address.toLowerCase().includes(query)

      const bedsMatch = Number(listing.beds || 0) >= minBeds
      const bathsMatch = Number(listing.baths || 0) >= minBaths
      const priceMatch = numericPrice(listing.price) <= maxPrice
      const distanceMatch = distanceMiles(listing.distance) <= maxDistance

      const listingPetPolicy = resolvedPetPolicy(listing)
      const petMatch =
        petPolicy === 'any'
        || (petPolicy === 'pets' && listingPetPolicy === 'Pets allowed')
        || (petPolicy === 'cats' && listingPetPolicy === 'Only cats allowed')
        || (petPolicy === 'none' && listingPetPolicy === 'No pets')

      const laundryMatch = !requireLaundry || hasInUnitLaundry(listing)
      const heatingMatch = !requireHeating || listing.amenities?.includes('Heating Included')
      const bikeMatch = !requireBikeStorage || listing.amenities?.includes('Bike Storage')

      return textMatch && bedsMatch && bathsMatch && priceMatch && distanceMatch && petMatch && laundryMatch && heatingMatch && bikeMatch
    })
  }, [
    listings,
    searchQuery,
    minBeds,
    minBaths,
    maxPrice,
    maxDistance,
    petPolicy,
    requireLaundry,
    requireHeating,
    requireBikeStorage,
  ])

  const totalBrowsePages = Math.max(1, Math.ceil(filteredListings.length / BROWSE_PAGE_SIZE))

  const pagedListings = useMemo(() => {
    const start = (browsePage - 1) * BROWSE_PAGE_SIZE
    return filteredListings.slice(start, start + BROWSE_PAGE_SIZE)
  }, [filteredListings, browsePage])

  useEffect(() => {
    setBrowsePage((current) => Math.min(current, totalBrowsePages))
  }, [totalBrowsePages])

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
        setPendingRegistrationData(data)
        setPendingVerification({
          email: response.email || data.email || '',
          devCode: response.devVerificationCode || '',
        })
        setBoard(BOARD.VERIFY_ACCOUNT)
      } catch (error) {
        setNotice(error.message || 'Unable to create account.')
      } finally {
        setIsSyncing(false)
      }
      return
    }

    if (mode === BOARD.VERIFY_ACCOUNT) {
      const snapshot = await runSnapshotTask(
        () => backend.verifyUniversityEmail({ ...data, profileData: pendingRegistrationData }),
        'Email verified and signed in.',
      )

      if (snapshot) {
        setPendingRegistrationData(null)
        setPendingVerification({ email: '', devCode: '' })
        setBoard(BOARD.MY_ACCOUNT)
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
        listings={pagedListings}
        mapListings={filteredListings}
        showHelp={false}
        onHelpOpen={() => setBoard(BOARD.BROWSE_HELP)}
        onHelpClose={() => setBoard(BOARD.BROWSE)}
        onOpenListing={openListing}
        activeMenu="Browse Listings"
        onMenuClick={handleMenuClick}
        onProfileClick={handleProfileClick}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        minBeds={minBeds}
        onMinBedsChange={setMinBeds}
        minBaths={minBaths}
        onMinBathsChange={setMinBaths}
        maxPrice={maxPrice}
        onMaxPriceChange={setMaxPrice}
        maxPriceBound={maxPriceBound}
        maxDistance={maxDistance}
        onMaxDistanceChange={setMaxDistance}
        maxDistanceBound={maxDistanceBound}
        petPolicy={petPolicy}
        onPetPolicyChange={setPetPolicy}
        requireLaundry={requireLaundry}
        onRequireLaundryChange={setRequireLaundry}
        requireHeating={requireHeating}
        onRequireHeatingChange={setRequireHeating}
        requireBikeStorage={requireBikeStorage}
        onRequireBikeStorageChange={setRequireBikeStorage}
        currentPage={browsePage}
        totalPages={totalBrowsePages}
        onPageChange={setBrowsePage}
      />
    )
  } else if (board === BOARD.BROWSE_HELP) {
    renderedBoard = (
      <SearchLayout
        listings={pagedListings}
        mapListings={filteredListings}
        showHelp
        onHelpOpen={() => setBoard(BOARD.BROWSE_HELP)}
        onHelpClose={() => setBoard(BOARD.BROWSE)}
        onOpenListing={openListing}
        activeMenu="Browse Listings"
        onMenuClick={handleMenuClick}
        onProfileClick={handleProfileClick}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        minBeds={minBeds}
        onMinBedsChange={setMinBeds}
        minBaths={minBaths}
        onMinBathsChange={setMinBaths}
        maxPrice={maxPrice}
        onMaxPriceChange={setMaxPrice}
        maxPriceBound={maxPriceBound}
        maxDistance={maxDistance}
        onMaxDistanceChange={setMaxDistance}
        maxDistanceBound={maxDistanceBound}
        petPolicy={petPolicy}
        onPetPolicyChange={setPetPolicy}
        requireLaundry={requireLaundry}
        onRequireLaundryChange={setRequireLaundry}
        requireHeating={requireHeating}
        onRequireHeatingChange={setRequireHeating}
        requireBikeStorage={requireBikeStorage}
        onRequireBikeStorageChange={setRequireBikeStorage}
        currentPage={browsePage}
        totalPages={totalBrowsePages}
        onPageChange={setBrowsePage}
      />
    )
  } else if (board === BOARD.BROWSE_INFO && activeListing) {
    renderedBoard = (
      <SearchLayout
        listings={pagedListings}
        mapListings={filteredListings}
        showHelp={false}
        onHelpOpen={() => setBoard(BOARD.BROWSE_HELP)}
        onHelpClose={() => setBoard(BOARD.BROWSE)}
        onOpenListing={openListing}
        activeMenu="Browse Listings"
        onMenuClick={handleMenuClick}
        onProfileClick={handleProfileClick}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        minBeds={minBeds}
        onMinBedsChange={setMinBeds}
        minBaths={minBaths}
        onMinBathsChange={setMinBaths}
        maxPrice={maxPrice}
        onMaxPriceChange={setMaxPrice}
        maxPriceBound={maxPriceBound}
        maxDistance={maxDistance}
        onMaxDistanceChange={setMaxDistance}
        maxDistanceBound={maxDistanceBound}
        petPolicy={petPolicy}
        onPetPolicyChange={setPetPolicy}
        requireLaundry={requireLaundry}
        onRequireLaundryChange={setRequireLaundry}
        requireHeating={requireHeating}
        onRequireHeatingChange={setRequireHeating}
        requireBikeStorage={requireBikeStorage}
        onRequireBikeStorageChange={setRequireBikeStorage}
        currentPage={browsePage}
        totalPages={totalBrowsePages}
        onPageChange={setBrowsePage}
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
  } else if (board === BOARD.CREATE_ACCOUNT || board === BOARD.VERIFY_ACCOUNT || board === BOARD.SIGN_IN) {
    renderedBoard = (
      <AuthBoard
        mode={board}
        onModeChange={setBoard}
        onSubmit={handleAuthSubmit}
        onMenuClick={handleMenuClick}
        pendingVerification={pendingVerification}
      />
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
        <div className="loading-indicator" aria-live="polite" aria-label="Loading">
          <span className="loading-indicator__spinner" aria-hidden="true" />
        </div>
      ) : null}

      {notice ? <div className="floating-notice">{notice}</div> : null}
    </main>
  )
}

export default App
