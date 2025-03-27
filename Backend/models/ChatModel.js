const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const messageSchema = new mongoose.Schema({
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const chatSchema = new mongoose.Schema({
    chatId: { type: String, default: uuidv4, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, default: 'New Chat' },
    messages: [messageSchema],
    isActive: { type: Boolean, default: true },
    lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

// Add indexes for commonly queried fields
chatSchema.index({ chatId: 1, user: 1 });
chatSchema.index({ user: 1, isActive: 1 });
chatSchema.index({ lastUpdated: -1 });

chatSchema.pre('save', function(next) {
    this.lastUpdated = new Date();
    next();
});

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;