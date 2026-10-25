import { API_BASE_URL } from '../config/appConfig'

const AUTH_ENDPOINTS = Object.freeze({
  login: '/api/auth/login',
  logout: '/api/auth/logout',
})

async function readJsonResponse(response) {
  try {
    return await response.json()
  } catch {
    return null
  }
}

function getLoginErrorMessage(response, payload) {
  return (
    payload?.message ||
    `Login failed with status ${response.status}. Please try again.`
  )
}

async function performAuthRequest({ endpoint, method, body, token }) {
  const headers = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  const payload = await readJsonResponse(response)
  return { response, payload }
}

export async function loginUser({ email, password }) {
  const { response, payload } = await performAuthRequest({
    endpoint: AUTH_ENDPOINTS.login,
    method: 'POST',
    body: { email, password },
  })

  if (!response.ok) {
    throw new Error(getLoginErrorMessage(response, payload))
  }

  const user = payload?.data?.user
  const token = payload?.data?.token

  if (!user || !token) {
    throw new Error('Login response is missing required user or token data.')
  }

  return { user, token }
}

export async function logoutUser(token) {
  const { response, payload } = await performAuthRequest({
    endpoint: AUTH_ENDPOINTS.logout,
    method: 'POST',
    token,
  })

  if (!response.ok) {
    throw new Error(
      payload?.message ||
        `Logout failed with status ${response.status}. Please try again.`,
    )
  }
}
