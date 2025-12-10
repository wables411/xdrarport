import { useState } from 'react'
import './ContactModal.css'

function ContactModal({ onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    comment: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success' or 'error'
  const [errorMessage, setErrorMessage] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      // Submit to Cloudflare Pages Function
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          comment: formData.comment,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Form submission failed')
      }

      setSubmitStatus('success')
      setErrorMessage(null)
      setFormData({ name: '', email: '', comment: '' })
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onClose()
        setSubmitStatus(null)
      }, 2000)

    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus('error')
      setErrorMessage(error.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <h2 className="modal-title">Contact</h2>
        <form 
          name="contact" 
          onSubmit={handleSubmit} 
          className="contact-form"
        >
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="comment">How can I help you?</label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              rows="6"
              required
            />
          </div>
          {submitStatus === 'success' && (
            <div className="form-message form-success">
              Thank you! Your message has been sent.
            </div>
          )}
          {submitStatus === 'error' && (
            <div className="form-message form-error">
              {errorMessage || 'Something went wrong. Please try again.'}
            </div>
          )}
          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ContactModal

