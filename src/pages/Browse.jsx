import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  Bath,
  BedDouble,
  Bike,
  Flame,
  MapPin,
  PawPrint,
  Ruler,
  Search,
  Shirt,
  Wallet,
} from 'lucide-react'
import ListingCard, { EmptyListingCard } from '../components/ListingCard'
import MapPanel from '../components/MapPanel'
import ListingInfoModal from '../components/ListingInfoModal'
import { 
  numericPrice, 
  distanceMiles, 
  resolvedPetPolicy, 
  hasInUnitLaundry 
} from '../utils/helpers'

const BROWSE_PAGE_SIZE = 8

export default function Browse({ 
  listings, 
  user, 
  onOpenThread,
  onMarkThreadRead 
}) {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  
  // Get URL parameters
  const listingId = searchParams.get('listing')
  const showHelp = searchParams.get('help') === 'true'
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [minBeds, setMinBeds] = useState(0)
  const [minBaths, setMinBaths] = useState(0)
  const [maxDistance, setMaxDistance] = useState(3)
  const [petPolicy, setPetPolicy] = useState('any')
  const [requireLaundry, setRequireLaundry] = useState(false)
  const [requireHeating, setRequireHeating] = useState(false)
  const [requireBikeStorage, setRequireBikeStorage] = useState(false)
  const [browsePage, setBrowsePage] = useState(1)

  // Calculate bounds for sliders
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

  // Filter listings
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

  // URL handlers
  const openListing = (id) => {
    setSearchParams({ ...Object.fromEntries(searchParams), listing: id })
  }

  const closeListing = () => {
    const newParams = new URLSearchParams(searchParams)
    newParams.delete('listing')
    setSearchParams(newParams)
  }

  const toggleHelp = () => {
    const newParams = new URLSearchParams(searchParams)
    if (showHelp) {
      newParams.delete('help')
    } else {
      newParams.set('help', 'true')
    }
    setSearchParams(newParams)
  }

  const handleMessage = async (listingId) => {
    if (!user) {
      navigate('/auth?mode=signin')
      return
    }
    
    const listing = listings.find(l => l.id === listingId)
    if (listing && listing.threadId) {
      await onMarkThreadRead?.(listing.threadId)
      navigate(`/messages?thread=${listing.threadId}`)
    }
  }

  // Get selected listing
  const selectedListing = listingId ? listings.find(l => l.id === listingId) : null

  const firstRowListings = pagedListings.slice(0, 2)
  const remainingListings = pagedListings.slice(2)

  return (
    <div className="board board--search">
      <section className="search-body">
        <h1>Browse Listings</h1>

        <div className="results-controls" role="search">
          <div className="search-row">
            <Search size={16} aria-hidden="true" />
            <input
              id="listing-search-input"
              className="search-row__input"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by title, owner, or address"
              aria-label="Search listings"
            />
            <button
              type="button"
              className="search-row__action"
              onClick={() => setSearchQuery(searchQuery.trim())}
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
                onChange={(event) => setMinBeds(Number(event.target.value))}
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
                onChange={(event) => setMinBaths(Number(event.target.value))}
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
                onChange={(event) => setMaxPrice(Number(event.target.value))}
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
                onChange={(event) => setMaxDistance(Number(event.target.value))}
              />
            </label>

            <label className="icon-filter" htmlFor="pet-policy-filter">
              <PawPrint size={14} aria-hidden="true" />
              Pets
              <select
                id="pet-policy-filter"
                value={petPolicy}
                onChange={(event) => setPetPolicy(event.target.value)}
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
                onChange={(event) => setRequireLaundry(event.target.checked)}
              />
            </label>

            <label className="icon-filter icon-filter--check" htmlFor="heating-filter">
              <Flame size={14} aria-hidden="true" />
              Heating Included
              <input
                id="heating-filter"
                type="checkbox"
                checked={requireHeating}
                onChange={(event) => setRequireHeating(event.target.checked)}
              />
            </label>

            <label className="icon-filter icon-filter--check" htmlFor="bike-storage-filter">
              <Bike size={14} aria-hidden="true" />
              Bike Storage
              <input
                id="bike-storage-filter"
                type="checkbox"
                checked={requireBikeStorage}
                onChange={(event) => setRequireBikeStorage(event.target.checked)}
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
                  <ListingCard key={listing.id} listing={listing} onSeeMore={() => openListing(listing.id)} />
                ))
              )}
            </div>

            {remainingListings.length > 0 ? (
              <div className="results-feed results-feed--below">
                {remainingListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} onSeeMore={() => openListing(listing.id)} />
                ))}
              </div>
            ) : null}
          </div>

          <aside className="results-map-rail">
            <MapPanel
              listings={filteredListings}
              showHelp={showHelp}
              onHelpToggle={toggleHelp}
              onOpenListing={openListing}
            />
          </aside>
        </div>

        <div className="browse-pagination" aria-label="Listings pagination">
          <button type="button" disabled={browsePage <= 1} onClick={() => setBrowsePage(browsePage - 1)}>
            Previous
          </button>
          <p>
            Page {browsePage} of {totalBrowsePages}
          </p>
          <button type="button" disabled={browsePage >= totalBrowsePages} onClick={() => setBrowsePage(browsePage + 1)}>
            Next
          </button>
        </div>
      </section>

      <footer className="map-credit">
        <p>Interactive map data: OpenStreetMap contributors</p>
        <p>Click any pin to preview and open a listing</p>
      </footer>

      {selectedListing && (
        <ListingInfoModal
          listing={selectedListing}
          user={user}
          onClose={closeListing}
          onMessage={handleMessage}
        />
      )}
    </div>
  )
}