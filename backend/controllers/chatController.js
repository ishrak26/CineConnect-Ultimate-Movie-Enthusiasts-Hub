const { supabase } = require("../config/supabaseConfig");

const dbChat = require("../models/Chat");
const dbUser = require("../models/User");

const chatController = {
  getChats: async (req, res) => {
    try {
      // Ensure the user is authenticated
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Extract the userId of the chat partner from the request parameters
      const userId = req.params.userId;

      const { data: chats, error } = await dbChat.getChats(req.user.id, userId);

      // Check for any errors from the chat service
      if (error) {
        console.error("Error fetching chats:", error);
        return res.status(500).json({ error: "Failed to fetch chats" });
      }

      // If there are no errors, send the retrieved chat messages to the client
      return res.status(200).json(chats);
    } catch (error) {
      // Log the error and return a 500 Internal Server Error status code
      console.error("Server error when fetching chats:", error.message);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  sendMessage: async (req, res) => {
    try {
      // Ensure the user is authenticated
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Extract the userId of the chat partner from the request parameters
      const userId = req.params.userId;

      // Extract the message content from the request body
      const { message } = req.body;

      // Send the message to the chat service
      const { data, error } = await dbChat.sendMessage(
        req.user.id,
        userId,
        message
      );

      // Check for any errors from the chat service
      if (error) {
        console.error("Error sending message:", error);
        return res.status(500).json({ error: "Failed to send message" });
      }

      // If there are no errors, send the message to the client
      return res.status(201).json(data);
    } catch (error) {
      // Log the error and return a 500 Internal Server Error status code
      console.error("Server error when sending message:", error.message);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getChatUsers: async (req, res) => {
    try {
      // Ensure the user is authenticated
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Retrieve the list of users with whom the current user has chatted
      const { userIds } = await dbChat.getChatUsers(req.user.id);

      // Check for any errors from the chat service
      if (error) {
        console.error("Error fetching chat users:", error);
        return res.status(500).json({ error: "Failed to fetch chat users" });
      }

      console.log("userIds ", userIds);

      // Fetch details for all users in parallel
      const userPromises = userIds.map((userId) =>
        dbUser.fetchUserById(userId)
      );
      const users = await Promise.all(userPromises);

      // Send the list of chat users to the client
      return res.status(200).json(users);
    } catch (error) {
      // Log the error and return a 500 Internal Server Error status code
      console.error("Server error when fetching chat users:", error.message);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

module.exports = chatController;
