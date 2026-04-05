const STORAGE_KEY = 'group12_hifi_backend_v1'
const MIN_DELAY_MS = 280
const MAX_DELAY_MS = 760

const SEED_DB = {
  auth: {
    signedIn: true,
    userId: 'user-1',
  },
  users: [
    {
      id: 'user-1',
      firstName: 'Alicia',
      lastName: 'Stone',
      email: 'alicia.stone@yale.edu',
      role: 'Looking for housing',
      about:
        "Hi there! I'm a 24-year-old graduate student looking for a 2-year housing lease. Super fun and easy to connect with, clean, responsible and mostly keep to myself. Thanks!",
      classYear: '2027',
    },
  ],
  listings: [
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
      createdAt: '2026-04-05T14:00:00.000Z',
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
      createdAt: '2026-04-02T14:00:00.000Z',
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
      createdAt: '2026-03-28T14:00:00.000Z',
    },
  ],
  threads: [
    {
      id: 'thread-john',
      listingId: 'listing-john',
      user: 'John Doe',
      subject: '2 Bed, 2 Bath Listing',
      preview: 'Is this listing still available?',
      unread: true,
      time: '1m ago',
      updatedAt: '2026-04-05T13:59:00.000Z',
    },
    {
      id: 'thread-mary',
      listingId: 'listing-mary',
      user: 'Mary Smith',
      subject: '1 Bed, 1 Bath Listing',
      preview: 'Would July move-in work for you?',
      unread: true,
      time: '12m ago',
      updatedAt: '2026-04-05T13:48:00.000Z',
    },
    {
      id: 'thread-alex',
      listingId: 'listing-alex',
      user: 'Alex Kim',
      subject: '3 Bed, 2 Bath Listing',
      preview: 'Can I schedule an in-person tour?',
      unread: false,
      time: '3h ago',
      updatedAt: '2026-04-05T11:00:00.000Z',
    },
  ],
  messages: {
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
  },
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

  return {
    title,
    owner,
    address,
    lease,
    description,
    price: normalizedPrice,
    rentLabel,
    amenities,
    distance: input.distance || fallbackListing?.distance || '0.8mi from center of campus',
    roommates: input.roommates || fallbackListing?.roommates || '2 roomates',
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
    writeDb(db)
    return snapshotFromDb(db)
  },

  async signIn({ email }) {
    await delay()
    const db = readDb()
    const normalizedEmail = (email || '').trim().toLowerCase()

    if (!normalizedEmail.endsWith('.edu')) {
      throw new Error('Please use a valid .edu email address.')
    }

    let user = db.users.find((candidate) => candidate.email.toLowerCase() === normalizedEmail)

    if (!user) {
      user = {
        id: `user-${Date.now()}`,
        firstName: 'Student',
        lastName: 'User',
        email: normalizedEmail,
        role: 'Looking for housing',
        about: 'Newly signed-in user profile created by the prototype backend emulator.',
        classYear: '2028',
      }
      db.users.push(user)
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
    const email = (payload.email || '').trim().toLowerCase()

    if (!email.endsWith('.edu')) {
      throw new Error('University email must end in .edu')
    }

    const existing = db.users.find((user) => user.email.toLowerCase() === email)

    if (existing) {
      throw new Error('Account already exists. Please sign in.')
    }

    db.users.push({
      id: `user-${Date.now()}`,
      firstName: payload.firstName?.trim() || 'New',
      lastName: payload.lastName?.trim() || 'User',
      email,
      role: payload.intent || 'Looking for housing',
      about: 'New account created in the prototype backend emulator.',
      classYear: '2028',
    })

    writeDb(db)

    return {
      ok: true,
      message: 'Verification code sent to your email.',
    }
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
