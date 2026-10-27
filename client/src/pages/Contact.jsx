import { useState } from 'react'
import { useToast } from '../context/ToastProvider.jsx'

export default function Contact() {
  const { showToast } = useToast()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    service: 'Scent Consultation (1-on-1)',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [activeFaq, setActiveFaq] = useState(null)

  const faqs = [
    {
      q: 'How long does a Velvet Vapors fragrance last on the skin?',
      a: 'Our Extrait and Eau de Parfum concentrations typically last between 8 to 14 hours depending on the scent pyramid, body chemistry, and notes selected (woody and oriental bases tend to endure the longest).'
    },
    {
      q: 'What is your shipping and delivery timeline across India?',
      a: 'We ship from our Bengaluru studio via premium air courier. Metros receive orders within 24–48 hours, while other regional locations across India take 2–4 business days with live tracking.'
    },
    {
      q: 'Can I book a personalized Bespoke Scent creation session?',
      a: 'Yes! We offer 1-on-1 virtual or in-boutique consultations with our master noses to formulate custom olfactory accords tailored to your signature mood.'
    },
    {
      q: 'What is your return & exchange policy?',
      a: 'Due to artisanal batch production and hygiene protocols, opened bottles cannot be returned. However, every order includes a 2ml discovery vial to test before breaking the luxury seal of your full bottle!'
    }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email) {
      showToast('Please fill in your name and email', 'error')
      return
    }
    setSubmitting(true)
    setTimeout(() => {
      showToast('Consultation booked! Our concierge will contact you within 24 hours.')
      setForm({
        name: '',
        email: '',
        phone: '',
        date: '',
        service: 'Scent Consultation (1-on-1)',
        message: ''
      })
      setSubmitting(false)
    }, 800)
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <p style={{ color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            Private Concierge & Boutiques
          </p>
          <h1 className="section-title">Connect with Velvet Vapors</h1>
          <p className="section-subtitle" style={{ maxWidth: 620, margin: '0 auto' }}>
            Book a private olfactory consultation, explore bespoke fragrance formulations, or connect with our fragrance curators.
          </p>
        </div>

        {/* 2-Column Layout: Form & Info */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', marginBottom: '4rem' }}>
          {/* Consultation Form */}
          <div className="glass-card" style={{ padding: '2.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--gold)', marginBottom: '0.5rem' }}>
              Book an Olfactory Consultation
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.8rem' }}>
              Select a date and tell us about your fragrance preferences.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  className="input-luxury"
                  placeholder="e.g. Maya Shenoy"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    className="input-luxury"
                    placeholder="maya@luxury.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    className="input-luxury"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Preferred Date</label>
                  <input
                    type="date"
                    className="input-luxury"
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Session Type</label>
                  <select
                    className="input-luxury"
                    value={form.service}
                    onChange={e => setForm({ ...form, service: e.target.value })}
                  >
                    <option value="Scent Consultation (1-on-1)">1-on-1 Scent Profile</option>
                    <option value="Bespoke Wedding / Gifting">Wedding & Bridal Gifting</option>
                    <option value="Artisanal Layering Masterclass">Perfume Layering Class</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Special Requests / Fragrance Notes You Love</label>
                <textarea
                  className="input-luxury"
                  rows="3"
                  placeholder="Share any preferred scent families (e.g., smoky oud, white florals, crisp bergamot)..."
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                className="btn-gold"
                style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', marginTop: '0.5rem' }}
                disabled={submitting}
              >
                {submitting ? 'Confirming Appointment...' : 'Request Private Consultation ✨'}
              </button>
            </form>
          </div>

          {/* Boutique Details & Ateliers */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>🏛️</div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--gold)', marginBottom: '0.4rem' }}>
                Flagship Atelier — Bangalore
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.7' }}>
                The Obsidian Pavilion, 42 Lavelle Road<br />
                Shanthala Nagar, Ashok Nagar, Bengaluru, KA 560001<br />
                <span style={{ color: 'var(--text-primary)' }}>Hours:</span> Mon – Sun, 11:00 AM – 9:00 PM
              </p>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>💎</div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--gold)', marginBottom: '0.4rem' }}>
                Boutique Noir — Mumbai
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.7' }}>
                Level 2, Palladium Grand Mall, Senapati Bapat Marg<br />
                Lower Parel, Mumbai, MH 400013<br />
                <span style={{ color: 'var(--text-primary)' }}>Hours:</span> Mon – Sun, 10:30 AM – 9:30 PM
              </p>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>📞</div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--gold)', marginBottom: '0.4rem' }}>
                Private Concierge Desk
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.7' }}>
                <strong>Telephone:</strong> +91 (80) 4123-VAPOR / +91 98765 43210<br />
                <strong>Direct Inquiries:</strong> concierge@velvetvapors.com<br />
                <strong>Press & Collaborations:</strong> pr@velvetvapors.com
              </p>
            </div>
          </div>
        </div>

        {/* Interactive FAQ Accordion */}
        <div style={{ maxWidth: 840, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">Everything you need to know about care, longevity, and delivery</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index
              return (
                <div key={index} className="faq-item glass-card" style={{ border: '1px solid var(--gold-dim)' }}>
                  <button
                    className="faq-question"
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    style={{
                      background: isOpen ? 'rgba(197, 160, 89, 0.1)' : 'transparent',
                      width: '100%',
                      cursor: 'pointer',
                      border: 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '1.2rem 1.5rem',
                      color: isOpen ? 'var(--gold)' : 'var(--text-primary)',
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.05rem',
                      textAlign: 'left'
                    }}
                  >
                    <span>{faq.q}</span>
                    <span style={{ fontSize: '1.2rem', transition: 'transform 0.25s', transform: isOpen ? 'rotate(45deg)' : 'rotate(0)' }}>
                      +
                    </span>
                  </button>
                  {isOpen && (
                    <div className="faq-answer" style={{ padding: '0 1.5rem 1.2rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.7' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
