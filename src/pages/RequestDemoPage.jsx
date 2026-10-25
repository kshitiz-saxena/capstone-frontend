import { useState } from 'react'
import { Link } from 'react-router-dom'

const initialForm = {
  email: '',
  mobile: '',
  company: '',
}

function RequestDemoPage() {
  const [formData, setFormData] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
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
            <Link to="/login" className="primary-button full-width" style={{ marginTop: '12px' }}>
              Continue to Login
            </Link>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Email address
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@company.com"
                required
              />
            </label>

            <label>
              Mobile number
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                required
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
              />
            </label>

            <button type="submit" className="primary-button full-width">
              Submit request
            </button>
          </form>
        )}

        <p className="login-footer">
          <Link to="/">Back to home</Link>
        </p>
      </div>
    </div>
  )
}

export default RequestDemoPage
