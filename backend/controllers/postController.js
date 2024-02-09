const { supabase } = require('../config/supabaseConfig');

const dbPost = require('../models/Post');
const dbMovie = require('../models/Movie');

const postController = {
    getPostById: async (req, res) => {
        try {
            if (!req.user)
                return res.status(401).json({ message: 'Unauthorized' });

            const postId = req.params.postId;
            const movieId = dbPost.fetchMovieIdByPostId(postId);
            if (!movieId) {
                return res.status(404).json({ message: 'Invalid postId' });
            }

            const isJoined = await dbPost.isJoinedForum(req.user.id, movieId);
            if (!isJoined) {
                return res
                    .status(403)
                    .json({ message: 'User not a member of the forum' });
            }

            const post = await dbPost.fetchPostById(postId);
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({ message: 'Post not found' });
            }
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getReactionsByPostId: async (req, res) => {
        try {
            const postId = req.params.postId;
            const reactions = await dbPost.fetchReactionsByPostId(postId);
            if (reactions) {
                res.json(reactions);
            } else {
                res.status(404).json({ message: 'Reactions not found' });
            }
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    createNewForumPost: async (req, res) => {
        try {
            if (!req.user)
                return res.status(401).json({ message: 'Unauthorized' });

            const userId = req.user.id;
            const movieId = req.params.movieId;

            const isJoined = await dbPost.isJoinedForum(userId, movieId);
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

            if (images) {
                // sanitize images
                if (!Array.isArray(images)) {
                    return res
                        .status(400)
                        .json({ message: 'Images must be an array' });
                }
                for (let image of images) {
                    if (!image.image_url) {
                        return res
                            .status(400)
                            .json({ message: 'Image URL cannot be empty' });
                    }
                    image.caption = image.caption || '';
                }
            }

            const newPost = await dbPost.createNewPost(
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
            console.log(error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    joinNewForum: async (req, res) => {
        try {
            if (!req.user)
                return res.status(401).json({ message: 'Unauthorized' });

            const userId = req.user.id;
            const movieId = req.params.movieId;

            const isMovieInWatchedList = await dbMovie.isMovieInWatchedlist(
                userId,
                movieId
            );
            if (!isMovieInWatchedList) {
                return res
                    .status(400)
                    .json({ message: 'Movie not in user watched-list' });
            }

            const isJoined = isMovieInWatchedList.joined_forum;
            if (isJoined) {
                return res
                    .status(400)
                    .json({ message: 'User already joined the forum' });
            }

            const joinForum = await dbPost.joinForum(isMovieInWatchedList.id);
            if (!joinForum) {
                return res
                    .status(500)
                    .json({ message: 'Failed to join the forum' });
            }

            res.status(201).json({
                success: true,
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getAllPosts: async (req, res) => {
        try {
            if (!req.user)
                return res.status(401).json({ message: 'Unauthorized' });

            const userId = req.user.id;
            const movieId = req.params.movieId;

            const isJoined = await dbPost.isJoinedForum(userId, movieId);
            if (!isJoined) {
                return res
                    .status(403)
                    .json({ message: 'User not a member of the forum' });
            }

            const limit = req.query.limit || 10;
            const offset = req.query.offset || 0;
            const posts = await dbPost.fetchPostsByMovieId(
                movieId,
                parseInt(limit),
                parseInt(offset)
            );
            if (posts) {
                const data = [];
                for (let post of posts) {
                    data.push({
                        postId: post.post_id,
                        author: {
                            id: post.author_id,
                            username: post.username,
                            image_url: post.user_image_url,
                        },
                        content: post.content,
                        totalImages: post.total_images,
                        topImage: post.top_post_image_url,
                        created_at: post.created_at,
                    });
                }
                res.status(200).json(data);
            } else {
                res.status(404).json({ message: 'Posts not found' });
            }
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // Add more methods as per your API documentation...
};

module.exports = postController;
