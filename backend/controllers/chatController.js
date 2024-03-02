const { supabase } = require('../config/supabaseConfig');

const dbChat = require('../models/Chat');
const dbUser = require('../models/User');

const chatController = {
    getChats: async (req, res) => {
        try {
            // Ensure the user is authenticated
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            // Extract the userId of the chat partner from the request parameters
            const userId = req.params.userId;
            const limit = parseInt(req.query.limit) || 100;
            const offset = parseInt(req.query.offset) || 0;

            if (!req.query.beforeTime) {
                const currentDate = new Date();
                req.query.beforeTime = currentDate.toISOString();
            }

            const { data: chats } = await dbChat.getChats(
                req.user.id,
                userId,
                req.query.beforeTime,
                limit,
                offset
            );

            const data = [];
            for (let chat of chats) {
                data.push({
                    createdAt: chat.created_at,
                    content: chat.content,
                    senderId: chat.sender_id,
                    receiverId: chat.receiver_id,
                });
            }

            // If there are no errors, send the retrieved chat messages to the client
            return res.status(200).json(data);
        } catch (error) {
            // Log the error and return a 500 Internal Server Error status code
            console.error('Server error when fetching chats:', error.message);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    getNewChats: async (req, res) => {
        try {
            // Ensure the user is authenticated
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            // Extract the userId of the chat partner from the request parameters
            const userId = req.params.userId;

            if (!req.query.afterTime) {
                const currentDate = new Date();
                req.query.afterTime = currentDate.toISOString();
            }

            // Retrieve the new chat messages from the chat service
            const { data } = await dbChat.getNewChats(
                req.user.id,
                userId,
                req.query.afterTime
            );

            const response = [];

            for (let chat of data) {
                response.push({
                    createdAt: chat.created_at,
                    content: chat.content,
                    senderId: chat.sender_id,
                    receiverId: chat.receiver_id,
                });
            }

            // If there are no errors, send the retrieved chat messages to the client

            return res.status(200).json(response);
        } catch (error) {
            // Log the error and return a 500 Internal Server Error status code
            console.error('Server error when fetching new chats:', error.message);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    sendMessage: async (req, res) => {
        try {
            // Ensure the user is authenticated
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            // Extract the userId of the chat partner from the request parameters
            const userId = req.params.userId;

            // Extract the message content from the request body
            const { message } = req.body;
            if (!message) {
                return res.status(400).json({ error: 'Empty message' });
            }

            // Send the message to the chat service
            const { data } = await dbChat.sendMessage(
                req.user.id,
                userId,
                message
            );

            if (!data) {
                return res
                    .status(500)
                    .json({ error: 'Failed to send message' });
            }

            // console.log('Message sent:', data);

            // If there are no errors, send the message to the client
            return res
                .status(201)
                .json({ createdAt: data.created_at, content: data.content, senderId: data.sender_id, receiverId: data.receiver_id });
        } catch (error) {
            // Log the error and return a 500 Internal Server Error status code
            console.error('Server error when sending message:', error.message);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    getChatUsers: async (req, res) => {
        try {
            // Ensure the user is authenticated
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            if (!req.query.beforeTime) {
                const currentDate = new Date();
                req.query.beforeTime = currentDate.toISOString();
            }
            req.query.limit = parseInt(req.query.limit) || 10;
            req.query.offset = parseInt(req.query.offset) || 0;

            // Retrieve the list of users with whom the current user has chatted
            const data = await dbChat.getChatUsers(
                req.user.id,
                req.query.beforeTime,
                req.query.limit,
                req.query.offset
            );

            const response = [];
            for (let user of data) {
                response.push({
                    userId: user.user_id,
                    username: user.username,
                    fullname: user.full_name,
                    imageUrl: user.profile_url,
                    lastConversationAt: user.last_conversation_at,
                });
            }

            // console.log("Chat users", response);

            // Send the list of chat users to the client
            return res.status(200).json(response);
        } catch (error) {
            // Log the error and return a 500 Internal Server Error status code
            console.error(
                'Server error when fetching chat users:',
                error.message
            );
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },
};

module.exports = chatController;
