const express = require('express');
const postController = require('../controllers/postController');

const router = express.Router();

// Route for getting a specific post/review
router.get('/:postId', postController.getPostById); // **//

// Route for editing a specific post/review
router.put('/:postId', postController.editPost); // **//

// Route for deleting a specific post/review
router.delete('/:postId', postController.deletePost); // **//

// Route for voting on a specific post/review
router.post('/:postId/vote', postController.votePost); // **//

// Route for unvoting a specific post/review
router.delete('/:postId/vote', postController.unvotePost); // **//

// Route for getting all comments of a specific post/review/comment/reply
// router.get('/:postId/comments', postController.getPostComments); // **//

// Route for submitting a comment/reply for a specific post/review/comment/reply
// router.post('/:postId/comment/submit', postController.submitComment); // **//

// Route for getting total reaction count of a specific post/review
// router.get('/:postId/reactions', postController.getPostReactions); // **//

module.exports = router;
