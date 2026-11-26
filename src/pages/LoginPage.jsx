import { useState } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import { Link, useNavigate } from 'react-router-dom'
import { DEFAULT_LOGIN_FORM, GOOGLE_CLIENT_ID, ROUTES } from '../config/appConfig'
import { loginUser, loginWithGoogle } from '../services/authApi'

const LOGIN_COPY = Object.freeze({
  missingCredentials: 'Email and password are required.',
  missingGoogleClientId: 'Google login is not configured. Please set VITE_GOOGLE_CLIENT_ID.',
  genericError: 'Unable to log in. Please try again.',
  submitLabel: 'Login to dashboard',
  submittingLabel: 'Logging in...',
  googleLabel: 'Continue with Google',
  googleLoadingLabel: 'Logging in with Google...',
})

function LoginPage({ onLogin }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState(DEFAULT_LOGIN_FORM)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false)
  const isBusy = isSubmitting || isGoogleSubmitting

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))

    if (error) {
      setError('')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const email = formData.email.trim()
    const password = formData.password

    if (!email || !password) {
      setError(LOGIN_COPY.missingCredentials)
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const { user, token } = await loginUser({ email, password })
      onLogin({ user, token })
      navigate(ROUTES.chat)
    } catch (loginError) {
      setError(loginError.message || LOGIN_COPY.genericError)
    } finally {
      setIsSubmitting(false)
    }
  }

  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    prompt: 'select_account',
    scope: 'openid email profile',
    onSuccess: async ({ code }) => {
      if (!code) {
        setError(LOGIN_COPY.genericError)
        setIsGoogleSubmitting(false)
        return
      }

      try {
        const { user, token } = await loginWithGoogle({ code })
        onLogin({ user, token })
        navigate(ROUTES.chat)
      } catch (loginError) {
        setError(loginError.message || LOGIN_COPY.genericError)
      } finally {
        setIsGoogleSubmitting(false)
      }
    },
    onError: () => {
      setError(LOGIN_COPY.genericError)
      setIsGoogleSubmitting(false)
    },
  })

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand-row">
          <div className="brand-mark">T</div>
          <div>
            <div className="brand-name">Tariffic AI</div>
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
              disabled={isBusy}
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
              disabled={isBusy}
            />
          </label>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" disabled={isBusy} />
              <span>Keep me signed in</span>
            </label>
            <a href="#">Forgot password?</a>
          </div>

          <button type="submit" className="primary-button full-width" disabled={isBusy}>
            {isSubmitting ? LOGIN_COPY.submittingLabel : LOGIN_COPY.submitLabel}
          </button>

          <button
            type="button"
            className="secondary-button full-width"
            onClick={() => {
              if (!GOOGLE_CLIENT_ID) {
                setError(LOGIN_COPY.missingGoogleClientId)
                return
              }

              setError('')
              setIsGoogleSubmitting(true)
              googleLogin()
            }}
            disabled={isBusy}
          >
            {isGoogleSubmitting ? LOGIN_COPY.googleLoadingLabel : LOGIN_COPY.googleLabel}
          </button>
        </form>

        <p className="login-footer">
          Need an account? <Link to={ROUTES.home}>Go back home</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
