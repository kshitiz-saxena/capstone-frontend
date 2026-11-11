import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../config/appConfig'
import { CHAT_COPY, CHAT_FILE_ACCEPT } from '../config/chatConfig'
import { initialMessages, quickPrompts } from '../data/chatData'
import { logoutUser } from '../services/authApi'
import { sendChatMessage } from '../services/chatApi'

function createUserMessage({ text, files }) {
  return {
    id: Date.now(),
    sender: 'user',
    text: text || CHAT_COPY.emptyMessageFallback,
    files: files.map((file) => ({ name: file.name, size: file.size })),
  }
}

function createBotMessage(text) {
  return {
    id: Date.now() + 1,
    sender: 'bot',
    text: text || `I can help with ${CHAT_COPY.replyFallbackTopic}. Please share more details.`,
  }
}

function ChatPage({ user, authToken, onLogout }) {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [messages, setMessages] = useState(initialMessages)
  const [draft, setDraft] = useState('')
  const [selectedFiles, setSelectedFiles] = useState([])
  const [logoutError, setLogoutError] = useState('')
  const [chatError, setChatError] = useState('')
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const userName = useMemo(
    () => user?.name || CHAT_COPY.fallbackUserName,
    [user],
  )

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || [])
    setSelectedFiles(files)
    if (chatError) {
      setChatError('')
    }
  }

  const handleLogout = async () => {
    if (!authToken) {
      setLogoutError(CHAT_COPY.missingToken)
      return
    }

    setIsLoggingOut(true)
    setLogoutError('')

    try {
      await logoutUser(authToken)
      onLogout()
      navigate(ROUTES.login)
    } catch (error) {
      setLogoutError(error.message || CHAT_COPY.logoutFailed)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleSend = async () => {
    if (isSending) {
      return
    }

    const trimmedMessage = draft.trim()
    const outboundMessage = trimmedMessage || CHAT_COPY.emptyMessageFallback

    if (!trimmedMessage && selectedFiles.length === 0) {
      return
    }

    const userMessage = createUserMessage({
      text: trimmedMessage,
      files: selectedFiles,
    })

    setIsSending(true)
    setChatError('')

    try {
      const replyText = await sendChatMessage({
        token: authToken,
        message: outboundMessage,
        files: selectedFiles,
      })
      const botMessage = createBotMessage(replyText)
      setMessages((current) => [...current, userMessage, botMessage])
      setDraft('')
      setSelectedFiles([])

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      setChatError(error.message || CHAT_COPY.chatFailed)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="chat-layout">
      <aside className="chat-sidebar">
        <div className="sidebar-header">
          <div className="brand-mark">T</div>
          <div>
            <div className="brand-name">TariffFlow AI</div>
            <div className="brand-tag">Trade assistant</div>
          </div>
        </div>

        <div className="profile-box">
          <div className="avatar">{userName.charAt(0)}</div>
          <div>
            <strong>{userName}</strong>
            <span>{user?.company || CHAT_COPY.fallbackCompany}</span>
          </div>
        </div>

        <div className="sidebar-section">
          <h3>Quick prompts</h3>
          <ul>
            {quickPrompts.map((prompt) => (
              <li key={prompt}>
                <button type="button" onClick={() => setDraft(prompt)}>
                  {prompt}
                </button>
              </li>
            ))}
          </ul>
        </div>

      </aside>

      <main className="chat-panel">
        <header className="chat-header">
          <div>
            <span className="eyebrow">Business assistant</span>
            <h2>Customs & tariff guidance</h2>
          </div>
          <button
            type="button"
            className="secondary-button"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? CHAT_COPY.logoutLoadingLabel : CHAT_COPY.logoutLabel}
          </button>
        </header>
        {logoutError && <div className="error-message">{logoutError}</div>}
        {chatError && <div className="error-message">{chatError}</div>}

        <div className="chat-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message-row ${message.sender}`}>
              <div className="message-bubble">
                <p>{message.text}</p>
                {message.files && message.files.length > 0 && (
                  <div className="attachment-list">
                    {message.files.map((file) => (
                      <span key={`${message.id}-${file.name}`} className="attachment-pill">
                        {file.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="composer">
          <div className="file-upload-row">
            <label className="upload-button">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={CHAT_FILE_ACCEPT}
                onChange={handleFileChange}
                disabled={isSending}
              />
              {CHAT_COPY.uploadLabel}
            </label>
            {selectedFiles.length > 0 && (
              <div className="selected-files">
                {selectedFiles.map((file) => (
                  <span key={file.name} className="attachment-pill">
                    {file.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="input-row">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              rows="3"
              placeholder={CHAT_COPY.composerPlaceholder}
              disabled={isSending}
            />
s            <button
              type="button"
              className="primary-button send-button"
              onClick={handleSend}
              disabled={isSending}
            >
              {isSending ? CHAT_COPY.sendLoadingLabel : CHAT_COPY.sendLabel}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ChatPage
