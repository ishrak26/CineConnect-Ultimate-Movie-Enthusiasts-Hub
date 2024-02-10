const { supabase } = require('../config/supabaseConfig');

const dbPost = require('../models/Post');
const dbMovie = require('../models/Movie');

const postController = {
    getPostById: async (req, res) => {
        try {
            if (!req.user)
                return res.status(401).json({ message: 'Unauthorized' });

            const userId = req.user.id;
            const postId = req.params.postId;
            const forumId = req.params.forumId;
            const isJoined = await dbPost.isJoinedForumByForumId(
                userId,
                forumId
            );
            if (!isJoined) {
                return res
                    .status(403)
                    .json({ message: 'User not a member of the forum' });
            }

            const imgLimit = req.query.imgLimit || 2;
            const post = await dbPost.fetchSinglePostById(
                postId,
                parseInt(imgLimit)
            );
            if (post) {
                const data = {
                    postId: postId,
                    content: post.content,
                    images: post.images,
                    created_at: post.created_at,
                    author: {
                        id: post.author_id,
                        username: post.username,
                        image_url: post.user_image_url,
                    },
                    totalImages: post.total_images,
                };
                res.status(200).json(data);
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
            if (!req.user)
                return res.status(401).json({ message: 'Unauthorized' });

            const userId = req.user.id;
            const postId = req.params.postId;
            const forumId = req.params.forumId;
            const isJoined = await dbPost.isJoinedForumByForumId(
                userId,
                forumId
            );
            if (!isJoined) {
                return res
                    .status(403)
                    .json({ message: 'User not a member of the forum' });
            }

            const reactions = await dbPost.fetchPostReactionCount(postId);
            if (reactions) {
                reactions.upvotes = reactions.upvotes || 0;
                reactions.downvotes = reactions.downvotes || 0;
                reactions.total_comments = reactions.total_comments || 0;
                res.status(200).json(reactions);
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
            const forumId = req.params.forumId;

            const isJoined = await dbPost.isJoinedForumByForumId(
                userId,
                forumId
            );
            if (!isJoined) {
                return res
                    .status(403)
                    .json({ message: 'User not a member of the forum' });
            }

            const { content } = req.body;
            let { images } = req.body;
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
            } else {
                images = [];
            }

            const newPost = await dbPost.createNewPost(
                userId,
                forumId,
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
            const movieId = req.params.forumId;

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
            const forumId = req.params.forumId;
            const isJoined = await dbPost.isJoinedForumByForumId(
                userId,
                forumId
            );
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
                const contentLimit = parseInt(req.query.contentLimit) || 500;
                for (let post of posts) {
                    data.push({
                        postId: post.post_id,
                        author: {
                            id: post.author_id,
                            username: post.username,
                            image_url: post.user_image_url,
                        },
                        content: post.content.substring(0, contentLimit),
                        contentFull: post.content.length <= contentLimit,
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

    editPost: async (req, res) => {
        try {
            if (!req.user)
                return res.status(401).json({ message: 'Unauthorized' });

            //TODO

            const postId = req.params.postId;
            const post = await dbPost.fetchSinglePostById(postId, 0);
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            if (post.author_id !== req.user.id) {
                return res
                    .status(403)
                    .json({ message: 'User not authorized to edit the post' });
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

            const updatedPost = await dbPost.updatePost(
                postId,
                content,
                images
            );
            if (!updatedPost) {
                return res
                    .status(500)
                    .json({ message: 'Failed to update the post' });
            }
            res.status(200).json({
                success: true,
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    deletePost: async (req, res) => {
        try {
            if (!req.user)
                return res.status(401).json({ message: 'Unauthorized' });

            //TODO

            const postId = req.params.postId;
            const post = await dbPost.fetchSinglePostById(postId, 0);
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            if (post.author_id !== req.user.id) {
                return res.status(403).json({
                    message: 'User not authorized to delete the post',
                });
            }

            const deletedPost = await dbPost.removePost(postId);
            if (!deletedPost) {
                return res
                    .status(500)
                    .json({ message: 'Failed to delete the post' });
            }
            res.status(200).json({
                success: true,
            });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    votePost: async (req, res) => {
        try {
            if (!req.user)
                return res.status(401).json({ message: 'Unauthorized' });

            const { type } = req.body;
            if (type !== 'upvote' && type !== 'downvote') {
                return res.status(400).json({ message: 'Invalid vote type' });
            }

            const postId = req.params.postId;
            const userId = req.user.id;
            const forumId = req.params.forumId;
            const isJoined = await dbPost.isJoinedForumByForumId(
                userId,
                forumId
            );
            if (!isJoined) {
                return res
                    .status(403)
                    .json({ message: 'User not a member of the forum' });
            }

            const vote = await dbPost.fetchPostVoteByUser(postId, req.user.id);
            if (vote === null) {
                return res
                    .status(500)
                    .json({ message: 'Internal server error' });
            }
            if (vote.length === 0) {
                // no previous vote found, so can vote
                // vote the post
                const newVote = await dbPost.submitVote(
                    postId,
                    req.user.id,
                    type
                );
                if (!newVote) {
                    return res
                        .status(500)
                        .json({ message: 'Failed to vote the post' });
                }
                res.status(201).json({ suceess: true });
            } else {
                res.status(400).json({
                    message: 'User already voted the post',
                });
            }
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    unvotePost: async (req, res) => {
        try {
            if (!req.user)
                return res.status(401).json({ message: 'Unauthorized' });

            const { type } = req.body;
            if (type !== 'upvote' && type !== 'downvote') {
                return res.status(400).json({ message: 'Invalid vote type' });
            }

            const postId = req.params.postId;
            const userId = req.user.id;
            const forumId = req.params.forumId;
            const isJoined = await dbPost.isJoinedForumByForumId(
                userId,
                forumId
            );
            if (!isJoined) {
                return res
                    .status(403)
                    .json({ message: 'User not a member of the forum' });
            }

            const vote = await dbPost.fetchPostVoteByUser(postId, req.user.id);
            if (vote === null) {
                return res
                    .status(500)
                    .json({ message: 'Internal server error' });
            }
            if (vote.length === 0) {
                res.status(400).json({
                    message: 'User did not vote the post',
                });
            } else {
                const data = vote[0];
                if (data.type !== type) {
                    return res
                        .status(404)
                        .json({ message: `no previous vote of type ${type}` });
                }
                // unvote the post
                const unvote = await dbPost.removeVote(data.id);
                if (!unvote) {
                    return res
                        .status(500)
                        .json({ message: 'Failed to unvote the post' });
                }
                res.status(200).json({ suceess: true });
            }
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    checkUserJoinedForum: async (req, res) => {
        try {
            if (!req.user)
                return res.status(401).json({ message: 'Unauthorized' });

            const userId = req.user.id;
            const forumId = req.params.forumId;
            const isJoined = await dbPost.isJoinedForumByForumId(
                userId,
                forumId
            );
            if (isJoined) {
                res.status(200).json({ joined: true });
            } else {
                res.status(200).json({ joined: false });
            }
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getTotalMemberCount: async (req, res) => {
        try {
            if (!req.user)
                return res.status(401).json({ message: 'Unauthorized' });

            const userId = req.user.id;
            const forumId = req.params.forumId;
            const isJoined = await dbPost.isJoinedForumByForumId(
                userId,
                forumId
            );
            if (isJoined) {
                const memberCount = await dbPost.fetchTotalMemberCountInForum(
                    forumId
                );
                if (!memberCount) {
                    res.status(500).json({ message: 'Internal server error' });
                }
                res.status(200).json({ memberCount });
            } else {
                res.status(403).json({
                    message: 'User not a member of the forum',
                });
            }
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    submitComment: async (req, res) => {
        try {
            if (!req.user)
                return res.status(401).json({ message: 'Unauthorized' });

            const userId = req.user.id;
            const forumId = req.params.forumId;

            const isJoined = await dbPost.isJoinedForumByForumId(
                userId,
                forumId
            );
            if (!isJoined) {
                return res
                    .status(403)
                    .json({ message: 'User not a member of the forum' });
            }

            const { content } = req.body;
            let { images } = req.body;
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
            } else {
                images = [];
            }

            const newPost = await dbPost.createNewComment(
                userId,
                req.params.postId,
                content,
                images
            );
            if (!newPost) {
                return res
                    .status(500)
                    .json({ message: 'Failed to create new comment' });
            }
            res.status(201).json({
                success: true,
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // Add more methods as per your API documentation...
};

module.exports = postController;
