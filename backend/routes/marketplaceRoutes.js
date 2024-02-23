const express = require('express');
const marketplaceController = require('../controllers/marketplaceController');

const router = express.Router();

// Route for fetching all tags for a marketplace
router.get('/tags', marketplaceController.getAllTags); // **//
/* 
Usage:
    /v1/marketplace/tags?limit=10&offset=0
    /v1/marketplace/tags?limit=10
    /v1/marketplace/tags?offset=0
    /v1/marketplace/tags
*/

// Route for fetching all products for movies, tags, etc.
router.get('/products', marketplaceController.getAllProducts); // **//
/* 
Usage: 
    /v1/marketplace/products?tags=cover,art&movies=Interstellar,godfather&limit=10&offset=0&sortType=name_asc
    /v1/marketplace/products?tags=art
    /v1/marketplace/products?movies=Interstellar
    /v1/marketplace/products?limit=10&offset=0
    /v1/marketplace/products?sortType=name_asc
    /v1/marketplace/products

    sortTypes: name_asc, name_desc, price_asc, price_desc, rating_asc, rating_desc
*/

// Route for fetching product rating
router.get('/product/:id/rating', marketplaceController.getProductRating); // **//

// Route for fetching product details
router.get('/product/:id', marketplaceController.getProductDetails); // **//

module.exports = router;
