const express = require('express');
const postController = require('../controllers/postController');

const router = express.Router();

// Route for creating a new post in a forum
router.post('/:forumId/submit', postController.createNewForumPost); // **//

// Route for joining a forum
router.post('/:forumId/join', postController.joinNewForum); // **//

// Route for checking if a user is member of a forum
router.get('/:forumId/joined', postController.checkUserJoinedForum); // **//

// Route for getting total members of a forum
router.get('/:forumId/totalMembers', postController.getTotalMemberCount);

// Route for leaving a forum
// router.delete('/v1/movie/:movieId/forum/leave', postController.leaveForum); // **//

// Route for all posts in a forum
router.get('/:forumId/posts', postController.getAllPosts); // **//

// Route for getting a specific post/review
router.get('/:forumId/post/:postId', postController.getPostById); // **//

// Route for editing a specific post/review
router.put('/:forumId/post/:postId', postController.editPost); // **//

// Route for deleting a specific post/review
router.delete('/:forumId/post/:postId', postController.deletePost); // **//

// Route for voting on a specific post/review
router.post('/:forumId/post/:postId/vote', postController.votePost); // **//

// Route for unvoting a specific post/review
router.delete('/:forumId/post/:postId/vote', postController.unvotePost); // **//

// Route for getting all comments of a specific post/review/comment/reply
router.get('/:forumId/post/:postId/comments', postController.getAllComments); // **//

// Route for submitting a comment/reply for a specific post/review/comment/reply
router.post(
    '/:forumId/post/:postId/comment/submit',
    postController.submitComment
); // **//

// Route for getting total reaction count of a specific post/review
router.get(
    '/:forumId/post/:postId/reactions',
    postController.getReactionsByPostId
); // **//



// Route for getting userId from request
router.get('/user', postController.getUserId); // **//

// Route for getting information about a specific forum by forumId
router.get('/:forumId', postController.getForumById); // **//

// Route to check if user voted to a post
router.get('/:forumId/post/:postId/voted', postController.checkUserVotedPost); // **//


module.exports = router;
