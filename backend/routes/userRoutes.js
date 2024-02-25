const express = require("express");
const userController = require("../controllers/userController");
// const { authenticateTokens } = require('../middleware/authMiddleware');

const router = express.Router();

// Route to get user by username
// router.get('/:username', userController.getProfileByUsername);

router.get("/profile/:username/cinefellows/", userController.getCineFellows);

// Route to get cinefellows count
router.get(
    "/profile/:username/cinefellows/count",
    userController.getCineFellowCount
);

// Route to follow a CineFellow
router.post(
    "/profile/:username/cinefellows/follow",
    userController.followCineFellow
);

// Route to unfollow a CineFellow
router.post(
    "/profile/:username/cinefellows/unfollow",
    userController.unfollowCineFellow
);

// Route to withdraw a CineFellow request
router.post(
    "/profile/:username/cinefellows/withdraw-request",
    userController.withdrawCineFellowRequest
);

// for getting pending requests
router.get("/requests", userController.getPendingRequestsWithRequesters);

// for accepting a pending request
router.post(
    "/requests/:requestId/accept",
    userController.acceptSpecificPendingRequest
);

// for rejecting a pending request
router.post(
    "/requests/:requestId/reject",
    userController.rejectSpecificPendingRequest
);

// Accept CineFellow request
router.post(
    "/profile/:username/cinefellows/accept",
    userController.acceptCineFellowRequest
);

// Reject or cancel CineFellow request
router.post(
    "/profile/:username/cinefellows/reject",
    userController.rejectCineFellowRequest
);

// Route to get watched movies by username
router.get("/profile/:username/watched", userController.getWatchedMovies);

// Route to get watchlist by username
router.get("/profile/:username/watchlist", userController.getWatchlist);

// Route for searching profiles by username
router.get(
    "/profile/:username/search",
    userController.searchProfilesByUsername
);

// Route to get user joined forums
router.get("/profile/:username/forums", userController.getUserJoinedForums);

// Route to get the type of the profile holder (user or cinefellow or non-cinefellow)
router.get(
    "/profile/:username/identify-profile",
    userController.identifyProfileHolder
);

// Route to get the profile of a user by username
router.get("/profile/:username/", userController.getProfileDetails);

// // Route to get the profile of a user by id
router.get("/:id/profile", userController.getProfileById);
module.exports = router;

// Route to fetch current user information for edit-profile form
router.get(
    "/profile/:username/edit-profile",
    userController.getCurrentUserFullProfile
);

// Route to check username availability
router.get("/username/check", userController.checkUsernameAvailability);

// Route to update profile information
router.post(
    "/profile/:username/update-profile",
    userController.updateUserProfile
);

// http://localhost:4000/v1/profile/
