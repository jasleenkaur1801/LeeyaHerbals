import { useEffect, useState } from 'react'
import './App.css'

function StarInput({ value, onChange }) {
  return (
    <div className="stars" role="radiogroup" aria-label="Rating">
      {Array.from({ length: 5 }).map((_, i) => (
        <button
          key={i}
          type="button"
          aria-checked={value === i + 1}
          role="radio"
          className={i < value ? 'star filled' : 'star'}
          onClick={() => onChange(i + 1)}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.4rem' }}
        >
          ★
        </button>
      ))}
    </div>
  )
}

export default function Reviews() {
  const [reviews, setReviews] = useState([])
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [rating, setRating] = useState(5)
  const [image, setImage] = useState('')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('leeya_reviews')
      setReviews(saved ? JSON.parse(saved) : [])
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem('leeya_reviews', JSON.stringify(reviews))
  }, [reviews])

  const onImageChange = async (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImage(reader.result)
    reader.readAsDataURL(file)
  }

  const submit = (e) => {
    e.preventDefault()
    if (!name.trim() || !text.trim()) return
    const entry = {
      id: Date.now(),
      name: name.trim(),
      text: text.trim(),
      rating,
      image,
      date: new Date().toISOString()
    }
    setReviews([entry, ...reviews])
    setName('')
    setText('')
    setRating(5)
    setImage('')
    alert('Review submitted!')
  }

  return (
    <div className="section">
      <div className="container">
        <div className="section-head"><h2>Customer Reviews</h2><p>Share your experience with Leeya products</p></div>

        <form className="subscribe" onSubmit={submit} style={{ gridTemplateColumns: '1fr', gap: '0.8rem', marginBottom: '1.2rem' }}>
          <input placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
          <textarea placeholder="Write your review" value={text} onChange={e => setText(e.target.value)} rows={4} style={{ resize: 'vertical', padding: '.7rem .9rem', borderRadius: 10, border: '1px solid #eceef4' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label className="btn small" style={{ cursor: 'pointer' }}>
              Upload image
              <input type="file" accept="image/*" onChange={e => onImageChange(e.target.files?.[0])} style={{ display: 'none' }} />
            </label>
            <StarInput value={rating} onChange={setRating} />
          </div>
          {image ? <img src={image} alt="preview" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 12, border: '1px solid #e6e7ec' }} /> : null}
          <button className="btn primary" type="submit">Submit Review</button>
        </form>

        <div className="grid products" style={{ gridTemplateColumns: 'repeat(1, 1fr)' }}>
          {reviews.length === 0 ? (
            <p className="muted">No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map(r => (
              <article key={r.id} className="card product">
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  {r.image ? <img src={r.image} alt={r.name} style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 10, border: '1px solid #e6e7ec' }} /> : null}
                  <div>
                    <h3 style={{ margin: 0 }}>{r.name}</h3>
                    <div className="stars" aria-label={`Rated ${r.rating} out of 5`}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < r.rating ? 'star filled' : 'star'}>★</span>
                      ))}
                    </div>
                    <p style={{ marginTop: '.4rem' }}>{r.text}</p>
                    <div className="muted" style={{ fontSize: '.85rem' }}>{new Date(r.date).toLocaleString()}</div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  )
}


