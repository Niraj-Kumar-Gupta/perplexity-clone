
const chatSession = require('../services/LLMservices/ChatSession');
const sendMessageService  = require('../services/LLMservices/SendMessageService');
const Chat = require('../models/ChatModel');
const { v4: uuidv4 } = require('uuid');

const messageSessionStore = new Map();

const chatController = {
    async initializeChat(req, res) {
        try {
            const { userId } = req.body;
            
            if (!userId) {
                return res.status(400).json({
                    success: false,
                    error: 'User ID is required'
                });
            }
            
            const chat = await chatSession.initializeSession(userId);
            res.json({
                success: true,
                chatId: chat.chatId
            });
        } catch (error) {
            console.error('Error initializing chat:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to initialize chat'
            });
        }
    },

    async createMessageSession(req, res) {
        try {
            const { userId, chatId, message, search } = req.body;
            
            if (!userId || !chatId || !message) {
                return res.status(400).json({
                    success: false,
                    error: 'User ID, Chat ID, and message are required'
                });
            }
            
            const sessionId = uuidv4();
            
            messageSessionStore.set(sessionId, {
                userId,
                chatId,
                message,
                search: search || false,
                timestamp: Date.now()
            });
            
            
            setTimeout(() => {
                if (messageSessionStore.has(sessionId)) {
                    messageSessionStore.delete(sessionId);
                    console.log(`Session ${sessionId} expired and was removed`);
                }
            }, 10 * 60 * 1000);
            
            res.json({
                success: true,
                sessionId
            });
        } catch (error) {
            console.error('Error creating message session:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to create message session'
            });
        }
    },


    async streamMessageResponse(req, res) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        try {
            const { sessionId } = req.params;
            
            if (!sessionId || !messageSessionStore.has(sessionId)) {
                res.write(`data: ${JSON.stringify({ error: 'Invalid or expired session ID' })}\n\n`);
                return res.end();
            }
            
            const { userId, chatId, message, search } = messageSessionStore.get(sessionId);
            
            messageSessionStore.delete(sessionId);
            
            await sendMessageService.sendMessage(userId, chatId, message, res, search);
            res.end();
        } catch (error) {
            console.error('Error in streamMessageResponse:', error);
            res.write(`data: ${JSON.stringify({ error: error.message || 'An unexpected error occurred' })}\n\n`);
            res.end();
        }
    },


    async handleMessage(req, res) {

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        try {
            const { userId, chatId, message ,search} = req.query;
            console.log(userId, chatId, message,search);
            if (!userId) {
                res.write(`data: ${JSON.stringify({ error: 'User ID is required' })}\n\n`);
                return res.end();
            }

            if (!message || typeof message !== 'string' || !message.trim()) {
                res.write(`data: ${JSON.stringify({ error: 'Valid message is required' })}\n\n`);
                return res.end();
            }

            await sendMessageService.sendMessage(userId, chatId, message, res);
            res.end();
        } catch (error) {
            console.error('Error in handleMessage:', error);
            res.write(`data: ${JSON.stringify({ error: error.message || 'An unexpected error occurred' })}\n\n`);
            res.end();
        }
    },

    async getChatHistory(req, res) {
        try {
            const { chatId } = req.params;
            const userId = req.user?.id; // Assuming auth middleware sets req.user
            
            if (!chatId) {
                return res.status(400).json({
                    success: false,
                    error: 'Chat ID is required'
                });
            }
            
            const chat = await Chat.findOne({ chatId })
                .select('messages title lastUpdated user')
                .lean();

            if (!chat) {
                return res.status(404).json({
                    success: false,
                    error: 'Chat not found'
                });
            }
           
            // Optional: Check ownership if userId is available
            if (userId && chat.user && chat.user.toString() !== userId.toString()) {
                return res.status(403).json({
                    success: false,
                    error: 'Unauthorized access to chat history'
                });
            }

            res.json({
                success: true,
                chat
            });
        } catch (error) {
            console.error('Error getting chat history:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to retrieve chat history'
            });
        }
    },

    async getChatList(req, res) {
        try {
            const { userId } = req.params;
            
            if (!userId) {
                return res.status(400).json({
                    success: false,
                    error: 'User ID is required'
                });
            }
            
            const chats = await Chat.find({ user: userId })
                .select('chatId title lastUpdated')
                .sort({ lastUpdated: -1 })
                .lean();

            res.json({
                success: true,
                chats
            });
        } catch (error) {
            console.error('Error getting chat list:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to retrieve chat list'
            });
        }
    },
    
    async deleteChat(req, res) {
        try {
            const { chatId } = req.params;
            const userId = req.user?.id; // Assuming auth middleware sets req.user
            
            if (!chatId) {
                return res.status(400).json({
                    success: false,
                    error: 'Chat ID is required'
                });
            }
            
            const chat = await Chat.findOne({ chatId });
            
            if (!chat) {
                return res.status(404).json({
                    success: false,
                    error: 'Chat not found'
                });
            }
            
            // Check ownership if userId is available
            if (userId && chat.user.toString() !== userId.toString()) {
                return res.status(403).json({
                    success: false,
                    error: 'Unauthorized access to delete chat'
                });
            }
            
            // Delete from database
            await Chat.deleteOne({ chatId });
            
            // Clean up the session
            await chatSession.deleteSession(chatId);
            
            res.json({
                success: true,
                message: 'Chat deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting chat:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to delete chat'
            });
        }
    }
};

module.exports = chatController;
