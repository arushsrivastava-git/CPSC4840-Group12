import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { IMAGE_ICON_URL } from '../utils/constants'

function ImagePlaceholder({ alt = '' }) {
  return <img className="image-placeholder" src={IMAGE_ICON_URL} alt={alt} />
}

export default function CreateListing({ 
  listing, 
  profile, 
  onSubmit, 
  isLoading,
  mode = 'create' // 'create' or 'edit'
}) {
  const navigate = useNavigate()
  const { id } = useParams() // For edit mode
  const isEdit = mode === 'edit' || Boolean(id)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const submitLockRef = useRef(false)

  const [form, setForm] = useState({
    title: listing?.title || '1 Bed, 1 Bath',
    owner: listing?.owner || `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim(),
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

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (submitLockRef.current || isSubmitting || isLoading) {
      return
    }

    submitLockRef.current = true
    setIsSubmitting(true)
    const result = await onSubmit?.(form, isEdit ? listing?.id : undefined)
    if (result?.success) {
      navigate('/my-listings')
      return
    }

    submitLockRef.current = false
    setIsSubmitting(false)
  }

  const availableAmenities = [
    'Attached Bathroom',
    'In House Laundry', 
    'Fully Furnished',
    'Dishwasher',
    'Bike Storage',
    'Heating Included'
  ]

  return (
    <div className="board board--editor">
      <section className="editor-body">
        <h1>{isEdit ? 'Editing Your Post' : 'Your Post'}</h1>

        <form onSubmit={handleSubmit}>
          <div className="editor-layout">
            <div className="editor-left">
              <div className="editor-image-panel">
                <ImagePlaceholder alt="Listing image" />
              </div>

              <button type="button" className="editor-action">
                📷 {isEdit ? 'Replace Images' : 'Upload Images'}
              </button>

              <section className="editor-room-details">
                <h2>Room Details</h2>

                <div className="form-field">
                  <label htmlFor="title">Title</label>
                  <input
                    id="title"
                    type="text"
                    required
                    value={form.title}
                    onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="owner">Owner</label>
                  <input
                    id="owner"
                    type="text"
                    required
                    value={form.owner}
                    onChange={(event) => setForm((prev) => ({ ...prev, owner: event.target.value }))}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="address">Address</label>
                  <input
                    id="address"
                    type="text"
                    required
                    value={form.address}
                    onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="price">Monthly Price</label>
                  <input
                    id="price"
                    type="text"
                    required
                    value={form.price}
                    onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="lease">Lease Details</label>
                  <input
                    id="lease"
                    type="text"
                    required
                    value={form.lease}
                    onChange={(event) => setForm((prev) => ({ ...prev, lease: event.target.value }))}
                  />
                </div>
              </section>
            </div>

            <div className="editor-right">
              <div className="editor-description">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  required
                  value={form.description}
                  onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                  placeholder="Describe your listing in detail..."
                />
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="beds">Beds</label>
                  <input
                    id="beds"
                    type="number"
                    min="0"
                    max="10"
                    required
                    value={form.beds}
                    onChange={(event) => setForm((prev) => ({ ...prev, beds: Number(event.target.value) }))}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="baths">Baths</label>
                  <input
                    id="baths"
                    type="number"
                    min="1"
                    max="10"
                    step="0.5"
                    required
                    value={form.baths}
                    onChange={(event) => setForm((prev) => ({ ...prev, baths: Number(event.target.value) }))}
                  />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="petPolicy">Pet Policy</label>
                <select
                  id="petPolicy"
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
                  {availableAmenities.map((amenity) => (
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

          <button 
            className="editor-submit" 
            type="submit" 
            disabled={isLoading || isSubmitting}
          >
            {isLoading || isSubmitting
              ? (isEdit ? 'Updating...' : 'Creating...') 
              : (isEdit ? 'Update Post' : 'Upload Post')
            }
          </button>
        </form>
      </section>
    </div>
  )
}