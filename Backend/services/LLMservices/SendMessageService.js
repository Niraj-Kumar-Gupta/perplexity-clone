const chatSession = require('./ChatSession');
const Chat = require('../../models/ChatModel');


class SendMessageService {
    constructor() {
        this.maxRetries = 3;
        this.retryDelay = 1000; 
    }

    async handleMessageStream(response, res) {
        try {
            if (!response || !response.stream) {
                const textResponse = (await response.text()) || "No response generated";
                res.write(`data: ${JSON.stringify({ reply: textResponse })}\n\n`);
                res.end();
                return textResponse;
            }
    
            let assistantMessage = '';
    
            for await (const chunk of response.stream) {
                const decodedChunk = chunk.text ? chunk.text() : chunk; 
                assistantMessage += decodedChunk;
                process.stdout.write(decodedChunk);
                res.write(`data: ${JSON.stringify({ reply: decodedChunk })}\n\n`);
            }

            res.end();
            return assistantMessage;
        } catch (error) {
            console.error('Error handling message stream:', error);
            const errorMessage = "Failed to process response stream";
            res.write(`data: ${JSON.stringify({ error: errorMessage })}\n\n`);
            res.end();
            return errorMessage;
        }
    }
    

    async retryOperation(operation) {
        let LastError;
        
        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                return await operation();
            } catch (error) {
                LastError = error;
                console.log(`Attempt ${attempt} failed:`, error.message);
                if (attempt === this.maxRetries) throw error;
                await new Promise(resolve => 
                    setTimeout(resolve, this.retryDelay * attempt)
                );
            }
        }
    }

    async sendMessage(userId, chatId, message, res) {
        let chat;
        let session;
        chatId = chatId === 'null' ? null : chatId;
        try {
            // Initialize or get existing chat
            if ( !chatId ) {
                chat = await chatSession.initializeSession(userId);
                chatId = chat.chatId;
                // console.log(`Chat ${chatId}`);
                res.write(`data: ${JSON.stringify({ chatId })}\n\n`);
            } else {
                chat = await Chat.findOne({ chatId, user: userId });
                if (!chat) {
                    throw new Error('Chat not found');
                }
            }

            // Get or initialize chat session
            session = await chatSession.getSession(chatId);
            if (!session) {
                await chatSession.initializeSession(userId, chatId);
                session = await chatSession.getSession(chatId);
                if (!session) {
                    throw new Error('Failed to initialize chat session');
                }
            }

            // Update chat title if first message
            if (chat.messages.length === 0) {
                chat.title = message.length > 30 
                    ? `${message.substring(0, 30)}...` 
                    : message;
            }

            // Add user message
            chat.messages.push({
                role: 'user',
                content: message,
                timestamp: new Date()
            });

            // First save the user message
            await chat.save();

            // Send message with retry
            let response;
            try {
                response = await this.retryOperation(async () => {
                    const result = await session.sendMessageStream(message);
                   
                    // Check if response has expected structure
                    if (!result || (!result.stream && !result.response)) {
                        console.warn('Received unexpected response format:', result);
                        // Create a fallback response
                        return { 
                            text: () => "I received your message but couldn't generate a proper response. Please try again.",
                            response: { text: () => "Response fallback" }
                        };
                    }
                    
                    return result;
                });
            } catch (error) {
                console.error('Failed to get response after retries:', error);
                res.write(`data: ${JSON.stringify({ error: "Failed to get response from AI service" })}\n\n`);
                return { success: false, error: error.message };
            }
             
   
            let responseText;
            if (response.stream) {
                // Stream response
                responseText = await this.handleMessageStream(response, res);
            } else if (response.response?.text) {
                // Non-stream response with text method
                responseText = response.response.text();
                res.write(`data: ${JSON.stringify({ reply: responseText })}\n\n`);
            } else if (response.text) {
                // Direct text method
                responseText = response.text();
                res.write(`data: ${JSON.stringify({ reply: responseText })}\n\n`);
            } else {
                // Fallback for unknown format
                responseText = JSON.stringify(response);
                res.write(`data: ${JSON.stringify({ reply: "Received response in unknown format" })}\n\n`);
            }

            // Add assistant response
            chat.messages.push({
                role: 'assistant',
                content: responseText,
                timestamp: new Date()
            });

            await chat.save();

            return {
                success: true,
                chatId: chat.chatId,
                messageId: chat.messages[chat.messages.length - 1]._id
            };

        } catch (error) {
            console.error('Error in sendMessage:', error);
            res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
            
            if (chat) {
                try {
                    await chat.save();
                } catch (saveError) {
                    console.error('Error saving chat:', saveError);
                }
            }

            throw error;
        }
    }
}

const sendMessageService = new SendMessageService();
module.exports = sendMessageService;