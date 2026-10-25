import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const VALID_EMAIL = 'business@tariff.ai'
const VALID_PASSWORD = 'password123'

function LoginPage({ onLogin }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: 'business@tariff.ai',
    password: 'password123',
  })
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))

    if (error) {
      setError('')
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const isValid =
      formData.email.trim().toLowerCase() === VALID_EMAIL &&
      formData.password === VALID_PASSWORD

    if (!isValid) {
      setError('Invalid email or password. Please try again.')
      return
    }

    setError('')
    onLogin(formData)
    navigate('/chat')
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand-row">
          <div className="brand-mark">T</div>
          <div>
            <div className="brand-name">TariffFlow AI</div>
            <div className="brand-tag">Business login</div>
          </div>
        </div>

        <h1>Welcome back</h1>
        <p className="auth-subtitle">Log in to discuss your queries.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <label>
            Email address
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              aria-invalid={Boolean(error)}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              aria-invalid={Boolean(error)}
            />
          </label>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" defaultChecked />
              <span>Keep me signed in</span>
            </label>
            <a href="#">Forgot password?</a>
          </div>

          <button type="submit" className="primary-button full-width">
            Login to dashboard
          </button>
        </form>

        <p className="login-footer">
          Need an account? <Link to="/">Go back home</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
