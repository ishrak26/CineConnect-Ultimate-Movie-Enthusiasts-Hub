const supabase = require('../config/supabaseConfig');

async function fetchAllTags(offset, limit) {
    try {
        const { data, error } = await supabase.rpc('fetch_distinct_tags', {
            limit_val: limit,
            offset_val: offset,
        });

        if (error) {
            console.error('Error fetching tags:', error.message);
            return null;
        }

        // console.log('Returning from fetchAllTags:', data);
        return data;
    } catch (err) {
        console.error('Exception fetching tags:', err.message);
    }
}

module.exports = {
    fetchAllTags,
};
