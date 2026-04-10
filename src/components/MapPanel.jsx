import { useEffect, useMemo, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import { MAP_CENTER } from '../utils/constants'

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

export default function MapPanel({ listings, showHelp, onHelpToggle, onOpenListing }) {
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

      <button 
        className="map-help-toggle" 
        type="button" 
        aria-label="Map help" 
        onClick={onHelpToggle}
      >
        {showHelp ? 'Hide map help' : 'Map help'}
      </button>

      {showHelp ? (
        <aside className="map-help" aria-live="polite">
          <button className="map-help__close" type="button" onClick={onHelpToggle}>
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