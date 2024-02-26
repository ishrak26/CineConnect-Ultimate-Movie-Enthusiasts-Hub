const express = require('express');
const userController = require('../controllers/userController');
// const { authenticateTokens } = require('../middleware/authMiddleware');

const router = express.Router();

// Route to get user by username
// router.get('/:username', userController.getProfileByUsername);

router.get('/:username/cinefellows/', userController.getCineFellows);

// Route to get cinefellows count
router.get('/:username/cinefellows/count', userController.getCineFellowCount);

// Route to follow a CineFellow
router.post('/:username/cinefellows/follow', userController.followCineFellow);

// Route to unfollow a CineFellow
router.post(
    '/:username/cinefellows/unfollow',
    userController.unfollowCineFellow
);

// Route to withdraw a CineFellow request
router.post(
    '/:username/cinefellows/withdraw-request',
    userController.withdrawCineFellowRequest
);

// for getting pending requests
router.get(
    '/:username/cinefellows/requests',
    userController.getPendingRequests
);

// Accept CineFellow request
router.post(
    '/:username/cinefellows/accept',
    userController.acceptCineFellowRequest
);

// Reject or cancel CineFellow request
router.post(
    '/:username/cinefellows/reject',
    userController.rejectCineFellowRequest
);

// Route to get watched movies by username
router.get('/:username/watched', userController.getWatchedMovies);

// Route to get watchlist by username
router.get('/:username/watchlist', userController.getWatchlist);

// Route to get product wishlist by username
router.get('/:username/product/wishlist', userController.getWishlist);

// Route for searching profiles by username
router.get('/:username/search', userController.searchProfilesByUsername);

// Route to get user joined forums
router.get('/:username/forums', userController.getUserJoinedForums);

// Route to get the type of the profile holder (user or cinefellow or non-cinefellow)
router.get('/:username/identify-profile', userController.identifyProfileHolder);

// Route to get the profile of a user by username
router.get('/:username/', userController.getProfileDetails);

// // Route to get the profile of a user by id
router.get('/:id/profile', userController.getProfileById);
module.exports = router;

// http://localhost:4000/v1/profile/
