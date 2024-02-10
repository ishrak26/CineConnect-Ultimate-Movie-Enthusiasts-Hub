const supabase = require('../config/supabaseConfig');

/*
    returns a specific post given the postId
*/
async function fetchSinglePostById(postId, imgLimit) {
    try {
        const { data, error } = await supabase.rpc('fetch_single_post', {
            p_id: postId,
            img_limit: imgLimit,
        });

        if (error || data.length === 0) {
            console.error('Error fetching single post:', error.message);
            return null;
        }

        if (data.length > 1) {
            console.error(
                'Error fetching single post: more than one post found'
            );
            return null;
        }

        // console.log('Fetched single post details:', data[0]);
        // console.log('images:', data[0].images);
        return data[0];
    } catch (err) {
        console.error('Exception fetching single post:', err.message);
    }
}

async function fetchReactionsByPostId(postId) {
    // Count upvotes
    const { count: upvoteCount, error: upvotesError } = await supabase
        .from('post_has_reaction')
        .select('*', { count: 'exact' })
        .eq('post_id', postId)
        .eq('type', 'upvote');

    // Count downvotes
    const { count: downvotesCount, error: downvotesError } = await supabase
        .from('post_has_reaction')
        .select('*', { count: 'exact' })
        .eq('post_id', postId)
        .eq('type', 'downvote');

    // Assuming comments are stored in a way that they can be counted for a given post
    // Replace 'comments_table' with the actual table name and 'post_id' with the actual foreign key column name if different
    const { data: commentsData, error: commentsError } = await supabase
        .from('comments_table') // Replace 'comments_table' with your actual table name
        .select('*', { count: 'exact' })
        .eq('parent_id', postId);

    if (upvotesError || downvotesError || commentsError) {
        console.error(
            'Error fetching post statistics:',
            upvotesError || downvotesError || commentsError
        );
        return null;
    }

    const statistics = {
        postId: postId,
        upvotes: upvotesData.count,
        downvotes: downvotesData.count,
        comments: commentsData.count, // Assuming this is the count of comments and replies together
    };

    console.log('Post statistics:', statistics);
    return statistics;
}

async function createNewPost(userId, movieId, content, images) {
    // Convert images array to JSONB format expected by the PostgreSQL function
    // const imagesJsonb = JSON.stringify(images);

    try {
        const { data, error } = await supabase.rpc('create_new_forum_post', {
            user_id: userId,
            movie_id: movieId,
            content: content,
            images,
            // images: imagesJsonb,
        });

        if (error) {
            console.error('Error creating new post:', error.message);
            return null;
        }

        console.log('Returning from createNewPost: new post ID:', data);
        return data;
    } catch (err) {
        console.error('Exception creating new post:', err.message);
    }
}

async function isJoinedForumByForumId(userId, forumId) {
    const { count, error } = await supabase
        .from('watched_list')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('movie_id', forumId)
        .eq('joined_forum', true);

    if (error) {
        console.error('Error:', error.message);
        return null;
    }

    return count === 1;
}

async function isJoinedForumByPostId(postId, userId) {
    try {
        const { data, error } = await supabase.rpc('check_user_joined_forum', {
            pid: postId,
            uid: userId,
        });

        if (error) {
            console.error('Error:', error.message);
            return null;
        }

        // console.log('Is user joined the forum?', data);
        return data;
    } catch (err) {
        console.error('Exception:', err.message);
        return null;
    }
}

async function joinForum(id) {
    const { data, error } = await supabase
        .from('watched_list')
        .update({ joined_forum: true })
        .eq('id', id)
        .select();

    if (error) {
        console.error('Error:', error.message);
        return null;
    }

    return data;
}

async function fetchMovieIdByPostId(postId) {
    const { data, error } = await supabase
        .from('movie_has_reviews_and_posts')
        .select('movie_id')
        .eq('post_id', postId)
        .single();

    if (error) {
        console.error('Error:', error.message);
        return null;
    }

    return data.movie_id;
}

async function fetchPostsByMovieId(movieId, limit, offset) {
    try {
        const { data, error } = await supabase.rpc('fetch_posts_by_movie', {
            m_id: movieId,
            post_limit: limit,
            post_offset: offset,
        });

        if (error) {
            console.error('Error fetching posts by movieId:', error.message);
            return null;
        }

        // console.log('Returning from fetchPostsByMovieId:', data);

        return data;
    } catch (err) {
        console.error('Exception fetching posts by movieId:', err.message);
    }
}

async function fetchPostVoteByUser(postId, userId) {
    const { data, error } = await supabase
        .from('post_has_reaction')
        .select('id, type')
        .eq('post_id', postId)
        .eq('reactor_id', userId);

    if (error) {
        console.error('Error:', error.message);
        return null;
    }

    if (data.length > 1) {
        console.error('Error: more than one vote found');
        return null;
    }

    return data;
}

async function submitVote(postId, userId, type) {
    const { data, error } = await supabase
        .from('post_has_reaction')
        .insert([{ post_id: postId, reactor_id: userId, type: type }])
        .select();

    if (error) {
        console.error('Error:', error.message);
        return null;
    }

    return data;
}

async function removeVote(voteId) {
    const { data, error } = await supabase
        .from('post_has_reaction')
        .delete()
        .eq('id', voteId)
        .select();

    if (error) {
        console.error('Error:', error.message);
        return null;
    }

    return data;
}

async function fetchTotalMemberCountInForum(forumId) {
    const { count, error } = await supabase
        .from('watched_list')
        .select('*', { count: 'exact', head: true })
        .eq('movie_id', forumId);

    if (error) {
        console.error('Error fetching total member count:', error.message);
        return null;
    }

    return count;
}

async function fetchForumById(forumId) {

    const { data, error } = await supabase
        .from('movie')
        .select('id, title, poster_url, release_date, plot_summary')
        .eq('id', forumId)
        .single();

    if (error) {
        console.error('Error:', error.message);
        return null;
    }

    return data;
}

module.exports = {
    createNewPost,
    isJoinedForumByForumId,
    fetchMovieIdByPostId,
    joinForum,
    fetchPostsByMovieId,
    fetchSinglePostById,
    fetchPostVoteByUser,
    submitVote,
    isJoinedForumByPostId,
    removeVote,
    fetchTotalMemberCountInForum,
    fetchForumById,
};
