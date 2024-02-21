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

async function fetchPostAuthorByPostId(postId) {
    const { data, error } = await supabase
        .from('post')
        .select('author_id')
        .eq('id', postId);

    if (error) {
        console.error('Error:', error.message);
        return null;
    }

    if (data.length > 1) {
        console.error('Error: more than one author found');
        return null;
    }

    return data[0].author_id;
}

async function fetchPostReactionCount(postId) {
    try {
        const { data, error } = await supabase.rpc('get_post_reaction_count', {
            pid: postId,
        });

        if (error || data.length !== 1) {
            console.error('Error fetching post reaction count:', error.message);
            return null;
        }

        // console.log('Post reaction count:', data);
        return data[0];
    } catch (err) {
        console.error('Exception fetching post reaction count:', err.message);
        return null;
    }
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

async function updatePost(postId, title, content, images) {
    try {
        const { data, error } = await supabase.rpc(
            'update_forum_post_version',
            {
                p_post_id: postId,
                p_content: content,
                p_title: title,
                p_images: images,
            }
        );

        if (error) {
            console.error('Error updating post:', error.message);
            return null;
        }

        console.log('Returning from updatePost: new post_version ID:', data);
        return data;
    } catch (err) {
        console.error('Exception creating new post:', err.message);
    }
}

async function createNewComment(userId, parentId, content, images) {
    // Convert images array to JSONB format expected by the PostgreSQL function
    // const imagesJsonb = JSON.stringify(images);

    try {
        const { data, error } = await supabase.rpc('create_new_comment', {
            user_id: userId,
            parent_id: parentId,
            content: content,
            images,
            // images: imagesJsonb,
        });

        if (error) {
            console.error('Error creating new comment:', error.message);
            return null;
        }

        // console.log('Returning from createNewCommentt: new post ID:', data);
        return data;
    } catch (err) {
        console.error('Exception creating new comment:', err.message);
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

async function fetchCommentsByPostId(postId, limit, offset) {
    try {
        const { data, error } = await supabase.rpc('get_paginated_comments', {
            p_id: postId,
            post_limit: limit,
            post_offset: offset,
        });

        if (error) {
            console.error('Error fetching comments by postId:', error.message);
            return null;
        }

        // console.log('Returning from fetchPostsByMovieId:', data);

        return data;
    } catch (err) {
        console.error('Exception fetching comments by postId:', err.message);
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
    updatePost,
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
    createNewComment,
    fetchPostReactionCount,
    fetchCommentsByPostId,
    fetchForumById,
    fetchPostAuthorByPostId,
};
