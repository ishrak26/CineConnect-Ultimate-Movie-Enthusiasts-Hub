const supabase = require('../config/supabaseConfig');

async function fetchNotifications(userId, beforeTime, limit, offset) {
    const { data, error } = await supabase.rpc(
        'fetch_paginated_notifications',
        {
            p_user_id: userId,
            before_time: beforeTime,
            p_limit: limit,
            p_offset: offset,
        }
    );

    if (error) {
        console.error('Error fetching notifications:', error.message);
        throw error;
    }

    return data;
}

module.exports = {
    fetchNotifications,
};
