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

async function findOne({ username }) {  // Fetch user{id, username, password, role} by username
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

async function findOneById(id) {  // Fetch user{id, username, password, role} by username
    const { data, error } = await supabase
        .from('user_info')
        .select('id, password, username, role')
        .eq('id', id);

    if (error) {
        console.error(error);
        return null;
    }

    if (data) {
        return data[0];
    }
}

async function findOneById(id) {  // Fetch user{id, username, password, role} by username
    const { data, error } = await supabase
        .from('user_info')
        .select('id, password, username, role')
        .eq('id', id);

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


async function getProfileByUsername({ username }) {
    try {
        const { data, error } = await supabase
            .from('user_info')
            .select('id, username, full_name, image_url, email')
            .eq('username', username)
            .single();

        if (error) throw error;

        return data;

    } catch (error) {
        console.error('Error fetching profile:', error.message);
        return null;
    }
}

async function getCineFellows({ userId, limit, offset}) {
    try {
        // Fetch fellow1 details
        const { data: fellowsAsFellow1, error: error1 } = await supabase
            .from('cinefellow')
            .select(`
                requestee_id,
                user_info:requestee_id (id, username, full_name, image_url, email)
            `)
            .eq('requestor_id', userId)
            .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

        if (error1) throw error1;

        // Fetch fellow2 details
        const { data: fellowsAsFellow2, error: error2 } = await supabase
            .from('cinefellow')
            .select(`
                requestor_id,
                user_info:requestor_id (id, username, full_name, image_url, email)
            `)
            .eq('requestee_id', userId);

        if (error2) throw error2;

        // Map and combine the results to a unified structure
        const combinedFellows = [
            ...fellowsAsFellow1.map(item => item.user_info),
            ...fellowsAsFellow2.map(item => item.user_info),
        ];

        // console.log(combinedFellows);

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
            .select('requestee_id', { count: 'exact' }) // Use count feature
            .eq('requestor_id', userId)
            .single(); // Assuming count returns a single object

        if (error1) {
            console.error('Error counting where user is fellow1:', error1);
            throw error1; // Throw to catch block
        }

        // Count where the user is fellow2
        const { count: count2, error: error2 } = await supabase
            .from('cinefellow')
            .select('requestor_id', { count: 'exact' }) // Use count feature
            .eq('requestee_id', userId)
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

async function getCinefellowCount2({ userId }) {
    const { data, error } = await supabase
      .from('cinefellow')
      .select('id', { count: 'exact' }) // We want to count the number of matches
      .or(`requestor_id.eq.${userId},requestee_id.eq.${userId}`);
  
    if (error) {
      console.error('Error fetching cinefellow count:', error);
      return 0; // Return 0 if there's an error
    }
  
    return data.length; // The number of cinefellow rows for the user
  }
  


async function followCinefellow({ userId, fellowId }) {
    try {
        // First, check if there's already a pending or accepted request
        // const { data: existingRequest, error: existingError } = await supabase
        //     .from('cinefellow_request')
        //     .select('id')
        //     .or(`from_id.eq.${userId},to_id.eq.${fellowId}`)
        //     .or(`from_id.eq.${fellowId},to_id.eq.${userId}`)
        //     .in('status', ['pending', 'accepted']);

        // if (existingError) throw existingError;

        // If a request already exists, prevent creating a duplicate
        // if (existingRequest.length > 0) {
        //     console.log('A request already exists between these users.');
        //     return false; // Indicates no new request was created
        // }

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

        // Delete the cinefellow relationship
        const { data, error: deleteError } = await supabase
            .from('cinefellow')
            .delete()
            .or(`requestor_id.eq.${userId},requestee_id.eq.${userId}`)
            .or(`requestor_id.eq.${fellowId},requestee_id.eq.${fellowId}`).select();

        if (deleteError) throw deleteError;

        if(data.length === 0) {
            console.log('No cinefellow relationship found.');
            return false;
        }

        return true;

    } catch (error) {
        console.error('Error unfollowing cinefellow:', error.message);
        throw error;
    }
}

async function isFollowing({ userId, fellowId }) {
    try {
        // Check if the user is following the fellow
        // console.log('Inside model function isFollowing UserId : ', userId, 'FellowId : ', fellowId);
        const { data, error } = await supabase
            .from('cinefellow')
            .select('id')
            .or(`requestor_id.eq.${userId},requestee_id.eq.${userId}`)  // Check if user is requestor
            .or(`requestor_id.eq.${fellowId},requestee_id.eq.${fellowId}`); // Check if user is requestee

        // console.log('in isfollowing function', data, error);
            if (error || data.length > 1) throw error;

        if (data.length === 0) {
            return null;
        }
        
            return data[0];

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

        return { incomingRequests };
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
                { requestor_id: requestData.from_id, requestee_id: requestData.to_id },
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

async function checkIfIRequested({ userId, fellowId }) {
    const { data, error } = await supabase
      .from('cinefellow_request')
      .select('id')
      .match({ from_id: userId, to_id: fellowId })
      .single();
  
    if (error) {
      console.error('Error checking cinefellow request:', error);
      throw error; // or handle the error as you see fit
    }
  
    return data ? true : false; // If there's data, a request exists (true), otherwise not (false)
  }

  async function checkIfTheyRequested({ userId, fellowId }) {
    const { data, error } = await supabase
      .from('cinefellow_request')
      .select('id')
      .match({ from_id: fellowId, to_id: userId })
      .single();
  
    if (error) {
      console.error('Error checking if they requested:', error);
      throw error; // or handle the error as you see fit
    }
  
    return !!data; // Convert the result to boolean: true if they requested, false otherwise
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

        return data.map(item => item.movie);

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
};

async function fetchJoinedForums(userId, limit, offset) {
    try {
        console.log('Fetching joined forums:', userId, limit, offset);

        const { data, error } = await supabase.rpc('get_joined_forums', {
            uid: userId,
            limit_val: limit,
            offset_val: offset,
        });

        if (error) {
            console.error('Error fetching joined forums:', error.message);
            return null;
        }

        // console.log('Joined forums:', data);
        return data;
    } catch (err) {
        console.error('Exception fetching joined forums:', err.message);
        return null;
    }

}

const getProfileDetails = async ({ username }) => {
    try {
        const { data, error } = await supabase
            .from('user_info')
            .select('id, username, full_name, image_url, role')
            .eq('username', username);

        if (error) throw error;

        return data[0];

    } catch (error) {
        console.error('Error fetching profile details:', error.message);
        throw error;
    }
}

async function fetchUserById({ id }) {
    const { data, error } = await supabase
        .from('user_info')
        .select('id, username, role, image_url')
        .eq('id', id);

    if (error) {
        console.error(error);
        return null;
    }

    if (data.length !== 1) {
        return null;
    }

    return data[0];

}

module.exports = {
    createUser,
    findOne,
    findOneById,
    checkIfUserExists,
    checkIfEmailExists,

    getProfileByUsername,
    getCineFellows,
    getCineFellowCount,
    getCinefellowCount2,
    followCinefellow,
    unfollowCinefellow,
    getPendingRequests,
    acceptCineFellowRequest,
    rejectCineFellowRequest,
    checkIfIRequested,
    checkIfTheyRequested,
    getWatchedMovies,
    getWatchlist,
    removeFromWatchlist,
    searchProfilesByUsername,
    fetchJoinedForums,

    getProfileDetails,
    fetchUserById,

};
