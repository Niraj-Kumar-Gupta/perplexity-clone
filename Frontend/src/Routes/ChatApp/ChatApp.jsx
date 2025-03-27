import React, { useState, useEffect, useRef } from 'react';
// import { 
//   useInitializeChat, 
//   useSendMessage, 
//   useChatHistory, 
//   useChatList 
// } from '../../Hooks/LLMChatHook/useChatHooks';
import './ChatApp.css';

import { useSelector } from 'react-redux';
// Message Component

const Message = ({ message }) => {
  return (
    <div className={`message ${message.role === 'assistant' ? 'assistant' : 'user'}`}>
      <div className="message-header">
        <span className="role">{message.role === 'assistant' ? 'Gemini' : 'You'}</span>
        <span className="timestamp">
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </div>
      <div className="message-content">{message.content}</div>
    </div>
  );
};

// Chat List Item Component
const ChatListItem = ({ chat, active, onClick }) => {
  return (
    <div 
      className={`chat-list-item ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      <div className="chat-title">{chat.title}</div>
      <div className="chat-date">
        {new Date(chat.lastUpdated).toLocaleDateString()}
      </div>
    </div>
  );
};

// Main ChatApp Component
const ChatApp = () => {

   const user = useSelector((state) => state.user.userDetails); 
  
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');
  const [activeChatId, setActiveChatId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const messagesEndRef = useRef(null);

  // Custom hooks
  const { initializeChat } = useInitializeChat();
  const { 
    sendMessage, 
    loading: sendingMessage,
    streamingResponse 
  } = useSendMessage();
  const { 
    chatHistory, 
    loading: loadingHistory,
    refetchChatHistory 
  } = useChatHistory(activeChatId);
  const { 
    chats, 
    loading: loadingChats,
    refetchChatList 
  } = useChatList(isLoggedIn ? userId : null);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, streamingResponse]);

  // Login handler
  const handleLogin = (e) => {
    e.preventDefault();
    if (userId.trim()) {
      setIsLoggedIn(true);
    }
  };

  // Start new chat
  const handleNewChat = async () => {
    try {
      const newChatId = await initializeChat(userId);
      setActiveChatId(newChatId);
      refetchChatList();
    } catch (error) {
      console.error("Failed to start new chat:", error);
    }
  };

  // Select existing chat
  const handleSelectChat = (chatId) => {
    setActiveChatId(chatId);
  };

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
  
    try {
      let currentChatId = activeChatId;
      
      // If no active chat, create one
      if (!currentChatId) {
        currentChatId = await initializeChat(userId);
        setActiveChatId(currentChatId);
      }
  
      // Send the message
      const { chatId, response } = await sendMessage(userId, currentChatId, message);
      
      // Update UI - Append message manually instead of waiting for history refetch
      setChatHistory(prevHistory => ({
        ...prevHistory,
        messages: [...(prevHistory?.messages || []), { role: "user", content: message, timestamp: new Date() }]
      }));
  
      // Reset input field
      setMessage('');
  
      // Fetch updated chat history after streaming completes
      setTimeout(() => {
        refetchChatHistory();
      }, 1000); // Delay to allow streaming to complete
  
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };
  
  // Render login form if not logged in
  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <h1>Gemini Chat Demo</h1>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            placeholder="Enter your user ID"
            value={(userId.trim() || user.userId)}
            required
          />
          <button type="submit" onClick={()=>setUserId(user.userId)}>Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="chat-app">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Chats</h2>
          <button onClick={handleNewChat} className="new-chat-btn">
            New Chat
          </button>
        </div>
        
        <div className="chat-list">
          {loadingChats ? (
            <div className="loading">Loading chats...</div>
          ) : chats.length === 0 ? (
            <div className="empty-state">No chats yet</div>
          ) : (
            chats.map((chat) => (
              <ChatListItem
                key={chat.chatId}
                chat={chat}
                active={chat.chatId === activeChatId}
                onClick={() => handleSelectChat(chat.chatId)}
              />
            ))
          )}
        </div>
        
        <div className="user-info">
          <span>Logged in as: {userId}</span>
          <button onClick={() => setIsLoggedIn(false)}>Logout</button>
        </div>
      </div>

      <div className="chat-container">
        {!activeChatId && chats.length === 0 ? (
          <div className="welcome-screen">
            <h2>Welcome to Gemini Chat!</h2>
            <p>Start a new chat to begin conversation.</p>
            <button onClick={handleNewChat} className="start-btn">
              Start New Chat
            </button>
          </div>
        ) : (
          <>
            <div className="chat-header">
              <h2>{chatHistory?.title || "New Chat"}</h2>
            </div>

            <div className="messages-container">
              {loadingHistory ? (
                <div className="loading">Loading conversation...</div>
              ) : (
                <>
                  {chatHistory?.messages.map((msg, index) => (
                    <Message key={index} message={msg} />
                  ))}
                  
                  {/* Show streaming response if any */}
                  {streamingResponse && (
                    <div className="message assistant">
                      <div className="message-header">
                        <span className="role">Gemini</span>
                        <span className="timestamp">
                          {new Date().toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="message-content">{streamingResponse}</div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="message-form">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={sendingMessage}
              />
              <button 
                type="submit" 
                disabled={sendingMessage || !message.trim()}
              >
                {sendingMessage ? "Sending..." : "Send"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatApp;