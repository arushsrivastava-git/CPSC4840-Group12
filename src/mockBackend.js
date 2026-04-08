const STORAGE_KEY = 'group12_hifi_backend_v7'
const MIN_DELAY_MS = 280
const MAX_DELAY_MS = 760

const LISTING_SEED = [
  {
    title: '2 Bed, 2 Bath East Rock',
    owner: 'John Doe',
    address: '123 Apple St, New Haven, CT',
    price: '$1,500 / month',
    rentLabel: '$1500/mo',
    distance: '0.7mi from campus',
    lease: '1 year lease - Starts May 17',
    roommates: '2 roommates',
    description: 'Bright flat with open kitchen, tall windows, and a quiet study corner.',
    amenities: ['Attached Bathroom', 'In House Laundry', 'Fully Furnished'],
    neighborhoodId: 'nh-east-rock',
    beds: 2,
    baths: 2,
    sqFt: 980,
    lat: 41.3206,
    lng: -72.9093,
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: '1 Bed Orange Street',
    owner: 'Mary Smith',
    address: '472 Orange St, New Haven, CT',
    price: '$800 / month',
    rentLabel: '$800/mo',
    distance: '1.4mi from campus',
    lease: '1 year lease - Starts Aug 1',
    roommates: '1 roommate',
    description: 'Cozy one-bedroom with updated appliances and strong natural light.',
    amenities: ['Heating Included', 'Bike Storage', 'Pet Friendly'],
    neighborhoodId: 'nh-downtown',
    beds: 1,
    baths: 1,
    sqFt: 610,
    lat: 41.3188,
    lng: -72.9145,
    petPolicy: 'Only cats allowed',
    imageUrl: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: '3 Bed Chapel Hub',
    owner: 'Alex Kim',
    address: '88 Chapel St, New Haven, CT',
    price: '$2,100 / month',
    rentLabel: '$2100/mo',
    distance: '0.5mi from campus',
    lease: '9 month lease - Starts Sep 1',
    roommates: '2 roommates',
    description: 'Large shared apartment with expansive common room and work-friendly layout.',
    amenities: ['Dishwasher', 'Central Air', 'Study Room'],
    neighborhoodId: 'nh-wooster',
    beds: 3,
    baths: 2,
    sqFt: 1280,
    lat: 41.3075,
    lng: -72.9273,
    petPolicy: 'No pets',
    imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: 'Studio Crown Loft',
    owner: 'Lina Patel',
    address: '17 Crown St, New Haven, CT',
    price: '$1,250 / month',
    rentLabel: '$1250/mo',
    distance: '0.6mi from campus',
    lease: '12 month lease - Starts Jun 1',
    roommates: 'No roommates',
    description: 'Renovated loft with high ceilings, built-in desk, and modern finishes.',
    amenities: ['Fully Furnished', 'Heating Included', 'Bike Storage'],
    neighborhoodId: 'nh-downtown',
    beds: 0,
    baths: 1,
    sqFt: 520,
    lat: 41.3065,
    lng: -72.9257,
    imageUrl: 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: '4 Bed Edgewood Townhouse',
    owner: 'Sam O\'Brien',
    address: '204 Edgewood Ave, New Haven, CT',
    price: '$2,900 / month',
    rentLabel: '$2900/mo',
    distance: '1.2mi from campus',
    lease: '10 month lease - Starts Aug 15',
    roommates: '3 roommates',
    description: 'Three-level townhouse with backyard and generous storage.',
    amenities: ['In House Laundry', 'Dishwasher', 'Parking Spot'],
    neighborhoodId: 'nh-westville',
    beds: 4,
    baths: 2,
    sqFt: 1670,
    lat: 41.312,
    lng: -72.9464,
    imageUrl: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: '2 Bed River View',
    owner: 'Nora Zhang',
    address: '58 Frontage Rd, New Haven, CT',
    price: '$1,980 / month',
    rentLabel: '$1980/mo',
    distance: '0.9mi from campus',
    lease: '12 month lease - Starts Jul 1',
    roommates: '1 roommate',
    description: 'Corner unit with skyline views and quiet evenings.',
    amenities: ['Gym Access', 'Elevator', 'Pet Friendly'],
    neighborhoodId: 'nh-wooster',
    beds: 2,
    baths: 1,
    sqFt: 870,
    lat: 41.3018,
    lng: -72.9237,
    petPolicy: 'Pets allowed',
    imageUrl: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: '2 Bed Wooster Square',
    owner: 'Eli Carson',
    address: '11 Olive St, New Haven, CT',
    price: '$1,720 / month',
    rentLabel: '$1720/mo',
    distance: '0.8mi from campus',
    lease: '12 month lease - Starts Jul 15',
    roommates: '1 roommate',
    description: 'Historic brick building with updated kitchen and hardwood floors.',
    amenities: ['Dishwasher', 'Bike Storage', 'Heating Included'],
    neighborhoodId: 'nh-wooster',
    beds: 2,
    baths: 1,
    sqFt: 810,
    lat: 41.3049,
    lng: -72.9146,
    imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: '1 Bed Elm Street',
    owner: 'Sofia Kim',
    address: '299 Elm St, New Haven, CT',
    price: '$1,180 / month',
    rentLabel: '$1180/mo',
    distance: '0.4mi from campus',
    lease: '11 month lease - Starts Aug 20',
    roommates: 'No roommates',
    description: 'Walkable location with bright kitchen and secure entry.',
    amenities: ['Elevator', 'Quiet Hours', 'Heating Included'],
    neighborhoodId: 'nh-downtown',
    beds: 1,
    baths: 1,
    sqFt: 640,
    lat: 41.3083,
    lng: -72.9326,
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: '3 Bed Audubon House',
    owner: 'Darius Bell',
    address: '67 Audubon St, New Haven, CT',
    price: '$2,350 / month',
    rentLabel: '$2350/mo',
    distance: '0.5mi from campus',
    lease: '12 month lease - Starts Sep 1',
    roommates: '2 roommates',
    description: 'Spacious shared home near restaurants and grocery stores.',
    amenities: ['In House Laundry', 'Parking Spot', 'Dishwasher'],
    neighborhoodId: 'nh-east-rock',
    beds: 3,
    baths: 2,
    sqFt: 1220,
    lat: 41.311,
    lng: -72.9248,
    imageUrl: 'https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: '1 Bed State Street',
    owner: 'Camila Ruiz',
    address: '400 State St, New Haven, CT',
    price: '$1,040 / month',
    rentLabel: '$1040/mo',
    distance: '0.9mi from campus',
    lease: '10 month lease - Starts Aug 1',
    roommates: 'No roommates',
    description: 'Minimal one-bedroom with excellent transit access.',
    amenities: ['Pet Friendly', 'Bike Storage', 'Quiet Hours'],
    neighborhoodId: 'nh-downtown',
    beds: 1,
    baths: 1,
    sqFt: 560,
    lat: 41.3155,
    lng: -72.9171,
    petPolicy: 'Pets allowed',
    imageUrl: 'https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: '2 Bed Whitney Modern',
    owner: 'Noah Green',
    address: '180 Whitney Ave, New Haven, CT',
    price: '$1,860 / month',
    rentLabel: '$1860/mo',
    distance: '0.6mi from campus',
    lease: '12 month lease - Starts Jun 10',
    roommates: '1 roommate',
    description: 'Contemporary two-bedroom with balcony and morning sun.',
    amenities: ['Fully Furnished', 'Gym Access', 'Elevator'],
    neighborhoodId: 'nh-east-rock',
    beds: 2,
    baths: 2,
    sqFt: 940,
    lat: 41.3164,
    lng: -72.914,
    imageUrl: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: '3 Bed Trumbull Place',
    owner: 'Mina Hossain',
    address: '72 Trumbull St, New Haven, CT',
    price: '$2,280 / month',
    rentLabel: '$2280/mo',
    distance: '0.5mi from campus',
    lease: '11 month lease - Starts Aug 5',
    roommates: '2 roommates',
    description: 'Great group layout with equal-sized bedrooms and big living room.',
    amenities: ['Dishwasher', 'In House Laundry', 'Rooftop Access'],
    neighborhoodId: 'nh-downtown',
    beds: 3,
    baths: 2,
    sqFt: 1180,
    lat: 41.3094,
    lng: -72.9278,
    imageUrl: 'https://images.unsplash.com/photo-1464146072230-91cabc968266?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: '2 Bed York Street',
    owner: 'Grace Lee',
    address: '265 York St, New Haven, CT',
    price: '$1,690 / month',
    rentLabel: '$1690/mo',
    distance: '0.3mi from campus',
    lease: '12 month lease - Starts Jun 20',
    roommates: '1 roommate',
    description: 'Classic floor plan, fast walk to campus libraries.',
    amenities: ['Heating Included', 'Bike Storage', 'Quiet Hours'],
    neighborhoodId: 'nh-downtown',
    beds: 2,
    baths: 1,
    sqFt: 780,
    lat: 41.3058,
    lng: -72.9317,
    imageUrl: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: '1 Bed Prospect Hill',
    owner: 'Owen Pike',
    address: '95 Prospect St, New Haven, CT',
    price: '$1,330 / month',
    rentLabel: '$1330/mo',
    distance: '0.8mi from campus',
    lease: '12 month lease - Starts Jul 10',
    roommates: 'No roommates',
    description: 'Quiet block, large bedroom, and a dedicated office nook.',
    amenities: ['Attached Bathroom', 'Pet Friendly', 'Heating Included'],
    neighborhoodId: 'nh-east-rock',
    beds: 1,
    baths: 1,
    sqFt: 620,
    lat: 41.3182,
    lng: -72.9221,
    imageUrl: 'https://images.unsplash.com/photo-1495433324511-bf8e92934d90?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: '2 Bed Howe Street',
    owner: 'Bianca Tran',
    address: '145 Howe St, New Haven, CT',
    price: '$1,760 / month',
    rentLabel: '$1760/mo',
    distance: '1.0mi from campus',
    lease: '10 month lease - Starts Aug 1',
    roommates: '1 roommate',
    description: 'Two-bedroom with renovated bathroom and strong bus access.',
    amenities: ['In House Laundry', 'Dishwasher', 'Parking Spot'],
    neighborhoodId: 'nh-westville',
    beds: 2,
    baths: 1,
    sqFt: 860,
    lat: 41.3138,
    lng: -72.9371,
    imageUrl: 'https://images.unsplash.com/photo-1486946255434-2466348c2166?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: '3 Bed Davenport Row',
    owner: 'Kai Morris',
    address: '29 Davenport Ave, New Haven, CT',
    price: '$2,020 / month',
    rentLabel: '$2020/mo',
    distance: '1.1mi from campus',
    lease: '12 month lease - Starts Sep 1',
    roommates: '2 roommates',
    description: 'Large rowhouse with roomy kitchen and private backyard.',
    amenities: ['In House Laundry', 'Parking Spot', 'Pet Friendly'],
    neighborhoodId: 'nh-westville',
    beds: 3,
    baths: 2,
    sqFt: 1260,
    lat: 41.2978,
    lng: -72.9334,
    imageUrl: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: '2 Bed Court Street',
    owner: 'Anya Brooks',
    address: '15 Court St, New Haven, CT',
    price: '$1,840 / month',
    rentLabel: '$1840/mo',
    distance: '0.4mi from campus',
    lease: '11 month lease - Starts Jul 25',
    roommates: '1 roommate',
    description: 'Near downtown core, with premium finishes and elevator access.',
    amenities: ['Elevator', 'Gym Access', 'Quiet Hours'],
    neighborhoodId: 'nh-downtown',
    beds: 2,
    baths: 2,
    sqFt: 900,
    lat: 41.3042,
    lng: -72.9288,
    petPolicy: 'No pets',
    imageUrl: 'https://images.unsplash.com/photo-1502005097973-6a7082348e28?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: '1 Bed Saint Ronan',
    owner: 'Rafael Cruz',
    address: '205 Saint Ronan St, New Haven, CT',
    price: '$1,210 / month',
    rentLabel: '$1210/mo',
    distance: '1.3mi from campus',
    lease: '12 month lease - Starts Aug 10',
    roommates: 'No roommates',
    description: 'Quiet street, recently renovated interior, and tree-lined views.',
    amenities: ['Heating Included', 'Bike Storage', 'Quiet Hours'],
    neighborhoodId: 'nh-east-rock',
    beds: 1,
    baths: 1,
    sqFt: 590,
    lat: 41.3271,
    lng: -72.9174,
    imageUrl: 'https://images.unsplash.com/photo-1505692952047-1a78307da8f2?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: '4 Bed Winchester House',
    owner: 'Taylor Moss',
    address: '310 Winchester Ave, New Haven, CT',
    price: '$2,760 / month',
    rentLabel: '$2760/mo',
    distance: '1.5mi from campus',
    lease: '12 month lease - Starts Sep 1',
    roommates: '3 roommates',
    description: 'Generous four-bedroom with driveway parking and storage basement.',
    amenities: ['Parking Spot', 'In House Laundry', 'Dishwasher'],
    neighborhoodId: 'nh-westville',
    beds: 4,
    baths: 2,
    sqFt: 1740,
    lat: 41.3215,
    lng: -72.9397,
    imageUrl: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: '2 Bed Whitney Terrace',
    owner: 'Maya Chen',
    address: '250 Whitney Ave, New Haven, CT',
    price: '$1,920 / month',
    rentLabel: '$1920/mo',
    distance: '0.7mi from campus',
    lease: '10 month lease - Starts Aug 18',
    roommates: '1 roommate',
    description: 'Stylish interior with modern fixtures and large windows.',
    amenities: ['Fully Furnished', 'Gym Access', 'Elevator'],
    neighborhoodId: 'nh-east-rock',
    beds: 2,
    baths: 2,
    sqFt: 960,
    lat: 41.3202,
    lng: -72.9126,
    imageUrl: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=1600&q=80',
  },
]

