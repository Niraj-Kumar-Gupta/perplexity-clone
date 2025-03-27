const { getModel } = require('../../config/googleAIConfig');
const Chat = require('../../models/ChatModel');
const { externalwebAPI, getCurrentDateAndTime, webScrapUsingURL } = require('../../config/llmToolConfig');

class ChatSession {
    constructor() {
        this.sessions = new Map();
        this.initialized = false;
    }

    async ensureInitialized() {
        if (!this.initialized) {
            await this.initializeAllSessions();
            this.initialized = true;
        }
    }

    async initializeAllSessions() {
        try {
            // Find all active chats
            const activeChats = await Chat.find({ isActive: true });
            
            // Initialize sessions for each active chat
            for (const chat of activeChats) {
                if (!this.sessions.has(chat.chatId)) {
                    const model = await getModel();
                    const chatInstance = await model.startChat({
                        history: chat.messages.map(msg => ({
                            role: msg.role === 'assistant' ? 'model' : 'user',
                            parts: [{ text: msg.content }]
                        })),
                        tools: {
                            functionDeclarations: [externalwebAPI, getCurrentDateAndTime, webScrapUsingURL]
                        }
                    });
                    this.sessions.set(chat.chatId, chatInstance);
                }
            }
        } catch (error) {
            console.error('Error initializing all chat sessions:', error);
            throw error;
        }
    }

    async initializeSession(userId, chatId = null) {
        try {
            await this.ensureInitialized();
            const model = await getModel();
            let chat;

            if (chatId) {
                chat = await Chat.findOne({ chatId, user: userId });
                if (!chat) {
                    throw new Error('Chat not found');
                }
            } else {
                chat = new Chat({ user: userId });
                await chat.save();
            }

            // Check if session already exists
            if (!this.sessions.has(chat.chatId)) {
                const chatInstance = await model.startChat({
                    history: chat.messages.map(msg => ({
                        role: msg.role === 'assistant' ? 'model' : 'user',
                        parts: [{ text: msg.content }]
                    })),
                    tools: {
                        functionDeclarations: [externalwebAPI, getCurrentDateAndTime, webScrapUsingURL]
                    }
                });
                this.sessions.set(chat.chatId, chatInstance);
            }

            return chat;
        } catch (error) {
            console.error('Error initializing chat session:', error);
            throw error;
        }
    }

    async getSession(chatId) {
        await this.ensureInitialized();
        
        const session = this.sessions.get(chatId);
        if (!session) {
            // Try to recover the session
            const chat = await Chat.findOne({ chatId });
            if (chat) {
                const model = await getModel();
                const chatInstance = await model.startChat({
                    history: chat.messages.map(msg => ({
                        role: msg.role === 'assistant' ? 'model' : 'user',
                        parts: [{ text: msg.content }]
                    })),
                    tools: {
                        functionDeclarations: [externalwebAPI, getCurrentDateAndTime, webScrapUsingURL]
                    }
                });
                this.sessions.set(chatId, chatInstance);
                return chatInstance;
            }
        }
        return session;
    }

    async deleteSession(chatId) {
        this.sessions.delete(chatId);
        // Also mark the chat as inactive in the database
        await Chat.findOneAndUpdate(
            { chatId },
            { isActive: false },
            { new: true }
        );
    }

    // Method to handle server restart
    async handleServerRestart() {
        this.initialized = false;
        this.sessions.clear();
        await this.ensureInitialized();
    }
}

const chatSession = new ChatSession();

// Handle server restart
process.on('SIGTERM', async () => {
    console.log('Server shutting down, cleaning up sessions...');
    chatSession.sessions.clear();
});

module.exports = chatSession;