import {
  Bath,
  BedDouble,
  CalendarDays,
  MapPin,
  Ruler,
  Wallet,
} from 'lucide-react'
import { IMAGE_ICON_URL } from '../utils/constants'
import { 
  leaseDurationLabel, 
  normalizedDistanceLabel, 
  featurePills 
} from '../utils/helpers'

function IconMap({ iconName, size = 14 }) {
  const icons = {
    PawPrint: () => <svg viewBox="0 0 24 24" width={size} height={size}><path d="M11 2c1.6 0 3 1.4 3 3s-1.4 3-3 3-3-1.4-3-3 1.4-3 3-3zM8 8c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zM16 8c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zM12 14c-2.2 0-4.2.9-6 2.5.3 1.1 2.5 3.5 6 3.5s5.7-2.4 6-3.5c-1.8-1.6-3.8-2.5-6-2.5z"/></svg>,
    Shirt: () => <svg viewBox="0 0 24 24" width={size} height={size}><path d="M9 3h6l1 3-2 1v11H8V7L6 6l1-3zM9 1C8.4 1 8 1.4 8 2s.4 1 1 1h6c.6 0 1-.4 1-1s-.4-1-1-1H9z"/></svg>,
    Flame: () => <svg viewBox="0 0 24 24" width={size} height={size}><path d="M8.5 14.5c0-1.1.4-2.1 1.1-2.8L12 9.3l2.4 2.4c.7.7 1.1 1.7 1.1 2.8 0 2.2-1.8 4-4 4s-4-1.8-4-4zM12 2l-4 7c-1.1 1.9-1 4.4.3 6.2 1.3 1.8 3.5 2.8 5.7 2.8s4.4-1 5.7-2.8c1.3-1.8 1.4-4.3.3-6.2L12 2z"/></svg>,
    Bike: () => <svg viewBox="0 0 24 24" width={size} height={size}><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><path d="M15 6.5C15 5.1 13.9 4 12.5 4S10 5.1 10 6.5 11.1 9 12.5 9 15 7.9 15 6.5zM12 11.5l-3 6h6l-3-6z"/></svg>,
  }
  
  const IconComponent = icons[iconName]
  return IconComponent ? <IconComponent /> : null
}

function ImagePlaceholder({ alt = '' }) {
  return <img className="image-placeholder" src={IMAGE_ICON_URL} alt={alt} />
}

export function EmptyListingCard() {
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

export default function ListingCard({ listing, onSeeMore, showActions = false, onEdit, onOpen }) {
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
              <IconMap iconName={pill.icon} size={14} />
              {pill.label}
            </span>
          ))}
        </div>
      </div>

      {showActions ? (
        <div className="listing-card__actions">
          <button type="button" onClick={onEdit}>
            Edit Post
          </button>
          <button type="button" onClick={onOpen}>
            Open
          </button>
        </div>
      ) : onSeeMore ? (
        <button className="listing-card__cta" type="button" onClick={onSeeMore}>
          See More
        </button>
      ) : (
        <div className="listing-card__cta listing-card__cta--disabled">See More</div>
      )}
    </article>
  )
}