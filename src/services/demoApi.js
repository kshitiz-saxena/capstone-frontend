import { API_BASE_URL } from '../config/appConfig'

const DEMO_ENDPOINTS = Object.freeze({
  request: '/api/request-demo',
})

async function readJsonResponse(response) {
  try {
    return await response.json()
  } catch {
    return null
  }
}

export async function submitDemoRequest({ name, email, company, message }) {
  const response = await fetch(`${API_BASE_URL}${DEMO_ENDPOINTS.request}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      email,
      company,
      message,
    }),
  })

  const payload = await readJsonResponse(response)

  if (!response.ok) {
    throw new Error(
      payload?.message || `Demo request failed with status ${response.status}. Please try again.`,
    )
  }

  return payload?.data ?? payload
}