const SEED_LISTINGS = LISTING_SEED.map((listing, index) => ({
  ...listing,
  id: `listing-${index + 1}`,
  threadId: `thread-${index + 1}`,
  createdAt: new Date(Date.parse('2026-04-06T14:00:00.000Z') - index * 4 * 60 * 60 * 1000).toISOString(),
}))

const SEED_THREADS = SEED_LISTINGS.map((listing, index) => ({
  id: listing.threadId,
  listingId: listing.id,
  user: listing.owner,
  subject: `${listing.title} Listing`,
  preview: `Hi! Is ${listing.title.toLowerCase()} still available?`,
  unread: index % 3 !== 0,
  time: `${index + 1}h ago`,
  updatedAt: new Date(Date.parse('2026-04-06T13:45:00.000Z') - index * 90 * 60 * 1000).toISOString(),
}))

const SEED_MESSAGES = Object.fromEntries(
  SEED_LISTINGS.map((listing) => [
    listing.threadId,
    [
      { sender: 'them', text: `Hi! I am interested in ${listing.title}. Is this still available?` },
      { sender: 'me', text: 'Yes, it is available. I can share tour times this week.' },
    ],
  ]),
)

const SEED_DB = {
  auth: {
    signedIn: false,
    userId: null,
  },
  universities: [
    { id: 'uni-yale', name: 'Yale University', domain: 'yale.edu', city: 'New Haven' },
    { id: 'uni-uconn', name: 'University of Connecticut', domain: 'uconn.edu', city: 'Storrs' },
    { id: 'uni-southern', name: 'Southern Connecticut State University', domain: 'southernct.edu', city: 'New Haven' },
    { id: 'uni-harvard', name: 'Harvard University', domain: 'harvard.edu', city: 'Cambridge' },
    { id: 'uni-bu', name: 'Boston University', domain: 'bu.edu', city: 'Boston' },
  ],
  neighborhoods: [
    { id: 'nh-downtown', name: 'Downtown New Haven', walkScore: 92 },
    { id: 'nh-east-rock', name: 'East Rock', walkScore: 88 },
    { id: 'nh-wooster', name: 'Wooster Square', walkScore: 90 },
    { id: 'nh-westville', name: 'Westville', walkScore: 79 },
  ],
  amenityCatalog: [
    'Attached Bathroom',
    'In House Laundry',
    'Fully Furnished',
    'Dishwasher',
    'Bike Storage',
    'Pet Friendly',
    'Heating Included',
    'Gym Access',
    'Quiet Hours',
    'Parking Spot',
    'Elevator',
    'Rooftop Access',
  ],
  pendingVerifications: [],
  users: [
    {
      id: 'user-1',
      firstName: 'Alicia',
      lastName: 'Stone',
      email: 'alicia.stone@yale.edu',
      password: 'CampusLiving2026!',
      verifiedAt: '2026-01-08T09:00:00.000Z',
      role: 'Looking for housing',
      about:
        "Hi there! I'm a 24-year-old graduate student looking for a 2-year housing lease. Super fun and easy to connect with, clean, responsible and mostly keep to myself. Thanks!",
      classYear: '2027',
      universityId: 'uni-yale',
    },
    {
      id: 'user-2',
      firstName: 'Miguel',
      lastName: 'Reyes',
      email: 'miguel.reyes@yale.edu',
      password: 'YaleHousing!123',
      verifiedAt: '2025-11-11T13:20:00.000Z',
      role: 'Has a listing',
      about: 'Second-year law student. I value quiet weekdays, clear communication, and clean shared spaces.',
      classYear: '2027',
      universityId: 'uni-yale',
    },
    {
      id: 'user-3',
      firstName: 'Priya',
      lastName: 'Desai',
      email: 'priya.desai@uconn.edu',
      password: 'HuskiesHome$26',
      verifiedAt: '2026-02-15T08:45:00.000Z',
      role: 'Looking for housing',
      about: 'Graduate engineering student looking for a clean apartment with easy transit access.',
      classYear: '2028',
      universityId: 'uni-uconn',
    },
  ],
  listings: SEED_LISTINGS,
  threads: SEED_THREADS,
  messages: SEED_MESSAGES,
}

