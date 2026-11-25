import { API_BASE_URL } from '../config/appConfig'

const CHAT_ENDPOINT = '/api/chat'

async function readJsonResponse(response) {
  try {
    return await response.json()
  } catch {
    return null
  }
}

function extractReply(payload) {
  if (!payload) {
    return ''
  }

  if (typeof payload === 'string') {
    return payload
  }

  return (
    payload?.data?.reply ||
    payload?.data?.message ||
    payload?.data?.answer ||
    payload?.reply ||
    payload?.message ||
    payload?.answer ||
    ''
  )
}

export async function sendChatMessage({ token, message, files }) {
  if (!token) {
    throw new Error('Session token is missing. Please log in again.')
  }

  const formData = new FormData()
  formData.append('message', message)

  files.forEach((file) => {
    formData.append('files', file)
  })

  const response = await fetch(`${API_BASE_URL}${CHAT_ENDPOINT}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  const payload = await readJsonResponse(response)

  if (!response.ok) {
    throw new Error(
      payload?.message || `Chat request failed with status ${response.status}. Please try again.`,
    )
  }

  return extractReply(payload)
}
