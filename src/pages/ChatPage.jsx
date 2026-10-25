import { useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { generateBotReply, initialMessages, quickPrompts } from '../data/chatData'

function ChatPage({ user, onLogout }) {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [messages, setMessages] = useState(initialMessages)
  const [draft, setDraft] = useState('')
  const [selectedFiles, setSelectedFiles] = useState([])

  const userName = useMemo(() => user?.name || 'Business User', [user])

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || [])
    setSelectedFiles(files)
  }

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  const handleSend = () => {
    const trimmedMessage = draft.trim()

    if (!trimmedMessage && selectedFiles.length === 0) {
      return
    }

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: trimmedMessage || 'Please review the attached document.',
      files: selectedFiles.map((file) => ({ name: file.name, size: file.size })),
    }

    const reply = generateBotReply(trimmedMessage || 'customs document')

    const botMessage = {
      id: Date.now() + 1,
      sender: 'bot',
      text: reply,
    }

    setMessages((current) => [...current, userMessage, botMessage])
    setDraft('')
    setSelectedFiles([])

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
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
            <span>{user?.company || 'Import & Export'}</span>
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
          <button type="button" className="secondary-button" onClick={handleLogout}>
            Log out
          </button>
        </header>

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
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.csv"
                onChange={handleFileChange}
              />
              Upload document
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
              placeholder="Ask a question about tariff, customs duty, or uploaded documents..."
            />
            <button type="button" className="primary-button send-button" onClick={handleSend}>
              Send
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ChatPage