function normalizeEmail(value = '') {
  return value.trim().toLowerCase()
}

function nameFromEmail(email) {
  const localPart = (email.split('@')[0] || '').replace(/[^a-zA-Z.]/g, '.')
  const tokens = localPart.split('.').filter(Boolean)
  const first = tokens[0] || 'Student'
  const last = tokens[1] || 'User'

  const format = (value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()

  return {
    firstName: format(first),
    lastName: format(last),
  }
}

function inferUniversityId(email, universities) {
  const domain = email.split('@')[1] || ''
  return universities.find((university) => university.domain === domain)?.id || null
}

function buildVerificationCode() {
  return String(rand(100000, 999999))
}

function clone(data) {
  return JSON.parse(JSON.stringify(data))
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function delay(ms = rand(MIN_DELAY_MS, MAX_DELAY_MS)) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function readDb() {
  if (typeof window === 'undefined') {
    return clone(SEED_DB)
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)

  if (!raw) {
    const seed = clone(SEED_DB)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
    return seed
  }

  try {
    return JSON.parse(raw)
  } catch {
    const seed = clone(SEED_DB)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
    return seed
  }
}

function writeDb(db) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
}

function relativeTimeFromDateString(isoDate) {
  const diffMs = Date.now() - new Date(isoDate).getTime()
  const minute = 60 * 1000
  const hour = 60 * minute

  if (diffMs < hour) {
    const mins = Math.max(1, Math.round(diffMs / minute))
    return `${mins}m ago`
  }

  const hours = Math.max(1, Math.round(diffMs / hour))
  return `${hours}h ago`
}

function hydrateThreadTimes(db) {
  db.threads = db.threads
    .map((thread) => ({
      ...thread,
      time: relativeTimeFromDateString(thread.updatedAt),
    }))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
}

function listingToThread(listing) {
  return {
    id: listing.threadId,
    listingId: listing.id,
    user: listing.owner,
    subject: `${listing.title} Listing`,
    preview: `Is ${listing.title.toLowerCase()} still available?`,
    unread: true,
    time: 'now',
    updatedAt: new Date().toISOString(),
  }
}

function sanitizeListingInput(input, fallbackListing = null) {
  const title = (input.title || fallbackListing?.title || '1 Bed, 1 Bath').trim()
  const owner = (input.owner || fallbackListing?.owner || 'New Owner').trim()
  const address = (input.address || fallbackListing?.address || 'New Haven, CT').trim()
  const lease = (input.lease || fallbackListing?.lease || '1 year lease - Starts Sep 1').trim()
  const description =
    (input.description || fallbackListing?.description ||
      'New listing created in the high-fidelity prototype backend simulation.').trim()

  const priceRaw = (input.price || fallbackListing?.price || '$1,200 / month').trim()
  const numericPart = priceRaw.replace(/[^\d]/g, '')
  const numericPrice = Number(numericPart || '1200')
  const normalizedPrice = `$${numericPrice.toLocaleString()} / month`
  const rentLabel = `$${numericPrice}/mo`

  const amenities = Array.isArray(input.amenities) && input.amenities.length > 0
    ? input.amenities
    : fallbackListing?.amenities || ['Attached Bathroom', 'In House Laundry', 'Fully Furnished']

  const beds = Number(input.beds ?? fallbackListing?.beds ?? 2)
  const baths = Number(input.baths ?? fallbackListing?.baths ?? 1)
  const sqFt = Number(input.sqFt ?? fallbackListing?.sqFt ?? 850)
  const lat = Number(input.lat ?? fallbackListing?.lat ?? 41.3083)
  const lng = Number(input.lng ?? fallbackListing?.lng ?? -72.9279)
  const imageUrl = (
    input.imageUrl
    || fallbackListing?.imageUrl
    || 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1600&q=80'
  ).trim()

  return {
    title,
    owner,
    address,
    lease,
    description,
    price: normalizedPrice,
    rentLabel,
    amenities,
    distance: input.distance || fallbackListing?.distance || '0.8mi from campus',
    roommates: input.roommates || fallbackListing?.roommates || '2 roommates',
    beds,
    baths,
    sqFt,
    lat,
    lng,
    imageUrl,
  }
}

function ensureThreadAndMessages(db, listing) {
  const existingThread = db.threads.find((thread) => thread.id === listing.threadId)

  if (!existingThread) {
    db.threads.push(listingToThread(listing))
  }

  if (!db.messages[listing.threadId]) {
    db.messages[listing.threadId] = [
      {
        sender: 'them',
        text: `Hi! I am interested in ${listing.title}. Is it still open?`,
      },
    ]
  }
}

function snapshotFromDb(db) {
  hydrateThreadTimes(db)

  const user = db.users.find((candidate) => candidate.id === db.auth.userId) || db.users[0]

  return {
    auth: clone(db.auth),
    user: clone(user),
    listings: clone(db.listings),
    threads: clone(db.threads),
    messages: clone(db.messages),
  }
}

function randomAutoReply() {
  const replies = [
    'Sounds good. Can we set up a tour this week?',
    'Thanks for the update. I can share more details tonight.',
    'Great, that works for me. What time are you free?',
    'Perfect. I am still interested in moving forward.',
  ]

  return replies[rand(0, replies.length - 1)]
}

export const backend = {
  async bootstrap() {
    await delay()
    const db = readDb()
    db.auth = {
      signedIn: false,
      userId: db.auth?.userId || null,
    }
    writeDb(db)
    return snapshotFromDb(db)
  },

  async signIn({ email, password }) {
    await delay()
    const db = readDb()
    const normalizedEmail = normalizeEmail(email)
    const normalizedPassword = String(password || '').trim()

    if (!normalizedEmail.endsWith('.edu')) {
      throw new Error('Please use a valid .edu email address.')
    }

    const user = db.users.find((candidate) => candidate.email.toLowerCase() === normalizedEmail)

    if (!user) {
      throw new Error('No account found for this email. Please create an account first.')
    }

    if (!user.verifiedAt) {
      throw new Error('Please verify your university email before signing in.')
    }

    if (!normalizedPassword || user.password !== normalizedPassword) {
      throw new Error('Incorrect password. Please try again.')
    }

    db.auth = {
      signedIn: true,
      userId: user.id,
    }

    writeDb(db)
    return snapshotFromDb(db)
  },

  async createAccount(payload) {
    await delay()
    const db = readDb()
    const email = normalizeEmail(payload.email)
    const firstName = (payload.firstName || '').trim()
    const lastName = (payload.lastName || '').trim()
    const password = String(payload.password || '').trim()
    const confirmPassword = String(payload.confirmPassword || '').trim()

    if (!email.endsWith('.edu')) {
      throw new Error('University email must end in .edu')
    }

    if (firstName.length < 2 || lastName.length < 2) {
      throw new Error('Please provide your full first and last name.')
    }

    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long.')
    }

    if (password !== confirmPassword) {
      throw new Error('Password and confirm password must match.')
    }

    const existing = db.users.find((user) => user.email.toLowerCase() === email)

    if (existing) {
      throw new Error('Account already exists. Please sign in.')
    }

    db.pendingVerifications = db.pendingVerifications.filter((record) => record.email !== email)

    const code = buildVerificationCode()
    const now = Date.now()
    db.pendingVerifications.push({
      email,
      code,
      createdAt: new Date(now).toISOString(),
      expiresAt: new Date(now + 10 * 60 * 1000).toISOString(),
      attempts: 0,
      payload: {
        firstName,
        lastName,
        password,
        role: payload.intent || 'Looking for housing',
        classYear: '2028',
        universityId: inferUniversityId(email, db.universities),
      },
    })

    writeDb(db)

    return {
      ok: true,
      message: `Verification code sent to ${email}.`,
      email,
      devVerificationCode: code,
    }
  },

  async verifyUniversityEmail({ email, profileData = null }) {
    await delay()
    const db = readDb()
    const normalizedEmail = normalizeEmail(email)
    const record = db.pendingVerifications.find((candidate) => candidate.email === normalizedEmail)
    let user = db.users.find((candidate) => candidate.email.toLowerCase() === normalizedEmail)

    const providedFirstName = profileData?.firstName?.trim()
    const providedLastName = profileData?.lastName?.trim()
    const providedRole = profileData?.intent || 'Looking for housing'
    const providedPassword = String(profileData?.password || '').trim()

    if (!user) {
      const fallbackName = nameFromEmail(normalizedEmail)
      user = {
        id: `user-${Date.now()}`,
        firstName: record?.payload.firstName || providedFirstName || fallbackName.firstName,
        lastName: record?.payload.lastName || providedLastName || fallbackName.lastName,
        email: normalizedEmail,
        password: record?.payload.password || providedPassword || 'TempPass123!',
        role: record?.payload.role || providedRole,
        about: 'Profile created by the prototype email verification flow.',
        classYear: record?.payload.classYear || '2028',
        universityId: record?.payload.universityId || inferUniversityId(normalizedEmail, db.universities),
        verifiedAt: new Date().toISOString(),
      }
      db.users.push(user)
    } else {
      if (providedFirstName && (user.firstName === 'Student' || !user.firstName)) {
        user.firstName = providedFirstName
      }

      if (providedLastName && (user.lastName === 'User' || !user.lastName)) {
        user.lastName = providedLastName
      }

      if (providedRole && (!user.role || user.role === 'Looking for housing')) {
        user.role = providedRole
      }

      if (providedPassword && (!user.password || user.password === 'TempPass123!')) {
        user.password = providedPassword
      }

      user.verifiedAt = user.verifiedAt || new Date().toISOString()
    }

    db.pendingVerifications = db.pendingVerifications.filter((candidate) => candidate.email !== normalizedEmail)

    db.auth = {
      signedIn: true,
      userId: user.id,
    }

    writeDb(db)

    return snapshotFromDb(db)
  },

  async signOut() {
    await delay()
    const db = readDb()
    db.auth = {
      signedIn: false,
      userId: db.auth.userId,
    }
    writeDb(db)
    return snapshotFromDb(db)
  },

  async upsertListing({ mode, listingId, payload }) {
    await delay()
    const db = readDb()

    if (mode === 'edit') {
      const index = db.listings.findIndex((listing) => listing.id === listingId)

      if (index === -1) {
        throw new Error('Listing not found')
      }

      const current = db.listings[index]
      const next = {
        ...current,
        ...sanitizeListingInput(payload, current),
      }

      db.listings[index] = next

      const thread = db.threads.find((candidate) => candidate.id === current.threadId)
      if (thread) {
        thread.subject = `${next.title} Listing`
        thread.user = next.owner
        thread.updatedAt = new Date().toISOString()
      }

      writeDb(db)
      return snapshotFromDb(db)
    }

    const sanitized = sanitizeListingInput(payload)
    const listingIdValue = `listing-${Date.now()}`
    const threadIdValue = `thread-${Date.now()}`

    const newListing = {
      id: listingIdValue,
      threadId: threadIdValue,
      ...sanitized,
      createdAt: new Date().toISOString(),
    }

    db.listings.unshift(newListing)
    ensureThreadAndMessages(db, newListing)

    writeDb(db)
    return snapshotFromDb(db)
  },

  async markThreadRead(threadId) {
    await delay(180)
    const db = readDb()

    const thread = db.threads.find((candidate) => candidate.id === threadId)
    if (thread) {
      thread.unread = false
    }

    writeDb(db)
    return snapshotFromDb(db)
  },

  async sendMessage(threadId, text) {
    await delay()
    const db = readDb()

    if (!db.messages[threadId]) {
      db.messages[threadId] = []
    }

    db.messages[threadId].push({
      sender: 'me',
      text,
    })

    db.messages[threadId].push({
      sender: 'them',
      text: randomAutoReply(),
    })

    const thread = db.threads.find((candidate) => candidate.id === threadId)
    if (thread) {
      thread.preview = text
      thread.unread = false
      thread.updatedAt = new Date().toISOString()
    }

    writeDb(db)
    return snapshotFromDb(db)
  },
}
