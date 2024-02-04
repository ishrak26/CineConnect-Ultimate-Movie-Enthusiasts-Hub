const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/cinefellows/', userController.getCineFellows);

// Route to follow a CineFellow
router.post('/cinefellows/follow', userController.followCineFellow);

// Route to unfollow a CineFellow
router.post('/cinefellows/unfollow', userController.unfollowCineFellow);

// for getting pending requests (both incoming and outgoing)
router.get('/cinefellows/requests', userController.getPendingRequests);

// Accept CineFellow request
router.post('/cinefellows/accept', userController.acceptCineFellowRequest);

// Reject or cancel CineFellow request
router.delete('/cinefellows/reject', userController.rejectCineFellowRequest);

// Route to get watched movies by username
router.get('/profile/watched', userController.getWatchedMovies);

// Route to get watchlist by username
router.get('/profile/watchlist', userController.getWatchlist);

// Route to delete a movie from watchlist by username and movieId
router.delete('/profile/watchlist', userController.removeFromWatchlist);

module.exports = router;
