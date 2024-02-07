const { supabase } = require('../config/supabaseConfig');
const db_user = require('../models/User.js');

const userController = {
    getCineFellows: async (req, res) => {
        try {

            if(!req.user) return res.status(401).json({ message: 'Unauthorized' });

            const username = req.params.username;
            const user = await db_user.findOne({ username });
            const userId = user ? user.id : null;

            // If user not found
            if (!userId) {
                return res.status(404).json({ message: 'User not found.' });
            }

            const limit = req.query.limit || 10; // Default limit to 10 if not specified
            const offset = req.query.offset || 0; // Default offset to 0 if not specified

            const cineFellows = await db_user.getCineFellows({ 
                userId,
                limit,
                offset,
            });

            res.status(200).json({ cineFellows });

        } catch (error) {
            console.error('Failed to fetch cinefellows:', error.message);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    getCineFellowCount: async (req, res) => {
        try {
            const { username } = req.params;
            const user = await db_user.findOne({ username });
            const userId = user ? user.id : null;

            const count = await db_user.getCineFellowCount({ userId });

            res.json({ count });

        } catch (error) {
            console.error('Error getting CineFellow count:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },


    followCineFellow: async (req, res) => {
        try {

            if(!req.user) return res.status(401).json({ message: 'Unauthorized' });

            // If the user is trying to follow themselves
            if (req.user.username === req.params.username) {
                return res.status(400).json({ message: 'You cannot follow yourself.' });
            }

            // If the user is trying to follow someone they are already following
            const requestor = await db_user.findOne({ username: req.user.username });
            const requestee = await db_user.findOne({ username: req.params.username });
            const requestorId = requestor ? requestor.id : null;
            const requesteeId = requestee ? requestee.id : null;

            // If any of the users are not found
            if (!requestorId || !requesteeId) {
                return res.status(404).json({ message: 'User not found.' });
            }

            const isFollowing = await db_user.isFollowing({ requestorId, requesteeId });

            if (isFollowing) {
                return res.status(400).json({ message: 'You are already following this user.' });
            }

            const { fellowId } = req.body;
            const username = req.params.username;
            const user = await db_user.findOne({ username });
            const userId = user.id;

            const result = await db_user.followCinefellow({ userId, fellowId });

            if (result) {
                res.status(200).json({ message: 'CineFellow followed successfully.' });
            } else {
                res.status(404).json({ message: 'CineFellow not found.' });
            }
        } catch (error) {
            console.error('Failed to follow cinefellow:', error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    unfollowCineFellow: async (req, res) => {
        try {
            
            if(!req.user) return res.status(401).json({ message: 'Unauthorized' });

            // If the user is trying to unfollow themselves
            if (req.user.username === req.params.username) {
                return res.status(400).json({ message: 'You cannot unfollow yourself.' });
            }

            // If the user is trying to unfollow someone they are not following
            const requestor = await db_user.findOne({ username: req.user.username });
            const requestee = await db_user.findOne({ username: req.params.username });
            const requestorId = requestor ? requestor.id : null;
            const requesteeId = requestee ? requestee.id : null;

            // If any of the users are not found
            if (!requestorId || !requesteeId) {
                return res.status(404).json({ message: 'User not found.' });
            }

            const isFollowing = await db_user.isFollowing({ requestorId, requesteeId });

            if (!isFollowing) {
                return res.status(400).json({ message: 'You are not following this user.' });
            }

            const { fellowId } = req.body;
            const username = req.params.username;
            const user = await db_user.findOne({ username });
            const userId = user.id;

            const result = await db_user.unfollowCinefellow({ userId, fellowId });

            if (result) {
                res.status(200).json({ message: 'CineFellow unfollowed successfully.' });
            } else {
                res.status(404).json({ message: 'CineFellow not found.' });
            }
        } catch (error) {
            console.error('Failed to unfollow cinefellow:', error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getPendingRequests: async (req, res) => {
        try {

            if(!req.user) return res.status(401).json({ message: 'Unauthorized' });

            // If the user is trying to fetch pending requests for someone else
            if (req.user.username !== req.params.username) {
                return res.status(400).json({ message: 'You cannot fetch pending requests for another user.' });
            }


            const username = req.params.username;
            const user = await db_user.findOne({ username });
            const userId = user ? user.id : null;

            // If user not found
            if (!userId) {
                return res.status(404).json({ message: 'User not found.' });
            }

            const limit = req.query.limit || 10; // Default limit to 10 if not specified
            const offset = req.query.offset || 0; // Default offset to 0 if not specified

            const pendingRequests = await db_user.getPendingRequests({ 
                userId,
                limit,
                offset,
            });
            const outgoingRequests = await db_user.getOutgoingRequests({ 
                userId,
                limit,
                offset,
            });

            res.status(200).json({ pendingRequests, outgoingRequests });

        } catch (error) {
            console.error('Failed to fetch pending requests:', error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    acceptCineFellowRequest: async (req, res) => {
        try {

            if(!req.user) return res.status(401).json({ message: 'Unauthorized' });

            // If the user is trying to accept a request for someone else
            if (req.user.username !== req.params.username) {
                return res.status(400).json({ message: 'You cannot accept requests for another user.' });
            }

            const { requestId } = req.body;
            const username = req.params.username;
            const user = await db_user.findOne({ username });
            const userId = user ? user.id : null;

            // If the user is trying to accept a request that doesn't exist
            if (!requestId) {
                return res.status(404).json({ message: 'Request not found.' });
            }

            // If user not found
            if (!userId) {
                return res.status(404).json({ message: 'User not found.' });
            }

            const result = await db_user.acceptCineFellowRequest({ requestId, userId });

            if (result) {
                res.status(200).json({ message: 'CineFellow request accepted successfully.' });
            } else {
                res.status(404).json({ message: 'Request not found.' });
            }
        } catch (error) {
            console.error('Failed to accept cinefellow request:', error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    rejectCineFellowRequest: async (req, res) => {
        try {

            if(!req.user) return res.status(401).json({ message: 'Unauthorized' });

            // If the user is trying to reject a request for someone else
            if (req.user.username !== req.params.username) {
                return res.status(400).json({ message: 'You cannot reject requests for another user.' });
            }

            const { requestId } = req.body;
            const username = req.params.username;
            const user = await db_user.findOne({ username });
            const userId = user ? user.id : null;

            // If the user is trying to reject a request that doesn't exist
            if (!requestId) {
                return res.status(404).json({ message: 'Request not found.' });
            }

            // If user not found
            if (!userId) {
                return res.status(404).json({ message: 'User not found.' });
            }

            const result = await db_user.rejectCineFellowRequest({ requestId, userId });

            if (result) {
                res.status(200).json({ message: 'CineFellow request rejected or cancelled successfully.' });
            } else {
                res.status(404).json({ message: 'Request not found.' });
            }
        } catch (error) {
            console.error('Failed to reject/cancel cinefellow request:', error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getWatchedMovies: async (req, res) => {
        try {
            const username = req.params.username;
            const user = await db_user.findOne({ username });
            const userId = user ? user.id : null;
    
            const limit = req.query.limit || 10; // Default limit to 10 if not specified
            const offset = req.query.offset || 0; // Default offset to 0 if not specified
    
            // Pass limit and offset to the database query
            const watchedMovies = await db_user.getWatchedMovies({
                userId,
                limit,
                offset,
            });
    
            res.status(200).json({ watchedMovies });
        } catch (error) {
            console.error('Failed to fetch watched movies:', error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    

    getWatchlist: async (req, res) => {
        try {
            const username = req.params.username;
            const user = await db_user.findOne({ username });
            const userId = user ? user.id : null;

            const limit = req.query.limit || 10; // Default limit to 10 if not specified
            const offset = req.query.offset || 0; // Default offset to 0 if not specified

            const watchlist = await db_user.getWatchlist({ 
                userId,
                limit,
                offset,
            });

            res.status(200).json({ watchlist });
        } catch (error) {
            console.error('Failed to fetch watchlist:', error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    removeFromWatchlist: async (req, res) => {
        try {

            if(!req.user) return res.status(401).json({ message: 'Unauthorized' });

            // If the user is trying to remove a movie from watchlist for someone else
            if (req.user.username !== req.params.username) {
                return res.status(400).json({ message: 'You cannot remove movies from watchlist for another user.' });
            }

            const { movieId } = req.body;
            const username = req.params.username;
            const user = await db_user.findOne({ username });
            const userId = user.id;  

            const result = await db_user.removeFromWatchlist({ userId, movieId });

            if (result) {
                res.status(200).json({ message: 'Movie removed from watchlist successfully.' });
            } else {
                res.status(404).json({ message: 'Movie not found in watchlist.' });
            }
        } catch (error) {
            console.error('Failed to remove movie from watchlist:', error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    searchProfilesByUsername: async (req, res) => {
        try {
            const username = req.params.username;
            const user = await db_user.findOne({ username });
            const userId = user ? user.id : null;

            // If user not found
            if (!userId) {
                return res.status(404).json({ message: 'User not found.' });
            }

            const limit = req.query.limit || 10; // Default limit to 10 if not specified
            const offset = req.query.offset || 0; // Default offset to 0 if not specified

            const profiles = await db_user.searchProfilesByUsername({ 
                userId,
                limit,
                offset,
            });

            res.status(200).json({ profiles });
        } catch (error) {
            console.error('Failed to search profiles:', error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

module.exports = userController;
