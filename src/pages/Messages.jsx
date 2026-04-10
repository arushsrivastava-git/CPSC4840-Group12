import { useRef, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

function ProfileIcon() {
  return (
    <span className="profile-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" role="presentation">
        <circle cx="12" cy="8" r="4" />
        <path d="M4.5 19.5c1.6-3.6 4.5-5.5 7.5-5.5s5.9 1.9 7.5 5.5" />
      </svg>
    </span>
  )
}

export default function Messages({
  threads,
  activeThread,
  messages,
  chatDraft,
  onSelectThread,
  onChatDraftChange,
  onSend,
}) {
  const [searchParams] = useSearchParams()
  const threadId = searchParams.get('thread')
  
  const messageListRef = useRef(null)
  const activeThreadId = activeThread?.id || null
  const previousThreadIdRef = useRef(null)
  const previousMessageCountRef = useRef(0)
  const shouldAutoScrollRef = useRef(true)

  // Auto-select thread from URL
  useEffect(() => {
    if (threadId && threadId !== activeThreadId) {
      onSelectThread?.(threadId)
    }
  }, [threadId, activeThreadId, onSelectThread])

  const scrollMessagesToBottom = () => {
    const node = messageListRef.current
    if (!node) {
      return
    }
    node.scrollTop = node.scrollHeight
  }

  const updateAutoScrollPreference = () => {
    const node = messageListRef.current
    if (!node) {
      return
    }

    const distanceFromBottom = node.scrollHeight - node.scrollTop - node.clientHeight
    shouldAutoScrollRef.current = distanceFromBottom <= 24
  }

  useEffect(() => {
    if (previousThreadIdRef.current !== activeThreadId) {
      previousThreadIdRef.current = activeThreadId
      previousMessageCountRef.current = messages.length
      shouldAutoScrollRef.current = true
      requestAnimationFrame(scrollMessagesToBottom)
      return
    }

    const hadNewMessages = messages.length > previousMessageCountRef.current
    previousMessageCountRef.current = messages.length

    if (hadNewMessages && shouldAutoScrollRef.current) {
      requestAnimationFrame(scrollMessagesToBottom)
    }
  }, [activeThreadId, messages])

  const handleSend = async (event) => {
    event.preventDefault()
    if (!chatDraft.trim() || !activeThread) {
      return
    }
    await onSend?.()
  }

  return (
    <div className="board board--messages">
      <section className="messages-body">
        <h1>Messages</h1>

        <div className="messages-layout">
          <aside className="thread-list">
            {threads.length === 0 ? (
              <div className="thread-list__empty">
                <p>No message threads yet</p>
                <p>Messages will appear here when you contact listing owners</p>
              </div>
            ) : (
              threads.map((thread) => (
                <button
                  key={thread.id}
                  className={`thread-list__item ${thread.id === activeThread?.id ? 'thread-list__item--active' : ''}`}
                  type="button"
                  onClick={() => onSelectThread?.(thread.id)}
                >
                  <div>
                    <p className="thread-list__name">{thread.user}</p>
                    <p className="thread-list__subject">{thread.subject}</p>
                    <p className="thread-list__preview">{thread.preview}</p>
                  </div>
                  <div className="thread-list__meta">
                    {thread.unread ? <span className="thread-list__dot" aria-hidden="true" /> : null}
                    <span>{thread.time}</span>
                  </div>
                </button>
              ))
            )}
          </aside>

          <section className="conversation-panel" aria-label={`Conversation with ${activeThread?.user || 'contact'}`}>
            {activeThread ? (
              <>
                <header>
                  <ProfileIcon />
                  <div>
                    <p>{activeThread.user}</p>
                    <span>{activeThread.subject}</span>
                  </div>
                </header>

                <div
                  ref={messageListRef}
                  className="conversation-panel__messages"
                  onScroll={updateAutoScrollPreference}
                >
                  {messages.length === 0 ? (
                    <p className="chat-bubble chat-bubble--them">No messages yet.</p>
                  ) : (
                    messages.map((message, index) => (
                      <p key={`${message.sender}-${index}`} className={`chat-bubble chat-bubble--${message.sender}`}>
                        {message.text}
                      </p>
                    ))
                  )}
                </div>

                <form className="conversation-panel__composer" onSubmit={handleSend}>
                  <input
                    value={chatDraft || ''}
                    onChange={(event) => onChatDraftChange?.(event.target.value)}
                    placeholder="Message"
                    aria-label="Message"
                  />
                  <button type="submit">Send</button>
                </form>
              </>
            ) : (
              <div className="conversation-panel__empty">
                <ProfileIcon />
                <p>No thread selected</p>
                <span>Pick a message thread to begin.</span>
              </div>
            )}
          </section>
        </div>
      </section>
    </div>
  )
}