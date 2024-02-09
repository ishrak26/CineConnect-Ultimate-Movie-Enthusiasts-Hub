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

async function isJoinedForum(userId, movieId) {
    const { count, error } = await supabase
        .from('watched_list')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('movie_id', movieId)
        .eq('joined_forum', true);

    if (error) {
        console.error('Error:', error.message);
        return null;
    }

    return count === 1;
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

module.exports = {
    createNewPost,
    isJoinedForum,
    fetchMovieIdByPostId,
    joinForum,
    fetchPostsByMovieId,
    fetchSinglePostById,
};
