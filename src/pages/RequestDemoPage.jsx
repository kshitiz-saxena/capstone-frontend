import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../config/appConfig'
import { submitDemoRequest } from '../services/demoApi'

const initialForm = {
  name: '',
  email: '',
  company: '',
  message: '',
}

const DEMO_COPY = Object.freeze({
  missingContact: 'Name, email, company, and message are required.',
  genericError: 'Unable to submit the demo request. Please try again.',
  submittingLabel: 'Sending request...',
  submitLabel: 'Submit request',
})

function RequestDemoPage() {
  const [formData, setFormData] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))

    if (error) {
      setError('')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const name = formData.name.trim()
    const email = formData.email.trim()
    const company = formData.company.trim()
    const message = formData.message.trim()

    if (!name || !email || !company || !message) {
      setError(DEMO_COPY.missingContact)
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      await submitDemoRequest({ name, email, company, message })
      setSubmitted(true)
    } catch (submitError) {
      console.log(submitError)
      setError(submitError.message || DEMO_COPY.genericError)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand-row">
          <div className="brand-mark">T</div>
          <div>
            <div className="brand-name">TariffFlow AI</div>
            <div className="brand-tag">Request a demo</div>
          </div>
        </div>

        <h1>Book a demo</h1>
        <p className="auth-subtitle">
          Tell us how to reach you and our team will contact you about the tariff chatbot.
        </p>
        {submitted ? (
          <div className="demo-box success-box">
            <strong>Request submitted successfully</strong>
            <span>We will contact you shortly at {formData.email}.</span>
            <Link
              to={ROUTES.login}
              className="primary-button full-width"
              style={{ marginTop: '12px' }}
            >
              Continue to Login
            </Link>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}

            <label>
              Full name
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                required
                minLength={2}
                maxLength={100}
                disabled={isSubmitting}
              />
            </label>

            <label>
              Email address
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@company.com"
                required
                disabled={isSubmitting}
              />
            </label>

            <label>
              Company name
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Your company name"
                minLength={2}
                maxLength={150}
                disabled={isSubmitting}
              />
            </label>

            <label>
              Message
              <input
                type="text"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="We would like to book a product demo."
                required
                minLength={10}
                maxLength={1000}
                disabled={isSubmitting}
              />
            </label>

            <button type="submit" className="primary-button full-width" disabled={isSubmitting}>
              {isSubmitting ? DEMO_COPY.submittingLabel : DEMO_COPY.submitLabel}
            </button>
          </form>
        )}

        <p className="login-footer">
          <Link to={ROUTES.home}>Back to home</Link>
        </p>
      </div>
    </div>
  )
}

export default RequestDemoPage
