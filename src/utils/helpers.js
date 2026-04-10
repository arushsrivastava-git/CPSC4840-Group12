export function pickActiveById(items, id) {
  if (!Array.isArray(items) || items.length === 0) {
    return null
  }

  return items.find((item) => item.id === id) || items[0]
}

export function leaseDurationLabel(lease = '') {
  const match = lease.match(/^(\d+\s+(?:year|month)s?)/i)
  return match ? match[1] : lease
}

export function numericPrice(priceLabel = '') {
  const digits = String(priceLabel).replace(/[^\d]/g, '')
  return Number(digits || '0')
}

export function distanceMiles(distanceLabel = '') {
  const match = String(distanceLabel).match(/(\d+(?:\.\d+)?)\s*mi/i)
  return match ? Number(match[1]) : 0
}

export function normalizedDistanceLabel(distanceLabel = '') {
  return String(distanceLabel).replace('from center of campus', 'from campus')
}

export function resolvedPetPolicy(listing) {
  if (listing.petPolicy) {
    return listing.petPolicy
  }

  if (listing.amenities?.includes('Pet Friendly')) {
    return 'Pets allowed'
  }

  return 'No pets'
}

export function hasInUnitLaundry(listing) {
  return Boolean(listing.inUnitLaundry || listing.amenities?.includes('In House Laundry'))
}

export function featurePills(listing) {
  const pills = []
  const petPolicy = resolvedPetPolicy(listing)

  pills.push({ icon: 'PawPrint', label: petPolicy })

  if (hasInUnitLaundry(listing)) {
    pills.push({ icon: 'Shirt', label: 'In-unit laundry' })
  }

  if (listing.amenities?.includes('Heating Included')) {
    pills.push({ icon: 'Flame', label: 'Heating included' })
  }

  if (listing.amenities?.includes('Bike Storage')) {
    pills.push({ icon: 'Bike', label: 'Bike storage' })
  }

  return pills
}