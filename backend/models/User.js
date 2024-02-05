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

async function getCineFellows({ userId }) {
    // Attempt to fetch where the user is fellow1

    const { data: data1, error: error1 } = await supabase
        .from('cinefellow')
        .select('fellow2_id')
        .eq('fellow1_id', userId);

    if (error1) {
        console.error('Error fetching where user is fellow1:', error1);
        return null;
    }

    // Attempt to fetch where the user is fellow2
    const { data: data2, error: error2 } = await supabase
        .from('cinefellow')
        .select('fellow1_id')
        .eq('fellow2_id', userId);

    if (error2) {
        console.error('Error fetching where user is fellow2:', error2);
        return null;
    }


    for (let data of data1) {
        data.cine_fellow_id = data.fellow2_id;
    }
    for (let data of data2) {
        data.cine_fellow_id = data.fellow1_id;
    }


    // Combine the results from both queries
    const combinedData = [...data1, ...data2].map(item => item.cine_fellow_id);
    console.log('combinedData', combinedData);

    return combinedData;
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

const getPendingRequests = async ({ userId }) => {
    try {
        // Fetch incoming requests
        const { data: incomingRequests, error: incomingError } = await supabase
            .from('cinefellow_request')
            .select('*')
            .eq('to_id', userId)
            .eq('status', 'pending');

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
                { fellow1_id: requestData.to_id, fellow2_id: requestData.from_id },
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

const getWatchedMovies = async ({ userId }) => {
    try {
        const { data, error } = await supabase
            .from('watched_list')
            .select('movie_id')
            .eq('user_id', userId);

        if (error) throw error;

        return data.map(item => item.movie_id);

    } catch (error) {
        console.error('Error fetching watched movies:', error.message);
        throw error;
    }
}

const getWatchlist = async ({ userId }) => {
    try {
        const { data, error } = await supabase
            .from('watch_list')
            .select('movie_id')
            .eq('user_id', userId);

        if (error) throw error;

        return data.map(item => item.movie_id);

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

const searchProfilesByUsername = async ({ username }) => {
    try {
        const { data, error } = await supabase
            .from('user_info')
            .select('id, username, full_name')
            .ilike('username', `%${username}%`);

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
    followCinefellow,
    unfollowCinefellow,
    getPendingRequests,
    acceptCineFellowRequest,
    rejectCineFellowRequest,
    getWatchedMovies,
    getWatchlist,
    removeFromWatchlist,
    searchProfilesByUsername,
};
