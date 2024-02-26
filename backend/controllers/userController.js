const { supabase } = require('../config/supabaseConfig');
const db_user = require('../models/User.js');

const userController = {
    getProfileByUsername: async (req, res) => {
        try {
            if (!req.user)
                return res.status(401).json({ message: 'Unauthorized' });

            const username = req.params.username;
            const user = await db_user.getProfileByUsername({ username });
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }
            res.status(200).json({ user });
        } catch (error) {
            console.error('Failed to fetch user profile:', error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getCineFellows: async (req, res) => {
        try {
            if (!req.user)
                return res.status(401).json({ message: 'Unauthorized' });

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

            // If user not found
            if (!userId) {
                return res.status(404).json({ message: 'User not found.' });
            }

            const count = await db_user.getCineFellowCount({ userId });

            res.json({ count });
        } catch (error) {
            console.error('Error getting CineFellow count:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    followCineFellow: async (req, res) => {
        try {
            if (!req.user)
                return res.status(401).json({ message: 'Unauthorized' });

            const data = await db_user.findOneById(req.user.id);
            if (!data) {
                return res.status(404).json({ message: 'Not found' });
            }
            const requestorUsername = data.username;
            const requesteeUsername = req.params.username;

            // If the user is trying to follow themselves
            if (requestorUsername === requesteeUsername) {
                return res.status(400).json({ message: 'Bad request' });
            }

            // If the user is trying to follow someone they are already following
            const data2 = await db_user.findOne({
                username: requesteeUsername,
            });
            if (!data2) {
                return res.status(404).json({ message: 'Not found' });
            }
            // console.log(
            //     'In followCineFellow, requesteeUsername',
            //     requesteeUsername
            // );
            const requestorId = req.user.id;
            const requesteeId = data2.id;

            // console.log(
            //     'In followCinefellow, requesteeId:',
            //     requesteeId,
            //     'RequestorId: ',
            //     requestorId
            // );

            const result = await db_user.followCinefellow({
                userId: requestorId,
                fellowId: requesteeId,
            });

            if (result) {
                res.status(200).json({
                    message: 'CineFellow followed successfully.',
                });
            } else {
                res.status(404).json({ message: 'CineFellow not found.' });
            }
        } catch (error) {
            console.error('Failed to unfollow cinefellow:', error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    withdrawCineFellowRequest: async (req, res) => {
        try {
            if (!req.user)
                return res.status(401).json({ message: 'Unauthorized' });

            // Assuming req.user.id is the ID of the user who is making the request
            // and req.params.username is the username of the user to whom the request was sent
            const requestorId = req.user.id;

            // First, find the user ID of the requestee based on the username provided in the URL
            const requesteeData = await db_user.findOne({
                username: req.params.username,
            });
            if (!requesteeData) {
                return res
                    .status(404)
                    .json({ message: 'Requestee not found.' });
            }
            const requesteeId = requesteeData.id;

            // Now, call the model function to withdraw the cinefellow request
            const result = await db_user.withdrawCineFellowRequest({
                requestorId,
                requesteeId,
            });
            // console.log('result:', result);

            // Based on the result, send appropriate response
            if (result.success) {
                res.status(200).json({ message: result.message });
            } else {
                res.status(404).json({ message: result.message });
            }
        } catch (error) {
            console.error(
                'Failed to withdraw cinefellow request:',
                error.message
            );
            res.status(500).json({
                message: 'Internal server error',
                error: error.message,
            });
        }
    },

    unfollowCineFellow: async (req, res) => {
        try {
            if (!req.user)
                return res.status(401).json({ message: 'Unauthorized' });

            const data = await db_user.findOneById(req.user.id);
            if (!data) {
                return res.status(404).json({ message: 'Not found' });
            }
            const requestorUsername = data.username; //user
            const requesteeUsername = req.params.username; //profileHolder

            // If the user is trying to unfollow themselves
            if (requestorUsername === requesteeUsername) {
                return res.status(400).json({ message: 'Bad request' });
            }

            // If the user is trying to unfollow a non-existent profile
            // console.log(
            //     'In unfollowCineFellow, requestorUsername:',
            //     requestorUsername
            // );
            const data2 = await db_user.findOne({
                username: requesteeUsername,
            });
            if (!data2) {
                return res.status(404).json({ message: 'Not found' });
            }
            // console.log(
            //     'In unfollowCineFellow, requesteeUsername',
            //     requesteeUsername
            // );
            const requestorId = req.user.id;
            const requesteeId = data2.id;

            // console.log(
            //     'In unfollowCinefellow, requesteeId:',
            //     requesteeId,
            //     'RequestorId: ',
            //     requestorId
            // );

            const result = await db_user.unfollowCinefellow({
                userId: requestorId,
                fellowId: requesteeId,
            });

            if (result) {
                res.status(200).json({
                    message: 'CineFellow unfollowed successfully.',
                });
            } else {
                res.status(404).json({ message: 'CineFellow not found.' });
            }
        } catch (error) {
            console.error('Failed to unfollow cinefellow:', error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getPendingRequests: async (req, res) => {
        // console.log('Inside getPendingRequests controller: DHUKSI');
        // console.log("Inside getPendingRequests controller: req.user -->", req.user);
        try {
            if (!req.user)
                return res.status(401).json({ message: 'Unauthorized' });
            // console.log('Inside getPendingRequests controller: DEBUGGING 1');
            const sessionUser = await db_user.findOneById(req.user.id);
            const userName = sessionUser.username;
            // console.log('Inside getPendingRequests controller: DEBUGGING 2');
            // If the user is trying to fetch pending requests for someone else
            if (userName !== req.params.username) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const username = req.params.username;
            const user = await db_user.findOne({ username });
            const userId = user ? user.id : null;
            // console.log('Inside getPendingRequests controller: DEBUGGING 3');
            // If user not found
            if (!userId) {
                return res.status(404).json({ message: 'User not found.' });
            }
            console.log('Inside getPendingRequests controller: DEBUGGING 4');
            const limit = req.query.limit || 10; // Default limit to 10 if not specified
            const offset = req.query.offset || 0; // Default offset to 0 if not specified

            const pendingRequests = await db_user.getPendingRequests({
                userId,
                limit,
                offset,
            });
            // console.log('Inside getPendingRequests controller: DEBUGGING 5');
            res.status(200).json({ pendingRequests });
        } catch (error) {
            console.error('Failed to fetch pending requests:', error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    acceptCineFellowRequest: async (req, res) => {
        try {
            if (!req.user)
                return res.status(401).json({ message: 'Unauthorized' });
            const data = await db_user.findOneById(req.user.id);
            if (!data) {
                return res.status(404).json({ message: 'Not found' });
            }
            const requestorUsername = data.username;
            const requesteeUsername = req.params.username;

            // If the user is trying to accept/reject themselves
            if (requestorUsername === requesteeUsername) {
                return res.status(400).json({ message: 'Bad request' });
            }

            // If the user is trying to accept/reject someone who hasn't sent a request
            // console.log('In acceptCineFellowRequest, requestorUsername:', requestorUsername); //here requestor is the user (one who
            //is accepting/rejecting the request)
            const data2 = await db_user.findOne({
                username: requesteeUsername, // requestee is the one who sent the follow request
            });
            if (!data2) {
                return res.status(404).json({ message: 'Not found' });
            }

            const requestorId = req.user.id;
            const requesteeId = data2.id;

            // console.log('In acceptCinefellowRequest controller, requesteeId(profileholder):', requesteeId, 'RequestorId(user):', requestorId);

            const result = await db_user.acceptCineFellowRequest({
                userId: requestorId,
                requestorId: requesteeId,
            });

            if (result) {
                res.status(200).json({
                    message: 'CineFellow request accepted successfully.',
                });
            } else {
                res.status(404).json({
                    message: 'CineFellow request not found.',
                });
            }
        } catch (error) {
            console.error(
                'Failed to accept cinefellow request:',
                error.message
            );
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    rejectCineFellowRequest: async (req, res) => {
        // console.log('Inside rejectCineFellowRequest controller: DHUKSI')
        try {
            // console.log('Inside rejectCineFellowRequest controller: TRY BLOCK E DHUKSI')
            if (!req.user)
                return res.status(401).json({ message: 'Unauthorized' });
            const data = await db_user.findOneById(req.user.id);
            if (!data) {
                return res.status(404).json({ message: 'Not found' });
            }
            const requestorUsername = data.username; // user
            const requesteeUsername = req.params.username; // profileHolder

            // If the user is trying to accept/reject themselves
            if (requestorUsername === requesteeUsername) {
                return res.status(400).json({ message: 'Bad request' });
            }

            // If the user is trying to accept/reject someone who hasn't sent a request
            // console.log('In rejectCineFellowRequest, requestorUsername:', requestorUsername); //here requestor is the user (one who
            //is accepting/rejecting the request)
            const data2 = await db_user.findOne({
                username: requesteeUsername, // requestee is the one who sent the follow request
            });
            if (!data2) {
                return res.status(404).json({ message: 'Not found' });
            }

            const requestorId = req.user.id;
            const requesteeId = data2.id;

            // console.log('In rejectCinefellowRequest controller, requesteeId(profileholder):', requesteeId, 'RequestorId(user):', requestorId);

            const result = await db_user.rejectCineFellowRequest({
                userId: requestorId,
                requestorId: requesteeId,
            });

            if (result) {
                res.status(200).json({
                    message: 'CineFellow request rejected successfully.',
                });
            } else {
                res.status(404).json({
                    message: 'CineFellow request not found.',
                });
            }
        } catch (error) {
            console.error(
                'Failed to reject cinefellow request:',
                error.message
            );
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

    getWishlist: async (req, res) => {
        try {
            const username = req.params.username;
            const user = await db_user.findOne({ username });
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }
            const userId = user.id;

            const limit = parseInt(req.query.limit) || 10; // Default limit to 10 if not specified
            const offset = parseInt(req.query.offset) || 0; // Default offset to 0 if not specified

            const wishlist = await db_user.fetchProductWishlist(
                userId,
                limit,
                offset
            );
            const data = [];
            for (let product of wishlist) {
                data.push({
                    id: product.id,
                    name: product.product.name,
                    price: product.product.price,
                    thumbnail_url: product.product.thumbnail_url,
                });
            }

            res.status(200).json(data);
        } catch (error) {
            console.error('Failed to fetch wishlist:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // removeFromWatchlist: async (req, res) => {
    //     try {

    //         if(!req.user) return res.status(401).json({ message: 'Unauthorized' });

    //         // If the user is trying to remove a movie from watchlist for someone else
    //         if (req.user.username !== req.params.username) {
    //             return res.status(400).json({ message: 'You cannot remove movies from watchlist for another user.' });
    //         }

    //         const { movieId } = req.body;
    //         const username = req.params.username;
    //         const user = await db_user.findOne({ username });
    //         const userId = user.id;

    //         const result = await db_user.removeFromWatchlist({ userId, movieId });

    //         if (result) {
    //             res.status(200).json({ message: 'Movie removed from watchlist successfully.' });
    //         } else {
    //             res.status(404).json({ message: 'Movie not found in watchlist.' });
    //         }
    //     } catch (error) {
    //         console.error('Failed to remove movie from watchlist:', error.message);
    //         res.status(500).json({ message: 'Internal server error' });
    //     }
    // },

    searchProfilesByUsername: async (req, res) => {
        try {
            const username = req.query.username;
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

    getUserJoinedForums: async (req, res) => {
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

            const forums = await db_user.fetchJoinedForums(
                userId,
                parseInt(limit),
                parseInt(offset)
            );

            if (!forums) {
                return res.status(404).json({ message: 'Forums not found.' });
            }

            /*
            e.g. forums = [
                {
                    movie_id: 'abc',
                    title: 'Movie Title',
                    poster_url: 'https://image.tmdb.org/t/p/w500/abc.jpg',
                    member_count: 10
                },
                {
                    movie_id: 'def',
                    title: 'Movie Title 2',
                    poster_url: 'https://image.tmdb.org/t/p/w500/def.jpg',
                    member_count: 20
                }
            ]
            */

            res.status(200).json({ forums });
        } catch (error) {
            console.error('Failed to fetch joined forums:', error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // figure out if the visited profile belongs to the user themselves, or to a cinefellow, or to some other user who is not a cinefellow
    identifyProfileHolder: async (req, res) => {
        // userType 1: self, 2: cinefellow, 3: (Profile)Requested, 4: (Profile)Requestee, 5: Non-Cinefellow, 6: Non-User
        let userType = 6;
        try {
            // console.log('Inside identifyProfileHolder: DEBUG_CHECKPOINT_1');
            if (!req.user)
                return res
                    .status(401)
                    .json({ userType, message: 'unauthenticated' });
            const user = await db_user.findOneById(req.user.id);
            // console.log('Inside identifyProfileHolder: DEBUG_CHECKPOINT_2 --> ', user.username);
            const username = req.params.username;
            // console.log(username)
            const user2 = await db_user.findOne({ username });
            // console.log('Inside identifyProfileHolder: DEBUG_CHECKPOINT_3 --> ', user2.username);
            if (user.id === user2.id) userType = 1;
            else {
                const user1Id = user.id;
                const user2Id = user2.id;
                // console.log('Inside identifyProfileHolder: DEBUG_CHECKPOINT_4 --> ', user1Id, user2Id);
                const fellow = await db_user.isFollowing({
                    userId: user1Id,
                    fellowId: user2Id,
                });
                // console.log('Inside identifyProfileHolder: DEBUG_CHECKPOINT_5 --> ', fellow);
                if (fellow) userType = 2;
                else {
                    const hasRequested = await db_user.checkIfTheyRequested({
                        userId: user.id,
                        fellowId: user2.id,
                    });
                    // console.log(
                    //     'Inside identifyProfileHolder: DEBUG_CHECKPOINT_6 --> ',
                    //     hasRequested
                    // );
                    if (hasRequested) userType = 3;
                    else {
                        const hasBeenRequested =
                            await db_user.checkIfIRequested({
                                userId: user.id,
                                fellowId: user2.id,
                            });
                        // console.log(
                        //     'Inside identifyProfileHolder: DEBUG_CHECKPOINT_7 --> ',
                        //     hasBeenRequested
                        // );
                        if (hasBeenRequested) userType = 4;
                        else userType = 5;
                    }
                }
            }
            // console.log(
            //     'Inside identifyProfileHolder: DEBUG_CHECKPOINT_8 --> Out of all checks, userType:',
            //     userType
            // );
            res.status(200).json({ userType, message: 'website user' });
        } catch (error) {
            console.error('Failed to authenticate user:', error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getProfileDetails: async (req, res) => {
        try {
            const username = req.params.username;
            const profileInfo = await db_user.getProfileDetails({ username });
            if (profileInfo) res.status(200).json({ profileInfo });
            else res.status(404).json({ message: 'User not found.' });
        } catch (error) {
            console.error('Failed to fetch user:', error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getProfileById : async (req, res) => {
      try {
          // console.log('userId:', req.params.id);
          const id = req.params.id;
          const profileInfo = await db_user.fetchUserById({ id });

          // console.log('profileInfo:', profileInfo);
          
          if(profileInfo) res.status(200).json({ profileInfo });
          else res.status(404).json({ message: 'User not found.' });
      } catch (error) {
          console.error('Failed to fetch user:', error.message);
          res.status(500).json({ message: 'Internal server error' });
      }
  },
};

module.exports = userController;
