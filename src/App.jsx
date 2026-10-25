import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ChatPage from './pages/ChatPage'
import RequestDemoPage from './pages/RequestDemoPage'
import { DEFAULT_USER, ROUTES } from './config/appConfig'
import './App.css'

function ProtectedRoute({ isLoggedIn, children }) {
  if (!isLoggedIn) {
    return <Navigate to={ROUTES.login} replace />
  }

  return children
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(DEFAULT_USER)
  const [authToken, setAuthToken] = useState('')

  const handleLogin = ({ user: loggedInUser, token }) => {
    setUser((current) => ({
      ...current,
      ...loggedInUser,
    }))
    setAuthToken(token)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setAuthToken('')
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.home} element={<HomePage />} />
        <Route path={ROUTES.login} element={<LoginPage onLogin={handleLogin} />} />
        <Route path={ROUTES.requestDemo} element={<RequestDemoPage />} />
        <Route
          path={ROUTES.chat}
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <ChatPage user={user} authToken={authToken} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
