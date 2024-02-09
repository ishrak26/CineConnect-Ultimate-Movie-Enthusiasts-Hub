const express = require('express');
const postController = require('../controllers/postController');

const router = express.Router();

// Route for getting a specific post/review
router.get('/:postId', postController.getPostById); // **//

module.exports = router;
