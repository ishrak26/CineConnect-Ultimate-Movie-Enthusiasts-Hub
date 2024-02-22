const express = require('express');
const marketplaceController = require('../controllers/marketplaceController');

const router = express.Router();

// Route for fetching all tags for a marketplace
router.get('/tags', marketplaceController.getAllTags); // **//

// Route for fetching all products for movies, tags, etc.
router.get('/products', marketplaceController.getAllProducts); // **//

module.exports = router;
