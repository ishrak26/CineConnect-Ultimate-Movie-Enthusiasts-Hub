const supabase = require("../config/supabaseConfig");

// Function to retrieve chat messages between two users
const getChats = async (senderId, receiverId, limit, offset) => {
    const { data, error } = await supabase
      .from("chat")
      .select("*")
      // Attempt to fetch messages where either condition is met
      .or(`sender_id.eq.${senderId},receiver_id.eq.${senderId}`)
      .or(`sender_id.eq.${receiverId},receiver_id.eq.${receiverId}`)
      .order("created_at", { ascending: false }).range(offset, offset+limit-1);

    if (error) {
      console.error('Error fetching chats:', error.message);
      throw error;
    }

    // Filter the results to only include messages between the two users
    // const filteredData = data.filter(
    //   (message) =>
    //     (message.sender_id === senderId &&
    //       message.receiver_id === receiverId) ||
    //     (message.sender_id === receiverId && message.receiver_id === senderId)
    // );

    return { data };
};

// Function to send a message from one user to another
const sendMessage = async (senderId, receiverId, content) => {
    const { data, error } = await supabase
      .from("chat")
      .insert([
        { sender_id: senderId, receiver_id: receiverId, content: content },
      ]).select('id');

    if (error) {
      console.error('Error sending message:', error.message);
      throw error;
    }

    return { data: data[0] }; // Assuming the insert operation returns the inserted row
};

// Function to retrieve the users with whom the current user has chatted
const getChatUsers = async (userId, limit, offset) => {
        const { data, error } = await supabase
            .from('chat')
            .select('sender_id, receiver_id')
            .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);

        if (error) {
          console.error('Error fetching other chat users', error);
          throw error;
        }

        // Extract unique user IDs, excluding the current user's ID
        let userIds = new Set();
        data.forEach(row => {
            if (row.sender_id !== userId) userIds.add(row.sender_id);
            if (row.receiver_id !== userId) userIds.add(row.receiver_id);
        });

        console.log('userIds:', userIds);

        return { userIds: Array.from(userIds) };
};

module.exports = {
  getChats,
  sendMessage,
  getChatUsers,
};
