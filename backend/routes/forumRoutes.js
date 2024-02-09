const express = require('express');
const postController = require('../controllers/postController');

const router = express.Router();

// Route for getting all posts in a forum
router.get('/', postController.getPostById); // **//

// Route for creating a new post in a forum
router.post('/submit', postController.createNewForumPost); // **//

module.exports = router;
