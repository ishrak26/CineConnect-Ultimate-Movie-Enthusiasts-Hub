const dbProduct = require('../models/Product');

const marketplaceController = {
    getAllTags: async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const offset = parseInt(req.query.offset) || 0;
            const tags = await dbProduct.fetchAllTags(offset, limit);
            if (!tags) {
                return res
                    .status(500)
                    .json({ message: 'Internal server error' });
            }
            const data = [];
            for (let tag_name of tags) {
                data.push(tag_name.tag_name);
            }

            res.status(200).json(data);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getAllProducts: async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const offset = parseInt(req.query.offset) || 0;
            const tags = req.query.tags ? req.query.tags.split(',') : [];
            const movies = req.query.movies ? req.query.movies.split(',') : [];
            const sortType = req.query.sortType || 'name_asc';
            const products = await dbProduct.fetchProductsByTagsAndMovies(
                tags,
                movies,
                limit,
                offset,
                sortType
            );
            if (!products) {
                return res
                    .status(500)
                    .json({ message: 'Internal server error' });
            }
            const data = [];
            for (let product of products) {
                data.push({
                    id: product.product_id, // uuid
                    name: product.product_name, // string
                    price: product.price, // numeric
                    thumbnailUrl: product.thumbnail_url, // string
                    avgRating: product.average_rating, // numeric
                });
            }
            res.status(200).json(data);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getProductRating: async (req, res) => {
        try {
            const productId = req.params.id;
            const userId = req.user ? req.user.id : null;
            const ratingInfo = await dbProduct.getProductRatingInfo(
                productId,
                userId
            );
            if (!ratingInfo) {
                return res
                    .status(500)
                    .json({ message: 'Internal server error' });
            }
            const data = {
                avgRating: ratingInfo.average_rating, // numeric
                totalRatings: ratingInfo.total_ratings, // integer
                userRating: ratingInfo.user_rating, // numeric
            };
            res.status(200).json(data);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getProductDetails: async (req, res) => {
        try {
            const productId = req.params.id;
            const productDetails = await dbProduct.fetchProductDetails(
                productId
            );
            if (!productDetails) {
                return res.status(404).json({ message: 'Product not found' });
            }
            const data = {
                productName: productDetails.name, // string
                price: productDetails.price, // numeric
                owner: {
                    id: productDetails.owner_id, // uuid
                    username: productDetails.username, // string
                },
                sizes: productDetails.sizes, // array
                colors: productDetails.colors, // array
                availableQuantity: productDetails.available_qty, // numeric
                thumbnailUrl: productDetails.thumbnail_url, // string
                movieName: productDetails.movie_name, // string
                reviewCount: productDetails.total_reviews_count, // integer
                wishlistCount: productDetails.wishlist_count, // integer
            };
            res.status(200).json(data);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getProductFeatures: async (req, res) => {
        try {
            const productId = req.params.id;
            const productFeatures = await dbProduct.fetchProductFeatures(
                productId
            );
            if (!productFeatures) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.status(200).json(productFeatures);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getProductTags: async (req, res) => {
        try {
            const productId = req.params.id;
            const limit = parseInt(req.query.limit) || 10;
            const offset = parseInt(req.query.offset) || 0;
            const tags = await dbProduct.fetchProductTags(
                productId,
                offset,
                limit
            );
            const data = [];
            for (let tag_name of tags) {
                data.push(tag_name.name); // string
            }
            res.status(200).json(data);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    checkProductInWishlist: async (req, res) => {
        try {
            if (!req.user) return res.status(200).json({ inWishlist: false });

            const productId = req.params.id;
            const userId = req.user.id;
            const inWishlist = await dbProduct.isAddedToWishlist(
                productId,
                userId
            );
            res.status(200).json({ inWishlist });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    addToWishlist: async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const productId = req.params.id;
            const userId = req.user.id;
            const added = await dbProduct.addProductToWishlist(
                productId,
                userId
            );
            if (!added) {
                return res
                    .status(500)
                    .json({ message: 'Internal server error' });
            }
            res.status(201).json({ message: 'Added to wishlist' });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    removeFromWishlist: async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const productId = req.params.id;
            const userId = req.user.id;
            const removed = await dbProduct.removeProductFromWishlist(
                productId,
                userId
            );
            if (!removed) {
                return res
                    .status(500)
                    .json({ message: 'Internal server error' });
            }
            res.status(200).json({ message: 'Removed from wishlist' });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getProductImages: async (req, res) => {
        try {
            const productId = req.params.id;
            const limit = parseInt(req.query.limit) || 5;
            const offset = parseInt(req.query.offset) || 0;
            const images = await dbProduct.fetchProductImages(
                productId,
                offset,
                limit
            );
            const data = [];
            for (let image of images) {
                data.push({
                    imageUrl: image.image_url, // string
                    caption: image.caption || '', // string
                });
            }
            res.status(200).json(data);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // Add more methods as per your API documentation...
};

module.exports = marketplaceController;
