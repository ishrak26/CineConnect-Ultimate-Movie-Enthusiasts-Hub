const { supabase } = require('../config/supabaseConfig');

const dbPost = require('../models/Post');

const postController = {
    getPostById: async (req, res) => {
        try {
            if (!req.user)
                return res.status(401).json({ message: 'Unauthorized' });

            const postId = req.params.postId;
            const movieId = db_movie.fetchMovieIdByPostId(postId);
            if (!movieId) {
                return res.status(404).json({ message: 'Invalid postId' });
            }

            const isJoined = await db_movie.isJoinedForum(req.user.id, movieId);
            if (!isJoined) {
                return res
                    .status(403)
                    .json({ message: 'User not a member of the forum' });
            }

            const post = await db_movie.fetchPostById(postId);
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({ message: 'Post not found' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getReactionsByPostId: async (req, res) => {
        try {
            const postId = req.params.postId;
            const reactions = await db_movie.fetchReactionsByPostId(postId);
            if (reactions) {
                res.json(reactions);
            } else {
                res.status(404).json({ message: 'Reactions not found' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    createNewForumPost: async (req, res) => {
        try {
            if (!req.user)
                return res.status(401).json({ message: 'Unauthorized' });

            const userId = req.user.id;
            const movieId = req.params.movieId;

            const isJoined = await db_movie.isJoinedForum(userId, movieId);
            if (!isJoined) {
                return res
                    .status(403)
                    .json({ message: 'User not a member of the forum' });
            }

            const { content, images } = req.body;
            if (!content) {
                return res
                    .status(400)
                    .json({ message: 'Content cannot be empty' });
            }

            // sanitize images
            for (let image of images) {
                if (!image.image_url) {
                    return res
                        .status(400)
                        .json({ message: 'Image URL cannot be empty' });
                }
                image.caption = image.caption || '';
            }

            const newPost = await db_movie.createNewForumPost(
                userId,
                movieId,
                content,
                images
            );
            if (!newPost) {
                return res
                    .status(500)
                    .json({ message: 'Failed to create new post' });
            }
            res.status(201).json({
                success: true,
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Add more methods as per your API documentation...
};

module.exports = postController;
