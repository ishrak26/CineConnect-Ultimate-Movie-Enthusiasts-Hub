const supabase = require('../config/supabaseConfig');

// Function to retrieve chat messages between two users
const getChats = async (senderId, receiverId, timestamp, limit, offset) => {
    const { data, error } = await supabase
        .from('chat')
        .select('*')
        // Attempt to fetch messages where either condition is met
        .or(`sender_id.eq.${senderId},receiver_id.eq.${senderId}`)
        .or(`sender_id.eq.${receiverId},receiver_id.eq.${receiverId}`)
        .lt('created_at', timestamp)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

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
        .from('chat')
        .insert([
            { sender_id: senderId, receiver_id: receiverId, content: content },
        ])
        .select('id');

    if (error) {
        console.error('Error sending message:', error.message);
        throw error;
    }

    return { data: data[0] }; // Assuming the insert operation returns the inserted row
};

// Function to retrieve the users with whom the current user has chatted
const getChatUsers = async (userId, timestamp, limit, offset) => {
    const { data, error } = await supabase.rpc('fetch_chat_history', {
        my_user_id: userId,
        before_timestamp: timestamp,
        limit_val: limit,
        offset_val: offset,
    });

    if (error) {
        console.error('Error fetching chat partners', error);
        throw error;
    }

    return data;
};

module.exports = {
    getChats,
    sendMessage,
    getChatUsers,
};
