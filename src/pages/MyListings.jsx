import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bath,
  BedDouble,
  Bike,
  Flame,
  MapPin,
  PawPrint,
  Search,
  Shirt,
  Wallet,
} from 'lucide-react'
import { 
  numericPrice, 
  distanceMiles, 
  resolvedPetPolicy, 
  hasInUnitLaundry 
} from '../utils/helpers'

export default function MyListings({ 
  listings, 
  currentUserId,
  currentProfile,
  onEditListing, 
  onOpenListing 
}) {
  const navigate = useNavigate()
  const profileFullName = `${currentProfile?.firstName || ''} ${currentProfile?.lastName || ''}`.trim().toLowerCase()
  const profileEmail = (currentProfile?.email || '').trim().toLowerCase()

  const ownedListings = useMemo(() => {
    return listings.filter((listing) => {
      if (currentUserId && listing.ownerUserId) {
        return listing.ownerUserId === currentUserId
      }

      const listingOwner = String(listing.owner || '').trim().toLowerCase()
      const matchesName = profileFullName.length > 0 && listingOwner === profileFullName
      const matchesEmail = profileEmail.length > 0 && listingOwner === profileEmail
      return matchesName || matchesEmail
    })
  }, [listings, currentUserId, profileFullName, profileEmail])

  const uniqueOwnedListings = useMemo(() => {
    const bySignature = new Map()

    ownedListings.forEach((listing) => {
      const signature = [
        String(listing.ownerUserId || '').trim().toLowerCase(),
        String(listing.owner || '').trim().toLowerCase(),
        String(listing.title || '').trim().toLowerCase(),
        String(listing.address || '').trim().toLowerCase(),
        String(listing.price || '').trim().toLowerCase(),
        String(listing.lease || '').trim().toLowerCase(),
        String(listing.description || '').trim().toLowerCase(),
        String(listing.beds ?? ''),
        String(listing.baths ?? ''),
      ].join('|')

      const existing = bySignature.get(signature)
      if (!existing) {
        bySignature.set(signature, listing)
        return
      }

      const listingTime = new Date(listing.createdAt || 0).getTime()
      const existingTime = new Date(existing.createdAt || 0).getTime()
      if (listingTime > existingTime) {
        bySignature.set(signature, listing)
      }
    })

    return Array.from(bySignature.values())
  }, [ownedListings])
  
  const maxPriceBound = useMemo(() => {
    const prices = uniqueOwnedListings.map((listing) => numericPrice(listing.price)).filter((price) => price > 0)
    return prices.length > 0 ? Math.max(...prices) : 3000
  }, [uniqueOwnedListings])

  const maxDistanceBound = useMemo(() => {
    const distances = uniqueOwnedListings.map((listing) => distanceMiles(listing.distance)).filter((distance) => distance > 0)
    return distances.length > 0 ? Math.max(...distances) : 3
  }, [uniqueOwnedListings])

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

    return uniqueOwnedListings.filter((listing) => {
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
    uniqueOwnedListings,
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

  const handleEdit = (listingId) => {
    navigate(`/edit-listing/${listingId}`)
  }

  const handleOpen = (listingId) => {
    navigate(`/?listing=${listingId}`)
  }

  return (
    <div className="board board--my-listings">
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
                <h2>{uniqueOwnedListings.length === 0 ? 'No listings yet' : 'No listings match these filters'}</h2>
                <p>
                  {uniqueOwnedListings.length === 0
                    ? 'Create your first listing from the Create Listing tab.'
                    : 'Try broadening your filters to see more listings.'}
                </p>
              </article>
            ) : (
              filteredListings.map((listing) => (
                <article key={listing.id} className="my-listing-card">
                  <div className="my-listing-card__image">
                    {listing.imageUrl ? (
                      <img className="image-placeholder" src={listing.imageUrl} alt={listing.title} />
                    ) : (
                      <div className="image-placeholder" aria-hidden="true" />
                    )}
                  </div>

                  <h2>{listing.title}</h2>
                  <p>{listing.owner}</p>
                  <p>{listing.address}</p>

                  <div className="my-listing-card__actions">
                    <button type="button" onClick={() => handleEdit(listing.id)}>
                      Edit Post
                    </button>
                    <button type="button" onClick={() => handleOpen(listing.id)}>
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