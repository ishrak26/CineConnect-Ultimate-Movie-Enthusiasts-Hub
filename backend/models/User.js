const { parse } = require('dotenv');
const supabase = require('../config/supabaseConfig');

async function createUser(user) {
    const { data, error } = await supabase
        .from('user_info')
        .insert({
            username: user.username,
            email: user.email,
            password: user.password,
            full_name: user.full_name,
        })
        .select('id, username, email, full_name, role');

    if (error) {
        console.error(error);
        return null;
    }

    if (data) {
        return data[0];
    }
}

async function findOne({ username }) {
    const { data, error } = await supabase
        .from('user_info')
        .select('id, password, username, role')
        .eq('username', username);

    if (error) {
        console.error(error);
        return null;
    }

    if (data) {
        return data[0];
    }
}

async function checkIfUserExists({ username }) {
    const { data, error } = await supabase
        .from('user_info')
        .select('id')
        .eq('username', username);

    if (error) {
        console.error(error);
        return null;
    }

    if (data) {
        return data[0];
    }
}

async function checkIfEmailExists({ email }) {
    const { data, error } = await supabase
        .from('user_info')
        .select('id')
        .eq('email', email);

    if (error) {
        console.error(error);
        return null;
    }

    if (data) {
        return data[0];
    }
}

async function getCineFellows({ userId, limit, offset}) {
    try {
        // Fetch fellow1 details
        const { data: fellowsAsFellow1, error: error1 } = await supabase
            .from('cinefellow')
            .select(`
                fellow2_id,
                user_info:fellow2_id (id, username, full_name, image_url, email)
            `)
            .eq('fellow1_id', userId)
            .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

        if (error1) throw error1;

        // Fetch fellow2 details
        const { data: fellowsAsFellow2, error: error2 } = await supabase
            .from('cinefellow')
            .select(`
                fellow1_id,
                user_info:fellow1_id (id, username, full_name, image_url, email)
            `)
            .eq('fellow2_id', userId);

        if (error2) throw error2;

        // Map and combine the results to a unified structure
        const combinedFellows = [
            ...fellowsAsFellow1.map(item => item.user_info),
            ...fellowsAsFellow2.map(item => item.user_info),
        ];

        console.log(combinedFellows);

        return combinedFellows;

    } catch (error) {
        console.error('Error fetching CineFellows:', error.message);
        return null;
    }
}

async function getCineFellowCount({ userId }) {
    try {
        // Count where the user is fellow1
        const { count: count1, error: error1 } = await supabase
            .from('cinefellow')
            .select('fellow2_id', { count: 'exact' }) // Use count feature
            .eq('fellow1_id', userId)
            .single(); // Assuming count returns a single object

        if (error1) {
            console.error('Error counting where user is fellow1:', error1);
            throw error1; // Throw to catch block
        }

        // Count where the user is fellow2
        const { count: count2, error: error2 } = await supabase
            .from('cinefellow')
            .select('fellow1_id', { count: 'exact' }) // Use count feature
            .eq('fellow2_id', userId)
            .single(); // Assuming count returns a single object

        if (error2) {
            console.error('Error counting where user is fellow2:', error2);
            throw error2; // Throw to catch block
        }

        // Combine the counts from both queries
        const totalCount = count1 + count2;

        console.log(totalCount);

        return totalCount;
    } catch (error) {
        console.error('Error fetching CineFellow count:', error.message);
        return null; // Or handle error as appropriate
    }
}


async function followCinefellow({ userId, fellowId }) {
    try {
        // First, check if there's already a pending or accepted request
        const { data: existingRequest, error: existingError } = await supabase
            .from('cinefellow_request')
            .select('id')
            .or(`from_id.eq.${userId},to_id.eq.${fellowId}`)
            .or(`from_id.eq.${fellowId},to_id.eq.${userId}`)
            .in('status', ['pending', 'accepted']);

        if (existingError) throw existingError;

        // If a request already exists, prevent creating a duplicate
        if (existingRequest.length > 0) {
            console.log('A request already exists between these users.');
            return false; // Indicates no new request was created
        }

        // Insert the new follow request into the cinefellow_request table
        const { error: insertError } = await supabase
            .from('cinefellow_request')
            .insert([{ from_id: userId, to_id: fellowId, status: 'pending' }]);

        if (insertError) {
            throw insertError;
        }

        return true; // Successfully created a new follow request

    } catch (error) {
        console.error('Error following cinefellow:', error.message);
        throw error;
    }
}


async function unfollowCinefellow({ userId, fellowId }) {
    try {
        // Check if the user is following the fellow
        const { data, error } = await supabase
            .from('cinefellow')
            .select('id')
            .or(`fellow1_id.eq.${userId},fellow2_id.eq.${userId}`)
            .or(`fellow1_id.eq.${fellowId},fellow2_id.eq.${fellowId}`);

        if (error) throw error;

        if (data.length === 0) {
            return false;
        }

        // Delete the cinefellow relationship
        const { error: deleteError } = await supabase
            .from('cinefellow')
            .delete()
            .or(`fellow1_id.eq.${userId},fellow2_id.eq.${userId}`)
            .or(`fellow1_id.eq.${fellowId},fellow2_id.eq.${fellowId}`);

        if (deleteError) throw deleteError;

        return true;

    } catch (error) {
        console.error('Error unfollowing cinefellow:', error.message);
        throw error;
    }
}

