const { supabase } = require('../config/supabaseConfig');
const db_user = require('../models/User.js');

const userController = {
    getCineFellows: async (req, res) => {
        try {
            
            if(!req.user) return res.status(401).json({ message: 'Unauthorized' });
            /* eg for cookie, i.e., req.user response: 
                req.user {
                    id: '6a5fc3ee-6d9d-42fc-87af-9ed52d7d774d',
                    iat: 1707555491,
                    exp: 1707641891
                } 
            */
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
            console.log('cineFellows', cineFellows);

            res.status(200).json({ cineFellows });

        } catch (error) {
            console.error('Failed to fetch cinefellows:', error.message);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    getCineFellowCount: async (req, res) => {
        try {
            const { username } = req.params;    // enclosed in {} to destructure the username from req.params
            const user = await db_user.findOne({ username });
            const userId = user ? user.id : null;
            const cinefellowCount = await db_user.getCinefellowCount2({ userId });
            console.log('Inside controller, cinefellowCount', cinefellowCount);
            res.json({ cinefellowCount });

        } catch (error) {
            console.error('Error getting CineFellow count:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },


    followCineFellow: async (req, res) => {
        try {

            if(!req.user) return res.status(401).json({ message: 'Unauthorized' });

            // If the user is trying to follow themselves
            const initialUser = await db_user.findOneById(req.user.id);
            if (initialUser.username === req.params.username) {
                return res.status(400).json({ message: 'Unauthorized' });
            }

            // If the user is trying to follow someone they are already following
            const requestee = await db_user.findOne({ username: req.params.username });
            const requestorId = req.user.id;
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
            const ogUser = await db_user.findOneById(req.user.id);
            // If the user is trying to unfollow themselves
            if (ogUser.username === req.params.username) {
                return res.status(400).json({ message: 'Unauthorized' });
            }

            // If the user is trying to unfollow someone they are not following
            const requestee = await db_user.findOne({ username: req.params.username });
            const requestorId = req.user.id;
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
            const ogUser = await db_user.findOneById(req.user.id);
            // If the user is trying to fetch pending requests for someone else
            if (ogUser.username !== req.params.username) {
                return res.status(400).json({ message: 'Unauthorized' });
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
            const ogUser = await db_user.findOneById(req.user.id);
            // If the user is trying to accept a request for someone else
            if (ogUser.username !== req.params.username) {
                return res.status(400).json({ message: 'Unauthorized' });
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
            const ogUser = await db_user.findOneById(req.user.id);
            // If the user is trying to reject a request for someone else
            if (ogUser.username !== req.params.username) {
                return res.status(400).json({ message: 'Unauthorized' });
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
            // console.log('watchedMovies', watchedMovies)
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
            const ogUser = await db_user.findOneById(req.user.id);
            // If the user is trying to remove a movie from watchlist for someone else
            if (ogUser.username !== req.params.username) {
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
    },

    // figure out if the visited profile belongs to the user themselves, or to a cinefellow, or to some other user who is not a cinefellow
    identifyProfileHolder : async (req, res) => {
        // userType 1: self, 2: cinefellow, 3: (Profile)Requested, 4: (Profile)Requestee, 5: Non-Cinefellow, 6: Non-User
        let userType = 6;
        try {
            if(!req.user) return res.status(401).json({ userType, message: 'unauthenticated' });
            const user = await db_user.findOneById(req.user.id);
            const username = req.params.username;
            const user2 = await db_user.findOne({ username });
            if(user.id === user2.id) userType = 1;
            else {
                const fellow = await db_user.isFollowing({ requestorId: user.id, requesteeId: user2.id });
                if(fellow) userType = 2;
                else {
                    const hasRequested = await db_user.checkIfTheyRequested({ userId: user.id, fellowId: user2.id });
                    if(hasRequested) userType = 3;
                    else {
                        const hasBeenRequested = await db_user.checkIfIRequested({ userId: user2.id, fellowId: user.id });
                        if(hasBeenRequested) userType = 4;
                        else userType = 5;
                    }
                }
            }
            res.status(200).json({ userType, message: 'website user'});
        } catch (error) {
            console.error('Failed to authenticate user:', error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getProfileDetails : async (req, res) => {
        try {
            const username = req.params.username;
            const profileInfo = await db_user.getProfileDetails({ username });
            if(profileInfo) res.status(200).json({ profileInfo });
            else res.status(404).json({ message: 'User not found.' });
        } catch (error) {
            console.error('Failed to fetch user:', error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
};

module.exports = userController;
