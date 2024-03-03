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

    Returns an array of strings (tags) as response
    ['tag1', 'tag2', 'tag3']
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

    See the response format in the snippet from marketplaceController.getAllProducts
*/

// Route for fetching product rating
router.get('/product/:id/rating', marketplaceController.getProductRating); // **//
/*
    See the response format in the snippet from marketplaceController.getProductRating
*/

// Route for rating a product
router.post('/product/:id/rating', marketplaceController.rateProduct); // **//
/*
    Request body: {
        rating: 4
    }
*/

// Route for updating product rating
router.put('/product/:id/rating', marketplaceController.updateProductRating); // **//
/*
    Request body: {
        rating: 4
    }
*/

// Route for fetching product details
router.get('/product/:id', marketplaceController.getProductDetails); // **//
/*
    See the response format in the snippet from marketplaceController.getProductDetails
*/

// Route for fetching product features
router.get('/product/:id/features', marketplaceController.getProductFeatures); // **//
/*
    Returns response as an array of product features
    ['feature1', 'feature2', 'feature3']
*/

// Route for fetchign product tags
router.get('/product/:id/tags', marketplaceController.getProductTags); // **//
/*
    Returns an array of strings (tags) as response
    ['tag1', 'tag2', 'tag3']
*/

// Route to check if user added the product to wishlist
router.get(
    '/product/:id/wishlist',
    marketplaceController.checkProductInWishlist
); // **//
/*
    Response format:
    {
        inWishlist: true/false
    }
*/

// Route to add product to wishlist
router.post('/product/:id/wishlist', marketplaceController.addToWishlist); // **//

// Route to remove product from wishlist
router.delete(
    '/product/:id/wishlist',
    marketplaceController.removeFromWishlist
); // **//

// Route to fetch images for a product (paginated)
router.get('/product/:id/images', marketplaceController.getProductImages); // **//
/*
    Usage:
    /v1/marketplace/product/:id/images?limit=10&offset=0
    /v1/marketplace/product/:id/images?limit=10
    /v1/marketplace/product/:id/images?offset=0
    /v1/marketplace/product/:id/images

    default limit = 5, default offset = 0

    Returns an array of objects as response
    See the response format in the snippet from marketplaceController.getProductImages
*/

// Route for creating a new product
router.post('/product', marketplaceController.createProduct); // **//

/*
    See the request body format in the snippet from marketplaceController.createProduct
*/

// Route for editing an existing product
router.put('/product/:id', marketplaceController.editProduct); // **//

/*
    See the request body format in the snippet from marketplaceController.editProduct
*/

// Route for deleting a product
router.delete('/product/:id', marketplaceController.deleteProduct); // **//

// Route for updating product quantity
router.put(
    '/product/:id/quantity',
    marketplaceController.updateProductQuantity
); // **//

/*
    Request body: {
        quantity: 100
    }
*/

// Route for getting total products count by movie ID
router.get(
    '/movie/:movieId/products/count',
    marketplaceController.getTotalProductCountByMovieId
); // **//

/*
    Response format:
    {
        count: 100
    }

*/

// Route to get all products under a movie
router.get(
    '/movie/:movieId/products',
    marketplaceController.getProductsByMovie
); // **//
/*
    See the response format in the snippet from marketplaceController.getProductsByMovie
*/

// Route to get all tags of the products under a movie
router.get(
    '/movie/:movieId/products/tags',
    marketplaceController.getTagsByMovie
); // **//

/*
    Returns an array of strings (tags) as response
    ['tag1', 'tag2', 'tag3']

*/

// Route for getting total product count by username
router.get(
    '/user/:username/products/count',
    marketplaceController.getTotalProductCountByUsername
); // **//

/*
    Response format:
    {
        count: 100
    }

*/

// Route to get all products by a user
router.get(
    '/user/:username/products',
    marketplaceController.getProductsByUsername
); // **//

/*
    See the response format in the snippet from marketplaceController.getProductsByUsername
*/

module.exports = router;
