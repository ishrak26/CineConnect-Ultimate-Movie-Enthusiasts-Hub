const { supabase } = require('../config/supabaseConfig');
const db_user = require('../models/User.js');

const userController = {
    getCineFellows: async (req, res) => {
        try {
            const userId = req.user.id;
            const cineFellows = await db_user.getCineFellows({ userId });

            res.status(200).json({ cineFellows });
        } catch (error) {
            console.error('Failed to fetch cinefellows:', error.message);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },


    followCineFellow: async (req, res) => {
        try {
            const { fellowId } = req.body;
            const userId = req.user.id;
            const result = await db_user.followCineFellow({ userId, fellowId });

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
            const { fellowId } = req.body;
            const userId = req.user.id;
            const result = await db_user.unfollowCineFellow({ userId, fellowId });

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
                const userId = req.user.id;
                // Assuming functions for fetching pending and outgoing requests exist
                const pendingRequests = await db_user.getPendingRequests({ userId });
                const outgoingRequests = await db_user.getOutgoingRequests({ userId });

                res.status(200).json({ pendingRequests, outgoingRequests });
            } catch (error) {
                console.error('Failed to fetch pending requests:', error.message);
                res.status(500).json({ message: 'Internal server error' });
            }
        },

            acceptCineFellowRequest: async (req, res) => {
                try {
                    const { requestId } = req.body;
                    const userId = req.user.id;
                    // Assuming a function to accept a cinefellow request
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
                        const { requestId } = req.body;
                        const userId = req.user.id;
                        // Assuming a function to reject or cancel a cinefellow request
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
                const userId = req.user.id;
                // Assuming a function to get watched movies by userid
                const watchedMovies = await db_user.getWatchedMovies({ userId });

                res.status(200).json({ watchedMovies });
            } catch (error) {
                console.error('Failed to fetch watched movies:', error.message);
                res.status(500).json({ message: 'Internal server error' });
            }
        },

            getWatchlist: async (req, res) => {
                try {
                    const userId = req.user.id;
                    // Assuming a function to get watchlist by userid
                    const watchlist = await db_user.getWatchlist({ userId });

                    res.status(200).json({ watchlist });
                } catch (error) {
                    console.error('Failed to fetch watchlist:', error.message);
                    res.status(500).json({ message: 'Internal server error' });
                }
            },

                removeFromWatchlist: async (req, res) => {
                    try {
                        const { movieId } = req.body;
                        const userId = req.user.id;
                        // Assuming a function to remove a movie from watchlist
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
    };

    module.exports = userController;