async function isFollowing({ userId, fellowId }) {
    try {
        // Check if the user is following the fellow
        const { data, error } = await supabase
            .from('cinefellow')
            .select('id')
            .or(`fellow1_id.eq.${userId},fellow2_id.eq.${userId}`)
            .or(`fellow1_id.eq.${fellowId},fellow2_id.eq.${fellowId}`);

        if (error) throw error;

        return data.length > 0;

    } catch (error) {
        console.error('Error checking if following:', error.message);
        throw error;
    }
}

const getPendingRequests = async ({ userId, limit, offset }) => {
    try {
        // Fetch incoming requests
        const { data: incomingRequests, error: incomingError } = await supabase
            .from('cinefellow_request')
            .select('*')
            .eq('to_id', userId)
            .eq('status', 'pending')
            .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

        if (incomingError) throw incomingError;

        // Fetch outgoing requests
        const { data: outgoingRequests, error: outgoingError } = await supabase
            .from('cinefellow_request')
            .select('*')
            .eq('from_id', userId)
            .eq('status', 'pending');

        if (outgoingError) throw outgoingError;

        return { incomingRequests, outgoingRequests };
    } catch (error) {
        console.error('Error fetching pending requests:', error.message);
        throw error;
    }
}

const acceptCineFellowRequest = async ({ requestId, userId }) => {
    try {
        // First, retrieve the request to get from_id and to_id
        const { data: requestData, error: requestError } = await supabase
            .from('cinefellow_request')
            .select('*')
            .eq('id', requestId)
            .eq('to_id', userId)
            .single();

        if (requestError) throw requestError;
        if (!requestData) throw new Error('Request not found.');

        // Update request status to 'accepted'
        const { error: updateError } = await supabase
            .from('cinefellow_request')
            .update({ status: 'accepted' })
            .eq('id', requestId);

        if (updateError) throw updateError;

        // Add to the cinefellow table
        const { error: cinefellowError } = await supabase
            .from('cinefellow')
            .insert([
                { fellow1_id: requestData.from_id, fellow2_id: requestData.to_id },
            ]);

        if (cinefellowError) throw cinefellowError;

        return true;

    } catch (error) {
        console.error('Error accepting cinefellow request:', error.message);
        throw error;
    }
};


const rejectCineFellowRequest = async ({ requestId, userId }) => {
    try {
        // Update request status to 'rejected' or 'cancelled'
        // Ensure to check both from_id and to_id to correctly identify the request for the user
        const { error: rejectError } = await supabase
            .from('cinefellow_request')
            .update({ status: 'rejected' }) // Use 'cancelled' if appropriate for your logic
            .or(`id.eq.${requestId},from_id.eq.${userId},to_id.eq.${userId}`);

        if (rejectError) throw rejectError;

        return true;
    } catch (error) {
        console.error('Error rejecting/cancelling cinefellow request:', error.message);
        throw error;
    }
}

const getWatchedMovies = async ({ userId, limit, offset}) => {
    try {
        const { data, error } = await supabase
            .from('watched_list')
            .select(`
            movie_id,
            movie:movie_id (id, title, release_date, poster_url)
            `)
            .eq('user_id', userId)
            .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

        if (error) throw error;

        return data.map(item => item.movie_id);

    } catch (error) {
        console.error('Error fetching watched movies:', error.message);
        throw error;
    }
}

const getWatchlist = async ({ userId, limit, offset }) => {
    try {
        const { data, error } = await supabase
        .from('watch_list')
        .select(`
            movie_id,
            movie:movie_id (id, title, release_date, poster_url)
        `)
        .eq('user_id', userId)
        .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);
    
        if (error) throw error;

        return data.map(item => item.movie);

    } catch (error) {
        console.error('Error fetching watchlist:', error.message);
        throw error;
    }
}

const removeFromWatchlist = async ({ userId, movieId }) => {
    try {
        const { error } = await supabase
            .from('watch_list')
            .delete()
            .eq('user_id', userId)
            .eq('movie_id', movieId);

        if (error) throw error;

        return true;

    } catch (error) {
        console.error('Error removing from watchlist:', error.message);
        throw error;
    }
}

const searchProfilesByUsername = async ({ username , limit, offset}) => {
    try {
        const { data, error } = await supabase
            .from('user_info')
            .select('id, username, full_name')
            .ilike('username', `%${username}%`)
            .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

        if (error) throw error;

        return data;

    } catch (error) {
        console.error('Error searching profiles:', error.message);
        throw error;
    }
}

module.exports = {
    createUser,
    findOne,
    checkIfUserExists,
    checkIfEmailExists,
    getCineFellows,
    getCineFellowCount,
    followCinefellow,
    unfollowCinefellow,
    isFollowing,
    getPendingRequests,
    acceptCineFellowRequest,
    rejectCineFellowRequest,
    getWatchedMovies,
    getWatchlist,
    removeFromWatchlist,
    searchProfilesByUsername,
};
