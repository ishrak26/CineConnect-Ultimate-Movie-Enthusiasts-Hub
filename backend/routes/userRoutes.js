const express = require('express');
const userController = require('../controllers/userController');
// const { authenticateTokens } = require('../middleware/authMiddleware');

const router = express.Router();

// Route to get user by username
router.get('/:username', userController.getProfileByUsername);

router.get('/:username/cinefellows/', userController.getCineFellows);

// Route to get cinefellows count 
router.get('/:username/cinefellows/count', userController.getCineFellowCount);

// Route to follow a CineFellow
router.post('/:username/cinefellows/follow', userController.followCineFellow);

// Route to unfollow a CineFellow
router.post('/:username/cinefellows/unfollow', userController.unfollowCineFellow);

// for getting pending requests (both incoming and outgoing)
router.get('/:username/cinefellows/requests', userController.getPendingRequests);

// Accept CineFellow request
router.post('/:username/cinefellows/accept', userController.acceptCineFellowRequest);

// Reject or cancel CineFellow request
router.delete('/:username/cinefellows/reject', userController.rejectCineFellowRequest);

// Route to get watched movies by username
router.get('/:username/watched', userController.getWatchedMovies);

// Route to get watchlist by username
router.get('/:username/watchlist', userController.getWatchlist);

// Route for searching profiles by username
router.get('/:username/search', userController.searchProfilesByUsername);

// Route to get user joined forums
router.get('/:username/forums', userController.getUserJoinedForums);

module.exports = router;
