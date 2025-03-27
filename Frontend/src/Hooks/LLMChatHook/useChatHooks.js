// useChatHooks.js - Fixed version
import { useEffect, useRef, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveChat, clearActiveChat } from '../../features/chat/chatSlice';
import { store } from '../../redux/store';

const useChatHooks = (userId) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const chatId = useSelector((state) => state.chat.activeChatId);
    const messages = useSelector((state) => state.chat.activeMessages);
    const eventSourceRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    // Flag to track if a chat initialization is in progress
    const initializingRef = useRef(false);

    const cleanupEventSource = useCallback(() => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }
    }, []);

    useEffect(() => {
        return () => cleanupEventSource();
    }, [cleanupEventSource]);

    
    const initializeChat = async () => {
        
        if (initializingRef.current) {
            while (initializingRef.current) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            return store.getState().chat.activeChatId;
        }
        
        try {
            initializingRef.current = true;
            const response = await fetch('http://localhost:3000/api/initialize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to initialize chat');
            }
            
            console.log("Chat initialized with ID:", data.chatId);
            
            dispatch(setActiveChat({ 
                chatId: data.chatId,
                messages: []
            }));
            
            navigate(`/chat/${data.chatId}`, { replace: true });
            
            return data.chatId;
        } catch (err) {
            console.error('Error initializing chat:', err);
            throw err;
        } finally {
            initializingRef.current = false;
        }
    };

   
    const fetchResponse = async (message, searchEnabled = false) => {
        if (!message?.trim()) return;
        
        try {
            setIsLoading(true);
            cleanupEventSource();
          
           
            let currentMessages = store.getState().chat.activeMessages || []; 
            let currentChatId = store.getState().chat.activeChatId; 
            
            // For new chat, initialize first and ensure it's complete
            if (!currentChatId) {
                currentChatId = await initializeChat();
                
                // Double-check that initialization worked
                if (!currentChatId) {
                    throw new Error("Failed to initialize chat");
                }
                
                // Refresh messages array after initialization
                currentMessages = store.getState().chat.activeMessages || [];
                
                // Add a small delay to ensure server has processed the chat initialization
                await new Promise(resolve => setTimeout(resolve, 300));
            }

        
            const userMessage = { 
                _id: Date.now(), 
                content: message, 
                role: 'user', 
                timestamp: new Date().toISOString() 
            };
            
           
            dispatch(setActiveChat({ 
                chatId: currentChatId, 
                messages: [...currentMessages, userMessage] 
            }));
            

        
            const tempAiMessage = { 
                _id: Date.now() + 1, 
                content: '', 
                role: 'assistant', 
                isLoading: true,
                isStreaming: true,
                webSearch: [], 
                timestamp: new Date().toISOString() 
            };
            
           
            const updatedMessages = [...store.getState().chat.activeMessages, tempAiMessage];
            dispatch(setActiveChat({
                chatId: currentChatId,
                messages: updatedMessages
            }));

             // STEP 1: First, send the message content via POST beacuse of too large messages
            const sessionResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/message-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    chatId: currentChatId,
                    message,
                    search: searchEnabled
                })
            });

            if (!sessionResponse.ok) {
                throw new Error("Failed to create message session");
            }
            
            const sessionData = await sessionResponse.json();
            const sessionId = sessionData.sessionId;
            
            // STEP 2: Then create an EventSource with just the session ID
            const eventSourceUrl = `${import.meta.env.VITE_API_URL}/api/message-stream/${sessionId}`;
        
            //const eventSourceUrl = `${import.meta.env.VITE_API_URL}/api/message?userId=${userId}&chatId=${currentChatId}&message=${encodeURIComponent(message)}&search=${searchEnabled}`;
            
        
            const eventSource = new EventSource(eventSourceUrl);
            eventSourceRef.current = eventSource;

            let receivedResponse = false;
            let isFirstResponse = true;

            // Handle streaming message updates
            eventSource.onmessage = (event) => {
                receivedResponse = true;
                const data = JSON.parse(event.data);
               
                const latestMessages = store.getState().chat.activeMessages;
                
                
                dispatch(setActiveChat({ 
                    chatId: currentChatId, 
                    messages: latestMessages.map(msg =>
                      msg._id === tempAiMessage._id
                        ? { 
                            ...msg, 
                            content: msg.content + (data.reply || ""), 
                            isLoading: !data.done,
                            isStreaming: isFirstResponse ? false : !data.done,
                            webSearch: data.webSearch || [] 
                          }
                        : msg
                    )
                }));
        
                
                if (data.done) {
                    eventSource.close();
                    eventSourceRef.current = null;
                    setIsLoading(false);
                }
            };

           
            const timeoutId = setTimeout(() => {
                if (!receivedResponse && eventSourceRef.current === eventSource) {
                    console.log("No response received within timeout, closing connection");
                    eventSource.close();
                    eventSourceRef.current = null;
                    setIsLoading(false);
                    
                    // Update message with error state
                    const currentState = store.getState().chat;
                    const timeoutMessages = currentState.activeMessages.map(msg => {
                        if (msg._id === tempAiMessage._id) {
                            return {
                                ...msg,
                                isLoading: false,
                                isStreaming: false,
                                error: true, 
                                content: "No response received. Please try again."
                            };
                        }
                        return msg;
                    });
                    
                    dispatch(setActiveChat({
                        chatId: currentState.activeChatId,
                        messages: timeoutMessages
                    }));
                }
            }, 10000); // 10-second timeout

            // Handle errors
            eventSource.onerror = (err) => {
                console.error('SSE error:', err);
                clearTimeout(timeoutId);
                eventSource.close();
                eventSourceRef.current = null;
                setIsLoading(false);
                
                // Update message with error state
                const currentState = store.getState().chat;
                const updatedMessages = currentState.activeMessages.map(msg => {
                  if (msg._id === tempAiMessage._id) {
                    return {
                      ...msg,
                      isLoading: false,
                      isStreaming: false,
                      error: true, 
                      content: msg.content || "Could not generate response. Please try again."
                    };
                  }
                  return msg;
                });
              
                dispatch(setActiveChat({
                  chatId: currentState.activeChatId,
                  messages: updatedMessages
                }));
            };

        } catch (err) {
            console.error('Error sending message:', err);
            setIsLoading(false);
            
            // Show error in chat
            const errorMessage = { 
                _id: Date.now() + 2, 
                content: "Failed to send message. Please try again.",
                role: 'assistant', 
                isLoading: false,
                isStreaming: false,
                error: true,
                timestamp: new Date().toISOString() 
            };
            
            const currentMessages = store.getState().chat.activeMessages || [];
            dispatch(setActiveChat({
                chatId: store.getState().chat.activeChatId,
                messages: [...currentMessages, errorMessage]
            }));
        }
    };

  
    const getChatHistory = useCallback(async (targetChatId) => {
        if (!targetChatId) {
            dispatch(clearActiveChat());
            return;
        }

        try {
            setIsLoading(true);
            cleanupEventSource();

            const response = await fetch(`http://localhost:3000/api/history/${targetChatId}`);
            const data = await response.json();
            
            if (!response.ok) throw new Error(data.error || 'Failed to load history');
            
            dispatch(setActiveChat({
                chatId: targetChatId,
                messages: data.chat.messages.map(msg => ({
                    ...msg,
                    isLoading: false,
                    isStreaming: false
                }))
            }));
        } catch (err) {
            console.error('Error fetching chat history:', err);
            dispatch(clearActiveChat());
        } finally {
            setIsLoading(false);
        }
    }, [cleanupEventSource, dispatch]);

    const getChatList = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/list/${userId}`);
            const data = await response.json();
            return data.chats || [];
        } catch (err) {
            console.error('Error fetching chat list:', err);
            return [];
        }
    }, [userId]);

    const deleteChat = async (targetChatId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/${targetChatId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete chat');
            
            if (targetChatId === chatId) {
                dispatch(clearActiveChat());
                navigate('/chat');
            }
        } catch (err) {
            console.error('Error deleting chat:', err);
        }
    };

    return {
        messages,
        chatId,
        fetchResponse,
        initializeChat,
        getChatHistory,
        getChatList,
        deleteChat,
        isLoading
    };
};

export default useChatHooks;