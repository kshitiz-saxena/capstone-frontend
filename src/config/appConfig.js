const DEFAULT_API_BASE_URL = 'http://localhost:4000'

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL

export const ROUTES = Object.freeze({
  home: '/',
  login: '/login',
  requestDemo: '/request-demo',
  chat: '/chat',
})

export const DEFAULT_USER = Object.freeze({
  name: 'Aarav Mehta',
  company: 'Export Logistics Pvt Ltd',
  email: '',
})

export const DEFAULT_LOGIN_FORM = Object.freeze({
  email: '',
  password: '',
})
